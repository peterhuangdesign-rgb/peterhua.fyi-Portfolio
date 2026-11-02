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
  bouquet.js   ASCII lilies background, adapted from chernobayv/asciiFlowers (used with permission)
  README.md    this file
```

## How the game works

Two players (default names Peter and Emma, editable on "who are you?"). Three rounds per reading:

1. **choose... your fate...** Each player gets their own five cards. The two hands never overlap, and no word is dealt again until the 400-word pool runs low, then it reshuffles.
2. Both lock in, then **poof**: both cards flip at once.
3. **pick a word.. any word..** Each player types the word that bridges the two cards, locks in, then poof.
4. Either player marks it **Right** (+1) or **Wrong**. Every round is kept in "see the past".

On this site it is pass-and-play on one device ("hand to …" swaps sides) and the game is saved in the browser. Two-device play needs a shared backend; the claude.ai artifact version syncs through its own store.

## Credit

The ASCII lilies in the background are by chernobayv ([asciiFlowers](https://github.com/chernobayv/asciiFlowers)), used with her permission and recoloured for spookee.
