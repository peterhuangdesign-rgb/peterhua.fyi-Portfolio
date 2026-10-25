# peterhua.fyi — Peter Huang's portfolio

UX research and design portfolio. The live site is the repo root (GitHub Pages, `CNAME` peterhua.fyi). **The full, current spec is `design/notes/HANDOFF.md`. Read it before touching anything.**

## Status

The core design is **final** as of 25 Oct 2026 (GitHub `main` at round 6 = claude.ai artifact v26). New work adds content or fixes bugs inside this design. Do not restyle, reword or reorder anything Peter hasn't asked to change.

## Who it's for

- **Owner:** Peter Huang. NYU, B.S. Applied Psychology (May 2026), minor in Integrated Design & Media (HCI/UX). **No Philosophy minor** (not completed; never list it).
- **Now:** Founding Designer at Chorvivo (confidential: no case study, no details beyond his role).
- **Next:** Human Factors and Graduate Study. Portfolio is aimed at UX research roles now, human factors later.
- **Reader:** a hiring researcher or design lead skimming fast. Titles first, then method and evidence.
- **Contact:** peterhuangdesign@gmail.com · linkedin.com/in/peterhuaux · Orange County, CA.

## Working agreement

1. **Change only what Peter asks for.** Use his words; never invent results, numbers, quotes, clients or dates. Flag conflicts instead of fixing them.
2. **Back up first:** push a `backup/before-…` branch, then work on a feature branch.
3. **Peter reviews before anything goes live.** Show screenshots; merge to `main` and publish the artifact only when he says "push". Keep `main` and the artifact in sync.
4. **One source of truth:** professional facts live in `RESUME` in `shared/core.js` and feed Home's fact row, Profile, the résumé page and the PDF. After any `RESUME` change, rebuild the PDF with `design/notes/build-resume-pdf.js` (keep it one page).
5. **Check before shipping:** axe scan (WCAG 2.2 AA) on every page in Land and Sea; layout at 360 / 375 / 390 / 768 / 1024 / 1280 / 1440 / 1920 with no sideways scroll; reduced motion; keyboard only; theme switch on a content page.
6. Commits are authored as Claude (`noreply@anthropic.com`).

## Design rules (locked; details in HANDOFF §2–§3)

- **Logo:** lowercase p over h with a flat bar between them; the bar appears only in the logo. Rail mark and favicon use the Darker Grotesque 500 glyphs. Profile logo rolls peter/huang → psychology/human factors → prototype/hypothesis → product/heuristics, all at weight 500.
- **Type:** Darker Grotesque (display) and Albert Sans (body), self-hosted. Square corners everywhere. Labels ≥ 12 px. 4 px spacing scale.
- **Themes:** Land (bright) and Sea (dark), one toggle in the rail. Text passes AA in both.
- **Context line:** every project and job has one lowercase line under its title, parts split by " / " (projects: `ux research / research paper`, etc.).
- **Home:** greeting, Peter's intro, the Education / Now / Next fact row, photo; then three featured projects (title, context line, picture only).
- **Motion:** transform and opacity only; every animation has a reduced-motion still. The mission story uses native scroll with snap points (no scroll-jacking).
- No AI tropes: no gradients, emoji, glass, stat-triplet heroes, marketing verbs.

## Files

```
index.html            page shell (rail, nav, theme toggle, fonts, favicons)
shared/core.js        all content (DATA, RESUME, CONTACT, PROFILE) and shared renderers
shared/core.css       tokens, fonts, case-study and profile components
site/app.js           router, Home, featured work, animated logo, typed intro, mission story
site/app.css          layout, rail, Home, fact row, themes, story
media/                photos, fonts, résumé PDF, paper PDF, project images
design/notes/         HANDOFF.md (spec), build-resume-pdf.js, reports
design/archive/       retired directions (reference only)
.claude/skills/design-grade/   design rubric (run after visual changes)
```

## Tooling

- `.claude/skills/design-grade/`: visual design and UX rubric trimmed from Garry Tan's gstack `design-review` (MIT).
- Brand and logo canvas: https://claude.ai/artifact/F2jJWEpkSJRC1GDA1opfM9 (logo rounds, applications incl. LinkedIn banner, palettes, NYU directions).
