/* spookee: game logic. Mounts inside #game; self-contained (see README.md).
   Three ways to run, picked automatically:
   - online:  Firebase is configured (firebase-config.js) -> lobbies with codes, two devices anywhere, global leaderboard
   - claude:  running as a claude.ai artifact -> two devices through the artifact store
   - local:   neither -> pass-and-play on one device, saved in this browser */
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
    <a href="#ranks" data-tab="ranks">leaderboard</a>
  </nav>
  <div id="view" aria-live="polite"></div>
</div>`;

const WORDS = (window.SPOOKEE_WORDS || []).slice();
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI"];
const other = s => s === "a" ? "b" : "a";
const FALLBACK = {a:"player one", b:"player two"};

const ls = {
  get(k){ try { return localStorage.getItem(k); } catch { return null; } },
  set(k,v){ try { localStorage.setItem(k,v); } catch {} },
  del(k){ try { localStorage.removeItem(k); } catch {} }
};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// two private hands of five, never overlapping, never repeating words already dealt
function deal(used){
  let seen = new Set((used || []).map(w => w.toLowerCase()));
  let pool = WORDS.filter(w => !seen.has(w));
  if (pool.length < 10) { seen = new Set(); pool = WORDS.slice(); }
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [pool[i],pool[j]] = [pool[j],pool[i]]; }
  const a = pool.slice(0,5), b = pool.slice(5,10);
  return { decks:{a,b}, used:[...seen, ...a, ...b].slice(-400) };
}
function deepMerge(t, p){
  const out = {...(t || {})};
  for (const k in p) out[k] = (p[k] && typeof p[k] === "object" && !Array.isArray(p[k]) && out[k] && typeof out[k] === "object") ? deepMerge(out[k], p[k]) : p[k];
  return out;
}

/* ---------- ranks: Deadlock's ladder shape (11 tiers x 6 subranks, plus unranked), crystal-ball names ---------- */
const TIERS = ["dabbler","leaf reader","candle keeper","palm reader","card reader","séance holder","medium","seer","wraith","star gazer","the crystal ball"];
const UNRANKED = "in the fog";
const MIN_READINGS = 5;
// rating: successes weighted by how fast you agreed (round i = 1, ii = .8, iii = .6), smoothed so a few lucky readings don't top the board
function statsOf(readings){
  const n = readings.length;
  let s = 0, f = 0, guesses = 0, w = 0, solvedRounds = 0;
  for (const r of readings) {
    guesses += (r.attempts || []).length;
    if (r.result === "right") { s++; const k = (r.attempts || []).length || 1; w += [1, .8, .6][k - 1] || .6; solvedRounds += k; }
    else f++;
  }
  return { readings:n, successes:s, fails:f, guesses, rate: n ? s / n : 0, avg: s ? solvedRounds / s : 0, score:(w + 1) / (n + 2) };
}
function rankOf(st){
  if (st.readings < MIN_READINGS) return { name:UNRANKED, tier:0, sub:0 };
  if (st.score >= 0.9 && st.readings >= 20) return { name:TIERS[10], tier:11, sub:Math.min(6, 1 + Math.floor((st.score - 0.9) / 0.0167)) };
  const step = Math.max(0, Math.min(59, Math.floor(st.score / 0.9 * 60)));
  return { name:TIERS[Math.floor(step / 6)], tier:Math.floor(step / 6) + 1, sub:step % 6 + 1 };
}
const rankLabel = r => r.tier ? `${r.name} ${ROMAN[r.sub]}` : r.name;

/* ---------- state ---------- */
let mode = "local";            // local | claude | online
let game = null;               // the shared room / game doc
let lineage = [];              // finished readings
let board = [];                // leaderboard rows (online)
let loaded = false, slow = false, readOnly = false;
let seat = null;
let pick = null, draft = "";
let lastReveal = "";
let localNames = {a:"", b:""};
let online = null, room = null, lobbyCode = null, uid = null;
let unsub = [];
let entry = { name: ls.get("spookee:name") || "", code: "", err: "", busy: false };
let cdb = null;                // claude artifact db

/* ---------- persistence for local mode ---------- */
const SAVE_KEY = "spookee:v2";
function persist(){ if (mode === "local") ls.set(SAVE_KEY, JSON.stringify({ game, lineage })); }
function restore(){
  try { const s = JSON.parse(ls.get(SAVE_KEY) || "null"); if (s) { game = s.game || null; lineage = s.lineage || []; } } catch {}
}

/* ---------- store: one interface over the three backends ---------- */
const store = {
  async set(doc){
    if (mode === "online") return room.set(doc);
    if (mode === "claude") return cdb.doc("game/current").set(doc);
    game = doc; persist(); render();
  },
  async update(patch){
    if (mode === "online") return room.merge(patch);
    if (mode === "claude") return cdb.doc("game/current").update(patch);
    game = deepMerge(game, patch); persist(); render();
  },
  async saveReading(id, rec){
    if (mode === "online") return room.saveReading(id, rec);
    if (mode === "claude") return cdb.collection("readings").doc(id).set(rec);
    lineage = lineage.filter(r => r.id !== id).concat([{...rec, id}]); persist(); render();
  },
  // apply fn(current) -> next (or null to do nothing). Online this is a real transaction, so two
  // players tapping the same button at once can't both advance the game.
  async transact(fn){
    if (mode === "online") return room.transact(fn);
    const next = fn(game);
    if (next) await this.set(next);
    return !!next;
  }
};
async function write(fn){
  try { return await fn(); }
  catch (e) {
    if (e && (e.code === "invalid_argument" || e.code === "permission-denied")) { readOnly = true; render(); }
    else if (e && e.code === "unavailable") { setTimeout(() => write(fn), 400 + Math.random()*600); }
    else console.error(e);
  }
}

function names(){ return (game && game.names) ? {...localNames, ...game.names} : localNames; }
function nm(s){ return (names()[s] || "").trim() || FALLBACK[s]; }
const isHere = s => mode === "local" || (game && game.presence && Date.now() - (game.presence[s] || 0) < 70000);

/* ---------- hidden picks ----------
   online: each pick is saved in rooms/{code}/secrets/{seat}_{reading}_{step}. The rules let the other
   player read it only once both have locked this step, so whoever locks second reveals both, any time later.
   claude.ai: picks stay on the picker's device and each side reveals its own. */
function stepId(st){ return `${game.reading}_${st === "cards" ? "c" : "b" + game.round}`; }
function secretKey(st){ return `spookee:secret:${lobbyCode || mode}:${seat}:${game.reading}:${st === "cards" ? 0 : game.round}:${st}`; }
const myPicks = {}; // step -> my locked pick, fetched from the server when this device doesn't have it
let revealing = "";
async function revealOnline(tries = 0){
  if (!game || !game.reading || !seat || readOnly) return;
  const st = game.stage, locks = (game.locks || {})[st] || {}, pub = game[st] || {};
  if (pub.a && pub.b) return;
  const step = stepId(st), key = lobbyCode + ":" + step;
  if (!(locks.a && locks.b) || revealing === key) return;
  revealing = key;
  try {
    const [va, vb] = await Promise.all(["a", "b"].map(s => pub[s] || online.getSecret(lobbyCode, s, step)));
    if (va && vb) await store.update({ [st]:{ a:va, b:vb } });
    else if (!(seat === "a" ? va : vb)) await store.update({ locks:{ [st]:{ [seat]:false } } }); // my pick never saved: choose again
    else if (tries < 6) { // the server may not have recorded my own lock yet, so the rules still hide theirs: ask again shortly
      revealing = ""; setTimeout(() => revealOnline(tries + 1), 800 * (tries + 1)); return;
    }
  } catch (e) { console.error(e); }
  finally { if (revealing === key) revealing = ""; }
}
async function loadMyPick(st){
  const step = stepId(st);
  if (step in myPicks) return;
  myPicks[step] = "";
  try { myPicks[step] = (await online.getSecret(lobbyCode, seat, step)) || ""; render(); } catch {}
}
function revealMine(){
  if (mode === "online") return revealOnline();
  if (mode === "local" || !game || !game.reading || !seat || readOnly) return;
  const st = game.stage, locks = (game.locks || {})[st] || {}, pub = game[st] || {};
  if (pub[seat]) return;
  const key = secretKey(st), sec = ls.get(key);
  if (locks[seat] && !sec) { write(() => store.update({ locks:{ [st]:{ [seat]:false } } })); return; } // pick lost on this device: choose again
  if (locks.a && locks.b && sec && revealing !== key) {
    revealing = key;
    write(() => store.update({ [st]:{ [seat]:sec } })).finally(() => { revealing = ""; });
  }
}

/* ---------- actions ---------- */
function freshGame(cur){
  const d = deal(cur && cur.used);
  return { ...(cur || {}), names:(cur && cur.names) || names(), reading:1, round:1, stage:"cards", decks:d.decks, used:d.used,
    cards:{}, bridge:{}, locks:{cards:{}, bridge:{}}, attempts:[], score:0 };
}
function begin(){ pick = null; draft = ""; write(() => store.transact(cur => (cur && cur.reading) ? null : freshGame(cur))); }
function lockCard(){
  if (!pick || !seat) return;
  if (mode === "local") return write(() => store.update({ cards:{ [seat]: pick } }));
  ls.set(secretKey("cards"), pick);
  if (mode === "online") { const p = pick, step = stepId("cards"); myPicks[step] = p;
    return write(async () => { await online.setSecret(lobbyCode, seat, step, p); await store.update({ locks:{ cards:{ [seat]: true } } }); revealOnline(); }); }
  write(() => store.update({ locks:{ cards:{ [seat]: true } } }));
}
function lockWord(){
  const w = draft.trim().toLowerCase();
  if (!w || !seat) return;
  if (mode === "local") return write(() => store.update({ bridge:{ [seat]: w } }));
  ls.set(secretKey("bridge"), w);
  if (mode === "online") { const step = stepId("bridge"); myPicks[step] = w;
    return write(async () => { await online.setSecret(lobbyCode, seat, step, w); await store.update({ locks:{ bridge:{ [seat]: true } } }); revealOnline(); }); }
  write(() => store.update({ locks:{ bridge:{ [seat]: true } } }));
}
function toBridge(){
  const r = game.reading;
  write(() => store.transact(cur => (cur && cur.reading === r && cur.stage === "cards" && cur.cards && cur.cards.a && cur.cards.b) ? { ...cur, stage:"bridge" } : null));
}
// A reading is one pair of chosen cards, with up to three rounds to agree on a word:
// right ends it (+1, new cards, round i), wrong tries again, wrong in round iii fails it.
function verdict(v){
  const g = game, r = g.reading, rd = g.round;
  pick = null; draft = "";
  let rec = null;
  write(async () => {
    const ok = await store.transact(cur => {
      if (!cur || cur.reading !== r || cur.round !== rd || cur.stage !== "bridge" || !cur.bridge || !cur.bridge.a || !cur.bridge.b) return null;
      const attempts = (cur.attempts || []).concat([{ round:rd, a:cur.bridge.a, b:cur.bridge.b, verdict:v }]);
      if (v === "right" || rd >= 3) {
        const result = v === "right" ? "right" : "wrong";
        rec = { reading:r, names:{...cur.names}, cards:{...cur.cards}, attempts, result, at:Date.now() };
        const d = deal(cur.used);
        const next = { ...cur, reading:r + 1, round:1, stage:"cards", decks:d.decks, used:d.used, cards:{}, bridge:{},
          locks:{cards:{}, bridge:{}}, attempts:[], score:(cur.score || 0) + (result === "right" ? 1 : 0) };
        if (result === "right") next.lastWin = { reading:r, word:cur.bridge.a, at:Date.now() };
        return next;
      }
      return { ...cur, round:rd + 1, stage:"bridge", bridge:{}, locks:{ ...(cur.locks || {}), bridge:{} }, attempts };
    });
    if (ok && rec) {
      await store.saveReading("r" + r, rec);
      if (mode === "online") {
        const all = lineage.filter(x => x.id !== "r" + r).concat([rec]);
        const st = statsOf(all);
        await online.saveBoard(lobbyCode, { names:{...game.names}, ...st, rank:rankOf(st).tier * 10 + rankOf(st).sub, updated:Date.now() });
      }
    }
  });
}
let nameTimer = null;
function setName(s, v){
  if (game) {
    game = deepMerge(game, { names:{ [s]: v } });
    clearTimeout(nameTimer);
    nameTimer = setTimeout(() => write(() => store.update({ names:{ [s]: v } })), 500);
  } else localNames[s] = v;
}
function chooseSeat(s){
  if (!(names()[s] || "").trim()) { const i = document.getElementById("name-" + s); if (i) i.focus(); return; }
  seat = s; ls.set("seat", s); location.hash = "ball";
}

/* ---------- "your move": in the tab title and on each lobby in "your lobbies" ---------- */
function moveFor(g, s){
  if (!g || !s) return "";
  if (!(g.seats ? g.seats.b : true)) return "waiting for someone to join";
  if (!g.reading) return "your move";
  const st = g.stage, L = (g.locks || {})[st] || {}, P = g[st] || {};
  if (P.a && P.b) return "your move";
  if (!(L[s] || P[s])) return "your move";
  return "waiting for " + (((g.names || {})[other(s)] || "").trim() || FALLBACK[other(s)]);
}
function setTitle(){
  const m = (mode !== "local" && game && seat) ? moveFor(game, seat) : "";
  document.title = m === "your move" ? "(your move) spookee" : "spookee";
}
const lobbyLive = {}; // code -> room doc, for the list on the entry screen
const lobbyWatch = {};
function watchLobbies(){
  if (mode !== "online") return;
  myLobbies().forEach(l => {
    if (lobbyWatch[l.code]) return;
    lobbyWatch[l.code] = online.room(l.code).onRoom(d => { lobbyLive[l.code] = d; if (tab() === "who" && !lobbyCode) render(); }, () => {});
  });
}

/* ---------- presence: a heartbeat while the tab is open ---------- */
function beat(){
  if (mode === "local" || !seat || readOnly || document.hidden || !game) return;
  write(() => store.update({ presence:{ [seat]: Date.now() } }));
}
setInterval(() => { beat(); if (mode !== "local") render(); }, 30000);

/* ---------- lobbies (online) ---------- */
function myLobbies(){ try { return JSON.parse(ls.get("spookee:lobbies") || "[]"); } catch { return []; } }
function rememberLobby(){
  if (!lobbyCode || !game) return;
  const list = myLobbies().filter(l => l.code !== lobbyCode);
  list.unshift({ code:lobbyCode, names:game.names || {}, score:game.score || 0, at:Date.now() });
  ls.set("spookee:lobbies", JSON.stringify(list.slice(0, 8)));
}
function forgetLobby(code){ ls.set("spookee:lobbies", JSON.stringify(myLobbies().filter(l => l.code !== code))); }
const shareLink = code => location.origin + location.pathname + "?lobby=" + encodeURIComponent(code);
function cleanCode(c){ return String(c || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""); }

function enterRoom(code){
  unsub.forEach(u => u && u()); unsub = [];
  lobbyCode = code; room = online.room(code); game = null; lineage = []; loaded = false; seat = null; readOnly = false;
  ls.set("spookee:lobby", code);
  try { history.replaceState(null, "", "?lobby=" + encodeURIComponent(code) + location.hash); } catch {}
  unsub.push(room.onRoom(d => {
    game = d; loaded = true;
    const seats = (d && d.seats) || {};
    seat = Object.keys(seats).find(k => seats[k] === uid) || null;
    readOnly = !seat;
    if (game && game.stage === "cards" && pick && !((game.decks || {})[seat] || []).includes(pick)) pick = null;
    rememberLobby(); revealMine(); render();
  }, e => { console.error(e); loaded = true; render(); }));
  unsub.push(room.onReadings(rs => { lineage = rs; render(); }, e => console.error(e)));
  render();
}
function leaveRoom(){
  unsub.forEach(u => u && u()); unsub = [];
  lobbyCode = null; room = null; game = null; lineage = []; seat = null; readOnly = false; loaded = true;
  ls.del("spookee:lobby");
  try { history.replaceState(null, "", location.pathname + "#who"); } catch {}
  render();
}
async function makeLobby(){
  const name = entry.name.trim().toLowerCase();
  if (!name) { entry.err = "type your name first"; return render(); }
  entry.busy = true; entry.err = ""; render();
  ls.set("spookee:name", name);
  try {
    for (let i = 0; i < 6; i++) {
      const code = WORDS[Math.floor(Math.random() * WORDS.length)].replace(/[^a-z]/g, "") + "-" + String(Math.floor(Math.random() * 90) + 10);
      const made = await online.createRoom(code, { seats:{ a:uid }, names:{ a:name, b:"" }, presence:{ a:Date.now() }, created:Date.now() });
      if (made) { entry.busy = false; location.hash = "who"; enterRoom(code); return; }
    }
    entry.err = "couldn't make a lobby. try again.";
  } catch (e) { console.error(e); entry.err = "couldn't reach the crystal ball. check your connection."; }
  entry.busy = false; render();
}
async function joinLobby(codeIn){
  const name = entry.name.trim().toLowerCase(), code = cleanCode(codeIn || entry.code);
  if (!name) { entry.err = "type your name first"; return render(); }
  if (!code) { entry.err = "type the lobby code"; return render(); }
  entry.busy = true; entry.err = ""; render();
  ls.set("spookee:name", name);
  try {
    const res = await online.joinRoom(code, uid, name);
    entry.busy = false;
    if (res === "missing") { entry.err = `no lobby called "${code}". check the code.`; forgetLobby(code); return render(); }
    location.hash = "ball"; enterRoom(code); // "full" still enters, to watch
  } catch (e) { console.error(e); entry.busy = false; entry.err = "couldn't reach the crystal ball. check your connection."; render(); }
}

/* ---------- rendering ---------- */
const view = document.getElementById("view");
function tab(){
  const t = location.hash.slice(1);
  if (["who","ball","past","ranks"].includes(t)) return t;
  return (mode === "online" ? (lobbyCode ? "ball" : "who") : (seat ? "ball" : "who"));
}

function render(){
  const t = tab();
  const ae = document.activeElement;
  if (t === "who" && mode !== "online" && ae && ae.dataset && ae.dataset.name && view.querySelector(".sides")) return; // don't clobber a name mid-typing
  document.querySelectorAll("#tabs a").forEach(a => { if (a.dataset.tab === t) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
  const actId = ae && ae.id, sel = ae && ae.selectionStart;
  view.innerHTML = t === "who" ? whoView() : t === "past" ? pastView() : t === "ranks" ? ranksView() : ballView();
  if (actId) { const el = document.getElementById(actId); if (el && el !== document.body) { el.focus(); try { el.setSelectionRange(sel, sel); } catch {} } }
  wire();
  maybeCelebrate();
  setTitle();
}

const page = inner => `<div class="wrap" style="padding:0">${inner}</div>`;
const dot = s => mode === "local" ? "" : `<span class="dot ${isHere(s) ? "on" : ""}" title="${isHere(s) ? "here" : "away"}" aria-label="${isHere(s) ? "here" : "away"}"></span>`;

function whoView(){
  if (mode !== "online") {
    const side = s => `
      <section class="side ${seat === s ? "mine" : ""}">
        <div class="sigil" aria-hidden="true">${esc((names()[s] || "").trim()[0] || "?")}</div>
        <input id="name-${s}" data-name="${s}" value="${esc(names()[s])}" maxlength="16" autocomplete="off" placeholder="your name" aria-label="name for ${FALLBACK[s]}">
        <button class="btn ${seat === s ? "" : "ghost"}" data-seat="${s}" ${(names()[s] || "").trim() ? "" : "disabled"}>${seat === s ? "this is me" : "i'm " + esc(nm(s))}</button>
      </section>`;
    return page(`<h1>who are you?</h1><div class="sides">${side("a")}${side("b")}</div>`);
  }
  if (!lobbyCode) {
    const mine = myLobbies(); watchLobbies();
    return page(`<h1>who are you?</h1>
      <form class="entry" id="entry-form" autocomplete="off">
        <label class="lbl" for="entry-name">your name</label>
        <input id="entry-name" class="big-in" value="${esc(entry.name)}" maxlength="16" spellcheck="false">
        <button class="btn" type="button" data-act="make" ${entry.busy ? "disabled" : ""}>make a lobby</button>
        <p class="or">or</p>
        <label class="lbl" for="entry-code">lobby code</label>
        <input id="entry-code" class="big-in" value="${esc(entry.code)}" maxlength="24" spellcheck="false" placeholder="moth-42">
        <button class="btn ghost" type="submit" ${entry.busy ? "disabled" : ""}>join</button>
        ${entry.err ? `<p class="warn" role="alert">${esc(entry.err)}</p>` : ""}
      </form>
      ${accountLine()}
      ${mine.length ? `<section class="lobbies"><h2>your lobbies</h2><ul>
        ${mine.map(l => {
          const d = lobbyLive[l.code], seats = (d && d.seats) || {}, me = seats.a === uid ? "a" : seats.b === uid ? "b" : null;
          const nmz = (d && d.names) || l.names || {}, mv = d && me ? moveFor(d, me) : "";
          return `<li><button class="lob" data-rejoin="${esc(l.code)}"><b>${esc(l.code)}</b><span>${esc(nmz.a || "?")} & ${esc(nmz.b || "?")}</span>
            <span class="${mv === "your move" ? "move" : ""}">${esc(mv || ((d ? d.score : l.score) || 0) + " pts")}</span></button></li>`;
        }).join("")}
      </ul></section>` : ""}`);
  }
  if (!loaded) return page(`<h1>who are you?</h1><p class="note">opening ${esc(lobbyCode)}…</p>`);
  const full = !seat;
  const row = s => {
    const has = game && game.seats && game.seats[s];
    return `<li class="${seat === s ? "me" : ""}">${dot(s)}<span>${has ? esc(nm(s)) : "waiting for someone to join…"}</span>${seat === s ? `<small>you</small>` : ""}</li>`;
  };
  return page(`<h1>who are you?</h1>
    <section class="lobby">
      <p class="lbl">lobby</p>
      <p class="code">${esc(lobbyCode)}</p>
      <div class="share">
        <input id="share-link" readonly value="${esc(shareLink(lobbyCode))}" aria-label="link to this lobby">
        <button class="btn ghost" data-act="copy">copy link</button>
      </div>
      <ul class="players">${row("a")}${row("b")}</ul>
      ${full ? `<p class="warn">this lobby is full. you can watch.</p>` : `
        <label class="lbl" for="my-name">your name</label>
        <input id="my-name" class="big-in" value="${esc(names()[seat])}" maxlength="16" spellcheck="false">`}
      <div class="row"><a class="btn" href="#ball" style="text-decoration:none">go to the crystal ball</a></div>
      ${accountLine()}
      <button class="link" data-act="leave">leave this lobby</button>
    </section>`);
}

let signErr = "";
function accountLine(){
  if (mode !== "online") return "";
  if (!online.anonymous()) return `<p class="note acct">signed in as ${esc(online.email() || "you")}. your seats follow you to any device.</p>`;
  return `<div class="acct"><button class="btn ghost" data-act="google">keep my seat on any device</button>
    ${signErr ? `<p class="warn" role="alert">${esc(signErr)}</p>` : `<p class="note">sign in with google so your phone and laptop are the same player.</p>`}</div>`;
}
async function google(){
  signErr = "";
  try { await online.signInGoogle(); location.reload(); }
  catch (e) {
    console.error(e);
    signErr = e && e.code === "auth/operation-not-allowed" ? "google sign-in isn't turned on for this game yet."
      : e && e.code === "auth/popup-blocked" ? "your browser blocked the sign-in window. allow pop-ups and try again."
      : e && e.code === "auth/popup-closed-by-user" ? "" : "couldn't sign in. try again.";
    render();
  }
}
function header(){
  const right = `<span><b>${game.score || 0}</b> ${game.score === 1 ? "point" : "points"}</span>`;
  const left = `<span>round <b>${ROMAN[game.round] || "III"}</b> of III${game.round === 3 ? " · final" : ""}</span>`;
  const who = mode === "local"
    ? `<span class="who">you are <b>${esc(nm(seat))}</b> · <button class="link" data-act="switch">switch</button></span>`
    : `<span class="who">${dot("a")}<b>${esc(nm("a"))}</b> & ${dot("b")}<b>${esc(nm("b"))}</b>${lobbyCode ? ` · ${esc(lobbyCode)}` : ""}</span>`;
  return `<div class="meta">${left}${who}${right}</div>`;
}
const handoff = them => mode === "local" ? `<div class="row"><button class="btn ghost" data-act="switch">hand to ${esc(nm(them))}</button></div>` : "";
const awayNote = them => mode === "local" ? "" : `<p class="note">${isHere(them) ? esc(nm(them)) + " is here now." : esc(nm(them)) + " will see it when they open the lobby."} you can close this. it'll be here when you come back.</p>`;

