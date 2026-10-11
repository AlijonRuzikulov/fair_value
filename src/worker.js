/**
 * Fair Value — Cloudflare Worker (sayt + API)
 * ===========================================
 * Statik sahifalar ./public papkasidan (Workers Assets) beriladi,
 * /api/* va /v/:id so'rovlarini shu worker bajaradi.
 *
 * Bindinglar:
 *   FV_KV           KV namespace (hujjatlar, fayllar, arizalar, tokenlar)
 *   ASSETS          statik fayllar (wrangler.toml [assets])
 *   ADMIN_PASSWORD  secret — admin paneliga kirish paroli
 *
 * Ochiq endpointlar:
 *   GET  /v/:id                 -> 302 /verify?id=:id   (QR kod shu manzilga olib keladi)
 *   GET  /api/verify/:id        -> hujjat holati va asosiy ma'lumotlari
 *   GET  /api/verify/:id/file   -> hujjatning PDF nusxasi (agar yuklangan bo'lsa)
 *   POST /api/contact           { name, phone, service, message }
 *
 * Admin endpointlar (Authorization: Bearer <token>):
 *   POST   /api/admin/login     { password } -> { token }
 *   POST   /api/admin/logout
 *   GET    /api/docs            -> barcha hujjatlar
 *   POST   /api/docs            -> yangi hujjat
 *   GET    /api/docs/:id
 *   PUT    /api/docs/:id        -> tahrirlash / bekor qilish (status)
 *   DELETE /api/docs/:id
 *   PUT    /api/docs/:id/file   -> PDF yuklash (body = application/pdf)
 *   DELETE /api/docs/:id/file
 *   GET    /api/settings        -> imzo, muhr va QR joylashuvi sozlamalari
 *   PUT    /api/settings
 *   GET    /api/leads           -> saytdan kelgan arizalar
 *   PUT    /api/leads/:id       { done }
 *   DELETE /api/leads/:id
 *
 * KV tuzilmasi:
 *   doc:<ID>     hujjat JSON (metadata'da qisqa ma'lumot — ro'yxat uchun)
 *   file:<ID>    PDF (ArrayBuffer); hujjatda sha256 — tekshiruvchi faylni solishtirishi uchun
 *   settings     imzo/muhr rasmlari va QR sozlamalari (faqat admin uchun)
 *   lead:<ts-rand>  ariza JSON
 *   token:<t>    "admin" (TTL 12 soat)
 *   rl:<ip>      login urinishlari hisoblagichi (TTL 15 daqiqa)
 */

const TOKEN_TTL = 60 * 60 * 12;
const MAX_FILE = 24 * 1024 * 1024; // KV qiymati chegarasi 25 MiB
const MAX_IMG = 400 * 1024;          // imzo/muhr rasmi (data URL)
const ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 0/O, 1/I chalkashmasligi uchun
const DOC_TYPES = ["valuation", "business_plan", "teo", "import", "audit", "other"];
const STATUSES = ["valid", "revoked"];

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
const j = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
const err = (msg, status = 400) => j({ error: msg }, status);

function randomString(len, alphabet = ID_ALPHABET) {
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  return [...buf].map(b => alphabet[b % alphabet.length]).join("");
}
function newDocId() {
  // FV-XXXX-XXXX-XX  (10 belgi ≈ 50 bit — taxmin qilib bo'lmaydi)
  const s = randomString(10);
  return `FV-${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8)}`;
}
function normalizeId(raw) {
  return String(raw || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
}
function timingSafeEqual(a, b) {
  const ea = new TextEncoder().encode(a), eb = new TextEncoder().encode(b);
  let diff = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) diff |= (ea[i] || 0) ^ (eb[i] || 0);
  return diff === 0;
}
const str = (v, max = 500) => (v == null ? "" : String(v).trim().slice(0, max));

