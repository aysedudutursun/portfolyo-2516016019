/* ===== SAYFA MOTORU — içerik public/site/icerik.js dosyasındaki window.SITE'tan okunur.
   Yazı eklemek/değiştirmek için bu bölüme dokunmanız gerekmez. ===== */
(function () {
  "use strict";
  var S = window.SITE;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches;
  if (!S) { document.body.textContent = "İçerik dosyası (public/site/icerik.js) okunamadı."; return; }

  /* ---------- Dil ---------- */
  var codes = S.languages.map(function (l) { return l.code; });
  var lang = S.defaultLanguage || codes[0];
  try {
    var saved = localStorage.getItem("lang");
    if (saved && codes.indexOf(saved) > -1) lang = saved;
    else if (!saved) {
      var nav = (navigator.language || "").slice(0, 2).toLowerCase();
      if (codes.indexOf(nav) > -1) lang = nav;
    }
  } catch (e) {}

  function pick(v) {
    if (v == null) return "";
    if (typeof v !== "object") return String(v);
    if (v[lang] != null && v[lang] !== "") return v[lang];
    if (v.en != null) return v.en;
    if (v.tr != null) return v.tr;
    for (var k in v) return v[k];
    return "";
  }

  /* ---------- Küçük DOM yardımcıları ---------- */
  var binds = [];
  function tx(v) {
    var n = document.createTextNode(pick(v));
    if (v && typeof v === "object") n._v = v;
    if (v && typeof v === "object") binds.push(function () { n.nodeValue = pick(v); });
    return n;
  }
  function at(el, name, v) {
    el.setAttribute(name, pick(v));
    if (v && typeof v === "object") binds.push(function () { el.setAttribute(name, pick(v)); });
  }
  function add(el, kids) {
    (kids || []).forEach(function (c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) return add(el, c);
      if (c.nodeType) return el.appendChild(c);
      el.appendChild(tx(c));
    });
    return el;
  }
  function h(tag, cls, kids, attrs) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    for (var k in attrs || {}) el.setAttribute(k, attrs[k]);
    return add(el, kids);
  }
  function norm(s) {
    return String(s).toLocaleLowerCase()
      .replace(/ı/g, "i").replace(/İ/g, "i")
      .normalize("NFD").replace(/[\u0300-\u036f\u064b-\u065f\u0640]/g, "");
  }
  function tags(list) { return (list || []).map(function (t) { return h("span", "tag", [t]); }); }

  var projGrid = null;

  /* ---------- Bölüm oluşturucular ---------- */
  var builders = {
    about: function () {
      var communityCount = S.communities.reduce(function (n, c) { return n + (c.count || 1); }, 0);
      var stats = S.about.stats.map(function (s) {
        var v = s.value != null ? s.value : (s.auto === "projects" ? S.projects.length : communityCount);
        var b = h("b", "", ["0"], { "data-n": v });
        return h("div", "", [b, h("span", "", [s.label])]);
      });
      return [h("p", "rv", [S.about.text], { style: "max-width:70ch" }), h("div", "stats stag", stats)];
    },
    skills: function () {
      return [h("div", "grid stag", S.skills.map(function (k) {
        return h("div", "card sr", [h("h3", "", [k.title]), h("p", "", [k.text]), tags(k.tags)]);
      }))];
    },
    projects: function () {
      var cards = S.projects.map(function (p) {
        var kids = [h("h3", "", [p.title]), h("p", "", [p.text]), tags(p.tags)];
        if (p.link) kids.push(h("a", "lk", ["GitHub"], { href: p.link, target: "_blank", rel: "noopener" }));
        return h("div", "card sr", kids);
      });
      projGrid = h("div", "grid stag", cards);
      var out = [projGrid];
      if (S.github) out.push(h("p", "more rv", [h("a", "", ["GitHub"], { href: S.github, target: "_blank", rel: "noopener" })]));
      return out;
    },
    experience: function () {
      return [h("div", "tl stag", S.experience.map(function (e) {
        return h("div", "sr", [
          h("small", "", [h("bdi", "", [e.date], { dir: "ltr" })]),
          h("h3", "", [e.title]),
          e.text ? h("p", "", [e.text]) : null
        ]);
      }))];
    },
    community: function () {
      return [h("div", "grid stag", S.communities.map(function (c) {
        return h("div", "card sr", [h("h3", "", [c.title]), c.text ? h("p", "", [c.text]) : null, tags(c.tags)]);
      }))];
    },
    sports: function () {
      return [h("div", "grid stag", S.sports.map(function (s) {
        return h("div", "card sr", [h("span", "ic", [s.icon], { "aria-hidden": "true" }), h("h3", "", [s.title]), h("p", "", [s.text])]);
      }))];
    },
    references: function () {
      var R = S.references;
      var cards = R.people.map(function (p) {
        var kids = [h("div", "av", [p.initials], { "aria-hidden": "true" }), h("h3", "", [p.name]), h("p", "", [p.role]), h("p", "", [R.org])];
        (p.links || []).forEach(function (l) {
          kids.push(h("a", "lk", [l.label], { href: l.href, target: "_blank", rel: "noopener" }));
        });
        return h("div", "card sr", kids);
      });
      return [h("div", "grid stag", cards), h("p", "note rv", [R.note])];
    },
    contact: function () {
      return [h("div", "ct stag", S.contact.map(function (c) {
        var a = h("a", "sr", [h("small", "", [c.label]), h("bdi", "", [c.value], { dir: "ltr" })], { href: c.href });
        if (c.external) { a.target = "_blank"; a.rel = "noopener"; }
        return a;
      })), h("div", "btns rv", [h("a", "btn m", [S.ui.messageBtn], { href: "/iletisim" })])];
    },
    /* Güvenlik Laboratuvarı Bulgularım: veriler sunucudan window.BULGULAR ile gelir
       (bkz. app/route.js). { onecikan: [...], tumu: [...] } ya da hata olursa null. */
    lab: function () {
      var B = window.BULGULAR, L = S.ui.lab;
      var out = [h("p", "rv", [L.intro], { style: "max-width:70ch;color:var(--mut)" })];
      if (!B) { out.push(h("p", "note rv", [L.offline])); return out; }
      if (!B.tumu.length) { out.push(h("p", "note rv", [L.empty])); return out; }
      function seviye(c) { return c == null ? "" : c >= 9 ? "krit" : c >= 7 ? "yuk" : c >= 4 ? "orta" : "dus"; }
      function kart(b) {
        var c = b.cvss == null ? null : +b.cvss;
        var ust = h("div", "lab-ust", [
          c == null ? null : h("span", "cvss " + seviye(c), ["CVSS " + c.toFixed(1)]),
          b.durum ? h("span", "durum " + (b.durum === "açık" ? "acik" : "kapali"), [b.durum === "açık" ? L.open : L.closed]) : null
        ]);
        var alt = [];
        if (b.lab_ortami) alt.push(b.lab_ortami);
        if (b.bulunma_tarihi) alt.push(b.bulunma_tarihi);
        return h("div", "card sr lab", [ust, h("h3", "", [b.baslik]),
          alt.length ? h("p", "", [h("bdi", "", [alt.join(" · ")])]) : null,
          b.kategori ? h("span", "tag", [b.kategori]) : null]);
      }
      if (B.onecikan.length) {
        out.push(h("h3", "gh-title rv", [L.featured]));
        out.push(h("div", "grid stag", B.onecikan.map(kart)));
      }
      out.push(h("h3", "gh-title rv", [L.all]));
      out.push(h("div", "grid stag", B.tumu.map(kart)));
      return out;
    }
  };

  /* ---------- Sayfa iskeleti ---------- */
  var navEl = document.getElementById("nav");
  var pageEl = document.getElementById("page");
  var order = S.sections.filter(function (id) { return builders[id]; });

  // İçeriğe geç bağlantısı
  var skip = h("a", "skip", [S.ui.skip], { href: "#main" });
  document.body.insertBefore(skip, document.body.firstChild);

  // Gezinme
  var navWrap = h("div", "wrap", [h("b", "", [S.brand])]);
  var navLinks = {};
  order.forEach(function (id) {
    var a = h("a", "nl", [S.ui.nav[id]], { href: "#" + id });
    navLinks[id] = a; navWrap.appendChild(a);
  });
  var lg = h("div", "lg", S.languages.map(function (l) {
    var b = h("button", "", [l.label], { type: "button", "data-code": l.code, title: l.name, lang: l.code });
    return b;
  }), { role: "group" });
  at(lg, "aria-label", S.ui.languageLabel);
  navWrap.appendChild(lg);
  var tb = h("button", "tb", ["◐"], { type: "button" });
  at(tb, "aria-label", S.ui.themeToggle); at(tb, "title", S.ui.themeToggle);
  navWrap.appendChild(tb);
  navEl.appendChild(navWrap);
  var prog = h("div", "", [], { id: "prog", "aria-hidden": "true" });
  navEl.appendChild(prog);

  // Hero
  var ph = S.photo, photo = null;
  if (ph && ph.src) {
    var img = h("img", "", [], { src: ph.src, width: 840, height: 1120, decoding: "async", fetchpriority: "high" });
    at(img, "alt", ph.alt);
    photo = h("div", "photo rise", [h("div", "frame", [img, h("div", "fb", [ph.initials || ""], { "aria-hidden": "true" })])], { style: "--d:250" });
    var okImg = function () { photo.classList.add("ok"); };
    img.addEventListener("load", okImg);
    img.addEventListener("error", function () {
      photo.classList.add("no");
    });
    if (img.complete && img.naturalWidth) okImg();
  }
  var ty = h("em", "", [""], { id: "ty" });
  /* Veri analizi grafiği: geçmiş veri (düz çizgi + sütunlar) ve tahmin (kesik çizgi + güven aralığı) */
  function buildViz() {
    var W = 440, H = 190, pl = 12, pr = 12, pt = 16, pb = 22, base = H - pb;
    var hist = [.18, .24, .27, .42, .36, .48, .58, .65, .2, .3, .62, .78, .86, .92], fc = [.92, .96, 1.0, 1.05];
    var n = hist.length + fc.length - 1, step = (W - pl - pr) / (n - 1), top = base - pt;
    function X(i) { return (pl + i * step).toFixed(1); }
    function Y(v) { return (base - v / 1.12 * top).toFixed(1); }
    var o = "";
    for (var g = 0; g < 4; g++) { var gy = (pt + g * top / 3).toFixed(1); o += '<line class="gr" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + gy + '" y2="' + gy + '"/>'; }
    o += '<line class="gr" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + base + '" y2="' + base + '" style="stroke-opacity:.5"/>';
    hist.forEach(function (v, i) {
      var bh = (v * .42 * top).toFixed(1), bw = (step * .5).toFixed(1);
      o += '<rect class="vb" style="--i:' + i + '" x="' + (pl + i * step - step * .25).toFixed(1) + '" y="' + (base - bh).toFixed(1) + '" width="' + bw + '" height="' + bh + '" rx="3"/>';
    });
    var d = hist.map(function (v, i) { return (i ? "L" : "M") + X(i) + " " + Y(v); }).join("");
    var up = "", lo = "", fd = "", k0 = hist.length - 1;
    fc.forEach(function (v, j) {
      var sp = j * .035, x = X(k0 + j);
      up += (j ? "L" : "M") + x + " " + Y(v + sp); fd += (j ? "L" : "M") + x + " " + Y(v);
    });
    for (var j = fc.length - 1; j >= 0; j--) lo += "L" + X(k0 + j) + " " + Y(fc[j] - j * .035);
    o += '<path class="fb" d="' + up + lo + 'Z"/>';
    o += '<path class="hl" pathLength="1" d="' + d + '"/>';
    o += '<path class="fl" d="' + fd + '"/>';
    hist.forEach(function (v, i) { if (i % 2 === 0 || i === k0) o += '<circle class="pt" style="--i:' + i + '" cx="' + X(i) + '" cy="' + Y(v) + '" r="3.2"/>'; });
    o += '<circle class="ed" cx="' + X(n - 1) + '" cy="' + Y(fc[fc.length - 1]) + '" r="4.5"/>';
    var box = h("div", "viz rise", [], { "aria-hidden": "true", style: "--d:520" });
    box.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" focusable="false">' + o + "</svg>";
    box.appendChild(h("div", "viz-leg", [h("span", "", [S.ui.vizActual]), h("span", "f", [S.ui.vizForecast])]));
    return box;
  }
  var chipRow = h("div", "chips rise", (S.hero.chips || []).map(function (c) { return h("a", "chip", [c], { href: "#skills" }); }), { style: "--d:340" });
  var firstId = order[0], lastId = order[order.length - 1];
  var hero = h("header", "hero", [h("div", "wrap hero-grid", [
    h("div", "hero-text", [
      h("h1", "rise", [h("span", "", S.name.map(function (n, k) { return k ? [document.createElement("br"), n] : [n]; }).reduce(function (a, b) { return a.concat(b); }, []))], { style: "--d:60" }),
      h("p", "role rise", [ty], { style: "--d:260" }),
      chipRow,
      h("p", "sub rise", [S.hero.subtitle], { style: "--d:430" }),
      buildViz(),
      h("div", "btns rise", [
        order.indexOf("projects") > -1 ? h("a", "btn", [S.ui.projectsBtn], { href: "#projects" }) : null,
        order.indexOf("contact") > -1 ? h("a", "btn m", [S.ui.contactBtn], { href: "#contact" }) : null
      ], { style: "--d:680" })
    ]),
    photo
  ])]);

  // Arama kutusu
  var q = h("input", "", [], { id: "q", type: "search", autocomplete: "off", enterkeyhint: "search" });
  at(q, "placeholder", S.ui.searchPlaceholder); at(q, "aria-label", S.ui.searchPlaceholder);
  var cnt = h("span", "", [], { id: "cnt", "aria-live": "polite" });
  var sb = h("div", "sb", [h("div", "wrap", [q, cnt])]);

  var main = h("main", "", [hero, sb], { id: "main" });
  order.forEach(function (id) {
    var sec = h("section", "", [h("div", "wrap", [h("h2", "rv", [(S.ui.headings && S.ui.headings[id]) || S.ui.nav[id]])].concat(builders[id]()))], { id: id });
    main.appendChild(sec);
  });
  var footer = h("footer", "", [h("div", "wrap", ["© " + S.year + " " + S.name.join(" ") + " · " + S.location])]);
  pageEl.appendChild(main); pageEl.appendChild(footer);

  /* ---------- GitHub depolarını otomatik ekle ---------- */
  var GH = S.githubProjects;
  function repoCards(repos) {
    var manual = S.projects.map(function (p) { return String(p.repo || "").toLowerCase(); }).filter(Boolean);
    var skip = (GH.exclude || []).map(function (n) { return n.toLowerCase(); });
    var list = repos.filter(function (r) {
      var n = r.name.toLowerCase();
      return !(GH.hideForks && r.fork) && !r.archived && skip.indexOf(n) < 0 && manual.indexOf(n) < 0;
    }).sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); }).slice(0, GH.max || 12);
    if (!list.length) return;
    var head = h("h3", "gh-title rv", [GH.title]);
    var cards = list.map(function (r) {
      var t = [];
      if (r.language) t.push(r.language);
      (r.topics || []).slice(0, 3).forEach(function (x) { t.push(x); });
      var kids = [h("h3", "", [r.name.replace(/[-_]+/g, " ")])];
      if (r.description) kids.push(h("p", "", [r.description]));
      kids.push(tags(t));
      kids.push(h("a", "lk", ["GitHub" + (r.stargazers_count ? " ★ " + r.stargazers_count : "")], { href: r.html_url, target: "_blank", rel: "noopener" }));
      return h("div", "card sr rv", kids);
    });
    var grid = h("div", "grid", cards);
    cards.forEach(function (c, k) { c.style.transitionDelay = Math.min(k * 80, 480) + "ms"; });
    var anchor = projGrid.parentNode.querySelector(".more");
    projGrid.parentNode.insertBefore(head, anchor);
    projGrid.parentNode.insertBefore(grid, anchor);
    [head].concat(cards).forEach(function (e) { io.observe(e); });
    search();
  }
  function loadRepos() {
    if (!GH || !GH.enabled || !GH.username || !projGrid || !window.fetch) return;
    var key = "gh-repos-" + GH.username, now = Date.now();
    try {
      var c = JSON.parse(localStorage.getItem(key) || "null");
      if (c && now - c.t < 3600000) return repoCards(c.d);   // 1 saat önbellek (GitHub istek sınırı için)
    } catch (e) {}
    fetch("https://api.github.com/users/" + encodeURIComponent(GH.username) + "/repos?per_page=100&sort=pushed")
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        try { localStorage.setItem(key, JSON.stringify({ t: now, d: d })); } catch (e) {}
        repoCards(d);
      })
      .catch(function () {
        try { var c = JSON.parse(localStorage.getItem(key) || "null"); if (c) repoCards(c.d); } catch (e) {}
      });
  }

  /* ---------- Dil uygulama ---------- */
  var tw = { i: 0, c: 0, del: false, t: null };
  function applyLang(code) {
    lang = code;
    var meta = S.languages.filter(function (l) { return l.code === code; })[0];
    document.documentElement.lang = code;
    document.documentElement.dir = meta.dir || "ltr";
    binds.forEach(function (f) { f(); });
    [].forEach.call(lg.children, function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-code") === code); });
    document.title = S.name.join(" ") + " | " + pick(S.hero.roles[0]);
    clearTimeout(tw.t); tw.i = 0; tw.c = pick(S.hero.roles[0]).length; tw.del = false; typeTick();
    search();
  }
  function setLang(code) {
    if (code === lang) return;
    try { localStorage.setItem("lang", code); } catch (e) {}
    if (reduce) return applyLang(code);
    pageEl.classList.add("swap");
    setTimeout(function () {
      applyLang(code);
      requestAnimationFrame(function () { requestAnimationFrame(function () { pageEl.classList.remove("swap"); }); });
    }, 240);
  }
  lg.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-code]"); if (b) setLang(b.getAttribute("data-code"));
  });

  /* ---------- Yazı makinesi ---------- */
  function typeTick() {
    var roles = S.hero.roles, t = pick(roles[tw.i]);
    if (reduce) { ty.textContent = t; return; }
    ty.textContent = t.slice(0, tw.c);
    var wait = 55;
    if (!tw.del && tw.c < t.length) tw.c++;
    else if (!tw.del) { tw.del = true; wait = 1500; }
    else if (tw.c > 0) { tw.c--; wait = 28; }
    else { tw.del = false; tw.i = (tw.i + 1) % roles.length; wait = 320; }
    tw.t = setTimeout(typeTick, wait);
  }

  /* ---------- Arama ---------- */
  var hits = [], hi = -1, stimer = null;
  // Bir kartın aranabilir metni: görünen yazı + bütün dillerdeki karşılıkları
  function hay(el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), out = [], n;
    while ((n = w.nextNode())) out.push(n._v ? Object.keys(n._v).map(function (k) { return n._v[k]; }).join(" ") : n.nodeValue);
    return norm(out.join(" "));
  }
  function updCount() {
    var has = q.value.trim();
    cnt.textContent = !has ? "" : (hits.length ? (hi >= 0 ? (hi + 1) + "/" : "") + hits.length : "0") + " " + pick(S.ui.results);
  }
  function search() {
    var words = norm(q.value.trim()).split(/\s+/).filter(Boolean); hits = []; hi = -1;
    [].forEach.call(document.querySelectorAll(".sr"), function (e) {
      e.classList.remove("dim", "hit", "cur");
      if (!words.length) return;
      e.classList.add("in"); // henüz belirmemiş kartlar hayalet gibi görünmesin
      var t = hay(e);
      // her kelime kartta geçmeli (sırası önemli değil)
      if (words.every(function (w) { return t.indexOf(w) > -1; })) { e.classList.add("hit"); hits.push(e); } else e.classList.add("dim");
    });
    updCount();
  }
  function go(i) {
    if (!hits.length) return;
    if (hi >= 0) hits[hi].classList.remove("cur");
    hi = (i + hits.length) % hits.length;
    hits[hi].classList.add("cur");
    hits[hi].scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    updCount();
  }
  q.addEventListener("input", function () {
    search(); clearTimeout(stimer);
    stimer = setTimeout(function () { if (hits.length) go(0); }, 350); // yazmayı bırakınca ilk sonuca git
  });
  q.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === "ArrowDown") { e.preventDefault(); clearTimeout(stimer); go(hi + (e.shiftKey ? -1 : 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); go(hi - 1); }
    else if (e.key === "Escape") { q.value = ""; search(); q.blur(); }
  });

  /* ---------- Görününce belirme (gruplarda kademeli) ---------- */
  [].forEach.call(document.querySelectorAll(".stag"), function (g) {
    [].forEach.call(g.children, function (c, k) {
      c.classList.add("rv");
      c.style.transitionDelay = Math.min(k * 80, 480) + "ms";
    });
  });
  function countUp(el) {
    var n = +el.getAttribute("data-n");
    if (reduce || !n) { el.textContent = n; return; }
    var t0 = performance.now(), dur = 1300;
    (function step(t) {
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(n * e);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (x) {
      if (!x.isIntersecting) return;
      var t = x.target;
      t.classList.add("in");
      [].forEach.call(t.querySelectorAll("[data-n]"), countUp);
      if (t.hasAttribute("data-n")) countUp(t);
      setTimeout(function () { t.style.transitionDelay = ""; }, 1500); // hover gecikmesin
      io.unobserve(t);
    });
  }, { threshold: 0.01, rootMargin: "0px 0px 8% 0px" });
  [].forEach.call(document.querySelectorAll(".rv"), function (e) { io.observe(e); });

  /* ---------- Aktif bölüm + ilerleme çubuğu ---------- */
  var current = null;
  var so = new IntersectionObserver(function (es) {
    es.forEach(function (x) {
      if (x.isIntersecting) {
        current = x.target.id;
        for (var id in navLinks) navLinks[id].classList.toggle("on", id === current);
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  order.forEach(function (id) { so.observe(document.getElementById(id)); });
  var lo = new IntersectionObserver(function (es) {
    es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("seen"); lo.unobserve(x.target); } });
  }, { rootMargin: "0px 0px -10% 0px" });
  order.forEach(function (id) { lo.observe(document.getElementById(id)); });
  var amb = document.getElementById("amb");
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - innerHeight;
      prog.style.transform = "scaleX(" + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ")";
      if (amb && !reduce) amb.style.setProperty("--py", (-scrollY * 0.06).toFixed(1) + "px");
      if (scrollY < innerHeight * .4) for (var id in navLinks) navLinks[id].classList.remove("on");
      ticking = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var t = document.getElementById(a.getAttribute("href").slice(1));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }
  });

  /* ---------- Tema ---------- */
  var root = document.documentElement, colors = { c: "#00f0ff", m: "#ff2bd6" };
  function readColors() {
    var cs = getComputedStyle(root);
    colors.c = cs.getPropertyValue("--c").trim(); colors.m = cs.getPropertyValue("--m").trim();
  }
  function isLight() { return root.getAttribute("data-theme") === "light"; }
  function paintTheme() {
    tb.textContent = isLight() ? "☾" : "☀"; readColors();
    var mt = document.querySelector('meta[name="theme-color"]'); if (mt) mt.setAttribute("content", isLight() ? "#f3f6fb" : "#070a14");
    if (reduce) draw();
  }
  if (!root.getAttribute("data-theme")) root.setAttribute("data-theme", window.matchMedia && matchMedia("(prefers-color-scheme:light)").matches ? "light" : "dark");
  tb.addEventListener("click", function () {
    var next = isLight() ? "dark" : "light";
    root.classList.add("theming");
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    setTimeout(function () { readColors(); paintTheme(); }, 30);
    setTimeout(function () { root.classList.remove("theming"); }, 650);
  });

  /* ---------- Arka plan parçacıkları ---------- */
  var cv = document.getElementById("cv"), x = cv.getContext("2d"), P = [], W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nw = innerWidth, nh = innerHeight, wide = Math.abs(nw - W) > 40;
    W = nw; H = nh;
    cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (wide || !P.length) {
      P = []; var n = Math.min(70, Math.floor(W * H / 22000));
      for (var i = 0; i < n; i++) P.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5 });
    }
    if (reduce) draw();
  }
  function draw() {
    x.clearRect(0, 0, W, H);
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
      x.fillStyle = i % 3 ? colors.c : colors.m; x.shadowColor = x.fillStyle; x.shadowBlur = 10;
      x.beginPath(); x.arc(p.x, p.y, 2, 0, 7); x.fill(); x.shadowBlur = 0;
      for (var j = i + 1; j < P.length; j++) {
        var d = Math.hypot(p.x - P[j].x, p.y - P[j].y);
        if (d < 130) { x.strokeStyle = colors.c; x.globalAlpha = (1 - d / 130) * .35; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(P[j].x, P[j].y); x.stroke(); x.globalAlpha = 1; }
      }
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  addEventListener("resize", resize);

  /* ---------- Başlat ---------- */
  applyLang(lang);
  loadRepos();
  paintTheme();
  resize();
  if (!reduce) draw();
})();

