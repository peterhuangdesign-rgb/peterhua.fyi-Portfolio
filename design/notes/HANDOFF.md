# peterhua.fyi — portfolio and personal brand handoff

Context for a new chat. Status as of 24 Oct 2026 (portfolio artifact version 24, GitHub `main`).
Paste this file in first, then give the next request.

---

## 0. READ FIRST: everything below is locked

Everything in this document is a decision Peter has made. **Keep it exactly as it is.** Do not redesign, restyle, reword, reorder or "improve" anything unless Peter asks for that specific change.

Rules for any new chat:
1. **Change only what Peter asks for.** No side improvements, no "while I was there" edits.
2. **Use Peter's words.** Never invent results, numbers, years, methods, clients or quotes. If something is missing, ask. Case text for the research papers is condensed from Peter's own papers.
3. **Flag, don't fix.** If you see a conflict (e.g. two different dates), tell Peter and leave his text alone unless he says otherwise.
4. **Back up before changing anything.** Make a `backup/...` branch on GitHub first (tags are refused by the proxy; branches work).
5. **Check before publishing:**
   - desktop 1440 px, tablet 768 px and phone 390/375/360 px, both Land and Sea themes
   - switch theme on a content page and check nothing is hard to read
   - no sideways scrolling, no lorem ipsum, no console errors
   - the locked items in this document are still true (logo pairs, bar only in the logo, home hero contents, featured order, Résumé and Email buttons work)
6. If a request would break a locked item, say so and ask before doing it.

---

## 1. Where things live

| What | Where |
|---|---|
| Portfolio (claude.ai artifact, multi-file) | https://claude.ai/artifact/83J6u88WPmagR5GSvvcx3S |
| Logo and brand canvas (Design artifact) | https://claude.ai/artifact/F2jJWEpkSJRC1GDA1opfM9 (pages: Logo rounds, Applications, Round 5, **Palettes · bright + dark**) |
| Code | github.com/peterhuangdesign-rgb/peterhua.fyi-portfolio, branch `main` (private repo) |
| Backups | branches `backup/before-fixes`, `backup/before-round-2`, `backup/before-round-3` |
| Live site today | **Framer** still serves peterhua.fyi. The GitHub version is not live yet (see §4). |
| Model portfolio Peter admires | https://www.dennisquizhpi.com/ and https://www.dennisquizhpi.com/lawnstack |

### Portfolio file structure

