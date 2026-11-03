/* spookee: the ecology of lexicon. Every word ever dealt or said, and what it was said beside.
   A small force-directed graph on a canvas, in the spirit of Obsidian's graph view:
   - nodes are words (gold = a dealt card, lilac = a word someone typed, green ring = a word two people agreed on)
   - a line joins each typed word to the words it was bridging (the row above it), and two agreed words to each other
   - drag to move around, scroll or pinch to zoom, tap a word to see everything it touches
   Built once and kept alive across re-renders, so positions don't jump. */
(() => {
  "use strict";
  const norm = w => String(w || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "").replace(/^(the|a|an) /, "").replace(/\s+/g, " ").trim();
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MAX_NODES = 450;

  function build(readings){
    const nodes = new Map(), edges = new Map();
    const node = (w, kind) => {
      const k = norm(w); if (!k) return null;
      let n = nodes.get(k);
      if (!n) { n = { k, dealt:0, said:0, agreed:0, deg:0 }; nodes.set(k, n); }
      n[kind]++; return n;
    };
    const link = (a, b, kind) => {
      if (!a || !b || a === b) return;
      const [x, y] = a.k < b.k ? [a.k, b.k] : [b.k, a.k], key = x + "|" + y;
      let e = edges.get(key);
      if (!e) { e = { a:x, b:y, w:0, kind }; edges.set(key, e); }
      e.w++; if (kind === "same") e.kind = "same";
    };
    for (const r of readings) {
      const c = r.cards || {};
      let prev = [node(c.a, "dealt"), node(c.b, "dealt")].filter(Boolean);
      if (prev.length === 2) link(prev[0], prev[1], "pair");
      for (const t of (r.attempts || [])) {
        const row = [node(t.a, "said"), node(t.b, "said")].filter(Boolean);
        for (const g of row) for (const p of prev) link(g, p, "link");
        if (t.verdict === "right") { row.forEach(n => n.agreed++); if (row.length === 2) link(row[0], row[1], "same"); }
        if (row.length) prev = row;
      }
    }
    for (const e of edges.values()) { nodes.get(e.a).deg += e.w; nodes.get(e.b).deg += e.w; }
    return { nodes, edges:[...edges.values()] };
  }

  // ---------- the view ----------
  const el = document.createElement("div");
  el.className = "lex";
  el.innerHTML = `
    <div class="lex-tools">
      <input id="lex-q" type="search" placeholder="find a word" autocomplete="off" spellcheck="false" aria-label="find a word">
      <span class="lex-count" aria-live="polite"></span>
    </div>
    <div class="lex-stage">
      <canvas aria-label="a map of every word and what it was said beside"></canvas>
      <p class="lex-empty" hidden>nothing yet</p>
      <div class="lex-zoom">
        <button type="button" data-z="in" aria-label="zoom in">+</button>
        <button type="button" data-z="out" aria-label="zoom out">−</button>
        <button type="button" data-z="fit" aria-label="show everything">fit</button>
      </div>
    </div>
    <div class="lex-focus" aria-live="polite"></div>
    <p class="lex-key"><i class="k-dealt"></i>dealt <i class="k-said"></i>said <i class="k-agreed"></i>agreed</p>`;
  const canvas = el.querySelector("canvas"), ctx = canvas.getContext("2d");
  const stage = el.querySelector(".lex-stage"), focusEl = el.querySelector(".lex-focus"), countEl = el.querySelector(".lex-count");
  const emptyEl = el.querySelector(".lex-empty"), q = el.querySelector("#lex-q");

  let N = [], E = [], byKey = new Map(), adj = new Map();
  let cam = { x:0, y:0, s:1 }, W = 300, H = 300, dpr = 1;
  let alpha = 0, selected = null, hover = null, raf = 0, fitted = false, autoFit = true;

  function setData(readings){
    const g = build(readings);
    let list = [...g.nodes.values()];
    if (list.length > MAX_NODES) {
      list.sort((a, b) => (b.deg + b.said + b.dealt) - (a.deg + a.said + a.dealt));
      list = list.slice(0, MAX_NODES);
    }
    const keep = new Set(list.map(n => n.k)), old = byKey;
    byKey = new Map();
    N = list.map(n => {
      const o = old.get(n.k);
      const m = o ? Object.assign(o, n) : Object.assign(n, { x:(Math.random() - .5) * 240, y:(Math.random() - .5) * 240, vx:0, vy:0 });
      byKey.set(n.k, m); return m;
    });
    E = g.edges.filter(e => keep.has(e.a) && keep.has(e.b)).map(e => ({ ...e, A:byKey.get(e.a), B:byKey.get(e.b) }));
    adj = new Map(N.map(n => [n.k, []]));
    E.forEach(e => { adj.get(e.a).push([e.B, e]); adj.get(e.b).push([e.A, e]); });
    // new words start beside a word they touch
    N.forEach(n => { if (!old.has(n.k)) { const nb = (adj.get(n.k) || []).map(x => x[0]).find(x => old.has(x.k)); if (nb) { n.x = nb.x + (Math.random() - .5) * 40; n.y = nb.y + (Math.random() - .5) * 40; } } });
    labelSet = new Set([...N].sort((a, b) => b.deg - a.deg).slice(0, 40).map(n => n.k));
    if (selected && !byKey.has(selected.k)) selected = null;
    countEl.textContent = N.length ? `${N.length} ${N.length === 1 ? "word" : "words"} · ${E.length} ${E.length === 1 ? "thread" : "threads"}` : "";
    emptyEl.hidden = !!N.length;
    alpha = Math.max(alpha, old.size ? .5 : 1); fitted = fitted && old.size > 0;
    showFocus(); kick();
  }
  let labelSet = new Set();

  // ---------- physics ----------
  function tick(){
    const n = N.length;
    for (let i = 0; i < n; i++) {
      const a = N[i];
      for (let j = i + 1; j < n; j++) {
        const b = N[j]; let dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < 1) { dx = Math.random() - .5; dy = Math.random() - .5; d2 = 1; }
        if (d2 > 160000) continue;
        const f = 1100 * alpha / d2; dx *= f; dy *= f;
        a.vx += dx; a.vy += dy; b.vx -= dx; b.vy -= dy;
      }
    }
    for (const e of E) {
      const dx = e.B.x - e.A.x, dy = e.B.y - e.A.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
      const L = e.kind === "same" ? 34 : e.kind === "pair" ? 90 : 62, f = (d - L) / d * 0.06 * alpha * Math.min(3, e.w);
      e.A.vx += dx * f; e.A.vy += dy * f; e.B.vx -= dx * f; e.B.vy -= dy * f;
    }
    for (const a of N) {
      a.vx -= a.x * 0.004 * alpha; a.vy -= a.y * 0.004 * alpha;
      if (a === drag.node) { a.vx = a.vy = 0; continue; }
      a.vx *= .78; a.vy *= .78; a.x += a.vx; a.y += a.vy;
    }
    alpha *= .985;
  }

  // ---------- drawing ----------
  const toS = (x, y) => [(x - cam.x) * cam.s + W / 2, (y - cam.y) * cam.s + H / 2];
  const toW = (x, y) => [(x - W / 2) / cam.s + cam.x, (y - H / 2) / cam.s + cam.y];
  const radius = n => Math.min(15, 3.5 + Math.sqrt(n.deg) * 1.7) * Math.max(.7, Math.min(1.5, Math.sqrt(cam.s)));
  function draw(){
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const near = selected ? new Set([selected.k, ...(adj.get(selected.k) || []).map(x => x[0].k)]) : null;
    for (const e of E) {
      const on = near && (e.a === selected.k || e.b === selected.k);
      const [x1, y1] = toS(e.A.x, e.A.y), [x2, y2] = toS(e.B.x, e.B.y);
      ctx.lineWidth = Math.min(4, .7 + e.w * .5) * (on ? 1.4 : 1);
      ctx.strokeStyle = e.kind === "same" ? `rgba(125,214,160,${on ? .95 : near ? .12 : .55})`
        : e.kind === "pair" ? `rgba(207,168,255,${on ? .7 : near ? .06 : .22})`
        : `rgba(201,168,106,${on ? .9 : near ? .08 : .32})`;
      ctx.setLineDash(e.kind === "pair" ? [3, 4] : []);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.setLineDash([]);
    for (const n of N) {
      const [x, y] = toS(n.x, n.y), r = radius(n), dim = near && !near.has(n.k);
      ctx.globalAlpha = dim ? .25 : 1;
      ctx.fillStyle = n.said ? "#cfa8ff" : "#c9a86a";
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      if (n.dealt && n.said) { ctx.lineWidth = 2; ctx.strokeStyle = "#c9a86a"; ctx.stroke(); }
      if (n.agreed) { ctx.lineWidth = 2; ctx.strokeStyle = "#7dd6a0"; ctx.beginPath(); ctx.arc(x, y, r + 3, 0, Math.PI * 2); ctx.stroke(); }
      if (n === selected) { ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y, r + 6, 0, Math.PI * 2); ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
    ctx.font = "700 13px 'Atkinson Hyperlegible', system-ui, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.lineJoin = "round";
    for (const n of N) {
      const show = n === selected || n === hover || (near ? near.has(n.k) : (labelSet.has(n.k) || cam.s > 1.6 || N.length < 60));
      if (!show) continue;
      const [x, y] = toS(n.x, n.y), r = radius(n);
      ctx.lineWidth = 4; ctx.strokeStyle = "rgba(9,6,13,.9)"; ctx.strokeText(n.k, x, y + r + 4);
      ctx.fillStyle = n === selected ? "#fff" : "#efe4ff"; ctx.fillText(n.k, x, y + r + 4);
    }
  }
  function loop(){
    raf = 0;
    if (!el.isConnected) return;
    if (alpha > .02 && !reduce) tick();
    else if (reduce && alpha > .02) { for (let i = 0; i < 300 && alpha > .02; i++) tick(); }
    if (autoFit) fit();
    draw();
    if (alpha > .02 || drag.on || camAnim) raf = requestAnimationFrame(loop);
  }
  function kick(){ if (!raf && el.isConnected) raf = requestAnimationFrame(loop); }

  // ---------- camera ----------
  let camAnim = null;
  function fit(){
    if (!N.length) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    N.forEach(n => { x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x); y1 = Math.max(y1, n.y); });
    cam = { x:(x0 + x1) / 2, y:(y0 + y1) / 2 + 6, s:Math.max(.25, Math.min(2.2, (W - 90) / (x1 - x0 + 1), (H - 110) / (y1 - y0 + 1))) };
  }
  function glide(x, y, s){
    const from = { ...cam }, t0 = performance.now(), to = { x, y, s:s || cam.s };
    camAnim = true;
    const step = now => {
      const k = reduce ? 1 : Math.min(1, (now - t0) / 380), e = 1 - Math.pow(1 - k, 3);
      cam = { x:from.x + (to.x - from.x) * e, y:from.y + (to.y - from.y) * e, s:from.s + (to.s - from.s) * e };
      draw();
      if (k < 1) requestAnimationFrame(step); else camAnim = null;
    };
    requestAnimationFrame(step);
  }
  function zoomAt(f, sx, sy){
    const [wx, wy] = toW(sx, sy);
    cam.s = Math.max(.2, Math.min(4, cam.s * f));
    const [nx, ny] = toW(sx, sy); cam.x += wx - nx; cam.y += wy - ny;
    draw();
  }

  // ---------- pointer ----------
  const drag = { on:false, node:null, sx:0, sy:0, moved:0, pts:new Map(), pinch:0 };
  const pos = e => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  function hit(sx, sy){
    let best = null, bd = 1e9;
    for (const n of N) { const [x, y] = toS(n.x, n.y), r = radius(n) + 8, d = (x - sx) ** 2 + (y - sy) ** 2; if (d < r * r && d < bd) { bd = d; best = n; } }
    return best;
  }
  canvas.addEventListener("pointerdown", e => {
    canvas.setPointerCapture(e.pointerId);
    const [sx, sy] = pos(e); drag.pts.set(e.pointerId, [sx, sy]);
    if (drag.pts.size === 2) { const [a, b] = [...drag.pts.values()]; drag.pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); drag.node = null; return; }
    drag.on = true; drag.sx = sx; drag.sy = sy; drag.moved = 0; drag.node = hit(sx, sy);
    if (drag.node) { alpha = Math.max(alpha, .3); kick(); }
  });
  canvas.addEventListener("pointermove", e => {
    const [sx, sy] = pos(e);
    if (drag.pts.has(e.pointerId)) drag.pts.set(e.pointerId, [sx, sy]);
    if (drag.pts.size === 2) {
      const [a, b] = [...drag.pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      autoFit = false; if (drag.pinch) zoomAt(d / drag.pinch, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      drag.pinch = d; return;
    }
    if (!drag.on) { const h = hit(sx, sy); if (h !== hover) { hover = h; canvas.style.cursor = h ? "pointer" : "grab"; draw(); } return; }
    const dx = sx - drag.sx, dy = sy - drag.sy; drag.moved += Math.abs(dx) + Math.abs(dy);
    if (drag.node) { const [wx, wy] = toW(sx, sy); drag.node.x = wx; drag.node.y = wy; alpha = Math.max(alpha, .25); kick(); }
    else { cam.x -= dx / cam.s; cam.y -= dy / cam.s; draw(); }
    drag.sx = sx; drag.sy = sy;
  });
  const up = e => {
    drag.pts.delete(e.pointerId);
    if (drag.pts.size) return;
    if (drag.on && drag.moved < 6) select(drag.node || null); else if (drag.on) autoFit = false;
    drag.on = false; drag.node = null; drag.pinch = 0;
  };
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("wheel", e => { e.preventDefault(); autoFit = false; const [sx, sy] = pos(e); zoomAt(Math.exp(-e.deltaY * .0015), sx, sy); }, { passive:false });
  el.querySelectorAll("[data-z]").forEach(b => b.onclick = () => {
    if (b.dataset.z === "fit") { autoFit = true; fit(); draw(); } else autoFit = false, zoomAt(b.dataset.z === "in" ? 1.3 : 1 / 1.3, W / 2, H / 2);
  });

  // ---------- focus ----------
  function select(n, center){
    selected = n; showFocus(); draw();
    if (n && center) { autoFit = false; glide(n.x, n.y, Math.max(cam.s, 1.2)); }
  }
  function showFocus(){
    if (!selected) { focusEl.innerHTML = N.length ? `<p class="note">tap a word to see what it touches</p>` : ""; return; }
    const n = selected, list = (adj.get(n.k) || []).slice().sort((a, b) => b[1].w - a[1].w);
    const kinds = [n.dealt ? `dealt ${n.dealt}×` : "", n.said ? `said ${n.said}×` : "", n.agreed ? `agreed ${n.agreed}×` : ""].filter(Boolean).join(" · ");
    focusEl.innerHTML = `<div class="lex-word"><h3>${esc(n.k)}</h3><p class="note">${kinds}</p></div>
      ${list.length ? `<ul class="lex-links">${list.map(([m, e]) => `<li><button type="button" class="lex-chip ${e.kind}" data-k="${esc(m.k)}">${esc(m.k)}${e.w > 1 ? `<small>${e.w}</small>` : ""}</button></li>`).join("")}</ul>` : ""}`;
    focusEl.querySelectorAll("[data-k]").forEach(b => b.onclick = () => select(byKey.get(b.dataset.k), true));
  }
  q.addEventListener("input", () => {
    const v = norm(q.value); if (!v) return;
    const m = N.find(n => n.k === v) || N.find(n => n.k.startsWith(v)) || N.find(n => n.k.includes(v));
    if (m && m !== selected) select(m, true);
  });
  q.addEventListener("keydown", e => { if (e.key === "Escape") { q.value = ""; select(null); } });

  // ---------- size ----------
  function resize(){
    const r = stage.getBoundingClientRect();
    if (!r.width) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = Math.max(360, Math.min(640, Math.round(window.innerHeight * .6)));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.height = H + "px";
    draw();
  }
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
  window.addEventListener("resize", resize);

  window.SpookeeLexicon = {
    mount(slot){
      if (el.parentNode !== slot) slot.appendChild(el);
      resize(); kick();
    },
    setData,
    _build: build, // for tests
  };
})();
