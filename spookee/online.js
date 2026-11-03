/* spookee online: lobbies and the leaderboard on Firebase (anonymous sign-in + Firestore).
   Loaded as a module after firebase-config.js. If the config is still the placeholder,
   window.SpookeeOnline resolves to null and the game falls back to pass-and-play. */
const V = "10.12.2";
const cfg = window.SPOOKEE_FIREBASE || {};

window.SpookeeOnline = (async () => {
  if (!cfg.apiKey || String(cfg.apiKey).startsWith("PASTE")) return null;
  const [{ initializeApp }, { getAuth, signInAnonymously, onAuthStateChanged, GoogleAuthProvider, linkWithPopup, signInWithPopup, signInWithCredential }, fs] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`),
  ]);
  const { getFirestore, doc, collection, onSnapshot, setDoc, getDoc, runTransaction, query, orderBy, limit } = fs;
  const app = initializeApp(cfg);
  const auth = getAuth(app);
  const db = getFirestore(app);
  // reuse whoever is already signed in on this browser (anonymous or google), else sign in anonymously
  const existing = await new Promise(res => { const off = onAuthStateChanged(auth, u => { off(); res(u); }); });
  const user = existing || (await signInAnonymously(auth)).user;
  const uid = user.uid;

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
    // hidden picks: rooms/{code}/secrets/{seat}_{reading}_{step}
    setSecret: (code, seat, step, v) => setDoc(doc(db, "rooms", code, "secrets", `${seat}_${step}`), { v }),
    getSecret: async (code, seat, step) => {
      try { const s = await getDoc(doc(db, "rooms", code, "secrets", `${seat}_${step}`)); return s.exists() ? s.data().v : null; }
      catch (e) { if (e.code === "permission-denied") return null; throw e; }
    },
    // your lobbies, kept on your account so every device you sign in on shows the same games
    saveLobbies: list => setDoc(doc(db, "users", uid), { lobbies: list, updated: Date.now() }, { merge: true }),
    loadLobbies: async () => { try { const s = await getDoc(doc(db, "users", uid)); return (s.exists() && s.data().lobbies) || []; } catch { return []; } },
    // the shared lexicon: one entry per finished reading, written once by one of its players
    addLexicon: (id, data) => setDoc(doc(db, "lexicon", id), data),
    onLexicon: (cb, err) => onSnapshot(query(collection(db, "lexicon"), orderBy("at", "desc"), limit(1500)),
      qs => cb(qs.docs.map(d => ({ id: d.id, ...d.data() }))), err),
    anonymous: () => !auth.currentUser || auth.currentUser.isAnonymous,
    email: () => (auth.currentUser && auth.currentUser.email) || "",
    // link this browser's anonymous player to google (keeps the same player);
    // if that google account is already a player elsewhere, switch to it
    signInGoogle: async () => {
      const provider = new GoogleAuthProvider();
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        try { return await linkWithPopup(auth.currentUser, provider); }
        catch (e) {
          if (e.code === "auth/credential-already-in-use") { const c = GoogleAuthProvider.credentialFromError(e); if (c) return signInWithCredential(auth, c); }
          throw e;
        }
      }
      return signInWithPopup(auth, provider);
    },
  };
})().catch(e => { console.error("spookee online is off:", e); return null; });
