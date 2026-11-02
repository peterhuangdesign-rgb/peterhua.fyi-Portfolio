/* spookee: game logic. Mounts inside #game; self-contained (see README.md).
   On claude.ai it syncs two devices through the artifact store; elsewhere it is pass-and-play on one device, saved in this browser. */
(() => {
"use strict";
const root = document.getElementById("game");
if (!root) return;
root.innerHTML = `<div class="wrap">
  <p class="mark">spookee</p>
  <nav id="tabs" aria-label="spookee">
    <a href="#who" data-tab="who">who are you?</a>
    <a href="#ball" data-tab="ball">crystal ball</a>
    <a href="#past" data-tab="past">see the past</a>
  </nav>
  <div id="view" aria-live="polite"></div>
</div>`;

const WORDS = (window.SPOOKEE_WORDS || []).slice();
const ROMAN = ["","I","II","III"];
const other = s => s === "a" ? "b" : "a";
const DEFAULT_NAMES = {a:"Peter", b:"Emma"};

const ls = {
  get(k){ try { return localStorage.getItem(k); } catch { return null; } },
  set(k,v){ try { localStorage.setItem(k,v); } catch {} }
};

// two private hands of five, never overlapping, never repeating words already dealt
function deal(used){
  let seen = new Set((used || []).map(w => w.toLowerCase()));
  let pool = WORDS.filter(w => !seen.has(w));
  if (pool.length < 10) { seen = new Set(); pool = WORDS.slice(); }
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [pool[i],pool[j]] = [pool[j],pool[i]]; }
  const a = pool.slice(0,5), b = pool.slice(5,10);
  return { decks:{a,b}, used:[...seen, ...a, ...b] };
}
function deepMerge(t, p){
  const out = {...t};
  for (const k in p) out[k] = (p[k] && typeof p[k] === "object" && !Array.isArray(p[k]) && t[k] && typeof t[k] === "object") ? deepMerge(t[k], p[k]) : p[k];
  return out;
}

/* ---------- state ---------- */
let game = null;          // shared game doc
let lineage = [];         // shared round records
let loaded = false, slow = false, readOnly = false, mode = "local";
let seat = ls.get("seat"); if (seat !== "a" && seat !== "b") seat = null;
let pick = null;          // card picked, not yet locked
let draft = "";           // bridge word being typed
let localNames = {...DEFAULT_NAMES};
let lastReveal = "";      // to animate only the first time a reveal appears

/* ---------- store: shared (db) or local fallback ---------- */
const SAVE_KEY = "spookee:v1";
function persist(){ if (!store.db) ls.set(SAVE_KEY, JSON.stringify({ game, lineage })); }
function restore(){
  try { const s = JSON.parse(ls.get(SAVE_KEY) || "null"); if (s) { game = s.game || null; lineage = s.lineage || []; } } catch {}
}
const store = {
  db: null,
  async set(doc){
    if (this.db) return this.db.doc("game/current").set(doc);
    game = doc; persist(); render();
  },
  async update(patch){
    if (this.db) return this.db.doc("game/current").update(patch);
    game = deepMerge(game, patch); persist(); render();
  },
  async saveRound(id, rec){
    if (this.db) return this.db.collection("lineage").doc(id).set(rec);
    lineage = lineage.filter(r => r.id !== id).concat([{...rec, id}]); persist(); render();
  }
};
async function write(fn){
  try { await fn(); }
  catch (e) {
    if (e && e.code === "invalid_argument") { readOnly = true; render(); }
    else if (e && e.code === "unavailable") { setTimeout(() => write(fn), 400 + Math.random()*600); }
    else { console.error(e); }
  }
}

function names(){ return (game && game.names) ? {...DEFAULT_NAMES, ...game.names} : localNames; }
function nm(s){ return (names()[s] || "").trim() || (s === "a" ? "Peter" : "Emma"); }

/* ---------- actions ---------- */
function begin(){
  const n = names();
  const d = deal(game && game.used);
  const doc = { names:n, gameNo:(game && game.gameNo || 0) + 1, round:1, stage:"cards", decks:d.decks, used:d.used, cards:{}, bridge:{}, score:0 };
  pick = null; draft = "";
  write(() => store.set(doc));
}
function lockCard(){
  if (!pick || !seat) return;
  write(() => store.update({ cards:{ [seat]: pick } }));
}
function toBridge(){ write(() => store.update({ stage:"bridge" })); }
function lockWord(){
  const w = draft.trim();
  if (!w || !seat) return;
  write(() => store.update({ bridge:{ [seat]: w } }));
}
function verdict(v){
  const g = game;
  const id = "g" + g.gameNo + "r" + g.round;
  const rec = { game:g.gameNo, round:g.round, names:names(), cards:g.cards, bridge:g.bridge, verdict:v, at:Date.now() };
  const d = deal(g.used);
  const next = { ...g, round:g.round + 1, stage:"cards", decks:d.decks, used:d.used, cards:{}, bridge:{}, score:(g.score||0) + (v === "right" ? 1 : 0) };
  pick = null; draft = "";
  write(async () => { await store.saveRound(id, rec); await store.set(next); });
}
let nameTimer = null;
function setName(s, v){
  if (game) {
    game = deepMerge(game, { names:{ [s]: v } });
    clearTimeout(nameTimer);
    nameTimer = setTimeout(() => write(() => store.update({ names:{ [s]: v } })), 500);
  } else localNames[s] = v;
}
function chooseSeat(s){ seat = s; ls.set("seat", s); location.hash = "ball"; }

/* ---------- rendering ---------- */
const view = document.getElementById("view");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function tab(){ const t = location.hash.slice(1); return ["who","ball","past"].includes(t) ? t : (seat ? "ball" : "who"); }

function render(){
  const t = tab();
  // don't clobber a name while it's being typed
  if (t === "who" && document.activeElement && document.activeElement.dataset && document.activeElement.dataset.name && view.querySelector(".sides")) return;
  document.querySelectorAll("#tabs a").forEach(a => { if (a.dataset.tab === t) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });

  // keep focus + caret if the user was typing
  const act = document.activeElement, actId = act && act.id, sel = act && act.selectionStart;
  view.innerHTML = t === "who" ? whoView() : t === "past" ? pastView() : ballView();
  if (actId) { const el = document.getElementById(actId); if (el) { el.focus(); try { el.setSelectionRange(sel, sel); } catch {} } }
  wire();
}

function whoView(){
  const side = s => `
    <section class="side ${seat === s ? "mine" : ""}">
      <div class="sigil" aria-hidden="true">${esc((nm(s)[0] || "?").toUpperCase())}</div>
      <input id="name-${s}" data-name="${s}" value="${esc(names()[s])}" maxlength="16" autocomplete="off" aria-label="Name for this side">
      <button class="btn ${seat === s ? "" : "ghost"}" data-seat="${s}">${seat === s ? "This is me" : "Be " + esc(nm(s))}</button>
    </section>`;
  return `<div class="wrap" style="padding:0">
    <h1>who are you?</h1>
    <div class="sides">${side("a")}${side("b")}</div>
  </div>`;
}

function handoff(them){
  return mode === "local" ? `<div class="row"><button class="btn ghost" data-act="switch">hand to ${esc(nm(them))}</button></div>` : "";
}
function header(){
  return `<div class="meta"><span>Round <b>${ROMAN[game.round] || "III"}</b> of III</span>
    <span class="who">You are <b>${esc(nm(seat))}</b> · <button class="link" data-act="switch">switch</button></span>
    <span><b>${game.score || 0}</b> ${game.score === 1 ? "point" : "points"}</span></div>`;
}

function ballView(){
  const notes = (readOnly ? `<p class="warn">You can watch, but your moves can't be saved. Ask the owner for Contributor access.</p>` : "")
              + (slow && !loaded ? `<p class="note">The ball is cloudy. Still trying to reach the other side.</p>` : "");
  if (!seat) return `<div class="wrap" style="padding:0"><div class="orb" aria-hidden="true"></div><h1>crystal ball</h1>
    <div class="row"><a class="btn" href="#who" style="text-decoration:none">Choose who you are</a></div></div>`;
  if (!loaded) return `<div class="wrap" style="padding:0"><div class="orb" aria-hidden="true"></div><h1>Gazing…</h1>${notes}</div>`;
  if (!game || game.round > 3) {
    const done = game && game.round > 3;
    return `<div class="wrap" style="padding:0"><div class="orb" aria-hidden="true"></div>
      <h1>${done ? `${game.score} of 3` : "crystal ball"}</h1>${notes}
      <div class="row"><button class="btn" data-act="begin" ${readOnly ? "disabled" : ""}>${done ? "begin again" : "begin"}</button>
      ${done ? `<a class="btn ghost" href="#past" style="text-decoration:none">see the past</a>` : ""}</div></div>`;
  }
  const me = seat, them = other(seat);
  let body = "";

  if (game.stage === "cards") {
    const mine = game.cards && game.cards[me], theirs = game.cards && game.cards[them];
    if (mine && theirs) {
      const key = "c" + game.gameNo + game.round, anim = lastReveal !== key ? "flip" : ""; lastReveal = key;
      body = `<h1>poof</h1>
        <div class="pair">
          <div class="slot"><div class="card static ${anim}">${esc(game.cards.a)}</div>${esc(nm("a"))}</div>
          <div class="slot"><div class="card static ${anim}" style="animation-delay:.15s">${esc(game.cards.b)}</div>${esc(nm("b"))}</div>
        </div>
        <div class="row"><button class="btn" data-act="bridge">pick a word.. any word..</button></div>`;
    } else if (mine) {
      body = `<h1>Waiting for ${esc(nm(them))}</h1>
        <div class="pair">
          <div class="slot"><div class="card static">${esc(mine)}</div>${esc(nm(me))}</div>
          <div class="slot"><div class="card static back" aria-label="${esc(nm(them))}'s card, hidden">✦</div>${esc(nm(them))}${theirs ? " · locked" : " · choosing"}</div>
        </div>${handoff(them)}`;
    } else {
      body = `<h1>choose... your fate...</h1>
        <div class="deck" role="group" aria-label="Your five cards">
          ${(game.decks && game.decks[me] || []).map(w => `<button class="card" data-card="${esc(w)}" aria-pressed="${pick === w}">${esc(w)}</button>`).join("")}
        </div>
        <p class="note">${theirs ? esc(nm(them)) + " has locked in" : esc(nm(them)) + " is choosing"}</p>
        <div class="row"><button class="btn" data-act="lock-card" ${pick && !readOnly ? "" : "disabled"}>Lock in</button></div>`;
    }
  } else {
    const mine = game.bridge && game.bridge[me], theirs = game.bridge && game.bridge[them];
    const pairLine = `<div class="small-pair"><span>${esc(game.cards.a)}</span><i aria-hidden="true">✦</i><span>${esc(game.cards.b)}</span></div>`;
    if (mine && theirs) {
      const key = "b" + game.gameNo + game.round, anim = lastReveal !== key ? "flip" : ""; lastReveal = key;
      body = `${pairLine}<h1>poof</h1>
        <div class="words">
          <div class="word ${anim}"><small>${esc(nm("a"))}</small><strong>${esc(game.bridge.a)}</strong></div>
          <div class="word ${anim}" style="animation-delay:.15s"><small>${esc(nm("b"))}</small><strong>${esc(game.bridge.b)}</strong></div>
        </div>
        <div class="row">
          <button class="btn right" data-verdict="right" ${readOnly ? "disabled" : ""}>Right</button>
          <button class="btn wrong" data-verdict="wrong" ${readOnly ? "disabled" : ""}>Wrong</button>
        </div>`;
    } else if (mine) {
      body = `${pairLine}<h1>Waiting for ${esc(nm(them))}</h1>
        <div class="words">
          <div class="word"><small>${esc(nm(me))}</small><strong>${esc(mine)}</strong></div>
          <div class="word"><small>${esc(nm(them))}</small><strong style="color:var(--orchid)">✦</strong></div>
        </div>${handoff(them)}`;
    } else {
      body = `${pairLine}
        <form class="field" id="bridge-form" autocomplete="off">
          <label for="bridge-input">${theirs ? esc(nm(them)) + " has locked in" : esc(nm(them)) + " is thinking"}</label>
          <input id="bridge-input" value="${esc(draft)}" maxlength="24" spellcheck="false">
          <button class="btn" type="submit" id="lock-word" ${draft.trim() && !readOnly ? "" : "disabled"}>Lock in</button>
        </form>`;
    }
  }
  return `<div class="wrap" style="padding:0">${header()}${notes}${body}</div>`;
}

function pastView(){
  if (!lineage.length) return `<div class="wrap" style="padding:0"><h1>see the past</h1>
    <div class="empty"><p class="note" style="margin:0">Nothing yet. Finish a round in the crystal ball.</p>
    <a class="btn ghost" href="#ball" style="text-decoration:none">go to the crystal ball</a></div></div>`;
  const byGame = {};
  lineage.forEach(r => (byGame[r.game] = byGame[r.game] || []).push(r));
  const games = Object.keys(byGame).map(Number).sort((a,b) => b - a);
  return `<div class="wrap" style="padding:0"><h1>see the past</h1><div class="games">
    ${games.map(g => {
      const rs = byGame[g].sort((a,b) => a.round - b.round);
      return `<section class="game"><h2>Reading ${g}</h2><ul class="rounds">
        ${rs.map(r => {
          const a = r.bridge.a, b = r.bridge.b;
          const final = a.toLowerCase() === b.toLowerCase() ? esc(a) : esc(a) + " / " + esc(b);
          return `<li><span class="rn">${ROMAN[r.round]}</span>
            <span class="chain"><span class="from">${esc(r.cards.a)} + ${esc(r.cards.b)} → </span><span class="to ${r.verdict}">${final}</span></span>
            <span class="tag ${r.verdict}">${r.verdict === "right" ? "Right" : "Wrong"}</span></li>`;
        }).join("")}
      </ul></section>`;
    }).join("")}
  </div></div>`;
}

function wire(){
  view.querySelectorAll("[data-seat]").forEach(b => b.onclick = () => chooseSeat(b.dataset.seat));
  view.querySelectorAll("[data-name]").forEach(i => i.oninput = () => {
    setName(i.dataset.name, i.value);
    const s = i.dataset.name, side = i.closest(".side");
    side.querySelector(".sigil").textContent = (nm(s)[0] || "?").toUpperCase();
    const btn = side.querySelector("[data-seat]"); if (seat !== s) btn.textContent = "Be " + nm(s);
  });
  view.querySelectorAll("[data-card]").forEach(b => b.onclick = () => { pick = b.dataset.card; render(); });
  view.querySelectorAll("[data-verdict]").forEach(b => b.onclick = () => verdict(b.dataset.verdict));
  const act = { "begin":begin, "lock-card":lockCard, "bridge":toBridge,
    "switch":() => { seat = other(seat); ls.set("seat", seat); pick = null; draft = ""; render(); } };
  view.querySelectorAll("[data-act]").forEach(b => b.onclick = () => act[b.dataset.act]());
  const inp = document.getElementById("bridge-input");
  if (inp) inp.oninput = () => { draft = inp.value; document.getElementById("lock-word").disabled = !draft.trim() || readOnly; };
  const form = document.getElementById("bridge-form");
  if (form) form.onsubmit = e => { e.preventDefault(); lockWord(); };
}

window.addEventListener("hashchange", render);
document.addEventListener("visibilitychange", () => document.body.classList.toggle("paused", document.hidden));

/* ---------- boot ---------- */
render();
const slowTimer = setTimeout(() => { slow = true; if (!loaded) { loaded = true; render(); } }, 10000);
if (!(window.claude && window.claude.use)) { mode = "local"; restore(); loaded = true; }

(async () => {
  const db = window.claude && window.claude.use ? await window.claude.use("db") : null;
  if (!db) clearTimeout(slowTimer);
  if (!db) { mode = "local"; restore(); clearTimeout(slowTimer); loaded = true; render(); return; }
  mode = "remote"; store.db = db;
  try {
    const user = await window.claude.use("user");
    if (user && user.can && (await user.can("data.write")) === false) readOnly = true;
  } catch {}
  db.doc("game/current").onSnapshot(snap => {
    game = snap.exists ? snap.data() : null;
    if (!snap.metadata.fromCache) { clearTimeout(slowTimer); slow = false; }
    loaded = true;
    if (game && game.stage === "cards" && pick && !(game.decks && seat && (game.decks[seat] || []).includes(pick))) pick = null;
    render();
  }, err => { console.error(err); clearTimeout(slowTimer); loaded = true; render(); });
  db.collection("lineage").onSnapshot(qs => {
    lineage = qs.docs.map(d => ({ id:d.id, ...d.data() }));
    render();
  }, err => console.error(err));
})();
})();