function ballView(){
  const notes = (readOnly && mode !== "online" ? `<p class="warn">you can watch, but your moves can't be saved. ask the owner for contributor access.</p>` : "")
              + (slow && !loaded ? `<p class="note">the ball is cloudy. still trying to reach the other side.</p>` : "");
  if (mode === "online" && !lobbyCode) return page(`<div class="orb" aria-hidden="true"></div><h1>crystal ball</h1>
    <div class="row"><a class="btn" href="#who" style="text-decoration:none">make or join a lobby</a></div>`);
  if (mode !== "online" && !seat) return page(`<div class="orb" aria-hidden="true"></div><h1>crystal ball</h1>
    <div class="row"><a class="btn" href="#who" style="text-decoration:none">choose who you are</a></div>`);
  if (!loaded) return page(`<div class="orb" aria-hidden="true"></div><h1>gazing…</h1>${notes}`);
  if (mode === "online" && game && !(game.seats && game.seats.b)) return page(`<div class="orb" aria-hidden="true"></div>
    <h1>waiting for someone to join…</h1>
    <p class="note">send them the code <b>${esc(lobbyCode)}</b> or the link.</p>
    <div class="row"><button class="btn ghost" data-act="copy">copy link</button></div>`);
  if (!game || !game.reading) return page(`<div class="orb" aria-hidden="true"></div><h1>crystal ball</h1>${notes}
    <div class="row"><button class="btn" data-act="begin" ${readOnly ? "disabled" : ""}>begin</button></div>`);
  if (!seat) { // watcher
    return page(`${header()}<p class="warn">this lobby is full. you're watching.</p>
      <div class="small-pair"><span>${esc((game.cards || {}).a || "✦")}</span><i aria-hidden="true">✦</i><span>${esc((game.cards || {}).b || "✦")}</span></div>`);
  }

  const me = seat, them = other(seat);
  const st = game.stage, locks = (game.locks || {})[st] || {}, pub = game[st] || {};
  const mineIn = !!(pub[me] || locks[me]), theirsIn = !!(pub[them] || locks[them]);
  let myWord = pub[me] || (mode === "local" ? "" : ls.get(secretKey(st))) || (mode === "online" ? myPicks[stepId(st)] : "") || "";
  if (!myWord && mode === "online" && mineIn) loadMyPick(st);
  const bothOut = pub.a && pub.b;
  let body = "";

  if (st === "cards") {
    if (bothOut) {
      const key = "c" + game.reading, anim = lastReveal !== key ? "flip" : ""; lastReveal = key;
      body = `<h1>poof</h1>
        <div class="pair">
          <div class="slot"><div class="card static ${anim}">${esc(pub.a)}</div>${esc(nm("a"))}</div>
          <div class="slot"><div class="card static ${anim}" style="animation-delay:.15s">${esc(pub.b)}</div>${esc(nm("b"))}</div>
        </div>
        <div class="row"><button class="btn" data-act="bridge">pick a word.. any word..</button></div>`;
    } else if (mineIn) {
      body = `<h1>${theirsIn ? "poof is coming…" : "waiting for " + esc(nm(them))}</h1>
        <div class="pair">
          <div class="slot"><div class="card static">${esc(myWord)}</div>${esc(nm(me))}</div>
          <div class="slot"><div class="card static back" aria-label="${esc(nm(them))}'s card, hidden">✦</div>${esc(nm(them))}${theirsIn ? " · locked" : " · choosing"}</div>
        </div>${handoff(them)}${awayNote(them)}`;
    } else {
      body = `<h1>choose... your fate...</h1>
        <div class="deck" role="group" aria-label="your five cards">
          ${((game.decks || {})[me] || []).map(w => `<button class="card" data-card="${esc(w)}" aria-pressed="${pick === w}">${esc(w)}</button>`).join("")}
        </div>
        <p class="note">${theirsIn ? esc(nm(them)) + " has locked in" : esc(nm(them)) + " is choosing"}</p>
        <div class="row"><button class="btn" data-act="lock-card" ${pick && !readOnly ? "" : "disabled"}>lock in</button></div>`;
    }
  } else {
    const cards = game.cards || {};
    const tries = (game.attempts || []).map(t => `<li><span class="rn">${ROMAN[t.round]}</span><span>${esc(t.a)} / ${esc(t.b)}</span></li>`).join("");
    const pairLine = `<div class="small-pair"><span>${esc(cards.a)}</span><i aria-hidden="true">✦</i><span>${esc(cards.b)}</span></div>`
      + (tries ? `<ul class="tries" aria-label="earlier tries">${tries}</ul>` : "");
    if (bothOut) {
      const key = "b" + game.reading + "-" + game.round, anim = lastReveal !== key ? "flip" : ""; lastReveal = key;
      body = `${pairLine}<h1>poof</h1>
        <div class="words">
          <div class="word ${anim}"><small>${esc(nm("a"))}</small><strong>${esc(pub.a)}</strong></div>
          <div class="word ${anim}" style="animation-delay:.15s"><small>${esc(nm("b"))}</small><strong>${esc(pub.b)}</strong></div>
        </div>
        <div class="row">
          <button class="btn right" data-verdict="right" ${readOnly ? "disabled" : ""}>right</button>
          <button class="btn wrong" data-verdict="wrong" ${readOnly ? "disabled" : ""}>wrong</button>
        </div>`;
    } else if (mineIn) {
      body = `${pairLine}<h1>${theirsIn ? "poof is coming…" : "waiting for " + esc(nm(them))}</h1>
        <div class="words">
          <div class="word"><small>${esc(nm(me))}</small><strong>${esc(myWord)}</strong></div>
          <div class="word"><small>${esc(nm(them))}</small><strong style="color:var(--orchid)">✦</strong></div>
        </div>${handoff(them)}${awayNote(them)}`;
    } else {
      body = `${pairLine}
        <form class="field" id="bridge-form" autocomplete="off">
          <label for="bridge-input">${theirsIn ? esc(nm(them)) + " has locked in" : esc(nm(them)) + " is thinking"}</label>
          <input id="bridge-input" value="${esc(draft)}" maxlength="24" spellcheck="false">
          <button class="btn" type="submit" id="lock-word" ${draft.trim() && !readOnly ? "" : "disabled"}>lock in</button>
        </form>`;
    }
  }
  return page(`${header()}${notes}${body}`);
}

