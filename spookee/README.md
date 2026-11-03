# spookee

A small two-player word game by Peter Huang. It lives at `peterhua.fyi/spookee/` and is linked only by a small "spookee" text link at the very end of the Profile page. It is not part of the portfolio design.

## How the game works

Two players share a **lobby**. Cards are dealt the moment a lobby exists, so whoever makes it can pick straight away, before anyone has joined. A **reading** is one pair of cards:

1. **choose... your fate...** Each player gets their own five cards from a 400-word pool. The two hands never overlap, and no word comes back until the pool runs low.
2. Both lock in, then **poof**: both cards show.
3. **pick a word.. any word..** Each player types one word that connects them, locks in, then poof.
4. The game checks the two words itself (there are no right/wrong buttons):
   - **the same:** identical once case, accents, "a/an/the" and punctuation are ignored; the same root word ("night" / "nights", "run" / "running"); or a one-letter typo (two letters for words of 8+).
   - **close enough:** words that mean about the same, looked up with the free Datamuse word API ("ocean" / "sea"). If Datamuse can't be reached, only the spelling checks count.
   - **match:** both players catch a **soul** (the points) and see "spookee, you guys said the same thing!". A new reading starts with new cards.
   - **no match in round i or ii:** both guesses join the **pool**, and the next word has to connect all of it. The two newest words are shown largest; older words stay as context.
   - **no match in round iii (final):** the reading fails.

**It is played asynchronously.** Lock in, close the page, come back any time. Each pick is saved on the server, and the rules let the other player read it only after both have locked that step. So neither side can peek, and whoever locks second sees the reveal straight away. The tab title shows "(your move)" when it's your turn, and "your lobbies" shows which lobbies are waiting on you.

The **what do i do?** link next to the spookee wordmark opens a short how-to for new players.

### Tabs

- **who are you?** Type a name, then make a lobby (you get a code like `oak-46` and a link to send) or join one. Each lobby is one pair, and its souls and history stay with the code. A third person opening the code can only watch. "play on any device" signs your player in with Google: the same player, and the same list of lobbies, on every device you sign in on (kept in `users/<id>` in Firestore).
- **crystal ball** The game.
- **see the past** Every reading in this lobby: who drew which card, each round's words with "same", "close enough" or "not quite", and the final word as success or fail.
- **see the others..** The leaderboard: every lobby's success rate, souls, fails, guesses and rank.

### Ranks

Ranks follow Deadlock's ladder shape: 11 tiers with subranks I–VI, plus unranked. The names are crystal-ball themed, lowest to highest:

1. dabbler
2. leaf reader
3. candle keeper
4. palm reader
5. card reader
6. séance holder
7. medium
8. seer
9. wraith
10. star gazer
11. the crystal ball

Under 5 readings a pair is "in the fog". The rating is the success rate, with agreement in round i worth more than in round iii, smoothed so a few lucky readings don't top the board. The crystal ball needs 20+ readings.

### Without Firebase

If `firebase-config.js` still holds the placeholder, the game runs as one-device pass-and-play ("hand to …" swaps sides), saved in that browser.

## Design

Dark velvet: black and deep purple with a lilac accent.

- **Type:** Atkinson Hyperlegible, designed for legibility (distinct letter shapes, open counters), all lowercase.
- **Cards:** five cards to choose from. Both flip at once on "poof".
- **The pool:** a line of words, with the newest two set largest.
- **Souls:** small ghost icons, one per win, in the game header, history and leaderboard.
- **Win screen:** a burst of ✦ around the shared word, and "+1 soul" rising.
- **Background:** ASCII lilies by chernobayv, now growing inside a crystal ball on a stand and recoloured into the velvet palette.

### How the ASCII background is made (bouquet.js)

1. Each frame, the scene is drawn with ordinary canvas shapes (curves, ellipses, gradients) onto a tiny offscreen canvas, one pixel per character cell.
2. Each pixel's brightness picks a glyph from the ramp ` .:-=+*cxoaX#%&@`, dark to dense, and the glyph is drawn in a colour from the pixel.
3. A faint blurred copy of the tiny image sits underneath for glow, and a few glyphs flicker so it feels alive.
4. The animation is just time (`T`) driving the shapes: stems grow, buds swell and open, everything sways.

So anything drawable with canvas shapes becomes ASCII for free. `drawScene` draws the crystal ball (stand, mist, rim, highlight), clips to the sphere, and draws the bouquet scaled down inside it.

**Colour:** green marks a match and dark red marks a miss.

**Motion:** it stops when the tab is hidden and respects reduced motion.

## Instructions for whoever changes the game (person or AI)

1. **Work only inside `spookee/`.** Do not edit any portfolio file: `index.html`, `shared/`, `site/`, `media/`, `design/` stay as they are. The Profile link already exists (`.spk` in `site/app.css`, last line of `profileHTML` in `shared/core.js`).
2. **Entry point:** `spookee/index.html`. Keep the `← Peter Huang` back link (it returns to `../#profile`) and the `noindex` meta tag.
3. **Relative paths only** (`assets/ghost.png`, not `/assets/ghost.png`). GitHub Pages serves the repo root, so a leading `/` breaks.
4. **No build step.** Plain HTML, CSS and JS that run as-is on GitHub Pages.
5. **Keep it light:** no autoplaying sound, pause when the tab is hidden, respect `prefers-reduced-motion`, keyboard playable, works at phone width.
6. **Keep on-screen text to the minimum.** Explanations belong in the help dialog or this README, not on the game screens.
7. **When you change a `.js` or `.css` file, bump its `?v=` number in `index.html`,** so browsers holding the old file fetch the new one.
8. **Changing the database shape?** Update `firestore.rules` too, and paste it into the Firebase console (Firestore > Rules > Publish) *before* the code goes live, or moves will be refused.
9. **Branch:** work on `feature/spookee-game`; `main` is the live site.

## Files

```
spookee/
  index.html          page shell: back link, #game mount, loads the scripts below
  style.css           the game's styles only
  bouquet.js          ASCII lilies background, adapted from chernobayv/asciiFlowers (used with permission)
  words.js            the 400-word card pool
  firebase-config.js  Firebase web config (project spookee-bcf91; public by design)
  online.js           lobbies, hidden picks and the leaderboard on Firebase (loads only when configured)
  game.js             the game: state, rules, screens, keyboard, help dialog
  firestore.rules     database rules; paste into the Firebase console when they change
  README.md           this file
```

## Firebase setup (already done for spookee-bcf91)

1. console.firebase.google.com: create a project.
2. Authentication > Sign-in method: enable **Anonymous** and **Google**. Settings > Authorized domains: add `peterhua.fyi`.
3. Firestore Database: create it in production mode.
4. Firestore > Rules: paste `firestore.rules`, Publish.
5. Project settings > Your apps > Web: copy the `firebaseConfig` values into `firebase-config.js`.

Test lobbies can be removed in Firestore > Data (`rooms/<code>`, and `board/<code>` for the leaderboard). The website itself can't delete anything.

## Credit

The ASCII lilies in the background are by chernobayv ([asciiFlowers](https://github.com/chernobayv/asciiFlowers)), used with her permission and recoloured for spookee.
