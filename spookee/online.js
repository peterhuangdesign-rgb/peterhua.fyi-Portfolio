/* spookee online: lobbies and the leaderboard on Firebase (anonymous sign-in + Firestore).
   Loaded as a module after firebase-config.js. If the config is still the placeholder,
   window.SpookeeOnline resolves to null and the game falls back to pass-and-play. */
const V = "10.12.2";
const cfg = window.SPOOKEE_FIREBASE || {};

window.SpookeeOnline = (async () => {
  if (!cfg.apiKey || String(cfg.apiKey).startsWith("PASTE")) return null;
  const [{ initializeApp }, { getAuth, signInAnonymously }, fs] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`),
  ]);
  const { getFirestore, doc, collection, onSnapshot, setDoc, getDoc, runTransaction, query, orderBy, limit } = fs;
  const app = initializeApp(cfg);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const cred = await signInAnonymously(auth);
  const uid = cred.user.uid;

  const roomRef = code => doc(db, "rooms", code);

  return {
    uid,
    room(code) {
      const ref = roomRef(code);
      return {
        onRoom: (cb, err) => onSnapshot(ref, s => cb(s.exists() ? s.data() : null), err),
        onReadings: (cb, err) => onSnapshot(collection(ref, "readings"), qs => cb(qs.docs.map(d => ({ id: d.id, ...d.data() }))), err),
        set: data => setDoc(ref, data),
        merge: patch => setDoc(ref, patch, { merge: true }),
        saveReading: (id, rec) => setDoc(doc(ref, "readings", id), rec),
        // fn(current) -> next | null; only one of two simultaneous taps wins
        transact: fn => runTransaction(db, async tx => {
          const s = await tx.get(ref);
          const next = fn(s.exists() ? s.data() : null);
          if (next) tx.set(ref, next);
          return !!next;
        }),
      };
    },
    // create only if the code is free
    createRoom: (code, data) => runTransaction(db, async tx => {
      const s = await tx.get(roomRef(code));
      if (s.exists()) return false;
      tx.set(roomRef(code), data);
      return true;
    }),
    // "ok" (seated, or already seated), "full" (watch only), or "missing"
    joinRoom: (code, me, name) => runTransaction(db, async tx => {
      const s = await tx.get(roomRef(code));
      if (!s.exists()) return "missing";
      const d = s.data(), seats = d.seats || {};
      if (seats.a === me || seats.b === me) return "ok";
      if (seats.b) return "full";
      tx.set(roomRef(code), {
        ...d,
        seats: { ...seats, b: me },
        names: { ...(d.names || {}), b: name },
        presence: { ...(d.presence || {}), b: Date.now() },
      });
      return "ok";
    }),
    saveBoard: (code, row) => setDoc(doc(db, "board", code), row),
    onBoard: (cb, err) => onSnapshot(query(collection(db, "board"), orderBy("rank", "desc"), limit(50)),
      qs => cb(qs.docs.map(d => ({ id: d.id, ...d.data() }))), err),
    exists: async code => (await getDoc(roomRef(code))).exists(),
  };
})().catch(e => { console.error("spookee online is off:", e); return null; });