function pastView(){
  const list = lineage.filter(r => r.attempts).sort((a,b) => b.reading - a.reading);
  const nmOf = (r, s) => ((r.names && r.names[s]) || "").trim() || FALLBACK[s];
  const st = statsOf(list), rk = rankOf(st);
  const summary = (game && list.length) ? `<p class="summary">${lobbyCode ? esc(lobbyCode) + " · " : ""}${esc(nm("a"))} & ${esc(nm("b"))} · ${st.successes} of ${st.readings} · ${esc(rankLabel(rk))}</p>` : "";
  if (!list.length) return page(`<h1>see the past</h1>
    <div class="empty"><p class="note" style="margin:0">nothing yet. finish a reading in the crystal ball.</p>
    <a class="btn ghost" href="#ball" style="text-decoration:none">go to the crystal ball</a></div>`);
  return page(`<h1>see the past</h1>${summary}<div class="games">
    ${list.map(r => {
      const last = r.attempts[r.attempts.length - 1];
      const final = last.a.toLowerCase() === last.b.toLowerCase() ? esc(last.a) : esc(last.a) + " / " + esc(last.b);
      return `<section class="game">
        <h2>${esc(nmOf(r,"a"))}: ${esc(r.cards.a)} <i aria-hidden="true">✦</i> ${esc(nmOf(r,"b"))}: ${esc(r.cards.b)}</h2>
        <ul class="rounds">
          ${r.attempts.map(t => `<li><span class="rn">${ROMAN[t.round]}</span>
            <span class="chain">${esc(nmOf(r,"a"))}: <b>${esc(t.a)}</b> · ${esc(nmOf(r,"b"))}: <b>${esc(t.b)}</b></span>
            <span class="tag ${t.verdict}">${t.verdict}</span></li>`).join("")}
          <li class="final"><span class="rn">✦</span><span class="chain"><span class="to ${r.result}">${final}</span></span>
            <span class="tag ${r.result}">${r.result === "right" ? "success" : "fail"}</span></li>
        </ul></section>`;
    }).join("")}
  </div>`);
}

