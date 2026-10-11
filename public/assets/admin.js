/* Fair Value — admin panel */
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TYPES = { valuation: "Baholash hisoboti", business_plan: "Biznes loyiha", teo: "TEO", import: "Import xulosasi", audit: "Audit xulosasi", other: "Boshqa" };
  const SERVICES = { valuation: "Mol-mulkni baholash", business_plan: "Biznes loyiha / TEO", import: "Import xulosasi", audit: "Audit" };
  const verifyUrl = id => `${location.origin}/v/${id}`;

  let token = null;
  try { token = sessionStorage.getItem("fv_admin"); } catch (e) {}
  let docs = [], leads = [], editing = null, qrDoc = null;

  function toast(text) {
    const el = $("toast");
    el.textContent = text;
    el.classList.remove("hidden");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.add("hidden"), 2600);
  }

  async function api(path, opts = {}) {
    const headers = { ...(opts.headers || {}) };
    if (token) headers.Authorization = "Bearer " + token;
    if (opts.json !== undefined) { headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(opts.json); }
    const r = await fetch(path, { ...opts, headers });
    const data = await r.json().catch(() => ({}));
    if (r.status === 401 && path !== "/api/admin/login") { logout(true); throw new Error("Sessiya tugadi, qayta kiring"); }
    if (!r.ok) throw new Error(data.error || "Xatolik: " + r.status);
    return data;
  }

  /* ---------- auth ---------- */
  function showApp(on) {
    $("login").classList.toggle("hidden", on);
    $("app").classList.toggle("hidden", !on);
    if (on) { loadDocs(); loadLeads(); } else $("pw").focus();
  }
  function logout(silent) {
    if (!silent && token) api("/api/admin/logout", { method: "POST" }).catch(() => {});
    token = null;
    try { sessionStorage.removeItem("fv_admin"); } catch (e) {}
    showApp(false);
  }
  $("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const err = $("loginErr");
    err.classList.add("hidden");
    try {
      const d = await api("/api/admin/login", { method: "POST", json: { password: $("pw").value } });
      token = d.token;
      try { sessionStorage.setItem("fv_admin", token); } catch (e) {}
      $("pw").value = "";
      showApp(true);
    } catch (ex) { err.textContent = ex.message; err.classList.remove("hidden"); }
  });
  $("logout").addEventListener("click", () => logout());

  /* ---------- tabs ---------- */
  document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.toggle("active", x === b));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.toggle("hidden", p.id !== "tab-" + b.dataset.tab));
  }));

  /* ---------- docs ---------- */
  async function loadDocs() {
    try { docs = (await api("/api/docs")).docs; renderDocs(); } catch (e) { toast(e.message); }
  }
  function renderDocs() {
    const q = $("search").value.trim().toLowerCase(), fs = $("fStatus").value;
    const list = docs.filter(d =>
      (!fs || d.status === fs) &&
      (!q || [d.id, d.number, d.client].some(v => String(v || "").toLowerCase().includes(q))));
    $("docRows").innerHTML = list.map(d => `
      <tr>
        <td class="mono"><b>${esc(d.id)}</b></td>
        <td>${esc(d.number)}</td>
        <td>${esc(TYPES[d.type] || d.type)}</td>
        <td>${esc(d.client)}</td>
        <td>${esc(d.issueDate || (d.createdAt || "").slice(0, 10))}</td>
        <td>${d.status === "revoked" ? '<span class="badge b-rev">Bekor qilingan</span>' : '<span class="badge b-ok">Amalda</span>'}${d.hasFile ? '<span class="badge b-file">PDF</span>' : ""}</td>
        <td class="acts">
          <button class="btn btn-dark btn-sm" data-qr="${esc(d.id)}">QR</button>
          <button class="btn btn-light btn-sm" data-edit="${esc(d.id)}">Tahrirlash</button>
          <button class="btn btn-light btn-sm" data-del="${esc(d.id)}" title="O'chirish">🗑</button>
        </td>
      </tr>`).join("");
    $("docEmpty").classList.toggle("hidden", list.length > 0);
    $("cntDocs").textContent = docs.length;
    $("stTotal").textContent = docs.length;
    $("stValid").textContent = docs.filter(d => d.status !== "revoked").length;
    $("stRev").textContent = docs.filter(d => d.status === "revoked").length;
    $("stFile").textContent = docs.filter(d => d.hasFile).length;
  }
  $("search").addEventListener("input", renderDocs);
  $("fStatus").addEventListener("change", renderDocs);

  $("docRows").addEventListener("click", async e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.qr) openQr(b.dataset.qr);
    if (b.dataset.edit) {
      try { openDoc((await api("/api/docs/" + b.dataset.edit)).doc); } catch (ex) { toast(ex.message); }
    }
    if (b.dataset.del) {
      if (!confirm(`${b.dataset.del} hujjatini butunlay o'chirasizmi?\n\nO'chirilgandan so'ng QR kod "Hujjat topilmadi" deb ko'rsatadi. Agar hujjat kuchini yo'qotgan bo'lsa, o'chirish o'rniga "Bekor qilingan" holatini tanlash tavsiya etiladi.`)) return;
      try { await api("/api/docs/" + b.dataset.del, { method: "DELETE" }); toast("O'chirildi"); loadDocs(); } catch (ex) { toast(ex.message); }
    }
  });

  /* ---------- doc modal ---------- */
  const form = $("docForm");
  function openModal(id) { $(id).classList.remove("hidden"); }
  function closeModal(el) { el.closest(".modal").classList.add("hidden"); }
  document.querySelectorAll(".modal").forEach(m => m.addEventListener("click", e => {
    if (e.target === m || e.target.closest("[data-close]")) closeModal(m);
  }));
  document.addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden")); });

  function openDoc(doc) {
    editing = doc;
    form.reset();
    $("docErr").classList.add("hidden");
    $("docTitle").textContent = doc ? "Hujjatni tahrirlash — " + doc.id : "Yangi hujjat";
    $("saveDoc").textContent = doc ? "Saqlash" : "Saqlash va QR olish";
    $("editOnly").classList.toggle("hidden", !doc);
    if (doc) {
      for (const el of form.elements) {
        if (!el.name || el.type === "file") continue;
        if (el.type === "checkbox") el.checked = doc[el.name] !== false;
        else if (doc[el.name] != null) el.value = doc[el.name];
      }
    } else {
      form.elements.issueDate.value = new Date().toISOString().slice(0, 10);
    }
    $("fileState").textContent = doc && doc.hasFile ? "✓ PDF yuklangan (yangisini tanlasangiz almashtiriladi)" : "";
    $("rmFile").classList.toggle("hidden", !(doc && doc.hasFile));
    openModal("docModal");
    form.elements.number.focus();
  }
  $("newDoc").addEventListener("click", () => openDoc(null));

  $("rmFile").addEventListener("click", async () => {
    if (!editing || !confirm("PDF faylni o'chirasizmi?")) return;
    try {
      editing = (await api(`/api/docs/${editing.id}/file`, { method: "DELETE" })).doc;
      $("fileState").textContent = "";
      $("rmFile").classList.add("hidden");
      toast("PDF o'chirildi");
      loadDocs();
    } catch (ex) { toast(ex.message); }
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const errBox = $("docErr");
    errBox.classList.add("hidden");
    const data = {};
    for (const el of form.elements) {
      if (!el.name || el.type === "file") continue;
      data[el.name] = el.type === "checkbox" ? el.checked : el.value;
    }
    if (!editing) { delete data.status; delete data.revokeReason; }
    if (!data.number.trim() || !data.client.trim()) {
      errBox.textContent = "Hujjat raqami va buyurtmachi majburiy.";
      errBox.classList.remove("hidden");
      return;
    }
    const file = form.elements.file.files[0];
    if (file && (file.size > 10 * 1024 * 1024 || !/pdf$/i.test(file.type || file.name))) {
      errBox.textContent = "Faqat PDF, 10 MB gacha.";
      errBox.classList.remove("hidden");
      return;
    }
    const btn = $("saveDoc");
    btn.disabled = true;
    try {
      let doc = editing
        ? (await api("/api/docs/" + editing.id, { method: "PUT", json: data })).doc
        : (await api("/api/docs", { method: "POST", json: data })).doc;
      if (file) {
        btn.textContent = "PDF yuklanmoqda…";
        doc = (await api(`/api/docs/${doc.id}/file`, { method: "PUT", headers: { "Content-Type": "application/pdf" }, body: file })).doc;
      }
      const isNew = !editing;
      $("docModal").classList.add("hidden");
      toast(isNew ? "Hujjat yaratildi: " + doc.id : "Saqlandi");
      await loadDocs();
      if (isNew) openQr(doc.id);
    } catch (ex) {
      errBox.textContent = ex.message;
      errBox.classList.remove("hidden");
    } finally {
      btn.disabled = false;
      btn.textContent = editing ? "Saqlash" : "Saqlash va QR olish";
    }
  });

  /* ---------- QR ---------- */
  // QR kodni canvas'ga chizish (yuqori xatoni tuzatish darajasi — H)
  function drawQr(text, px) {
    const qr = qrcode(0, "H");
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount(), quiet = 2, cell = Math.floor(px / (n + quiet * 2));
    const size = cell * (n + quiet * 2);
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, size, size);
    g.fillStyle = "#0c2246";
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++)
      if (qr.isDark(r, k)) g.fillRect((k + quiet) * cell, (r + quiet) * cell, cell, cell);
    return c;
  }
  function openQr(id) {
    qrDoc = id;
    const url = verifyUrl(id);
    const box = $("qrBox");
    box.innerHTML = "";
    box.appendChild(drawQr(url, 720)); // katta o'lcham — chop etish va PNG uchun tiniq
    $("qrId").textContent = id;
    $("qrUrl").textContent = url;
    $("qrOpen").href = url;
    openModal("qrModal");
  }
  $("qrCopy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(verifyUrl(qrDoc)); toast("Havola nusxalandi"); }
    catch (e) { prompt("Havolani nusxalang:", verifyUrl(qrDoc)); }
  });
  $("qrPrint").addEventListener("click", () => {
    document.body.classList.add("printing");
    window.print();
    setTimeout(() => document.body.classList.remove("printing"), 500);
  });
  $("qrPng").addEventListener("click", () => {
    const src = $("qrBox").querySelector("canvas");
    if (!src) return;
    const size = src.width, W = size, H = size + 140;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, W, H);
    g.drawImage(src, 0, 0);
    g.fillStyle = "#0c2246"; g.textAlign = "center";
    g.font = "700 30px Montserrat, Arial, sans-serif";
    g.fillText("FAIR VALUE · HUJJATNI TEKSHIRISH", W / 2, size + 40);
    g.font = "700 44px ui-monospace, Menlo, Consolas, monospace";
    g.fillText(qrDoc, W / 2, size + 100);
    const a = document.createElement("a");
    a.download = `QR-${qrDoc}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  });

  /* ---------- leads ---------- */
  async function loadLeads() {
    try { leads = (await api("/api/leads")).leads; renderLeads(); } catch (e) { toast(e.message); }
  }
  function renderLeads() {
    $("leadRows").innerHTML = leads.map(l => `
      <tr>
        <td style="white-space:nowrap">${esc(new Date(l.createdAt).toLocaleString("ru-RU"))}</td>
        <td>${esc(l.name)}</td>
        <td style="white-space:nowrap"><a href="tel:${esc(l.phone.replace(/[^\d+]/g, ""))}">${esc(l.phone)}</a></td>
        <td>${esc(SERVICES[l.service] || l.service || "—")}</td>
        <td style="max-width:320px">${esc(l.message)}</td>
        <td>${l.done ? '<span class="badge b-ok">Bog\'lanildi</span>' : '<span class="badge b-new">Yangi</span>'}</td>
        <td class="acts">
          <button class="btn btn-light btn-sm" data-done="${esc(l.id)}" data-v="${l.done ? "" : "1"}">${l.done ? "Qaytarish" : "✓ Bajarildi"}</button>
          <button class="btn btn-light btn-sm" data-ldel="${esc(l.id)}">🗑</button>
        </td>
      </tr>`).join("");
    $("leadEmpty").classList.toggle("hidden", leads.length > 0);
    $("cntLeads").textContent = leads.filter(l => !l.done).length;
  }
  $("leadRows").addEventListener("click", async e => {
    const b = e.target.closest("button");
    if (!b) return;
    try {
      if (b.dataset.done) await api("/api/leads/" + b.dataset.done, { method: "PUT", json: { done: !!b.dataset.v } });
      if (b.dataset.ldel) { if (!confirm("Arizani o'chirasizmi?")) return; await api("/api/leads/" + b.dataset.ldel, { method: "DELETE" }); }
      loadLeads();
    } catch (ex) { toast(ex.message); }
  });

  showApp(!!token);
})();