| File | What it holds |
|---|---|
| `index.html` | Page shell: rail with logo lockup, nav, rail foot (`#rail-foot`, filled by JS), theme toggle; font preloads; favicons |
| `shared/core.js` | Content: `DATA` (research, design, `work`, `field`, photos), `CONTACT`, `RESUME`, `PROFILE`; case renderer `caseHTML`; `ctxHTML` (context line); profile markup; lightbox; fog background |
| `shared/core.css` | Base system: self-hosted `@font-face`, tokens, buttons, case-study blocks, profile styles |
| `site/app.js` | Router, pages (home, research, design, profile, contact, resume), `ctaPair`, `ARR` arrow box, animated logo (`PAIRS`), typed intro, `FEATURED`, optional story |
| `site/app.css` | Site layout, rail, logo, home hero, featured work, context line, arrows, profile, contact, themes |
| `media/` | `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `fonts/` (Darker Grotesque 300/500/600, Albert Sans 400/500, OFL), photos, `paper-feature.webp`, `paper-cover.webp`, `paper-technology-social-contexts.pdf`, `resume-human-factors.pdf`, `wayfarer/*.webp`, `glenergy/*.webp` (incl. `feature.webp`), `track-01..03.mp3` (placeholders, hidden) |

How to edit the artifact: `read` the artifact URL first, then `read` each file you'll change. Publish only changed files, with `root` set to a local folder that mirrors the structure. Keep GitHub `main` and the artifact in sync.

---

## 2. Brand (locked)

**Positioning**
- Primary reader now: UX research lead. Later: human factors roles.
- Portfolio is focused on getting **research positions**.
- Three words: **curious, open, competent**.
- Against: assumptions, status-quo takes, flowery visuals.
- Admired brands: Kurzgesagt (clarity, consistent world), Subway Takes (personality, one repeatable format), Obama (calm, earned trust).
- **Do not use** the line "I check the context before I apply the rule." It must not appear anywhere on the site or in its share text.

### Logo: "p over h"
Lowercase p above lowercase h, stems on one vertical line, flat horizontal bar between them.
- Double meaning: Peter / Huang and psychology / human factors.
- The bar reads as "over". It replaced a slash (a slash reads as "or").

**Construction rules**
- The bar spans **exactly** the outer edges of the p and h. Never wider.
- The bar sits **equidistant** between the p's descender and the h's ascender.
- The bar appears **only in the logo**. Never in headlines, labels, nav, buttons, dividers or callouts.
- Do not extend the bar, move it off centre, or tilt it into a slash.

**Rail mark and favicon (updated 24 Oct): same glyphs as the animated logo**
- Both are built from the Darker Grotesque **500** outlines of p and h, with the animation's em geometry: viewBox `42 555 402 1328`, bar `x=42 y=1200 w=402 h=50`.
- Rail mark: 19.4 × 64 px (phones 12.1 × 40), letters `var(--ink)`, bar `var(--bar)`.
- Favicon: 64×64 ink tile `#15181A`, glyphs mist `#FCFCFA`, bar light earth `#C9A57E`. PNG 32 px and Apple touch icon 180 px rendered from it. Links carry `?v=19` to bust caches.
- The old stroked SVG mark (`M14 8V51…`) and the weight-600 favicon are retired.

**Colour (current site)**
| Role | Land (bright) | Sea (dark) |
|---|---|---|
| Ground | mist `#FCFCFA` | `#0D3640` |
| Letters | ink `#15181A` | `#F5FCFA` |
| Bar | earth `#7A5636` | aqua `#9FE0D2` |

Open question: earlier notes said the Sea bar is light earth `#C9A57E`, but the site uses `#9FE0D2`. The palette exploration (§5) is where this gets decided.

**Lockup in the rail (every page)**
- Mark, 1 px divider, "Peter Huang" (Darker Grotesque 600, 24 px), "UX RESEARCH / HUMAN FACTORS" (**12 px** caps, was 11).
- On phones: smaller mark plus the name only.

### Animated main logo (Profile page, top)
- p and h stay fixed; the rest of each word rolls.
- Pairs, in order: **peter / huang → psychology / human factors → presence / humility**, then loop. **The only allowed pairs.** (presence replaced patience on 24 Oct.)
- Lowercase. 2.8 s per pair, 0.8 s transition. Pause button (WCAG 2.2.2). Reduced motion = still. Screen readers get one label (built from `PAIRS`).
- Size `font-size:min(140px,17cqi)` so "human factors" never wraps. Any new h-word must be no wider than "human factors".
- Geometry (em, Darker Grotesque 500): line-height 1.16; bar margin `.04em 0 .051em .042em`; bar `.402em` × `.05em`; h line `.78em` with `margin-top:-.38em`.
- Placement: snug at the top of Profile, aligned to the portrait and text. **Only Pause sits under it**; the mission button moved (see Profile).
- Edit pairs in `PAIRS` in `site/app.js`, words without their first letter.

**Type and system**
- Darker Grotesque (display, 300/500/600) and Albert Sans (body), **self-hosted** from `media/fonts/` and preloaded.
- Square corners everywhere.
- Palette tokens: fog `#DADDD7`, mist `#FCFCFA`, ink `#15181A`, graphite `#585E62`, lichen `#5F6E2E`, earth `#7A5636`. Sea: `#0D3640`, `#9FE0D2`.
- Two themes, Land and Sea, toggled by the square swatch in the rail. On desktop the swatch has a visible label naming the theme it switches to ("Sea theme" / "Land theme").
- Spacing on a 4 px scale (margins, padding, gaps). Captions and labels 12 px minimum. Curly apostrophes in copy.
- Content column up to 1040 px.

---

## 3. Site: current state (locked)

### The context line (new, 24 Oct)
Every project, job and résumé entry has one **context line** on its own line, directly under the title, before any description. Lowercase, graphite, no letter-spacing, parts separated by " / ".
- **Projects:** `kind of project / field / detail`. Kind is ux research, ux design, or both.
- **Work and research experience:** `kind of work / what the work is for`.
- Data: `ctx:[…]` on each item in `DATA.research`, `DATA.design`, `DATA.work`, `DATA.field` and `RESUME.experience`. Rendered by `ctxHTML` in `shared/core.js`.
- The old uppercase tracked kicker above titles is gone everywhere.

| Item | Context line |
|---|---|
| Technology and well-being | ux research / psychology + technology / research paper, 7 self-run interviews, 2025 |
| Personality, resilience, and life satisfaction | ux research / psychology / research paper, survey of 52 + 1 interview, 2025 |
| Career within spirituality and religion | ux research / psychology + culture / research paper, ethnographic interview + observation, 2025 |
| Wayfarer | ux design + research / social wellness app / design-a-thon winner, 2026 |
| Glenergy | ux design + research / employee benefits portal / dark patterns study, team of 3, 2025 |
| Chorvivo (work) | design + research / a startup building a rehearsal-capture app for choreographers |
| Designity (work) | ui/ux design + user research / a "creativity as a service" agency, remote |
| DOROT | behavioral data research / social programs for older adults, new york city |
| Nordoff-Robbins | clinical observational research / music therapy for mental health, new york city |
| NOVA Kitchen and Bar (résumé only) | operations / a restaurant in orange, california |

The "field" parts (psychology + technology, social wellness app, employee benefits portal, etc.) were written from the project content. Peter should confirm them.

### Shared controls
- **Résumé + Email**: one button pair (`ctaPair`), same labels and style everywhere: rail foot (desktop), under the intro (phones), Contact. Labels are exactly "Résumé" and "Email".
  - Résumé → in-site `#resume` page (Download PDF, Open PDF, Email, then the résumé as text).
  - Email → opens the mail app **and** copies the address. Toast: "Opening your mail app. Address copied: …".
- **"Open" affordance**: one 44 px square arrow box (`ARR`). Always top right of the title row. Hover fills the box ink. Used on Home featured, Research list, Design list.
- Project layout everywhere: **title + arrow box → context line → one line of description → image (if any)**.
- Back link on case pages: "← Design" / "← Research", small caps text, no box.
- Case images open in a lightbox (Enter opens, arrows move, Escape closes and returns focus).
- Callouts (pivot, pull quote) use rules above and below, not a left border.
- Theme switch: all colours change in the same frame, and the background redraws on every switch.

### Home (opens every visit; no intro)
1. **Hero:** greeting "Hello! I'm Peter Huang." left, two-line intro that types in about 1 s (`TYPE_MS`, no blinking caret), smiling photo right (`me-smile.jpg`). **Nothing else in the hero.**
2. **Featured work**, in this order (edit `FEATURED` in `site/app.js`; context comes from the project's `ctx`):
   1. **Technology and well-being: an independent interview study**. Image: `paper-feature.webp` (crop of the paper's title page).
   2. **Wayfarer**. Image: `wayfarer/hero.webp`, uncropped.
   3. **Glenergy**. Image: `glenergy/feature.webp` (crop of the high-fidelity Give Back screen).
3. Links: "All research" and "All design".
- **Chorvivo is not a project.** Peter can't talk about it. It appears only under Work on Profile and on the résumé, with no link and no case page.

### Research (three papers)
| Project | Status |
|---|---|
| **Technology and well-being: an independent interview study** (was "Technology mediating connection") | Done. Self-directed, 7 semi-structured interviews Peter ran and coded. Full paper PDF hosted. |
| **Personality, resilience, and life satisfaction** (RM2, Aug 2025) | Done, from Peter's paper. Measures table, process, neuroticism finding, three interview themes, limitations, next steps. **Resilience results are deliberately left out** (see §4). |
| **Career within spirituality and religion** (Cultures of Psychology, Apr 2025) | Done, from Peter's paper. One participant ("TP"), interview + workplace observation, three themes, reflexivity, limitations. TP's comments on drug use are left out. The reflexivity section names Peter's religious upbringing; Peter can remove it. |
- Removed: "Student Outcomes amidst AI" and "Ethnographic Study on Pilipino Culture" placeholders.
- Not added: Seminar I Ayurveda paper (literature review, no primary data, co-authored). Better on the résumé.

### Design
Wayfarer and Glenergy (both done, Peter's text and images).

### Profile (first half = work, second half = the person)
- No visible "Profile" heading (screen-reader only).
- Animated logo (snug), Pause under it.
- Portrait and about (Peter's words).
- **Work**: Chorvivo (**Now**, Head of design, Sep 2026 – present, no link), then Designity (UI/UX intern, Jun 15 – Sep 15, 2026 · 3 months). Each entry: name + dates → role → context line → sections.
- **Research experience**, newest first: DOROT, then Nordoff-Robbins. Same layout.
- **Skills**.
- **"Beyond work"** heading, then:
  - **What guides me?** Peter's exact words in five short parts separated by rules. No numbers. Substack button, then **"Read my mission"** as the last thing in the section.
  - Photos of Peter (3).
  - **Outside of work**: Jazz Piano, Videogame Music Production, Climbing, Weightlifting, Meditating, Photography. Titles only.
  - My music: hidden (`SHOW_MUSIC=false`) until real tracks or links.
  - **Photography**: the three real photos only.

### Résumé page (matches Profile)
- Same organisations, roles, dates and context lines as Profile; entries read name + dates → role → context → bullets.
- Order: Chorvivo, Designity, DOROT, Nordoff-Robbins, NOVA Kitchen and Bar.
- Roles in sentence case. Skills: Research methods, UX design (Figma, Adobe Illustrator, InDesign, Photoshop), UX research (SPSS, Excel, R, Salesforce, qual + quant).
- **The PDF is still the old one** (see §4).

### Contact
- Heading "Seems like you're curious!" with "I'm open to connecting and collaborating on new projects!" under it.
- Email address, button pair + Copy email, LinkedIn, Based in Orange County, California.

### Story / mission
- Reached only from "Read my mission" on Profile. Buttons "Close story" and "Back to profile". Scroll is 100vh per chapter with a progress line at the bottom.

---

## 4. Open items / needed from Peter

- [ ] **Go live from GitHub (leave Framer as the fallback until then):**
  1. Make the repo public, or use GitHub Pro (Pages won't publish from a private repo on a free plan).
  2. Settings → Pages → Deploy from branch `main`, folder `/ (root)`. `CNAME` already says `peterhua.fyi`.
  3. Right before step 4: Framer → Site Settings → Domains → remove peterhua.fyi.
  4. At the registrar: four `A` records for `@` (185.199.108.153, .109.153, .110.153, .111.153) and a `CNAME` for `www` → `peterhuangdesign-rgb.github.io`. Unknown: where the domain was bought; if through Framer, check whether Framer lets you edit DNS.
  5. Tick Enforce HTTPS once the domain check passes.
- [ ] **RM2 scoring check.** The paper reverse-codes Brief Resilience Scale items 1, 3, 5; the scale's reverse-coded items are 2, 4, 6. That likely flips resilience and explains the unexpected negative correlation with life satisfaction. The paper also claims mediation although the Sobel test was not significant. Re-run with corrected coding if the data still exists; until then the site shows only the neuroticism result.
- [ ] **Confirm the context lines**, especially the "field" parts, and the new paper title.
- [ ] **Theme switching**: Peter saw visibility problems; not reproduced in Chromium. If it still happens, note the page and browser (Safari untested).
- [ ] **Résumé PDF is out of date**: still says ph2344@nyu.edu, "Expected May 2026", Designity "Aug – Sep 2026", and has no Chorvivo. The in-site résumé is correct.
- [ ] **Palette decision** (§5). Choose one, then apply it in one pass.
- [ ] **Designity**: 2–3 specific projects and one concrete result.
- [ ] **Links to check by hand**: YouTube demo, both Figma decks ("anyone with the link"), LinkedIn, Substack.
- [ ] **Conflicts flagged, Peter's text kept:**
  - Wayfarer: "two-day sprint" vs event banner "April 17–19, three-day". Devpost confirms solo build, 1st place; "solo" isn't in Peter's text.
  - Paper: ages 20–23 in Peter's text vs Table 1's 19–24 (page uses 19–24). Page date Oct 2025; paper dated Dec 16, 2025.
  - Glenergy: 4 weeks vs "two-week sprint"; slide also lists Adobe InDesign.
- [ ] **Music**: SoundCloud or Bandcamp links.
- [ ] **Repo `CLAUDE.md`** still describes an older version (signature logo, first-visit intro). Rewrite it from this file.
- [ ] Optional: a figure from the paper (e.g. Table 1) to replace the title-page image on Home.

---

## 5. Palette exploration (canvas page "Palettes · bright + dark")

Mockups only; nothing applied to the site. Each board shows the home screen in a bright and a dark theme with WCAG contrast for body text, muted text, links (4.5:1) and the logo bar (3:1). Where a palette couldn't pass on its own, the colour was nudged toward black or white, and the board says so.

| Palette | Colours | Ground contrast | Notes |
|---|---|---|---|
| Current · Land / Sea | `#FCFCFA` / `#0D3640` | 12.6:1 | All roles pass; bar changes hue between themes (brown → aqua). |
| A · Harbor | 001524 15616D FFECD1 FF7D00 78290F | 16.0:1 | Clearest split; bar stays warm (rust → orange). Strongest as given. |
| B · Coast | 022B3A 1F7A8C BFDBF7 E1E5F2 FFFFFF | 14.9:1 | Safest, least personality. |
| C · Clay | 283D3B 197278 EDDDD4 C44536 772E25 | 8.7:1 | Themes too alike; red lightened to pass on dark. |
| D · Seafoam | 006D77 83C5BE EDF6F9 FFDDD2 E29578 | 14.1:1 | Dark ground derived (no dark colour in the palette). |
| E · Sage | 6B9080 A4C3B2 CCE3DE EAF4F4 F6FFF8 | 15.4:1 | Ink, muted and dark ground all derived; a tint set, not a brand palette. |
| F · Peter's pick | 2A3D45 6E0D25 895B1E A3C4BC 94A187 | 10.0:1 | Distinctive; light ground derived; choose one bar colour for both themes. |

Brand principle agreed: two themes that are distinctly bright and dark, one bar colour family in both, one accent.

---

## 6. Tried and rejected (don't redo)

- Logo rounds 1–3: fused ph (reads as þ), pH with a scale, one line, seal, "peterhua." wordmark, "peterhua" custom wordmarks, brackets, "ph?", closure, sentence, domain tag, slider H. "Hua" is a different surname; use "Peter Huang". peterhua.fyi is the URL only.
- The slash version (p/h). Replaced by the horizontal bar.
- The bar as a site-wide device. Reverted; logo only.
- Ink line-drawing headshot.
- Featured projects as a 3-card row.
- Pairs "paddleboarder / hiker" and "patience / humility". Unused: pianist / hobbyist, philosopher / humanist, piano / harmony, perception / heuristics.
- First-visit intro. Removed for recruiter speed.
- The line "I check the context before I apply the rule."
- Inline "→" after titles and "Open case" text buttons. Replaced by the square arrow box.
- Full-screen logo hero on Profile. Replaced by the snug logo.
- Numbers 01–05 on "What guides me?".
- Empty striped image placeholders.
- Uppercase tracked kicker above project titles, and the same label squeezed into the start of the description. Replaced by the context line.
- Chorvivo as a featured project or case page.
- "Mission" button under the logo. Replaced by "Read my mission" at the end of What guides me?.
- Blinking caret on the typed intro.
- Left-border callouts.
