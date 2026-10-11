/* Fair Value — PDF hujjatga QR kod, imzo, muhr va tasdiq varag'ini qo'yish.
 * pdf-lib + fontkit + DejaVu Sans (lotin va kirill) faqat kerak bo'lganda yuklanadi.
 *
 * FVStamp.stamp(pdfBytes, info, opts) -> Uint8Array
 *   info: { id, url, number, typeLabel, title, client, issueDate, qrPng,
 *           signerName, signerTitle, signatureImg, stampImg }
 *   opts: { qrPages: "last"|"all"|"first", qrCorner: "br"|"bl"|"tr"|"tl",
 *           addSignature: bool, addSheet: bool }
 * Eslatma: burilgan (/Rotate) sahifalarda joylashuv burilmagan koordinatalarda hisoblanadi.
 */
window.FVStamp = (function () {
  const NAVY = [0.047, 0.133, 0.275];
  const GREY = [0.36, 0.40, 0.47];
  let ready = null;

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = () => rej(new Error("Yuklab bo'lmadi: " + src));
      document.head.appendChild(s);
    });
  }
  function ensure() {
    if (!ready) ready = (async () => {
      if (!window.PDFLib) await loadScript("/assets/vendor/pdf-lib.min.js");
      if (!window.fontkit) await loadScript("/assets/vendor/fontkit.umd.min.js");
      const [reg, bold] = await Promise.all(["DejaVuSans.ttf", "DejaVuSans-Bold.ttf"].map(async f => {
        const r = await fetch("/assets/vendor/" + f);
        if (!r.ok) throw new Error("Shrift yuklanmadi: " + f);
        return r.arrayBuffer();
      }));
      return { reg, bold };
    })().catch(e => { ready = null; throw e; });
    return ready;
  }

  const clean = s => String(s == null ? "" : s).replace(/[\u0000-\u001f]/g, " ").trim();
  const color = c => PDFLib.rgb(c[0], c[1], c[2]);
  const fmtDate = s => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || "");
    return m ? `${m[3]}.${m[2]}.${m[1]}` : clean(s);
  };

  async function embedImage(pdf, dataUrl) {
    if (!dataUrl) return null;
    return /^data:image\/png/.test(dataUrl) ? pdf.embedPng(dataUrl) : pdf.embedJpg(dataUrl);
  }

  // Matnni berilgan kenglikka qatorlarga bo'lish
  function wrap(text, font, size, maxW) {
    const words = clean(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let cur = "";
    for (const w of words) {
      const t = cur ? cur + " " + w : w;
      if (font.widthOfTextAtSize(t, size) <= maxW || !cur) cur = t;
      else { lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // Sahifa burchagiga QR + qisqa matn bloki
  function qrBlock(page, ctx, corner, qrSize) {
    const { F, B, qr, info } = ctx;
    const box = page.getCropBox();
    const m = 18, pad = 6, textW = 150;
    const lines = [
      [B, 7, "FAIR VALUE · ELEKTRON TASDIQ"],
      [F, 7, "ID: " + info.id],
      [F, 6, info.url.replace(/^https?:\/\//, "")],
      [F, 6, "QR kodni skanerlab haqiqiyligini tekshiring"],
    ];
    const blockW = pad + qrSize + 8 + textW + pad, blockH = qrSize + pad * 2;
    const right = corner[1] === "r", top = corner[0] === "t";
    const x = right ? box.x + box.width - m - blockW : box.x + m;
    const y = top ? box.y + box.height - m - blockH : box.y + m;
    page.drawRectangle({ x, y, width: blockW, height: blockH, color: PDFLib.rgb(1, 1, 1), borderColor: color(NAVY), borderWidth: 0.6, opacity: 0.96, borderOpacity: 0.5 });
    const qx = right ? x + blockW - pad - qrSize : x + pad;
    page.drawImage(qr, { x: qx, y: y + pad, width: qrSize, height: qrSize });
    const tx = right ? x + pad : qx + qrSize + 8;
    let ty = y + blockH / 2 + 12;
    for (const [font, size, text] of lines) {
      let t = text;
      while (font.widthOfTextAtSize(t, size) > textW && t.length > 4) t = t.slice(0, -2) + "…";
      page.drawText(t, { x: right ? tx + textW - font.widthOfTextAtSize(t, size) : tx, y: ty, size, font, color: color(font === B ? NAVY : GREY) });
      ty -= size + 4;
    }
  }

  // Imzo + muhr bloki (x, y — blokning pastki chap burchagi)
  function signBlock(page, ctx, x, y) {
    const { F, B, sig, stampImg, info } = ctx;
    const W = 210, H = 112;
    if (stampImg) {
      const s = stampImg.scaleToFit(96, 96);
      page.drawImage(stampImg, { x: x + 4, y: y + 22, width: s.width, height: s.height, opacity: 0.92 });
    }
    if (sig) {
      const s = sig.scaleToFit(120, 54);
      page.drawImage(sig, { x: x + 60, y: y + 44, width: s.width, height: s.height });
    }
    page.drawLine({ start: { x: x + 4, y: y + 34 }, end: { x: x + W, y: y + 34 }, thickness: 0.5, color: color(GREY), opacity: 0.6 });
    const name = clean(info.signerName), title = clean(info.signerTitle);
    if (title) page.drawText(title, { x: x + 4, y: y + 22, size: 8, font: F, color: color(GREY) });
    if (name) page.drawText(name, { x: x + W - B.widthOfTextAtSize(name, 9), y: y + 22, size: 9, font: B, color: color(NAVY) });
    page.drawText("Sana: " + fmtDate(info.issueDate || new Date().toISOString()), { x: x + 4, y: y + 8, size: 7, font: F, color: color(GREY) });
    return { W, H };
  }

  // Hujjat oxiriga alohida "Tasdiq varag'i"
  function sheet(pdf, ctx) {
    const { F, B, qr, info } = ctx;
    const page = pdf.addPage([595.28, 841.89]);
    const L = 56, R = 595.28 - 56, W = R - L;
    let y = 841.89 - 70;
    page.drawRectangle({ x: 0, y: 841.89 - 8, width: 595.28, height: 8, color: color(NAVY) });
    page.drawText("TASDIQ VARAG'I", { x: L, y, size: 20, font: B, color: color(NAVY) });
    y -= 20;
    page.drawText("Fair Value — baholash firmasi · elektron reyestr", { x: L, y, size: 10, font: F, color: color(GREY) });
    y -= 26;
    page.drawLine({ start: { x: L, y }, end: { x: R, y }, thickness: 0.8, color: color(NAVY), opacity: 0.4 });
    y -= 26;

    const rows = [
      ["Hujjat ID", info.id],
      ["Hujjat raqami", info.number],
      ["Hujjat turi", info.typeLabel],
      ["Nomi", info.title],
      ["Buyurtmachi", info.client],
      ["Berilgan sana", fmtDate(info.issueDate)],
      ["Tekshirish manzili", info.url],
    ].filter(r => clean(r[1]));
    const labelW = 140;
    for (const [k, v] of rows) {
      const lines = wrap(v, k === "Hujjat ID" ? B : F, 11, W - labelW);
      page.drawText(k, { x: L, y, size: 10, font: F, color: color(GREY) });
      for (const ln of lines) {
        page.drawText(ln, { x: L + labelW, y, size: 11, font: k === "Hujjat ID" ? B : F, color: color(NAVY) });
        y -= 16;
      }
      y -= 8;
    }

    y -= 10;
    const q = 150;
    page.drawRectangle({ x: L, y: y - q - 12, width: W, height: q + 24, color: PDFLib.rgb(0.957, 0.969, 0.984) });
    page.drawImage(qr, { x: L + 12, y: y - q, width: q, height: q });
    let ty = y - 24;
    for (const ln of wrap("Hujjatning haqiqiyligini tekshirish uchun QR kodni telefon kamerasi bilan skanerlang yoki tekshirish manzilini oching va hujjat ID raqamini kiriting.", F, 11, W - q - 48)) {
      page.drawText(ln, { x: L + q + 32, y: ty, size: 11, font: F, color: color(NAVY) });
      ty -= 16;
    }
    ty -= 8;
    for (const ln of wrap("Tekshirish sahifasida PDF faylni yuklab, uning asl nusxa bilan bir xilligini ham aniqlash mumkin.", F, 9, W - q - 48)) {
      page.drawText(ln, { x: L + q + 32, y: ty, size: 9, font: F, color: color(GREY) });
      ty -= 13;
    }
    y = y - q - 60;

    if (ctx.sig || ctx.stampImg || clean(info.signerName)) {
      page.drawText("Tasdiqlovchi:", { x: L, y, size: 10, font: F, color: color(GREY) });
      signBlock(page, ctx, R - 214, y - 100);
    }
    page.drawText("Ushbu varaq Fair Value elektron reyestri tomonidan avtomatik shakllantirilgan.", { x: L, y: 40, size: 8, font: F, color: color(GREY) });
  }

  async function stamp(src, info, opts) {
    const fonts = await ensure();
    const { PDFDocument } = PDFLib;
    let pdf;
    try {
      pdf = await PDFDocument.load(src, { updateMetadata: false });
    } catch (e) {
      if (/encrypt/i.test(e.message)) throw new Error("PDF parol bilan himoyalangan. Himoyasiz nusxasini yuklang.");
      throw new Error("PDF faylni o'qib bo'lmadi: " + e.message);
    }
    pdf.registerFontkit(window.fontkit);
    const ctx = {
      info,
      F: await pdf.embedFont(fonts.reg, { subset: true }),
      B: await pdf.embedFont(fonts.bold, { subset: true }),
      qr: await pdf.embedPng(info.qrPng),
      sig: await embedImage(pdf, info.signatureImg),
      stampImg: await embedImage(pdf, info.stampImg),
    };
    const pages = pdf.getPages();
    if (!pages.length) throw new Error("PDF da sahifa yo'q");
    const corner = opts.qrCorner || "br";
    const targets = opts.qrPages === "all" ? pages : opts.qrPages === "first" ? [pages[0]] : [pages[pages.length - 1]];
    for (const p of targets) qrBlock(p, ctx, corner, opts.qrPages === "all" ? 48 : 60);

    if (opts.addSignature && (ctx.sig || ctx.stampImg)) {
      const last = pages[pages.length - 1], box = last.getCropBox();
      // QR pastda bo'lsa — imzo qarama-qarshi tomonda, aks holda pastki o'ngda
      const qrBottom = corner[0] === "b", qrRight = corner[1] === "r";
      const left = qrBottom ? qrRight : false;
      const x = left ? box.x + 24 : box.x + box.width - 24 - 214;
      signBlock(last, ctx, x, box.y + 18);
    }
    if (opts.addSheet) sheet(pdf, ctx);

    pdf.setProducer("Fair Value elektron reyestri");
    pdf.setKeywords(["Fair Value", info.id]);
    pdf.setModificationDate(new Date());
    return pdf.save();
  }

  /* Imzo/muhr rasmini tayyorlash: o'lchamni kichraytirish va oq fonni shaffof qilish */
  function prepareImage(file, maxSide = 700) {
    return new Promise((res, rej) => {
      if (!/^image\/(png|jpeg)$/.test(file.type)) return rej(new Error("Faqat PNG yoki JPEG rasm"));
      const img = new Image();
      img.onload = () => {
        let side = maxSide, out;
        for (let i = 0; i < 4; i++) {
          const k = Math.min(1, side / Math.max(img.width, img.height));
          const c = document.createElement("canvas");
          c.width = Math.max(1, Math.round(img.width * k));
          c.height = Math.max(1, Math.round(img.height * k));
          const g = c.getContext("2d");
          g.drawImage(img, 0, 0, c.width, c.height);
          const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
          for (let j = 0; j < p.length; j += 4) {
            const lum = (p[j] + p[j + 1] + p[j + 2]) / 3;
            if (lum > 235) p[j + 3] = 0;
            else if (lum > 195) p[j + 3] = Math.min(p[j + 3], Math.round((235 - lum) / 40 * 255));
          }
          g.putImageData(d, 0, 0);
          out = c.toDataURL("image/png");
          if (out.length <= 380 * 1024) break;
          side = Math.round(side * 0.75);
        }
        URL.revokeObjectURL(img.src);
        res(out);
      };
      img.onerror = () => rej(new Error("Rasmni o'qib bo'lmadi"));
      img.src = URL.createObjectURL(file);
    });
  }

  return { stamp, prepareImage, preload: ensure };
})();