function ranksView(){
  let rows;
  if (mode === "online") {
    rows = board.map(b => ({ ...b, mine:b.id === lobbyCode, rk:rankOf(b) }));
    if (lobbyCode && game && !rows.some(r => r.mine) && lineage.length) { const s = statsOf(lineage); rows.push({ id:lobbyCode, names:game.names, ...s, mine:true, rk:rankOf(s) }); }
  } else {
    const s = statsOf(lineage);
    rows = lineage.length ? [{ id:"here", names:names(), ...s, mine:true, rk:rankOf(s) }] : [];
  }
  rows.sort((x, y) => (y.rk.tier * 10 + y.rk.sub) - (x.rk.tier * 10 + x.rk.sub) || y.score - x.score || y.readings - x.readings);
  const ladder = `<details class="ladder"><summary>the ranks</summary><ol>
      ${TIERS.slice().reverse().map(t => `<li>${t} <span>I–VI</span></li>`).join("")}
      <li>${UNRANKED} <span>under ${MIN_READINGS} readings</span></li></ol>
      <p class="note">ranked by success rate, with quicker agreement worth more. the crystal ball needs 20+ readings.</p></details>`;
  if (!rows.length) return page(`<h1>leaderboard</h1>
    <div class="empty"><p class="note" style="margin:0">${mode === "online" ? "no pairs yet. finish a reading to appear." : "finish a reading to see your rank."}</p></div>${ladder}`);
  return page(`<h1>leaderboard</h1>
    <div class="board-wrap"><table class="board">
      <thead><tr><th scope="col">#</th><th scope="col">pair</th><th scope="col">rank</th><th scope="col" class="num">success</th><th scope="col" class="num">won</th><th scope="col" class="num">failed</th><th scope="col" class="num">guesses</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr class="${r.mine ? "mine" : ""}">
        <td class="num">${i + 1}</td>
        <td class="pair-cell">${esc(((r.names || {}).a || "?"))} & ${esc(((r.names || {}).b || "?"))}${r.mine ? ` <small>you</small>` : ""}</td>
        <td class="rank t${r.rk.tier}">${esc(rankLabel(r.rk))}</td>
        <td class="num"><b>${Math.round(r.rate * 100)}%</b></td>
        <td class="num">${r.successes}</td>
        <td class="num">${r.fails}</td>
        <td class="num">${r.guesses}</td></tr>`).join("")}</tbody>
    </table></div>${ladder}`);
}

function wire(){
  view.querySelectorAll("[data-seat]").forEach(b => b.onclick = () => chooseSeat(b.dataset.seat));
  view.querySelectorAll("[data-name]").forEach(i => i.oninput = () => {
    setName(i.dataset.name, i.value);
    const s = i.dataset.name, side = i.closest(".side"), has = !!i.value.trim();
    side.querySelector(".sigil").textContent = has ? i.value.trim()[0] : "?";
    const btn = side.querySelector("[data-seat]"); btn.disabled = !has; if (seat !== s) btn.textContent = "i'm " + nm(s);
  });
  view.querySelectorAll("[data-card]").forEach(b => b.onclick = () => { pick = b.dataset.card; render(); });
  view.querySelectorAll("[data-verdict]").forEach(b => b.onclick = () => verdict(b.dataset.verdict));
  view.querySelectorAll("[data-rejoin]").forEach(b => b.onclick = () => joinLobby(b.dataset.rejoin));
  const act = {
    begin, "lock-card":lockCard, bridge:toBridge, make:makeLobby, leave:leaveRoom, google,
    switch:() => { seat = other(seat); ls.set("seat", seat); pick = null; draft = ""; render(); },
    copy:() => {
      const link = shareLink(lobbyCode), btns = view.querySelectorAll('[data-act="copy"]');
      const done = ok => btns.forEach(b => b.textContent = ok ? "copied" : "select the link to copy");
      try { navigator.clipboard.writeText(link).then(() => done(true), () => { const i = document.getElementById("share-link"); if (i) i.select(); done(false); }); }
      catch { done(false); }
    }
  };
  view.querySelectorAll("[data-act]").forEach(b => b.onclick = () => act[b.dataset.act] && act[b.dataset.act]());
  const inp = document.getElementById("bridge-input");
  if (inp) inp.oninput = () => { draft = inp.value; document.getElementById("lock-word").disabled = !draft.trim() || readOnly; };
  const form = document.getElementById("bridge-form");
  if (form) form.onsubmit = e => { e.preventDefault(); lockWord(); };
  const en = document.getElementById("entry-name"); if (en) en.oninput = () => { entry.name = en.value; };
  const ec = document.getElementById("entry-code"); if (ec) ec.oninput = () => { entry.code = ec.value; };
  const ef = document.getElementById("entry-form"); if (ef) ef.onsubmit = e => { e.preventDefault(); joinLobby(); };
  const mn = document.getElementById("my-name"); if (mn) mn.oninput = () => setName(seat, mn.value.toLowerCase());
  const sl = document.getElementById("share-link"); if (sl) sl.onfocus = () => sl.select();
}

/* ---------- the win moment: both players see it ---------- */
const celebrated = new Set();
let winTimer = null;
function closeWin(){
  const el = document.getElementById("win");
  if (!el) return;
  clearTimeout(winTimer);
  el.classList.add("out");
  setTimeout(() => el.remove(), 350);
}
function maybeCelebrate(){
  const w = game && game.lastWin;
  if (!w || celebrated.has(w.at) || ls.get("spookee:won") === String(w.at)) return;
  celebrated.add(w.at); ls.set("spookee:won", String(w.at));
  if (Date.now() - (w.at || 0) > 20000) return; // an old win, don't replay it on load
  const sparks = Array.from({length:14}, (_, i) =>
    `<i style="--a:${i * (360/14)}deg;--d:${110 + (i % 3) * 40}px;--t:${(i % 4) * 60}ms">✦</i>`).join("");
  const el = document.createElement("div");
  el.id = "win";
  el.setAttribute("role", "status");
  el.innerHTML = `<div class="win-card">
      <div class="sparks" aria-hidden="true">${sparks}</div>
      <p class="win-word">${esc(w.word)}</p>
      <p class="win-line"><span>spookee,</span> <span>you guys said the same thing!</span></p>
    </div>`;
  el.onclick = closeWin;
  document.body.appendChild(el);
  winTimer = setTimeout(closeWin, 4200);
}
document.addEventListener("keydown", e => { if (e.key === "Escape") closeWin(); });

window.addEventListener("hashchange", render);
document.addEventListener("visibilitychange", () => { document.body.classList.toggle("paused", document.hidden); if (!document.hidden) beat(); });

/* ---------- boot ---------- */
seat = ls.get("seat"); if (seat !== "a" && seat !== "b") seat = null;
render();
const slowTimer = setTimeout(() => { slow = true; if (!loaded) { loaded = true; render(); } }, 10000);

(async () => {
  // 1. online (Firebase) when configured
  if (window.SpookeeOnline) {
    online = await window.SpookeeOnline;
    if (online) {
      mode = "online"; uid = online.uid; seat = null; clearTimeout(slowTimer); loaded = true;
      online.onBoard(rows => { board = rows; if (tab() === "ranks") render(); }, e => console.error(e));
      const fromUrl = cleanCode(new URLSearchParams(location.search).get("lobby"));
      const last = fromUrl || ls.get("spookee:lobby");
      if (fromUrl && entry.name) { await joinLobby(fromUrl); }
      else if (fromUrl) { entry.code = fromUrl; location.hash = "who"; render(); }
      else if (last) enterRoom(last);
      else render();
      return;
    }
  }
  // 2. claude.ai artifact store
  const db = window.claude && window.claude.use ? await window.claude.use("db") : null;
  if (!db) { mode = "local"; restore(); clearTimeout(slowTimer); loaded = true; render(); return; }
  mode = "claude"; cdb = db;
  try {
    const user = await window.claude.use("user");
    if (user && user.can && (await user.can("data.write")) === false) readOnly = true;
  } catch {}
  db.doc("game/current").onSnapshot(snap => {
    game = snap.exists ? snap.data() : null;
    if (!snap.metadata.fromCache) { clearTimeout(slowTimer); slow = false; }
    loaded = true;
    if (game && game.stage === "cards" && pick && !((game.decks || {})[seat] || []).includes(pick)) pick = null;
    revealMine(); render();
  }, err => { console.error(err); clearTimeout(slowTimer); loaded = true; render(); });
  db.collection("readings").onSnapshot(qs => { lineage = qs.docs.map(d => ({ id:d.id, ...d.data() })); render(); }, err => console.error(err));
})();

// exposed for tests only
window.__spookee = { statsOf, rankOf, TIERS };
})();
