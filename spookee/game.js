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
  <div class="topline"><p class="mark">spookee</p><button class="help-btn" id="help-btn" aria-haspopup="dialog">what do i do?</button></div>
  <nav id="tabs" aria-label="spookee">
    <a href="#who" data-tab="who"><span>see yourself</span></a>
    <a href="#ball" data-tab="ball"><span>see the orb</span></a>
    <a href="#past" data-tab="past"><span>see the past</span></a>
    <a href="#ranks" data-tab="ranks"><span>see the others</span></a>
    <a href="#lex" data-tab="lex"><span>see the ecology of lexicon</span></a>
  </nav>
  <div id="view" aria-live="polite"></div>
</div>
<dialog class="help" id="help" aria-labelledby="help-title">
  <p class="help-title" id="help-title">what do i do?</p>
  <ol>
    <li><span>you each pick a card. nobody sees the other's.</span></li>
    <li><span>both cards show at once.</span></li>
    <li><span>you each type one word that connects them.</span></li>
    <li><span>the same word, or close enough? <b class="r">spookee</b>.</span></li>
    <li><span>not the same? your two words become a new row. the next word has to fit every row, the bottom one most.</span></li>
    <li><span>three tries per pair of cards.</span></li>
  </ol>
  <form method="dialog"><button class="btn">got it</button></form>
