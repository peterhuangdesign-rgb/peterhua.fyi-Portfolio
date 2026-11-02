# spookee

A small side game by Peter Huang. It lives at `peterhua.fyi/spookee/` and is linked only by a small "spookee" text link at the very bottom of the Profile page. It is not part of the portfolio design.

## Instructions for whoever adds the game (person or AI)

1. **Work only inside `spookee/`.** Do not edit any portfolio file: `index.html`, `shared/`, `site/`, `media/`, `design/` stay as they are. The Profile link already exists (`.spk` in `site/app.css`, last line of `profileHTML` in `shared/core.js`).
2. **Entry point:** `spookee/index.html`. Keep the `← Peter Huang` back link (it returns to `../#profile`) and the `noindex` meta tag.
3. **Mount the game in `<main id="game">`**, replacing the placeholder `<p class="soon">`. Code goes in `game.js`, styles in `style.css`; add more files or folders inside `spookee/` as needed (for example `spookee/assets/`).
4. **Relative paths only** (`assets/ghost.png`, not `/assets/ghost.png`). GitHub Pages serves the repo root, so a leading `/` breaks.
5. **No build step required.** Plain HTML, CSS and JS that run as-is on GitHub Pages. If the game is built with a bundler, commit the built output here, not the source tooling.
6. **Keep it light:** no autoplaying sound (start audio from a click), pause when the tab is hidden, respect `prefers-reduced-motion`, keyboard playable, works at phone width.
7. **Branch and review:** work on a branch (e.g. `feature/spookee-game`). Peter reviews before anything merges to `main`, which is the live site.

## Updating

When you change `style.css` or a `.js` file, bump the `?v=` number on its tag in `index.html`, so browsers holding the old file fetch the new one.

## Files

```
spookee/
  index.html   page shell: back link, #game mount, loads style.css and game.js
  style.css    the game's styles only
  game.js      game entry point (mounts into #game)
  words.js     the 400-word card pool
  firebase-config.js  Firebase web config (placeholder until set up)
  online.js    lobbies + leaderboard on Firebase (loads only when configured)
  firestore.rules     database rules to paste into the Firebase console
  bouquet.js   ASCII lilies background, adapted from chernobayv/asciiFlowers (used with permission)
  README.md    this file
```

## How the game works

Two players. On first visit each picks a side on "who are you?" and types a name (no default names).

A **reading** is one pair of cards:

1. **choose... your fate...** Each player gets their own five cards. The hands never overlap, and no word is dealt again until the 400-word pool runs low, then it reshuffles.
2. Both lock in, then **poof**: both cards flip at once.
3. **pick a word.. any word..** Each player types a word that bridges the two cards, locks in, then poof.
4. Either player marks it **right** or **wrong**.
   - right: +1 point, a short "spookee, you guys said the same thing!" celebration plays for both players, and a new reading starts at round I with new cards.
   - wrong in round I or II: same two cards, next round.
   - wrong in round III (final): the reading fails automatically.

"see the past" lists every reading: who drew which card, each round's words with right or wrong, and the final word as success or fail.

### Playing across the world (lobbies)

With Firebase configured, "who are you?" asks for a name, then **make a lobby** (you get a code like `oak-46` and a link to send) or **join** with a code. Each lobby is one pair of people: its points, history and rank stay with that code. A third person opening the code can only watch. Picks stay on the picker's device until both have locked in, so neither side can peek. A green dot means the other player has the page open.

Without Firebase configured, the game runs as one-device pass-and-play ("hand to …" swaps sides), saved in the browser.

### Leaderboard and ranks

"leaderboard" lists every lobby: success rate, readings won and failed, total guesses, and a rank. The ladder copies Deadlock's shape (11 tiers with subranks I–VI, plus unranked) with crystal-ball names, lowest to highest: dabbler, leaf reader, candle keeper, palm reader, card reader, séance holder, medium, seer, wraith, star gazer, the crystal ball. Under 5 readings a pair is "in the fog". The rating is the success rate, with agreement in round i worth more than round iii, smoothed so a few lucky readings don't top the board; the crystal ball needs 20+ readings.

### Firebase setup (one time)

1. console.firebase.google.com: create a project (Analytics off is fine).
2. Build > Authentication > Get started > Sign-in method: enable **Anonymous**. Settings > Authorized domains: add `peterhua.fyi`.
3. Build > Firestore Database > Create database, production mode, a US region.
4. Firestore > Rules: paste `firestore.rules`, Publish.
5. Project settings > Your apps > Web (`</>`): register an app, copy the `firebaseConfig` values into `firebase-config.js`.

## Credit

The ASCII lilies in the background are by chernobayv ([asciiFlowers](https://github.com/chernobayv/asciiFlowers)), used with her permission and recoloured for spookee.
