(function () {
  "use strict";
  const { ui, shell, slides: content } = presentationContent;
  const cfg = presentationConfig;
  const deck = document.getElementById("deck");
  const announcer = document.getElementById("announcer");
  const fsBtn = document.getElementById("fullscreen-btn");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const nodes = {};
  let current = null, busy = false, pending = null;

  /* ---------- ikon ---------- */
  const ICONS = {
    book: '<path d="M3 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H3z"/><path d="M21 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="m4 18 5-5 4 4 3-3 4 4"/>',
    columns: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/>',
    route: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5"/>',
    chart: '<path d="M6 20v-6M12 20V6M18 20v-10"/>',
    notebook: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M2 7h3M2 12h3M2 17h3"/>',
    flag: '<path d="M5 21V4M5 4h13l-2.5 4.5L18 13H5"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    eye: '<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17v4M17 19h4"/>',
    chat: '<path d="M4 5h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M19 9h1a1 1 0 0 1 1 1v8l-3-2.5h-6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>'
  };
  function icon(name, cls) {
    const s = document.createElement("span");
    s.className = "icon" + (cls ? " " + cls : "");
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || "") + "</svg>";
    return s;
  }

  /* ---------- helpers ---------- */
  function h(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function add(parent) {
    for (let i = 1; i < arguments.length; i++) if (arguments[i]) parent.appendChild(arguments[i]);
    return parent;
  }
  function button(cls, label, action, target, before, after) {
    const b = h("button", cls);
    b.type = "button";
    b.dataset.action = action;
    if (target != null) b.dataset.target = target;
    if (before) b.appendChild(icon(before));
    b.appendChild(h("span", null, label));
    if (after) b.appendChild(icon(after));
    return b;
  }
  const pad2 = n => String(n).padStart(2, "0");
  const toned = (el, tone) => { el.dataset.tone = tone; return el; };
  function heading(tag, cls, text) { const e = h(tag, "slide__title " + (cls || ""), text); e.tabIndex = -1; return e; }
  function logoBox(cls, text) {
    const b = h("span", "logo " + (cls || ""));
    const fallback = () => { b.textContent = text || shell.logoText; };
    if (shell.logoImage && !text) {
      const i = new Image(); i.alt = ""; i.onerror = fallback; i.src = shell.logoImage; b.appendChild(i);
    } else fallback();
    return b;
  }
  function figureBox(d) {
    const box = h("figure", "figure-box");
    const ph = () => {
      box.textContent = ""; box.classList.remove("has-image");
      add(box, icon("image", "figure-box__icon"), h("p", "figure-box__title", d.imageTitle), h("p", "figure-box__hint", d.imageHint));
    };
    if (!d.image) { ph(); return box; }
    const img = new Image(); img.alt = d.imageAlt || ""; img.onerror = ph; img.src = d.image;
    box.classList.add("has-image"); box.appendChild(img);
    return box;
  }
  function titleBlock(d) {
    const w = h("div", "titlebar"), l = h("div", "titlebar__text");
    add(l, h("p", "kicker", d.kicker), heading("h2", "", d.title), h("p", "lead", d.lead));
    return add(w, l, h("span", "titlebar__num", d.number));
  }
  const main = cls => h("div", "slide__main layout-" + cls);

  /* ---------- layout per slide ---------- */
  const layouts = {
    cover(d) {
      const m = main("cover"), l = h("div", "cover__text");
      add(l, h("p", "kicker kicker--line", d.kicker), heading("h1", "cover__title", d.title),
        h("p", "cover__sub", d.subtitle), button("btn", ui.next, "next", null, null, "arrowRight"));
      const c = toned(h("div", "id-card"), "lav");
      add(c, h("span", "id-card__dot"), h("p", "card-label", d.card.label), logoBox("", d.card.logoText), h("p", "id-card__school", d.card.school));
      d.card.rows.forEach(r => add(c, add(h("div", "id-card__row"), h("span", null, r.label), h("span", null, r.value))));
      return add(m, l, c);
    },
    menu(d, n) {
      const m = main("menu"), head = h("div", "menu__head"), board = h("div", "menu__board");
      add(head, add(h("div"), h("p", "kicker", d.kicker), heading("h2", "", d.title)), h("p", "menu__hint", d.hint));
      d.menuItems.forEach(it => {
        if (!Navigation.canGoTo(n, it.target)) return;
        const b = toned(button("menu-card", "", "goto", it.target), it.tone);
        b.textContent = "";
        add(b, add(h("span", "menu-card__top"), h("span", null, it.tag), icon("arrowUpRight")),
          icon(it.icon, "menu-card__icon"), h("span", "menu-card__label", it.label));
        board.appendChild(b);
      });
      return add(m, head, board);
    },
    hero(d) {
      const m = main("hero"), body = h("div", "hero__body");
      const a = toned(h("div", "card hero__main"), "blue");
      add(a, h("p", "card-label", d.hero.label), h("p", "hero__idea", d.hero.idea), h("p", "hero__note", d.hero.note));
      const s = toned(h("div", "card hero__side"), d.side.tone);
      s.appendChild(h("h3", null, d.side.title));
      d.side.items.forEach(i => add(s, add(h("div"), h("p", "item-label", i.label), h("p", null, i.text))));
      return add(m, titleBlock(d), add(body, a, s));
    },
    trio(d) {
      const m = main("trio"), body = h("div", "trio__body");
      d.cards.forEach(c => add(body, add(toned(h("div", "card trio__card"), c.tone),
        add(h("div", "trio__top"), h("span", "trio__letter", c.letter), icon(c.icon)),
        h("h3", null, c.title), h("p", null, c.text), h("p", "trio__note", c.note))));
      return add(m, titleBlock(d), body, add(h("p", "thread"), h("b", "kicker", d.thread.label), h("span", null, d.thread.text)));
    },
    figure(d) {
      const m = main("figure"), body = h("div", "fig__body"), left = h("div", "fig__left"), side = h("div", "fig__side");
      const cap = add(h("div", "fig__caption"), h("b", "kicker", d.caption.label), h("span", null, d.caption.text), h("small", null, d.caption.source));
      add(left, figureBox(d), cap);
      const co = h("div", "callout");
      add(co, h("p", "card-label", d.side.callout.label), h("p", null, d.side.callout.text));
      add(side, h("h3", null, d.side.title), h("p", null, d.side.text), co);
      return add(m, titleBlock(d), add(body, left, side));
    },
    compare(d) {
      const m = main("compare"), t = h("div", "cmp__table");
      const labels = add(h("div", "cmp__col"), h("div"));
      d.rows.forEach(r => labels.appendChild(h("div", "cmp__aspect", r.aspect)));
      t.appendChild(labels);
      d.columns.forEach((c, i) => {
        const col = toned(h("div", "cmp__col"), c.tone);
        add(col, add(h("div", "cmp__head"), h("b", null, c.letter), h("span", null, c.title)));
        d.rows.forEach(r => col.appendChild(h("div", "cmp__cell", i === 0 ? r.a : r.b)));
        t.appendChild(col);
      });
      return add(m, titleBlock(d), t, add(h("p", "thread"), h("b", "kicker", d.conclusion.label), h("span", null, d.conclusion.text)));
    },
    steps(d) {
      const m = main("steps"), grid = h("div", "steps__grid");
      const ends = add(h("div", "steps__ends"), h("span", null, d.from), icon("arrowRight"), h("span", null, d.to));
      d.steps.forEach(s => add(grid, add(toned(h("div", "card step"), s.tone),
        h("span", "step__n", s.n), h("h3", null, s.title), h("p", null, s.text), h("p", "step__out", s.output))));
      return add(m, titleBlock(d), ends, grid, add(h("p", "thread"), h("b", "kicker", d.note.label), h("span", null, d.note.text)));
    },
    data(d) {
      const m = main("data"), body = h("div", "data__body");
      const chart = toned(h("div", "card chart"), "white");
      add(chart, add(h("div", "chart__head"), h("h3", null, d.chart.title), h("span", null, d.chart.unit)));
      d.chart.bars.forEach(b => {
        const fill = toned(h("div", "bar__fill"), b.tone);
        fill.style.width = Math.max(0, Math.min(100, b.percent)) + "%";
        add(chart, add(h("div", "bar"), h("span", null, b.label), add(h("div", "bar__track"), fill), h("b", null, b.value)));
      });
      add(chart, h("p", "chart__src", d.chart.source), h("p", "chart__src", d.chart.hint));
      chart.querySelectorAll(".chart__src").forEach(e => { e.style.marginTop = "0"; });
      const hl = toned(h("div", "card hl"), "yel"), x = d.highlight;
      add(hl, h("p", "card-label", x.label), h("p", "hl__value", x.value), h("p", null, x.name), h("hr"),
        h("p", "card-label", x.meaningLabel), h("p", null, x.meaning));
      return add(m, titleBlock(d), add(body, chart, hl));
    },
    summary(d) {
      const m = main("summary"), body = h("div", "sum__body"), list = h("div", "sum__list");
      d.items.forEach(i => add(list, add(h("div", "sum__item"), h("span", "sum__n", i.n), add(h("div"), h("h3", null, i.title), h("p", null, i.text)))));
      const c = toned(h("div", "card sum__card"), "lav");
      add(c, h("p", "card-label", d.card.label), h("p", "big", d.card.title), h("p", "note", d.card.note));
      return add(m, titleBlock(d), add(body, list, c));
    },
    closing(d) {
      const m = main("closing");
      const top = add(h("div", "close__top"), h("b", "kicker", d.kicker), h("span", null, d.topRight));
      const mid = h("div", "close__mid");
      add(mid, add(h("span", "close__bubble"), icon("chat")), heading("h2", "close__title", d.title),
        h("p", "close__sub", d.subtitle), h("p", "close__text", d.text), h("p", "close__who", d.author));
      return add(m, top, mid, add(h("p", "close__ref"), h("b", "kicker", d.reference.label), h("span", null, d.reference.text)));
    }
  };

  function header(text) {
    const st = add(h("div", "status"), h("span", "status__dot"), h("span", null, text));
    return add(h("header", "slide-header"), add(h("div", "brand"), logoBox(), h("span", "brand__name", shell.school)),
      h("div", "room", shell.room), st);
  }
  function footer(n, d) {
    const left = h("div", "footer__left"), right = h("div", "footer__right");
    if (n === 1) { add(left, h("span", "footer__text", shell.authorLine)); add(right, h("span", "footer__text", shell.title)); }
    else if (n === 2) { add(left, button("link", ui.backToCover, "previous", null, "arrowLeft")); add(right, h("span", "footer__text", shell.title)); }
    else {
      add(left, button("link", ui.backToMenu, "home", null, "grid"));
      if (n === cfg.totalSlides) add(right, button("btn btn--ghost", ui.previous, "previous", null, "arrowLeft"), button("btn", ui.finish, "home", null, null, "arrowRight"));
      else add(right, button("btn btn--ghost", d.prevLabel || ui.previous, "previous", null, "arrowLeft"), button("btn", ui.next, "next", null, null, "arrowRight"));
    }
    return add(h("footer", "slide-footer"), left, h("div", "footer__count", pad2(n) + " — " + pad2(cfg.totalSlides)), right);
  }

  function build() {
    for (let n = 1; n <= cfg.totalSlides; n++) {
      const d = content[n];
      const s = h("section", "slide slide--" + d.layout);
      s.id = "slide-" + n;
      s.setAttribute("aria-label", ui.slideLabel.replace("{n}", n).replace("{total}", cfg.totalSlides));
      s.setAttribute("aria-hidden", "true");
      s.inert = true;
      const status = d.status || ("Materi " + pad2(d.materi) + " / " + pad2(shell.totalMateri));
      add(s, header(status), layouts[d.layout](d, n), footer(n, d));
      deck.appendChild(s);
      nodes[n] = s;
    }
  }

  /* ---------- navigasi ---------- */
  function duration() { return reduceMotion.matches ? cfg.reducedMotionMs : cfg.transitionMs; }

  function activate(n) {
    const s = nodes[n];
    s.classList.add("is-active");
    s.inert = false;
    s.removeAttribute("aria-hidden");
    current = n;
    const hd = s.querySelector(".slide__title");
    if (hd) hd.focus({ preventScroll: true });
    announcer.textContent = s.getAttribute("aria-label");
  }

  function setHash(n, fromHistory) {
    if (!cfg.useHash || fromHistory) return;
    const h2 = "#slide-" + n;
    if (location.hash !== h2) history.pushState(null, "", h2);
  }

  function go(n, fromHistory) {
    if (!Navigation.isValid(n) || n === current) return;
    if (busy) { pending = { n, fromHistory }; return; }
    setHash(n, fromHistory);
    if (current === null) { activate(n); return; }
    const dir = n > current ? "forward" : "backward";
    const out = nodes[current], inn = nodes[n];
    busy = true;
    out.classList.add("is-leaving-" + dir);
    inn.classList.add("is-entering-" + dir);
    inn.inert = false;
    setTimeout(() => {
      out.classList.remove("is-leaving-" + dir, "is-active");
      out.inert = true;
      out.setAttribute("aria-hidden", "true");
      inn.classList.remove("is-entering-" + dir);
      activate(n);
      busy = false;
      if (pending) { const p = pending; pending = null; go(p.n, p.fromHistory); }
    }, duration() + 30);
  }

  function act(action, target) {
    if (action === "goto") { if (Navigation.canGoTo(current, target)) go(target); return; }
    const t = Navigation.target(current, action);
    if (t !== null) go(t);
  }

  deck.addEventListener("click", e => {
    const b = e.target.closest("[data-action]");
    if (!b || b.disabled) return;
    act(b.dataset.action, Number(b.dataset.target));
  });

  document.addEventListener("keydown", e => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.target.closest && e.target.closest("input,textarea,select,[contenteditable]")) return;
    if (e.key === "ArrowRight") { act("next"); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { act("previous"); e.preventDefault(); }
    else if (e.key === "Home") { go(2); e.preventDefault(); }
    else if (e.key === "Escape" && fsElement()) exitFs();
  });

  function fromHash() {
    const m = /^#slide-(\d+)$/.exec(location.hash);
    return m ? Number(m[1]) : null;
  }
  function onHistory() { const n = fromHash(); if (n !== null) go(n, true); }
  window.addEventListener("popstate", onHistory);
  window.addEventListener("hashchange", onHistory);

  /* ---------- fullscreen ---------- */
  const root = document.documentElement;
  const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;
  const fsSupported = !!(root.requestFullscreen || root.webkitRequestFullscreen) && document.fullscreenEnabled !== false;
  function exitFs() {
    const f = document.exitFullscreen || document.webkitExitFullscreen;
    if (f) { const r = f.call(document); if (r && r.catch) r.catch(() => {}); }
  }
  function enterFs() {
    const f = root.requestFullscreen || root.webkitRequestFullscreen;
    try { const r = f.call(root); if (r && r.catch) r.catch(() => {}); } catch (_) {}
  }
  function syncFs() {
    const on = !!fsElement();
    fsBtn.setAttribute("aria-pressed", String(on));
    const label = on ? ui.fullscreenExit : ui.fullscreenEnter;
    fsBtn.setAttribute("aria-label", label);
    fsBtn.title = label;
  }
  if (fsSupported) {
    fsBtn.addEventListener("click", () => (fsElement() ? exitFs() : enterFs()));
    document.addEventListener("fullscreenchange", syncFs);
    document.addEventListener("webkitfullscreenchange", syncFs);
    syncFs();
  } else {
    fsBtn.disabled = true;
    fsBtn.setAttribute("aria-label", ui.fullscreenUnavailable);
    fsBtn.title = ui.fullscreenUnavailable;
  }

  /* ---------- start ---------- */
  document.documentElement.style.setProperty("--dur", cfg.transitionMs + "ms");
  reduceMotion.addEventListener
    ? reduceMotion.addEventListener("change", () => document.documentElement.style.setProperty("--dur", duration() + "ms"))
    : null;
  document.documentElement.style.setProperty("--dur", duration() + "ms");
  build();
  const start = cfg.useHash && Navigation.isValid(fromHash()) ? fromHash() : cfg.startSlide;
  go(start, !cfg.useHash || fromHash() === start);
})();
