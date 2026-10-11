/* Fair Value — umumiy sarlavha, futer, ikonkalar va kichik yordamchilar */
(function () {
  const I = (p, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${p}</svg>`;
  const ICONS = {
    check: I('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'stroke-width="3"'),
    qr: I('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>'),
    camera: I('<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>'),
    home: I('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
    chart: I('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'),
    ship: I('<path d="M3 17l2 3h14l2-3"/><path d="M5 17V9h14v8"/><path d="M9 9V5h6v4"/>'),
    audit: I('<path d="M9 3h6l4 4v14H5V3h4z"/><path d="M9 13l2 2 4-4"/>'),
    building: I('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"/>'),
    car: I('<path d="M5 16l1.5-5h11L19 16"/><rect x="3" y="16" width="18" height="4" rx="1"/><circle cx="7" cy="20" r="1"/><circle cx="17" cy="20" r="1"/>'),
    phone: I('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
    mail: I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    pin: I('<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'),
    clock: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    insta: I('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>'),
    send: I('<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>'),
    x: I('<path d="M6 6l12 12M18 6L6 18"/>', 'stroke-width="3"'),
    alert: I('<path d="M12 8v5M12 16.5v.01"/>', 'stroke-width="3"'),
    clockBig: I('<path d="M12 7v5l3 2"/>', 'stroke-width="3"'),
    file: I('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/>'),
    star: I('<path d="M12 3l2.7 5.6 6.3.9-4.5 4.4 1 6.1L12 17l-5.5 3 1-6.1L3 9.5l6.3-.9z"/>'),
    menu: I('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    shield: I('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
  };
  const divider = `<div class="divider"><svg viewBox="0 0 18 10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 9l4-6 4 4 4-6 4 6"/></svg></div>`;

  const QR_ILLUS = `<svg viewBox="0 0 29 29" shape-rendering="crispEdges" width="100%" height="100%"><path fill="#0c2246" d="M0 0h7v7H0zM22 0h7v7h-7zM0 22h7v7H0z"/><path fill="#fff" d="M1 1h5v5H1zM23 1h5v5h-5zM1 23h5v5H1z"/><path fill="#0c2246" d="M2 2h3v3H2zM24 2h3v3h-3zM2 24h3v3H2zM9 1h2v2H9zm3 0h1v3h-1zm3 1h2v1h-2zm3 0h2v3h-2zM9 5h1v3H9zm3 1h3v1h-3zm4 0h1v2h-1zM0 9h3v1H0zm5 0h4v2H5zm6 0h2v3h-2zm4-1h3v1h-3zm5 1h2v2h-2zm4 0h4v1h-4zM1 12h2v2H1zm6 0h3v1H7zm8 0h4v2h-4zm6 0h1v4h-1zm3 0h3v2h-3zM3 15h4v1H3zm7 0h3v3h-3zm5 2h2v2h-2zm5-1h3v1h-3zm5 1h3v2h-3zM0 18h2v2H0zm5 0h3v2H5zm13 1h3v1h-3zM9 20h2v3H9zm4 1h3v2h-3zm5 2h2v2h-2zm4-1h1v3h-1zm3 0h2v1h-2zM9 25h3v2H9zm5 0h2v3h-2zm5 1h3v1h-3zm6 0h4v3h-4z"/></svg>`;

  function header(active) {
    const home = location.pathname === "/" || /index\.html$/.test(location.pathname);
    const pre = home ? "" : "/";
    return `
    <header class="site-header ${home ? "" : "solid"}" id="hdr">
      <div class="container nav">
        <a class="brand" href="/" aria-label="Fair Value">
          <img src="/assets/logo.svg" alt="" width="40" height="40">
          <span><b>FAIR VALUE</b><small data-i18n="hero.badge"></small></span>
        </a>
        <nav class="nav-links" id="navLinks">
          <a href="${pre}#services" data-i18n="nav.services"></a>
          <a href="${pre}#why" data-i18n="nav.about"></a>
          <a href="${pre}#process" data-i18n="nav.process"></a>
          <a href="${pre}#faq" data-i18n="nav.faq"></a>
          <a href="${pre}#contact" data-i18n="nav.contact"></a>
          <a href="/verify" class="${active === "verify" ? "active" : ""}" data-i18n="nav.verify"></a>
        </nav>
        <div class="nav-right">
          <div class="lang-switch"></div>
          <a class="btn btn-primary btn-sm" href="/verify">${ICONS.qr}<span data-i18n="nav.verify"></span></a>
          <button class="burger" id="burger" aria-label="Menu">${ICONS.menu}</button>
        </div>
      </div>
    </header>`;
  }

  function footer() {
    const c = window.FV_CONFIG || {};
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="foot">
          <div>
            <a class="brand" href="/"><img src="/assets/logo.svg" alt="" width="40" height="40"><span><b>FAIR VALUE</b><small data-i18n="hero.badge"></small></span></a>
            <p data-i18n="footer.desc" style="margin-top:16px;max-width:340px"></p>
          </div>
          <div>
            <h4 data-i18n="footer.links"></h4>
            <ul>
              <li><a href="/#services" data-i18n="nav.services"></a></li>
              <li><a href="/#process" data-i18n="nav.process"></a></li>
              <li><a href="/#faq" data-i18n="nav.faq"></a></li>
              <li><a href="/verify" data-i18n="nav.verify"></a></li>
            </ul>
          </div>
          <div>
            <h4 data-i18n="nav.contact"></h4>
            <ul>
              <li><a href="tel:${c.phoneHref || ""}">${c.phone || ""}</a></li>
              <li><a href="mailto:${c.email || ""}">${c.email || ""}</a></li>
              <li data-cfg="address"></li>
              <li><a href="https://instagram.com/${c.instagram || ""}" target="_blank" rel="noopener">Instagram @${c.instagram || ""}</a></li>
            </ul>
          </div>
        </div>
        <div class="foot-bottom">
          <span>© ${new Date().getFullYear()} Fair Value. <span data-i18n="footer.rights"></span></span>
          <span>fairvalue.uz</span>
        </div>
      </div>
    </footer>`;
  }

  function mount(active) {
    const h = document.getElementById("site-header");
    if (h) h.outerHTML = header(active);
    const f = document.getElementById("site-footer");
    if (f) f.outerHTML = footer();

    const hdr = document.getElementById("hdr");
    if (hdr && !hdr.classList.contains("solid")) {
      const onScroll = () => hdr.classList.toggle("scrolled", window.scrollY > 30);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    const burger = document.getElementById("burger"), links = document.getElementById("navLinks");
    if (burger && links) {
      burger.addEventListener("click", () => links.classList.toggle("open"));
      links.addEventListener("click", e => { if (e.target.closest("a")) links.classList.remove("open"); });
    }
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: .12 });
    els.forEach(e => io.observe(e));
  }

  // [data-icon="name"] elementlarini ikonka bilan to'ldirish
  function fillIcons(root = document) {
    root.querySelectorAll("[data-icon]").forEach(el => { el.innerHTML = ICONS[el.dataset.icon] || ""; });
    root.querySelectorAll("[data-divider]").forEach(el => { el.outerHTML = divider; });
    root.querySelectorAll("[data-qr-illus]").forEach(el => { el.innerHTML = QR_ILLUS; });
  }

  /* QR kod matnidan hujjat ID sini ajratib olish (URL yoki to'g'ridan-to'g'ri ID) */
  function extractId(text) {
    const s = String(text || "").trim();
    try {
      const u = new URL(s);
      const q = u.searchParams.get("id");
      if (q) return q.toUpperCase();
      const m = u.pathname.match(/\/v\/([A-Za-z0-9-]+)/);
      if (m) return m[1].toUpperCase();
      return "";
    } catch (e) {}
    const m = s.toUpperCase().match(/FV-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}/);
    return m ? m[0] : s.toUpperCase().replace(/[^A-Z0-9-]/g, "");
  }

  window.FV = { ICONS, mount, initReveal, fillIcons, extractId };
})();