function maskName(name) {
  // "Alijon Ruzikulov" -> "A***** R*******" ; tashkilot nomlari ("MChJ ...") ochiq qoladi
  if (!name) return "";
  if (/(mchj|ooo|ao|aj|xk|qk|llc|ltd|jsc|давлат|davlat|bank|«|")/i.test(name)) return name;
  return name.split(/\s+/).map(w => w ? w[0] + "*".repeat(Math.max(w.length - 1, 2)) : w).join(" ");
}

function sanitizeDoc(input, prev = {}) {
  const d = { ...prev };
  const fields = {
    number: 60, type: 30, title: 200, client: 200, object: 500, address: 300,
    value: 40, currency: 8, purpose: 200, appraiser: 120, issueDate: 10, validUntil: 10, note: 1000,
  };
  for (const [k, max] of Object.entries(fields)) if (k in input) d[k] = str(input[k], max);
  if ("showValue" in input) d.showValue = !!input.showValue;
  if ("maskClient" in input) d.maskClient = !!input.maskClient;
  if ("status" in input && STATUSES.includes(input.status)) d.status = input.status;
  if ("revokeReason" in input) d.revokeReason = str(input.revokeReason, 300);
  if (!DOC_TYPES.includes(d.type)) d.type = "valuation";
  if (!d.currency) d.currency = "UZS";
  return d;
}
async function sha256Hex(buf) {
  const h = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join("");
}

const SETTINGS_DEFAULT = {
  signerName: "", signerTitle: "", signatureImg: "", stampImg: "",
  qrPages: "last", qrCorner: "br", addSignature: true, addSheet: false,
};
function sanitizeSettings(input, prev) {
  const s = { ...SETTINGS_DEFAULT, ...prev };
  if ("signerName" in input) s.signerName = str(input.signerName, 120);
  if ("signerTitle" in input) s.signerTitle = str(input.signerTitle, 120);
  for (const k of ["signatureImg", "stampImg"]) {
    if (!(k in input)) continue;
    const v = String(input[k] || "");
    if (v && !/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(v)) throw new Error("Rasm PNG yoki JPEG bo'lishi kerak");
    if (v.length > MAX_IMG) throw new Error("Rasm hajmi 300 KB dan oshmasin");
    s[k] = v;
  }
  if (["last", "all", "first"].includes(input.qrPages)) s.qrPages = input.qrPages;
  if (["br", "bl", "tr", "tl"].includes(input.qrCorner)) s.qrCorner = input.qrCorner;
  if ("addSignature" in input) s.addSignature = !!input.addSignature;
  if ("addSheet" in input) s.addSheet = !!input.addSheet;
  return s;
}

const docMeta = d => ({
  number: d.number, type: d.type, client: d.client, issueDate: d.issueDate,
  status: d.status, createdAt: d.createdAt, hasFile: !!d.hasFile,
});

function publicView(d, origin) {
  const expired = d.validUntil && d.validUntil < new Date().toISOString().slice(0, 10);
  return {
    id: d.id,
    number: d.number,
    type: d.type,
    title: d.title,
    client: d.maskClient === false ? d.client : maskName(d.client),
    object: d.object,
    address: d.address,
    value: d.showValue === false ? null : d.value,
    currency: d.currency,
    purpose: d.purpose,
    appraiser: d.appraiser,
    issueDate: d.issueDate,
    validUntil: d.validUntil,
    status: d.status === "revoked" ? "revoked" : expired ? "expired" : "valid",
    revokeReason: d.status === "revoked" ? d.revokeReason || "" : undefined,
    hasFile: !!d.hasFile,
    sha256: d.hasFile && d.status !== "revoked" ? d.sha256 || null : null,
    fileUrl: d.hasFile && d.status !== "revoked" ? `${origin}/api/verify/${d.id}/file` : null,
    verifiedAt: new Date().toISOString(),
  };
}

async function isAdmin(req, kv) {
  const h = req.headers.get("Authorization") || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!token || token.length < 32) return false;
  return (await kv.get("token:" + token)) === "admin";
}

async function listAll(kv, prefix) {
  const out = [];
  let cursor;
  do {
    const page = await kv.list({ prefix, cursor });
    out.push(...page.keys);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return out;
}

async function handleApi(req, env, url) {
  const kv = env.FV_KV;
  if (!kv) return err("KV namespace FV_KV ulanmagan", 500);
  const path = url.pathname.replace(/\/+$/, "");
  const m = req.method;
  const parts = path.split("/").filter(Boolean); // ["api", ...]

  /* ---------- ochiq ---------- */
  if (parts[1] === "verify" && parts[2] && m === "GET") {
    const id = normalizeId(parts[2]);
    const raw = await kv.get("doc:" + id);
    if (!raw) return j({ found: false, id }, 404);
    const doc = JSON.parse(raw);
    if (parts[3] === "file") {
      if (!doc.hasFile || doc.status === "revoked") return err("Fayl mavjud emas", 404);
      const file = await kv.get("file:" + id, "arrayBuffer");
      if (!file) return err("Fayl mavjud emas", 404);
      return new Response(file, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${id}.pdf"`,
          "Cache-Control": "no-store",
        },
      });
    }
    return j({ found: true, doc: publicView(doc, url.origin) });
  }

  if (path === "/api/contact" && m === "POST") {
    const b = await req.json().catch(() => ({}));
    if (b.website) return j({ ok: true }); // honeypot — bot
    const name = str(b.name, 100), phone = str(b.phone, 40);
    if (!name || !phone) return err("Ism va telefon raqami majburiy");
    const ip = req.headers.get("CF-Connecting-IP") || "?";
    const rlKey = "rlc:" + ip;
    const cnt = parseInt((await kv.get(rlKey)) || "0", 10);
    if (cnt >= 5) return err("Juda ko'p so'rov. Birozdan so'ng urinib ko'ring.", 429);
    await kv.put(rlKey, String(cnt + 1), { expirationTtl: 3600 });
    const id = `${Date.now()}-${randomString(4)}`;
    const lead = {
      id, name, phone, service: str(b.service, 60), message: str(b.message, 2000),
      createdAt: new Date().toISOString(), done: false,
    };
    await kv.put("lead:" + id, JSON.stringify(lead), { metadata: { name, phone, done: false } });
    return j({ ok: true });
  }

  if (path === "/api/admin/login" && m === "POST") {
    if (!env.ADMIN_PASSWORD) return err("Serverda ADMIN_PASSWORD sozlanmagan", 500);
    const ip = req.headers.get("CF-Connecting-IP") || "?";
    const rlKey = "rl:" + ip;
    const tries = parseInt((await kv.get(rlKey)) || "0", 10);
    if (tries >= 10) return err("Juda ko'p urinish. 15 daqiqadan so'ng qayta urinib ko'ring.", 429);
    const { password } = await req.json().catch(() => ({}));
    if (!password || !timingSafeEqual(String(password), env.ADMIN_PASSWORD)) {
      await kv.put(rlKey, String(tries + 1), { expirationTtl: 900 });
      return err("Parol noto'g'ri", 401);
    }
    const token = randomString(48, "abcdefghijklmnopqrstuvwxyz0123456789");
    await kv.put("token:" + token, "admin", { expirationTtl: TOKEN_TTL });
    return j({ token, expiresIn: TOKEN_TTL });
  }

  /* ---------- admin ---------- */
  if (!(await isAdmin(req, kv))) return err("Avtorizatsiya talab qilinadi", 401);

  if (path === "/api/admin/logout" && m === "POST") {
    const token = (req.headers.get("Authorization") || "").slice(7);
    await kv.delete("token:" + token);
    return j({ ok: true });
  }

  if (path === "/api/settings") {
    const prev = (await kv.get("settings", "json")) || {};
    if (m === "GET") return j({ settings: { ...SETTINGS_DEFAULT, ...prev } });
    if (m === "PUT") {
      const b = await req.json().catch(() => null);
      if (!b) return err("Noto'g'ri so'rov");
      let settings;
      try { settings = sanitizeSettings(b, prev); } catch (e) { return err(e.message); }
      await kv.put("settings", JSON.stringify(settings));
      return j({ settings });
    }
  }

  if (path === "/api/docs" && m === "GET") {
    const keys = await listAll(kv, "doc:");
    const docs = keys.map(k => ({ id: k.name.slice(4), ...(k.metadata || {}) }));
    docs.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return j({ docs });
  }

  if (path === "/api/docs" && m === "POST") {
    const b = await req.json().catch(() => null);
    if (!b) return err("Noto'g'ri so'rov");
    let id;
    do id = newDocId(); while (await kv.get("doc:" + id));
    const now = new Date().toISOString();
    const doc = sanitizeDoc(b, {
      id, status: "valid", showValue: true, maskClient: true, hasFile: false, createdAt: now,
    });
    doc.updatedAt = now;
    if (!doc.number || !doc.client) return err("Hujjat raqami va buyurtmachi majburiy");
    await kv.put("doc:" + id, JSON.stringify(doc), { metadata: docMeta(doc) });
    return j({ doc }, 201);
  }

  if (parts[1] === "docs" && parts[2]) {
    const id = normalizeId(parts[2]);
    const raw = await kv.get("doc:" + id);
    if (!raw) return err("Hujjat topilmadi", 404);
    let doc = JSON.parse(raw);

    if (parts[3] === "file") {
      if (m === "PUT") {
        const len = parseInt(req.headers.get("Content-Length") || "0", 10);
        if (len > MAX_FILE) return err("Fayl 24 MB dan oshmasligi kerak", 413);
        const buf = await req.arrayBuffer();
        if (buf.byteLength > MAX_FILE) return err("Fayl 24 MB dan oshmasligi kerak", 413);
        const head = new Uint8Array(buf.slice(0, 5));
        if (String.fromCharCode(...head) !== "%PDF-") return err("Faqat PDF fayl qabul qilinadi");
        await kv.put("file:" + id, buf);
        doc.hasFile = true;
        doc.sha256 = await sha256Hex(buf);
        doc.fileSize = buf.byteLength;
        doc.fileUploadedAt = new Date().toISOString();
        doc.stamped = req.headers.get("X-FV-Stamped") === "1";
      } else if (m === "DELETE") {
        await kv.delete("file:" + id);
        doc.hasFile = false;
        delete doc.sha256; delete doc.fileSize; delete doc.fileUploadedAt; delete doc.stamped;
      } else return err("Method not allowed", 405);
      doc.updatedAt = new Date().toISOString();
      await kv.put("doc:" + id, JSON.stringify(doc), { metadata: docMeta(doc) });
      return j({ doc });
    }

    if (m === "GET") return j({ doc });
    if (m === "PUT") {
      const b = await req.json().catch(() => null);
      if (!b) return err("Noto'g'ri so'rov");
      doc = sanitizeDoc(b, doc);
      doc.updatedAt = new Date().toISOString();
      await kv.put("doc:" + id, JSON.stringify(doc), { metadata: docMeta(doc) });
      return j({ doc });
    }
    if (m === "DELETE") {
      await Promise.all([kv.delete("doc:" + id), kv.delete("file:" + id)]);
      return j({ ok: true });
    }
  }

  if (path === "/api/leads" && m === "GET") {
    const keys = await listAll(kv, "lead:");
    const leads = (await Promise.all(keys.map(k => kv.get(k.name, "json")))).filter(Boolean);
    leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return j({ leads });
  }
  if (parts[1] === "leads" && parts[2]) {
    const key = "lead:" + parts[2];
    const lead = await kv.get(key, "json");
    if (!lead) return err("Topilmadi", 404);
    if (m === "PUT") {
      const b = await req.json().catch(() => ({}));
      lead.done = !!b.done;
      await kv.put(key, JSON.stringify(lead), { metadata: { name: lead.name, phone: lead.phone, done: lead.done } });
      return j({ lead });
    }
    if (m === "DELETE") {
      await kv.delete(key);
      return j({ ok: true });
    }
  }

  return err("Topilmadi", 404);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    try {
      if (url.pathname.startsWith("/api/")) return await handleApi(req, env, url);
      // QR kodlardagi qisqa havola: /v/FV-XXXX-XXXX-XX
      const short = url.pathname.match(/^\/v\/([A-Za-z0-9-]+)\/?$/);
      if (short) return Response.redirect(`${url.origin}/verify?id=${normalizeId(short[1])}`, 302);
      if (env.ASSETS) return env.ASSETS.fetch(req);
      return new Response("Not found", { status: 404 });
    } catch (e) {
      return err("Server xatosi: " + (e && e.message ? e.message : e), 500);
    }
  },
};