</dialog>`;
(() => {
  const dlg = document.getElementById("help"), btn = document.getElementById("help-btn");
  btn.onclick = () => { try { dlg.showModal(); } catch { dlg.setAttribute("open", ""); } };
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => btn.focus());
})();

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
// readings needed before a tier opens. Up to seer it climbs gently; past seer each tier needs far more.
const TIER_MIN = [5, 6, 8, 10, 13, 16, 20, 26, 80, 180, 400];
function rankOf(st){
  const n = st.readings || 0;
  if (n < MIN_READINGS) return { name:UNRANKED, tier:0, sub:0, need:MIN_READINGS - n };
  // what the score alone would earn
  let tier, sub;
  if (st.score >= 0.9) { tier = 11; sub = Math.min(6, 1 + Math.floor((st.score - 0.9) / 0.0167)); }
  else { const step = Math.max(0, Math.min(59, Math.floor(st.score / 0.9 * 60))); tier = Math.floor(step / 6) + 1; sub = step % 6 + 1; }
  // what the number of readings allows
  let cap = 1; while (cap < 11 && n >= TIER_MIN[cap]) cap++;
  if (tier > cap) {
    tier = cap;
    sub = cap < 11 ? Math.min(6, 1 + Math.floor(6 * (n - TIER_MIN[cap - 1]) / (TIER_MIN[cap] - TIER_MIN[cap - 1]))) : sub;
    return { name:TIERS[tier - 1], tier, sub, need: cap < 11 ? TIER_MIN[cap] - n : 0 };
  }
  return { name:TIERS[tier - 1], tier, sub, need:0 };
}
const rankLabel = r => r.tier ? `${r.name} ${ROMAN[r.sub]}` : r.name;
const ICONS = window.SPOOKEE_ICONS || [];
function rankIcon(r, cls){
  const ic = ICONS[(r && r.tier) || 0];
  return ic ? `<svg class="rk t${(r && r.tier) || 0}${cls ? " " + cls : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${esc(ic.name)}">${ic.svg}</svg>` : "";
}
// something to say about each rank, lowest to highest
const RANK_LINES = [
  "you are obscured.",
  "dipping a toe in the unknown. the water's warm.",
  "the tea leaves spell out \"nice\". probably.",
  "you keep the flame. don't let it go out.",
  "your palms say a really good boba is in your near future.",
  "you drew the card that says you're on a roll.",
  "the spirits rsvp'd. you're hosting now.",
  "not small, not large. perfectly attuned.",
  "you see things in a unique way.",
  "half here, half beyond. the veil thins for you.",
  "the stars gaze back at you.",
  "you are the pinnacle, the one with all in vision.",
];

/* ---------- the checker: same word, a near spelling, or a word that means the same ---------- */
function norm(w){
  return String(w || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "").replace(/^(the|a|an) /, "").replace(/\s+/g, " ").trim();
}
function stem(w){
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 4 && w.endsWith("ed")) return w.slice(0, -2);
  if (w.length > 4 && /(sh|ch|x|ss)es$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}
function lev(a, b){
  const m = a.length, n = b.length, row = Array.from({length:n + 1}, (_, j) => j);
  for (let i = 1; i <= m; i++) { let prev = row[0]; row[0] = i;
    for (let j = 1; j <= n; j++) { const t = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = t; } }
  return row[n];
}
// words that mean about the same, from Datamuse (free, no key). If it can't be reached, only spelling counts.
const related = {};
function relatedTo(w){
  if (related[w]) return related[w];
  related[w] = (async () => {
    try {
      const ctl = new AbortController(); setTimeout(() => ctl.abort(), 3500);
      const q = encodeURIComponent(w);
      const lists = await Promise.all([`ml=${q}&max=150`, `rel_syn=${q}&max=100`].map(p =>
        fetch("https://api.datamuse.com/words?" + p, { signal:ctl.signal }).then(r => r.json()).catch(() => [])));
      return new Set(lists.flat().map(x => stem(norm(x.word))));
    } catch { return new Set(); }
  })();
  return related[w];
}
async function judge(a, b){
  const A = norm(a), B = norm(b);
  if (!A || !B) return { v:"wrong", how:"different" };
  const sa = stem(A), sb = stem(B), short = Math.min(A.length, B.length), dist = lev(A, B);
  if (A === B || sa === sb || (short >= 4 && dist <= 1) || (short >= 8 && dist <= 2)) return { v:"right", how:"same" };
  const [ra, rb] = await Promise.all([relatedTo(A), relatedTo(B)]);
  if (ra.has(sb) || rb.has(sa)) return { v:"right", how:"close" };
  return { v:"wrong", how:"different" };
}
// Datamuse lookups for "brilliant", cached for the session
const dmCache = {};
async function dm(params){
  try {
    const ctl = new AbortController(); setTimeout(() => ctl.abort(), 3500);
    return await fetch("https://api.datamuse.com/words?" + params, { signal:ctl.signal }).then(r => r.json());
  } catch { return []; }
}
const cached = (k, f) => dmCache[k] || (dmCache[k] = f());
const mlRaw = w => cached("m" + w, () => dm(`ml=${encodeURIComponent(w)}&max=500`));
// single words linked to w: meaning-alike first, then statistically linked
const assoc = w => cached("a" + w, async () => {
  const [ml, trg] = await Promise.all([mlRaw(w), dm(`rel_trg=${encodeURIComponent(w)}&max=150`)]);
  const out = [];
  for (const x of ml.concat(trg)) if (!/\s/.test(x.word)) { const k = stem(norm(x.word)); if (!out.includes(k)) out.push(k); }
  return out;
});
const trgSet = w => cached("t" + w, async () => new Set((await dm(`rel_trg=${encodeURIComponent(w)}&max=150`)).map(x => stem(norm(x.word)))));
const synSet = w => cached("s" + w, async () => new Set((await dm(`rel_syn=${encodeURIComponent(w)}&max=100`)).map(x => stem(norm(x.word)))));
// dictionary phrases and sayings (multi-word entries) Datamuse knows around w
const phrasesOf = w => cached("p" + w, async () => (await mlRaw(w)).map(x => norm(x.word)).filter(p => /\s/.test(p)));
// the phrases around one side: its own and those of its 30 closest words
const NEAR = 30;
const sidePhrases = x => cached("sp" + x, async () => {
  const near = (await assoc(x)).slice(0, NEAR);
  const lists = await Promise.all([x, ...near].map(phrasesOf));
  return { near:new Set([stem(x), ...near]), list:[...new Set(lists.flat())] };
});
// slangy or generic neighbours that make for false links ("club good")
const GENERIC = new Set("good bad cool fun sweet nice great big small little boy girl man kid riot force rage surprise ramp swell cutie kingpin goody hot old new high low best fine grand top real".split(" "));
const toks = p => p.split(" ").map(stem);
// A word is brilliant when it lives inside a real saying or name on BOTH sides, and is not an obvious answer:
//   storm + water -> bottle  ("lightning in a bottle" / "water bottle")
//   storm + water -> glass   ("storm in a glass of water" / "water glass")
// Rejected as obvious: anything in either side's top 30 associations, synonyms, or words that usually appear
// alongside either one (rain, wind, ocean, forest, toadstool...).
async function brilliance(w, A, B){
  const W = norm(w), a = norm(A), b = norm(B), sw = stem(W);
  if (W.length < 3 || !a || !b || sw === stem(a) || sw === stem(b)) return null;
  const [la, lb, ta, tb, ya, yb, spA, spB, own] = await Promise.all([assoc(a), assoc(b), trgSet(a), trgSet(b), synSet(a), synSet(b), sidePhrases(a), sidePhrases(b), phrasesOf(W)]);
  if (!la.length || !lb.length) return null;
  const ra = la.indexOf(sw), rb = lb.indexOf(sw);
  if ((ra >= 0 && ra < 30) || (rb >= 0 && rb < 30) || ya.has(sw) || yb.has(sw) || ta.has(sw) || tb.has(sw)) return null;
  const find = sp => sp.list.concat(own).find(p => { const t = toks(p); return t.includes(sw) && t.some(x => x !== sw && !GENERIC.has(x) && sp.near.has(x)); }) || "";
  const pa = find(spA), pb = find(spB);
  if (!pa || !pb || pa === pb) return null;
  return { phrase: pa + " · " + pb };
}
const verdicts = {};      // reading-round -> {v, how} once checked
let judging = "";
function autoJudge(){
  if (!game || game.stage !== "bridge" || !seat || readOnly) return;
  const pub = game.bridge || {};
  if (!(pub.a && pub.b)) return;
  const key = game.reading + "-" + game.round;
  if (judging === key) return;
  judging = key;
  const t0 = Date.now(), r = game.reading, rd = game.round;
  const above = rd === 1 ? [(game.cards || {}).a, (game.cards || {}).b] : (() => { const t = (game.attempts || [])[rd - 2] || {}; return [t.a, t.b]; })();
  // kept rare: at most one brilliant word in any five readings of a lobby
  const recent = lineage.filter(x => x.reading >= r - 4).some(x => (x.attempts || []).some(t => t.brill));
  Promise.all([judge(pub.a, pub.b),
    recent ? null : brilliance(pub.a, above[0], above[1]), recent ? null : brilliance(pub.b, above[0], above[1])]).then(([res, ba, bb]) => {
    const bs = ba ? "a" : bb ? "b" : "";
    if (bs) res = { ...res, brill:bs, phrase:(ba || bb).phrase };
    verdicts[key] = res; render();
    if (bs && window.spookeeBloom) window.spookeeBloom.surge();
    else if (res.v === "wrong" && window.spookeeBloom) window.spookeeBloom.wither("miss");
    // let both words sit on screen a moment before moving on (longer for a brilliant one)
    setTimeout(() => { if (game && game.reading === r && game.round === rd && game.stage === "bridge") verdict(res.v, res.how, bs, res.phrase); },
      Math.max(900, (bs ? 4600 : 2400) - (Date.now() - t0)));
  });
}

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
// no "begin" button: whoever is seated first deals the cards
let beginning = false;
function autoBegin(){
  if (beginning || !loaded || !seat || readOnly || (game && game.reading)) return;
  if (mode === "online" && !game) return;
  beginning = true; begin(); setTimeout(() => { beginning = false; }, 3000);
}
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
function verdict(v, how, brill, phrase){
  const g = game, r = g.reading, rd = g.round;
  pick = null; draft = "";
  let rec = null;
  write(async () => {
    const ok = await store.transact(cur => {
      if (!cur || cur.reading !== r || cur.round !== rd || cur.stage !== "bridge" || !cur.bridge || !cur.bridge.a || !cur.bridge.b) return null;
      const attempts = (cur.attempts || []).concat([{ round:rd, a:cur.bridge.a, b:cur.bridge.b, verdict:v, how:how || "", ...(brill ? { brill, phrase:phrase || "" } : {}) }]);
      if (v === "right" || rd >= 3) {
        const result = v === "right" ? "right" : "wrong";
        rec = { reading:r, names:{...cur.names}, cards:{...cur.cards}, attempts, result, at:Date.now() };
        const d = deal(cur.used);
        const next = { ...cur, reading:r + 1, round:1, stage:"cards", decks:d.decks, used:d.used, cards:{}, bridge:{},
          locks:{cards:{}, bridge:{}}, attempts:[], score:(cur.score || 0) + (result === "right" ? 1 : 0) };
        if (result === "right") next.lastWin = { reading:r, word: norm(cur.bridge.a) === norm(cur.bridge.b) ? cur.bridge.a : cur.bridge.a + " ≈ " + cur.bridge.b, at:Date.now() };
        else next.lastFail = { reading:r, a:cur.bridge.a, b:cur.bridge.b, at:Date.now() };
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
function lobbyRows(){
  return myLobbies().map(l => {
    const d = l.code === lobbyCode && game ? game : lobbyLive[l.code];
    const seats = (d && d.seats) || {}, me = seats.a === uid ? "a" : seats.b === uid ? "b" : null;
    return { ...l, d, me, mv: d && me ? moveFor(d, me) : "", names:(d && d.names) || l.names || {}, score:(d ? d.score : l.score) || 0 };
  });
}
function updateBadge(){
  const a = document.querySelector('#tabs a[data-tab="who"]');
  if (!a) return;
  const n = mode === "online" ? lobbyRows().filter(r => r.mv === "your move").length : 0;
  let b = a.querySelector(".badge");
  if (!n) { if (b) b.remove(); return; }
  if (!b) { b = document.createElement("b"); b.className = "badge"; a.appendChild(b); }
  b.textContent = n; b.setAttribute("aria-label", n + (n === 1 ? " lobby needs you" : " lobbies need you"));
}
// your best rank across every lobby you play in
const boardRows = {};
function fetchMyBoards(){
  if (mode !== "online" || !online.getBoard) return;
  myLobbies().forEach(l => {
    if (l.code in boardRows) return;
    boardRows[l.code] = null;
    online.getBoard(l.code).then(r => { boardRows[l.code] = r; if (tab() === "who") render(); }).catch(() => {});
  });
}
function bestRank(){
  const cands = [];
  if (mode === "online") {
    fetchMyBoards();
    myLobbies().forEach(l => {
      const row = boardRows[l.code] || board.find(b => b.id === l.code);
      if (row) { const d = lobbyLive[l.code], seats = (d && d.seats) || {}, me = seats.a === uid ? "a" : seats.b === uid ? "b" : null;
        cands.push({ rk:rankOf(row), names:row.names || {}, me, code:l.code }); }
    });
    if (lobbyCode && lineage.length) cands.push({ rk:rankOf(statsOf(lineage)), names:(game && game.names) || {}, me:seat, code:lobbyCode });
  } else if (lineage.length) cands.push({ rk:rankOf(statsOf(lineage)), names:names(), me:seat, code:"" });
  cands.sort((x, y) => (y.rk.tier * 10 + y.rk.sub) - (x.rk.tier * 10 + x.rk.sub));
  return cands[0] || { rk:rankOf({ readings:0 }), names:{}, me:null, code:"" };
}
function rankCard(){
  const b = bestRank();
  const myName = (b.me && b.names[b.me]) || entry.name || (seat && nm(seat)) || "you";
  const partner = b.me && b.names[other(b.me)];
  return `<aside class="rankcard" aria-label="your best rank">
    ${rankIcon(b.rk, "big")}
    <div class="rc-text">
      <p class="rc-name">${esc(myName)}</p>
      <p class="rc-rank">${esc(rankLabel(b.rk))}${partner ? ` <span>with ${esc(partner)}</span>` : ""}</p>
      <p class="rc-line">${esc(RANK_LINES[b.rk.tier] || RANK_LINES[0])}</p>
    </div>
  </aside>`;
}
function lobbiesPanel(){
  if (mode !== "online") return "";
  watchLobbies();
  const rows = lobbyRows();
  if (!rows.length) return "";
  const yours = rows.filter(r => r.mv === "your move"), rest = rows.filter(r => r.mv !== "your move");
  const item = r => `<li><button class="lob${r.code === lobbyCode ? " here" : ""}${r.mv === "your move" ? " needs" : ""}" data-rejoin="${esc(r.code)}">
      <b>${esc(r.code)}</b>
      <span class="who-line">${esc(r.names.a || "?")} & ${esc(r.names.b || "…")}</span>
      <span class="state">${r.mv === "your move" ? "your move" : esc(r.mv || "…")}${r.code === lobbyCode ? " · open" : ""}</span>
      </button></li>`;
  return `<section class="lobbies">
    <div class="lobbies-head"><h2>your lobbies</h2>${lobbyCode ? `<button class="btn ghost" data-act="leave">new lobby</button>` : ""}</div>
    ${yours.length ? `<p class="group">waiting on you</p><ul>${yours.map(item).join("")}</ul>` : ""}
    ${rest.length ? `<p class="group">${yours.length ? "the rest" : "ongoing"}</p><ul>${rest.map(item).join("")}</ul>` : ""}
  </section>`;
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
    lobbyWatch[l.code] = online.room(l.code).onRoom(d => { lobbyLive[l.code] = d; if (tab() === "who") render(); else updateBadge(); }, () => {});
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
  const before = myLobbies();
  const list = before.filter(l => l.code !== lobbyCode);
  list.unshift({ code:lobbyCode, names:game.names || {}, score:game.score || 0, at:(before.find(l => l.code === lobbyCode) || {}).at || Date.now() });
  ls.set("spookee:lobbies", JSON.stringify(list.slice(0, 12)));
  syncLobbies(list.slice(0, 12));
}
// signed in with google: the lobby list is kept on the account, so every device shows the same games
let syncTimer = null;
function syncLobbies(list){
  if (mode !== "online" || online.anonymous()) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => online.saveLobbies(list.map(l => ({ code:l.code, at:l.at || 0 }))).catch(() => {}), 1500);
}
async function pullLobbies(){
  if (mode !== "online" || online.anonymous()) return;
  try {
    const remote = await online.loadLobbies();
    if (!remote.length) return;
    const local = myLobbies(), have = new Set(local.map(l => l.code));
    const merged = local.concat(remote.filter(r => !have.has(r.code)).map(r => ({ code:r.code, names:{}, score:0, at:r.at || 0 })))
      .sort((x, y) => (y.at || 0) - (x.at || 0)).slice(0, 12);
    ls.set("spookee:lobbies", JSON.stringify(merged));
    if (!lobbyCode && !ls.get("spookee:lobby") && merged[0]) enterRoom(merged[0].code);
    else render();
  } catch {}
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
  unsub.push(room.onReadings(rs => { lineage = rs; shareToLexicon(); render(); }, e => console.error(e)));
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
  if (!name) { entry.err = "name first"; return render(); }
  entry.busy = true; entry.err = ""; render();
  ls.set("spookee:name", name);
  try {
    for (let i = 0; i < 6; i++) {
      const code = WORDS[Math.floor(Math.random() * WORDS.length)].replace(/[^a-z]/g, "") + "-" + String(Math.floor(Math.random() * 90) + 10);
      const base = { seats:{ a:uid }, names:{ a:name, b:"" }, presence:{ a:Date.now() }, created:Date.now() };
      const made = await online.createRoom(code, freshGame(base));
      if (made) { entry.busy = false; location.hash = "ball"; enterRoom(code); return; }
    }
    entry.err = "try again";
  } catch (e) { console.error(e); entry.err = "offline?"; }
  entry.busy = false; render();
}
async function joinLobby(codeIn){
  const name = entry.name.trim().toLowerCase(), code = cleanCode(codeIn || entry.code);
  if (!name) { entry.err = "name first"; return render(); }
  if (!code) { entry.err = "code?"; return render(); }
  entry.busy = true; entry.err = ""; render();
  ls.set("spookee:name", name);
  try {
    const res = await online.joinRoom(code, uid, name);
    entry.busy = false;
    if (res === "missing") { entry.err = `no lobby "${code}"`; forgetLobby(code); return render(); }
    location.hash = "ball"; enterRoom(code); // "full" still enters, to watch
  } catch (e) { console.error(e); entry.busy = false; entry.err = "offline?"; render(); }
}

/* ---------- rendering ---------- */
const view = document.getElementById("view");
function tab(){
  const t = location.hash.slice(1);
  if (["who","ball","past","ranks","lex"].includes(t)) return t;
  return (mode === "online" ? (lobbyCode ? "ball" : "who") : (seat ? "ball" : "who"));
}

function render(){
  const t = tab();
  const ae = document.activeElement;
  if (t === "who" && mode !== "online" && ae && ae.dataset && ae.dataset.name && view.querySelector(".sides")) return; // don't clobber a name mid-typing
  document.querySelectorAll("#tabs a").forEach(a => { if (a.dataset.tab === t) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
  const actId = ae && ae.id, sel = ae && ae.selectionStart;
  view.innerHTML = t === "who" ? whoView() : t === "past" ? pastView() : t === "ranks" ? ranksView() : t === "lex" ? lexView() : ballView();
  if (t === "lex") mountLex();
  updateBadge();
  if (actId) { const el = document.getElementById(actId); if (el && el !== document.body) { el.focus(); try { el.setSelectionRange(sel, sel); } catch {} } }
  wire();
  autoJudge();
  autoBegin();
  maybeCelebrate();
  maybeMourn();
  setTitle();
}

const page = inner => `<div class="wrap" style="padding:0">${inner}</div>`;
const dot = s => mode === "local" ? "" : `<span class="dot ${isHere(s) ? "on" : ""}" title="${isHere(s) ? "here" : "away"}" aria-label="${isHere(s) ? "here" : "away"}"></span>`;

function whoView(){
  if (mode !== "online") {
    const side = s => `
      <section class="side ${seat === s ? "mine" : ""}">
        <input id="name-${s}" data-name="${s}" value="${esc(names()[s])}" maxlength="16" autocomplete="off" placeholder="your name" aria-label="name for ${FALLBACK[s]}">
        <button class="btn ${seat === s ? "" : "ghost"}" data-seat="${s}" ${(names()[s] || "").trim() ? "" : "disabled"}>${seat === s ? "this is me" : "i'm " + esc(nm(s))}</button>
      </section>`;
    return page(`<h1>see yourself</h1>${rankCard()}<div class="sides">${side("a")}${side("b")}</div>`);
  }
  if (!lobbyCode) {
    return page(`<h1>see yourself</h1>${rankCard()}
      <form class="entry" id="entry-form" autocomplete="off">
        <label class="lbl" for="entry-name">your name</label>
        <input id="entry-name" class="big-in" value="${esc(entry.name)}" maxlength="16" spellcheck="false">
        <button class="btn" type="button" data-act="make" ${entry.busy ? "disabled" : ""}>make a lobby</button>
        <p class="or">or</p>
        <label class="lbl" for="entry-code">code</label>
        <input id="entry-code" class="big-in" value="${esc(entry.code)}" maxlength="24" spellcheck="false" placeholder="moth-42">
        <button class="btn ghost" type="submit" ${entry.busy ? "disabled" : ""}>join</button>
        ${entry.err ? `<p class="warn" role="alert">${esc(entry.err)}</p>` : ""}
      </form>
      ${accountLine()}
      ${lobbiesPanel()}`);
  }
  if (!loaded) return page(`<h1>see yourself</h1>${rankCard()}<p class="note">opening ${esc(lobbyCode)}…</p>`);
  const full = !seat;
  const row = s => {
    const has = game && game.seats && game.seats[s];
    return `<li class="${seat === s ? "me" : ""}">${dot(s)}<span>${has ? esc(nm(s)) : "…"}</span>${seat === s ? `<small>you</small>` : ""}</li>`;
  };
  return page(`<h1>see yourself</h1>${rankCard()}
    <section class="lobby">
      <p class="lbl">lobby</p>
      <p class="code">${esc(lobbyCode)}</p>
      <div class="share">
        <input id="share-link" readonly value="${esc(shareLink(lobbyCode))}" aria-label="link to this lobby">
        <button class="btn ghost" data-act="copy">copy link</button>
      </div>
      <ul class="players">${row("a")}${row("b")}</ul>
      ${full ? `<p class="note">full. watching.</p>` : ""}
      <div class="row"><a class="btn" href="#ball" style="text-decoration:none">see the orb</a></div>
      ${accountLine()}
    </section>
    ${lobbiesPanel()}`);
}

let signErr = "";
function accountLine(){
  if (mode !== "online") return "";
  if (!online.anonymous()) return `<p class="note acct">${esc(online.email() || "signed in")}</p>`;
  return `<div class="acct"><button class="link" data-act="google">play on any device</button>
    ${signErr ? `<p class="warn" role="alert">${esc(signErr)}</p>` : ""}</div>`;
}
async function google(){
  signErr = "";
  try { await online.signInGoogle(); location.reload(); }
  catch (e) {
    console.error(e);
    signErr = e && e.code === "auth/popup-blocked" ? "allow pop-ups, then try again"
      : e && e.code === "auth/popup-closed-by-user" ? "" : "couldn't sign in";
    render();
  }
}
function header(){
  const right = `<span class="rankchip">${rankIcon(rankOf(statsOf(lineage)))}</span>`;
  const left = `<span>round <b>${ROMAN[game.round] || "III"}</b> of III${game.round === 3 ? " · final" : ""}</span>`;
  const who = mode === "local"
    ? `<span class="who">you are <b>${esc(nm(seat))}</b> · <button class="link" data-act="switch">switch</button></span>`
    : `<span class="who">${dot("a")}<b>${esc(nm("a"))}</b> & ${alone() ? "<b>…</b>" : dot("b") + "<b>" + esc(nm("b")) + "</b>"}${lobbyCode ? ` · ${esc(lobbyCode)}` : ""}</span>`;
  return `<div class="meta">${left}${who}${right}</div>`;
}
const handoff = them => mode === "local" ? `<div class="row"><button class="btn ghost" data-act="switch">hand to ${esc(nm(them))}</button></div>` : "";
const alone = () => mode === "online" && game && !(game.seats && game.seats.b);
const awayNote = them => mode === "local" ? "" : alone()
  ? `<div class="invite"><p class="note">send them <b>${esc(lobbyCode)}</b></p><button class="btn ghost" data-act="copy">copy link</button></div>`
  : `<p class="note">come back anytime</p>`;

// the big line on each screen, picked per reading and round so it doesn't flicker
const LINES = {
  cards: ["do you have a connection?", "anything coming to you?", "what's the thread?"],
  type:  ["think about it bro...", "don't think too much", "keep it simple..?", "pick a word.. any word.."],
  words: ["you guys tapped in?", "same wavelength?", "did you link up?"],
};
function line(kind, salt){ const l = LINES[kind]; return l[((game.reading || 1) * 7 + (salt || 0) * 3) % l.length]; }
function checkLine(){
  const res = verdicts[game.reading + "-" + game.round];
  if (!res) return `<p class="check">reading the words…</p>`;
  if (res.v === "right") return `<p class="check right">${res.how === "close" ? "close enough" : "the same"} ✦</p>`;
  return `<p class="check wrong">not quite${game.round >= 3 ? "" : ". again"}</p>`;
}
function ballView(){
  const notes = (readOnly && mode !== "online" ? `<p class="note">view only</p>` : "")
              + (slow && !loaded ? `<p class="note">connecting…</p>` : "");
  if (mode === "online" && !lobbyCode) return page(`<div class="orb" aria-hidden="true"></div><h1>see the orb</h1>
    <div class="row"><a class="btn" href="#who" style="text-decoration:none">make or join a lobby</a></div>`);
  if (mode !== "online" && !seat) return page(`<div class="orb" aria-hidden="true"></div><h1>see the orb</h1>
    <div class="row"><a class="btn" href="#who" style="text-decoration:none">choose who you are</a></div>`);
  if (!loaded) return page(`<div class="orb" aria-hidden="true"></div><h1>gazing…</h1>${notes}`);
  if (!game || !game.reading) return page(`<div class="orb" aria-hidden="true"></div><h1>gazing…</h1>${notes}`);
  if (!seat) { // watcher
    return page(`${header()}<p class="note">watching</p>
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
      body = `<h1>${line("cards")}</h1>
        <div class="pair">
          <div class="slot"><div class="card static ${anim}">${esc(pub.a)}</div>${esc(nm("a"))}</div>
          <div class="slot"><div class="card static ${anim}" style="animation-delay:.15s">${esc(pub.b)}</div>${esc(nm("b"))}</div>
        </div>
        <div class="row"><button class="btn" data-act="bridge">pick a word.. any word..</button></div>`;
    } else if (mineIn) {
      body = `<h1>${theirsIn ? "the orb is stirring…" : alone() ? "waiting for someone to join" : "waiting for " + esc(nm(them))}</h1>
        <div class="pair">
          <div class="slot"><div class="card static">${esc(myWord)}</div>${esc(nm(me))}</div>
          <div class="slot"><div class="card static back" aria-label="${esc(nm(them))}'s card, hidden">✦</div>${alone() ? "…" : esc(nm(them)) + (theirsIn ? " · locked" : " · choosing")}</div>
        </div>${handoff(them)}${awayNote(them)}`;
    } else {
      body = `<h1>choose... your fate...</h1>
        <div class="deck" role="group" aria-label="your five cards">
          ${((game.decks || {})[me] || []).map(w => `<button class="card" data-card="${esc(w)}" aria-pressed="${pick === w}">${esc(w)}</button>`).join("")}
        </div>
        <p class="note">${alone() ? "pick now. they'll pick when they join." : theirsIn ? esc(nm(them)) + " locked in" : esc(nm(them)) + " is choosing"}</p>
        <div class="row"><button class="btn" data-act="lock-card" ${pick && !readOnly ? "" : "disabled"}>lock in</button></div>`;
    }
  } else {
    const cards = game.cards || {};
    // the pool: both cards plus every word guessed so far this reading. The newest two are what you're
    // connecting this round; everything before them is context the new word has to fit too.
    const rows = [{ label:"cards", a:cards.a, b:cards.b }].concat((game.attempts || []).map(t => ({ label:ROMAN[t.round].toLowerCase(), a:t.a, b:t.b })));
    const pairLine = `<div class="rows" role="table" aria-label="the words so far, one row per try">
      <div class="prow head" role="row"><span role="columnheader"></span><span role="columnheader">${esc(nm("a"))}</span><span role="columnheader">${esc(nm("b"))}</span></div>
      ${rows.map((r, i) => `<div class="prow${i === rows.length - 1 ? " new" : ""}" role="row"><span class="rl" role="rowheader">${esc(r.label)}</span><span role="cell">${esc(r.a)}</span><span role="cell">${esc(r.b)}</span></div>`).join("")}
    </div>`;
    if (bothOut) {
      const key = "b" + game.reading + "-" + game.round, anim = lastReveal !== key ? "flip" : ""; lastReveal = key;
      body = `${pairLine}<h1>${line("words", game.round)}</h1>
        ${(() => { const res = verdicts[game.reading + "-" + game.round] || {}, br = res.brill;
          const cell = (s, delay) => `<div class="word ${anim}${br === s ? " brilliant" : ""}"${delay ? ` style="animation-delay:${delay}"` : ""}>${br === s ? `<span class="bang" aria-hidden="true">!!</span>` : ""}<small>${esc(nm(s))}</small><strong>${esc(pub[s])}</strong></div>`;
          return `<div class="words${br ? " has-brilliant" : ""}">${cell("a")}${cell("b", ".15s")}</div>
          ${br ? `<p class="brill-line"><b>!! brilliant</b> ${esc(nm(br))} found a rare thread${res.phrase ? `: <i>${esc(res.phrase)}</i>` : ""}</p>` : ""}`; })()}
        ${checkLine()}`;
    } else if (mineIn) {
      body = `${pairLine}<h1>${theirsIn ? "the orb is stirring…" : "waiting for " + esc(nm(them))}</h1>
        <div class="words">
          <div class="word"><small>${esc(nm(me))}</small><strong>${esc(myWord)}</strong></div>
          <div class="word"><small>${esc(nm(them))}</small><strong style="color:var(--orchid)">✦</strong></div>
        </div>${handoff(them)}${awayNote(them)}`;
    } else {
      body = `<h1>${line("type", game.round)}</h1>${pairLine}
        <form class="field" id="bridge-form" autocomplete="off">
          <label for="bridge-input">${theirsIn ? esc(nm(them)) + " locked in" : esc(nm(them)) + " is thinking"}</label>
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
  const summary = (game && list.length) ? `<p class="summary">${lobbyCode ? esc(lobbyCode) + " · " : ""}${esc(nm("a"))} & ${esc(nm("b"))} · ${esc(rankLabel(rk))}</p>` : "";
  if (!list.length) return page(`<h1>see the past</h1>
    <div class="empty"><p class="note" style="margin:0">nothing yet</p>
    <a class="btn ghost" href="#ball" style="text-decoration:none">see the orb</a></div>`);
  return page(`<h1>see the past</h1>${summary}<div class="games">
    ${list.map(r => {
      const last = r.attempts[r.attempts.length - 1];
      const final = last.a.toLowerCase() === last.b.toLowerCase() ? esc(last.a) : esc(last.a) + " / " + esc(last.b);
      return `<section class="game">
        <div class="rows past" role="table" aria-label="reading ${r.reading}">
          <div class="prow head" role="row"><span role="columnheader"></span><span role="columnheader">${esc(nmOf(r,"a"))}</span><span role="columnheader">${esc(nmOf(r,"b"))}</span><span role="columnheader"></span></div>
          <div class="prow" role="row"><span class="rl" role="rowheader">cards</span><span role="cell">${esc(r.cards.a)}</span><span role="cell">${esc(r.cards.b)}</span><span role="cell"></span></div>
          ${r.attempts.map(t => `<div class="prow" role="row"><span class="rl" role="rowheader">${ROMAN[t.round].toLowerCase()}</span><span role="cell">${esc(t.a)}${t.brill === "a" ? ` <b class="bang-s" title="${esc(t.phrase || "brilliant")}">!!</b>` : ""}</span><span role="cell">${esc(t.b)}${t.brill === "b" ? ` <b class="bang-s" title="${esc(t.phrase || "brilliant")}">!!</b>` : ""}</span>
            <span class="tag ${t.verdict}" role="cell">${t.verdict === "right" ? (t.how === "close" ? "close enough" : "same") : "not quite"}</span></div>`).join("")}
          <div class="prow final ${r.result}" role="row"><span class="rl" role="rowheader">✦</span><span class="to ${r.result}" role="cell">${final}</span>
            <span class="tag ${r.result}" role="cell">${r.result === "right" ? "success" : "fail"}</span></div>
        </div></section>`;
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
  const mine = rows.find(r => r.mine), here = {};
  rows.forEach(r => { here[r.rk.tier] = (here[r.rk.tier] || 0) + 1; });
  const tiers = TIERS.map((t, i) => ({ name:t, tier:i + 1, min:TIER_MIN[i] })).reverse().concat([{ name:UNRANKED, tier:0, min:0 }]);
  const spectrum = `<ol class="spectrum" aria-label="the ranks, highest first">
    ${tiers.map(t => `<li class="t${t.tier}${mine && mine.rk.tier === t.tier ? " you" : ""}${t.tier === 8 ? " gate" : ""}">
      <span class="sn">${rankIcon({ tier:t.tier })}${esc(t.name)}</span>
      <span class="sm">${t.tier ? t.min + "+" : ""}${here[t.tier] ? `<b>${here[t.tier]}</b>` : ""}</span>
      ${mine && mine.rk.tier === t.tier ? `<span class="you-mark">you${mine.rk.tier ? " · " + ROMAN[mine.rk.sub].toLowerCase() : ""}</span>` : ""}
    </li>`).join("")}
  </ol>`;
  const nextLine = mine && mine.rk.need ? `<p class="note">${mine.rk.need} more ${mine.rk.need === 1 ? "reading" : "readings"} to climb</p>` : "";
  if (!rows.length) return page(`<h1>see the others</h1><div class="ranks-layout">${spectrum}<div class="empty"><p class="note" style="margin:0">nothing yet</p></div></div>`);
  return page(`<h1>see the others</h1>
    <div class="ranks-layout">${spectrum}<div class="ranks-main">${nextLine}
    <div class="board-wrap"><table class="board">
      <thead><tr><th scope="col">#</th><th scope="col">pair</th><th scope="col">rank</th><th scope="col" class="num">success</th><th scope="col" class="num">failed</th><th scope="col" class="num">guesses</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr class="${r.mine ? "mine" : ""}">
        <td class="num pos">${i + 1}</td>
        <td class="pair-cell">${esc(((r.names || {}).a || "?"))} & ${esc(((r.names || {}).b || "?"))}${r.mine ? ` <small>you</small>` : ""}</td>
        <td class="rank t${r.rk.tier}">${rankIcon(r.rk)}${esc(rankLabel(r.rk))}</td>
        <td class="num" data-label="success"><b>${Math.round(r.rate * 100)}%</b></td>
        <td class="num" data-label="failed">${r.fails}</td>
        <td class="num" data-label="guesses">${r.guesses}</td></tr>`).join("")}</tbody>
    </table></div></div></div>`);
}

/* ---------- see the ecology of lexicon: every word, and what it was said beside ---------- */
let lexGlobal = [];
let lexSig = "";
function lexReadings(){
  const out = new Map();
  lexGlobal.forEach(r => out.set(r.id, r));
  lineage.forEach(r => out.set((lobbyCode || mode) + "_" + r.id, r));
  return [...out.values()];
}
function lexView(){ return page(`<h1>see the ecology of lexicon</h1><div id="lex-slot"></div>`); }
function mountLex(){
  const slot = document.getElementById("lex-slot");
  if (!slot || !window.SpookeeLexicon) return;
  const rs = lexReadings(), sig = rs.length + ":" + rs.reduce((m, r) => Math.max(m, r.at || 0), 0);
  window.SpookeeLexicon.mount(slot);
  if (sig !== lexSig) { lexSig = sig; window.SpookeeLexicon.setData(rs); }
}
// every finished reading is added to the shared lexicon (online), once
function shareToLexicon(){
  if (mode !== "online" || !lobbyCode || !seat) return;
  lineage.forEach(r => {
    const id = lobbyCode + "_" + r.id, key = "spookee:lex:" + id;
    if (!r.attempts || !r.cards || ls.get(key)) return;
    ls.set(key, "1");
    online.addLexicon(id, { cards:{ a:r.cards.a || "", b:r.cards.b || "" },
      attempts:r.attempts.map(t => ({ a:t.a || "", b:t.b || "", verdict:t.verdict || "" })), at:r.at || Date.now() }).catch(() => {});
  });
}

function wire(){
  view.querySelectorAll("[data-seat]").forEach(b => b.onclick = () => chooseSeat(b.dataset.seat));
  view.querySelectorAll("[data-name]").forEach(i => i.oninput = () => {
    setName(i.dataset.name, i.value);
    const s = i.dataset.name, side = i.closest(".side"), has = !!i.value.trim();
    const btn = side.querySelector("[data-seat]"); btn.disabled = !has; if (seat !== s) btn.textContent = "i'm " + nm(s);
  });
  view.querySelectorAll("[data-card]").forEach(b => b.onclick = () => { pick = b.dataset.card; render(); });
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
const mourned = new Set();
function maybeMourn(){
  const f = game && game.lastFail;
  if (!f || mourned.has(f.at) || ls.get("spookee:lost") === String(f.at)) return;
  mourned.add(f.at); ls.set("spookee:lost", String(f.at));
  if (Date.now() - (f.at || 0) > 20000) return;
  if (window.spookeeBloom) window.spookeeBloom.wither("fail");
  const el = document.createElement("div");
  el.id = "win"; el.className = "fail";
  el.setAttribute("role", "status");
  el.innerHTML = `<div class="win-card">
      <p class="fail-words"><span>${esc(f.a)}</span><i aria-hidden="true">✦</i><span>${esc(f.b)}</span></p>
      <p class="win-word">the vision fades</p>
      <p class="win-line">no spookee this time</p>
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
      online.onLexicon(rows => { lexGlobal = rows; if (tab() === "lex") mountLex(); }, e => console.error(e));
      watchLobbies();
      pullLobbies();
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
window.__spookee = { statsOf, rankOf, TIERS, brilliance };
})();
