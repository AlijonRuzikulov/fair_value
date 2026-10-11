/* Bosh sahifa */
(function () {
  FV.mount("home");
  FV.fillIcons();
  FV.initReveal();
  const c = window.FV_CONFIG || {};
  const set = (id, href) => { const el = document.getElementById(id); if (el) el.href = href; };
  set("infoPhone", "tel:" + (c.phoneHref || ""));
  set("infoEmail", "mailto:" + (c.email || ""));
  set("lnkInsta", "https://instagram.com/" + (c.instagram || ""));
  set("lnkTg", "https://t.me/" + (c.telegram || ""));

  // Tekshirish formalari -> /verify?id=...
  document.querySelectorAll("[data-verify-form]").forEach(f => f.addEventListener("submit", e => {
    e.preventDefault();
    const id = FV.extractId(f.elements.id.value);
    if (!id) { f.elements.id.focus(); return; }
    location.href = "/verify?id=" + encodeURIComponent(id);
  }));

  // Xizmat kartasidan formaga o'tganda xizmatni tanlab qo'yish
  document.querySelectorAll("[data-service]").forEach(a => a.addEventListener("click", () => {
    document.getElementById("cService").value = a.dataset.service;
  }));

  // Ariza formasi
  const form = document.getElementById("contactForm"), msg = document.getElementById("formMsg");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.name.trim()) return form.elements.name.focus();
    if (data.phone.replace(/\D/g, "").length < 7) return form.elements.phone.focus();
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    msg.className = "alert hidden";
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error();
      form.reset();
      msg.textContent = FV_I18N.t("form.ok");
      msg.className = "alert alert-ok";
    } catch (err) {
      msg.textContent = FV_I18N.t("form.err") + " " + (c.phone || "");
      msg.className = "alert alert-err";
    } finally { btn.disabled = false; }
  });
})();
