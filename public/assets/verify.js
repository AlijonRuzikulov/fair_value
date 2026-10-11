/* Hujjatni tekshirish sahifasi */
(function () {
  FV.mount("verify");
  FV.fillIcons();
  const t = k => FV_I18N.t(k);
  const $ = id => document.getElementById(id);
  const form = $("vForm"), input = $("vId"), out = $("vResult"), loading = $("vLoading"), msg = $("vMsg");
  let last = null; // oxirgi natija — til almashganda qayta chizish uchun
  let scanner = null;

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = s => {
    if (!s) return "";
    const d = new Date(s.length === 10 ? s + "T00:00:00" : s);
    if (isNaN(d)) return s;
    const loc = { uz: "uz-UZ", cy: "uz-Cyrl-UZ", ru: "ru-RU" }[FV_I18N.lang] || "ru-RU";
    return s.length === 10 ? d.toLocaleDateString(loc) : d.toLocaleString(loc);
  };
  const fmtMoney = (v, cur) => {
    const n = Number(String(v).replace(/[\s,]/g, ""));
    return (isNaN(n) || v === "" ? v : n.toLocaleString("ru-RU")) + " " + (cur || "");
  };

  function showMsg(text) { msg.textContent = text; msg.classList.toggle("hidden", !text); }

  function render() {
    if (!last) { out.innerHTML = ""; return; }
    if (last.error) { out.innerHTML = ""; showMsg(t("v.err")); return; }
    showMsg("");
    if (!last.found) {
      out.innerHTML = `
        <div class="result r-nf reveal in">
          <div class="result-head"><span class="big">${FV.ICONS.x}</span>
            <div><h2>${t("v.nf.t")}</h2><p>${t("v.nf.d")}</p></div></div>
          <dl><dt>${t("v.f.id")}</dt><dd class="mono">${esc(last.id)}</dd></dl>
          <div class="r-foot"><a class="btn btn-light" href="/#contact">${t("nav.contact")}</a></div>
        </div>`;
      return;
    }
    const d = last.doc;
    const st = { valid: ["r-ok", FV.ICONS.check, "v.ok"], revoked: ["r-rev", FV.ICONS.x, "v.rev"], expired: ["r-exp", FV.ICONS.clockBig, "v.exp"] }[d.status];
    const rows = [
      ["v.f.id", `<span class="mono">${esc(d.id)}</span>`],
      ["v.f.number", esc(d.number)],
      ["v.f.type", esc(t("type." + d.type))],
      d.title && ["v.f.title", esc(d.title)],
      d.client && ["v.f.client", esc(d.client)],
      d.object && ["v.f.object", esc(d.object)],
      d.address && ["v.f.address", esc(d.address)],
      d.value && ["v.f.value", esc(fmtMoney(d.value, d.currency))],
      d.purpose && ["v.f.purpose", esc(d.purpose)],
      d.appraiser && ["v.f.appraiser", esc(d.appraiser)],
      d.issueDate && ["v.f.issue", esc(fmtDate(d.issueDate))],
      d.validUntil && ["v.f.valid", esc(fmtDate(d.validUntil))],
      d.status === "revoked" && d.revokeReason && ["v.f.reason", esc(d.revokeReason)],
      ["v.f.checked", esc(fmtDate(d.verifiedAt))],
    ].filter(Boolean);
    out.innerHTML = `
      <div class="result ${st[0]} reveal in">
        <div class="result-head"><span class="big">${st[1]}</span>
          <div><h2>${t(st[2] + ".t")}</h2><p>${t(st[2] + ".d")}</p></div></div>
        <dl>${rows.map(([k, v]) => `<dt>${t(k)}</dt><dd>${v}</dd>`).join("")}</dl>
        <div class="r-foot">
          ${d.hasFile && d.status !== "revoked" ? `<a class="btn btn-dark" href="${esc(d.fileUrl)}" target="_blank" rel="noopener">${FV.ICONS.file}<span>${t("v.pdf")}</span></a>` : ""}
          <div class="note">${t("v.note")}</div>
          <span class="stamp">${FV.ICONS.shield.replace("<svg", '<svg width="16" height="16"')} fairvalue.uz</span>
        </div>
      </div>`;
  }

  async function check(rawId) {
    const id = FV.extractId(rawId);
    if (!id) { input.focus(); return; }
    input.value = id;
    const url = new URL(location.href);
    url.searchParams.set("id", id);
    url.searchParams.delete("scan");
    history.replaceState(null, "", url);
    out.innerHTML = "";
    showMsg("");
    loading.classList.remove("hidden");
    try {
      const r = await fetch("/api/verify/" + encodeURIComponent(id), { cache: "no-store" });
      if (r.status !== 200 && r.status !== 404) throw new Error(r.status);
      const data = await r.json();
      last = data.found ? data : { found: false, id };
    } catch (e) {
      last = { error: true };
    } finally {
      loading.classList.add("hidden");
    }
    render();
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function startScan() {
    if (!window.Html5Qrcode) { showMsg(t("v.cam")); return; }
    showMsg("");
    $("reader").classList.remove("hidden");
    $("scanBtn").classList.add("hidden");
    $("stopBtn").classList.remove("hidden");
    scanner = scanner || new Html5Qrcode("reader");
    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: (w, h) => { const s = Math.floor(Math.min(w, h) * 0.7); return { width: s, height: s }; } },
        text => {
          const id = FV.extractId(text);
          if (!/^FV-/.test(id)) { showMsg(t("v.badqr")); return; }
          stopScan();
          check(id);
        },
        () => {}
      );
    } catch (e) {
      stopScan();
      showMsg(t("v.cam"));
    }
  }
  async function stopScan() {
    $("reader").classList.add("hidden");
    $("scanBtn").classList.remove("hidden");
    $("stopBtn").classList.add("hidden");
    if (scanner && scanner.isScanning) { try { await scanner.stop(); } catch (e) {} }
  }

  form.addEventListener("submit", e => { e.preventDefault(); stopScan(); check(input.value); });
  $("scanBtn").addEventListener("click", startScan);
  $("stopBtn").addEventListener("click", stopScan);
  document.addEventListener("fv:lang", render);

  const params = new URLSearchParams(location.search);
  if (params.get("id")) check(params.get("id"));
  else if (params.get("scan")) window.addEventListener("load", startScan);
})();
