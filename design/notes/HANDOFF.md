# peterhua.fyi — portfolio and personal brand handoff

Context for a new chat. Status as of 25 Oct 2026 (portfolio artifact version 25, GitHub `main`, round 5). Round 6 is on branch `round-6`, not pushed yet. Peter asks to review before changes are pushed; wait for his go-ahead.
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
| Logo and brand canvas (Design artifact) | https://claude.ai/artifact/F2jJWEpkSJRC1GDA1opfM9 (pages: Logo rounds, Applications incl. **LinkedIn banner**, Round 5, **Palettes · bright + dark**) |
| Code | github.com/peterhuangdesign-rgb/peterhua.fyi-portfolio, branch `main` (private repo) |
| Backups | branches `backup/before-fixes`, `backup/before-round-2`, `backup/before-round-3`, `backup/before-round-4`, `backup/before-round-5`, `backup/before-round-6` |
| Live site today | Moving from **Framer** to GitHub Pages. Domain is on **Namecheap**; DNS change in progress (see §4). |
| Model portfolio Peter admires | https://www.dennisquizhpi.com/ and https://www.dennisquizhpi.com/lawnstack |

### Portfolio file structure

| File | What it holds |
|---|---|
| `index.html` | Page shell: rail with logo lockup, nav, rail foot (`#rail-foot`, filled by JS), theme toggle; font preloads; favicons |
| `shared/core.js` | Content: `DATA` (research, design, `work`, `field`, photos), `CONTACT`, `RESUME`, `PROFILE`; case renderer `caseHTML`; `ctxHTML` (context line); profile markup; lightbox; fog background |
| `shared/core.css` | Base system: self-hosted `@font-face`, tokens, buttons, case-study blocks, profile styles |
| `site/app.js` | Router, pages (home, research, design, profile, contact, resume), `ctaPair`, `ARR` arrow box, animated logo (`PAIRS`), typed intro, `FEATURED`, optional story |
| `site/app.css` | Site layout, rail, logo, home hero, featured work, context line, arrows, profile, contact, themes |
| `media/` | `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `fonts/` (Darker Grotesque 300/500/600, Albert Sans 400/500, OFL), photos, `paper-codebook.webp` (Home), `paper-feature.webp` and `paper-cover.webp` (unused on Home), `paper-technology-social-contexts.pdf`, `resume-human-factors.pdf` (rebuilt 24 Oct from `RESUME`), `wayfarer/*.webp`, `glenergy/*.webp` (incl. `feature.webp`), `track-01..03.mp3` (placeholders, hidden) |

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
- Pairs, in order: **peter / huang → psychology / human factors → prototype / hypothesis → product / heuristics**, then loop. **The only allowed pairs.** (25 Oct: presence / humility removed as corny.)
- **All rolling words use weight 500**, the same as the fixed p and h, so no pair changes weight mid-loop (the light 300 traits are retired).
- The loop is seamless: the roll lists end with a copy of the first pair (`LOOP` in `site/app.js`), so it always rolls forward and snaps back to the real first pair with no motion.
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

### The context line (24 Oct)
Every project, job and résumé entry has one **context line** on its own line, directly under the title, before any description. Lowercase, graphite, no letter-spacing, parts separated by " / ".
- **Projects:** `project type / format`. Type is ux research or ux design. Format is research paper, school project, work, or the competition. **No dates, no field.**
- **Work and research experience:** `kind of work / what the work is for`.
- Data: `ctx:[…]` on each item in `DATA.research`, `DATA.design` and `RESUME.experience`. Rendered by `ctxHTML` in `shared/core.js`.
- The old uppercase tracked kicker above titles is gone everywhere.

| Item | Context line |
|---|---|
| Technology and well-being | ux research / research paper |
| Personality, resilience, and life satisfaction | ux research / research paper |
| Career within spirituality and religion | ux research / research paper |
| Wayfarer | ux design / design-a-thon, 1st place |
| Glenergy | ux design / school project (Peter to confirm "school project") |
| Chorvivo (work) | design + research / a startup building a rehearsal-capture app for choreographers |
| Designity (work) | ui/ux design + user research / a "creativity as a service" agency, remote |
| DOROT | behavioral data research / social programs for older adults, new york city |
| Nordoff-Robbins | clinical observational research / music therapy for mental health, new york city |
| NOVA Kitchen and Bar (résumé only) | operations / a restaurant in orange, california |

Work context lines were written from Peter's descriptions; he should confirm them.

### Shared controls
- **Résumé + Email**: one button pair (`ctaPair`), same labels and style everywhere: rail foot (desktop), under the intro (phones), Contact. Labels are exactly "Résumé" and "Email".
  - Résumé → in-site `#resume` page (Download PDF, Open PDF, Email, then the résumé as text).
  - Email → opens the mail app **and** copies the address. Toast: "Opening your mail app. Address copied: …".
- **"Open" affordance**: one 44 px square arrow box (`ARR`). Always top right of the title row. Hover fills the box ink. Used on Home featured, Research list, Design list.
- **Home:** title + arrow box → context line → picture. Nothing else. Complexity lives one click in.
- **Research and Design lists:** title + arrow box → context line → one line of description → image (if any).
- **Case pages:** title → context line → **Key finding** (Peter's words, one sentence, `finding` in `DATA`) → description → the rest.
- Back link on case pages: "← Design" / "← Research", small caps text, no box.
- Case images open in a lightbox (Enter opens, arrows move, Escape closes and returns focus).
- Callouts (pivot, pull quote) use rules above and below, not a left border.
- Theme switch: all colours change in the same frame, and the background redraws on every switch.

### Home (opens every visit; no intro)
1. **Hero:** greeting "Hello! I'm Peter Huang." left, two-line intro that types in about 1 s (`TYPE_MS`, no blinking caret), smiling photo right (`me-smile.jpg`). Intro (25 Oct): "I'm a UX researcher and NYU psychology graduate with a background in digital media and design. I'm curious about how we design safer systems and more effective experiences." After the intro types in, a 2 px violet underline draws quickly under **NYU** (0.35 s) and stays; Land `#57068C`, Sea `#D4B8F2`; reduced motion shows it drawn. Box, fill and badge versions were tried and dropped as too much. Under the intro, a **fact row** (25 Oct; NYU direction 5): Education — NYU, B.S. Applied Psychology · Now — Head of design at Chorvivo · Next — Working toward human factors. Three columns between rules when the text column is at least 600 px wide, otherwise one fact per line. Replaced the "Currently working at Chorvivo." line. "Head of design" matches Profile and the résumé; recruiters skim titles first, so the real title is used. **Nothing else in the hero.**
2. **Featured work**, in this order (edit `FEATURED` in `site/app.js`; context comes from the project's `ctx`):
   1. **Technology and well-being: an independent interview study**. Image: `paper-codebook.webp` (top of the Appendix B codebook).
   2. **Wayfarer**. Image: `wayfarer/hero.webp`, uncropped.
   3. **Glenergy**. Image: `glenergy/feature.webp` (crop of the high-fidelity Give Back screen).
   All three pictures share one frame, Wayfarer's own ratio (1414:920), cropped from the top.
3. Links: "All research" and "All design".
- **Chorvivo is not a project.** Peter can't talk about it. It appears only in the Home fact row, under Work on Profile and on the résumé, with no link and no case page.

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
- **Work**: Chorvivo (**Now**, Head of design, Sep 2026 – present, no link), then Designity (UI/UX intern, Jun 15 – Sep 15, 2026 · 3 months).
- **Research experience**, newest first: DOROT, then Nordoff-Robbins.
- **Skills**.
- **One source (25 Oct):** Work, Research experience and Skills are rendered from `RESUME` (`experience` with `group: work | research | other`, and `skills`) by the same `xpHTML` used on the résumé page. Each entry: organisation + dates → role → context line → confidential note (if any) → bullets. `DATA.work`, `DATA.field` and `PROFILE.skills` were removed so Profile and résumé can't drift apart.
- **Chorvivo confidential indicator:** a small lock glyph, **Confidential**, then "Work in progress, so it isn't shown in this portfolio. I'm happy to talk about my role." Shown on Profile and the résumé page (`note` on the Chorvivo entry).
- **"Beyond work"** heading, then:
  - **What guides me?** Peter's exact words in five short parts separated by rules. No numbers. Substack button, then **"Read my mission"** as the last thing in the section.
  - Photos of Peter (3): `me-03.jpg` (outside Kkanbu Chicken, thumbs up, cropped to include the framed photo of the Jensen Huang table; replaced the duplicate of the top portrait on 25 Oct), `me-01.jpg` (with his cat), `me-02.jpg` (hillside).
  - **Outside of work**: Jazz Piano, Videogame Music Production, Climbing, Weightlifting, Meditating, Photography. Titles only.
  - My music: hidden (`SHOW_MUSIC=false`) until real tracks or links.
  - **Photography**: the three real photos only.

### Résumé page (matches Profile)
- Same data and renderer as Profile (`xpHTML`), so organisations, roles, dates, context lines, notes and bullets always match. Reached from the rail, Home on phones, Profile and Contact.
- Order: Chorvivo, Designity, DOROT, Nordoff-Robbins, NOVA Kitchen and Bar (NOVA is `group: other`, résumé only).
- Roles in sentence case. Bullets are the full ones from Peter's human factors résumé, in past tense. A Research section lists the three papers. Skills: Research methods, UX design (Figma, Adobe Illustrator, InDesign, Photoshop), UX research (SPSS, Excel, R, Salesforce, qual + quant).
- **PDF rebuilt 24 Oct** from the same `RESUME` data: one page, real text, brand fonts, contact line "Orange County, CA · (949) 933-0073 · peterhuangdesign@gmail.com · peterhua.fyi · linkedin.com/in/peterhuaux". GPA left off (versions disagree: 3.57 / 3.54 / 3.56).

### LinkedIn banner (24 Oct)
- 1584 × 396, exported at 2× (3168 × 792), Land and Sea versions. On the brand canvas, Applications page.
- Rail lockup (mark, Peter Huang, UX RESEARCH / HUMAN FACTORS), the line "Curious about how we design safer systems and more effective experiences.", and peterhua.fyi.
- Text sits right of centre, outside the desktop profile-photo zone and inside the phone-visible area. Faint contour lines fade out behind the text.

### Contact
- Heading "Seems like you're curious!" with "I'm open to connecting and collaborating on new projects!" under it.
- Email address, button pair + Copy email, LinkedIn, Based in Orange County, California.

### Story / mission (rewritten 25 Oct)
- Reached only from "Read my mission" on Profile. Buttons "Close story" and "Back to profile". Progress line at the bottom.
- **How it moves (round 6, scrollytelling best practice):** one 100vh step per chapter over a fixed stage. Native scroll with CSS `scroll-snap-type: y mandatory`, so every scroll stops on a chapter; wheel, touch, keyboard and scrollbar work normally (no scroll-jacking). The active chapter is read once per frame (passive listener + `requestAnimationFrame`). On a change, the sentence fades out (180 ms), then sentence and drawing swap in the same frame and the new part draws over 1.1 s, interruptible. Reduced motion: the finished frame appears at once. The app tiles code is gone.
- Nine chapters, one sentence each:
  1. "Technology can bring us closer, or distance us from each other." Sentence alone (the app-tile animation is removed).
  2. "How we use this power depends upon how we research, develop, and apply it in society." Research ↔ Theory ↔ Practice line drawing (kept).
  3–8. **Experience timeline**: a vertical line with square nodes that grows one step per chapter; earlier steps stay drawn. Nodes: Psychology → Observation → Behavioral data → Usability testing → Design + research → Human factors.
     - "I studied applied psychology at NYU, fascinated by how people think."
     - "At Nordoff-Robbins, I coded about 130 music therapy sessions and learned to observe behavior closely."
     - "At DOROT, I analyzed data from 400+ older adults to find the usability and accessibility barriers in their programs."
     - "At Designity, I ran usability tests and turned what users showed me into design recommendations."
     - "Now, at Chorvivo, I lead design and research, from discovery interviews to user flows."
     - "Safety-critical domains and human error have interested me since graduation, after realizing how AI infrastructure and its consequences have impacted fields such as healthcare, finance, and social well-being." (Peter's words; "infastructure" typo fixed.)
  9. "I believe that through quality, focused research, we can steer technology towards a better world for our friends, family, and future." Sentence alone.
- Chapters 3–7 were written from Peter's résumé facts; Peter should confirm the wording.
- Timeline data: `TL` and `tlStep()` in `site/app.js`. `keep` = earlier paths shown at once, `hold` = not erased.

---

## 4. Open items / needed from Peter

### Go live (in progress, 24 Oct)
- [ ] Repo public or GitHub Pro; Settings → Pages → deploy from `main`, `/ (root)`. `CNAME` says `peterhua.fyi`.
- [ ] Namecheap → Domain List → Manage → Nameservers "Namecheap BasicDNS" → Advanced DNS: delete Framer's records and any URL redirect; add four `A` records for `@` (185.199.108.153, .109.153, .110.153, .111.153) and a `CNAME` for `www` → `peterhuangdesign-rgb.github.io`. **Waiting on DNS.**
- [ ] Framer → Site Settings → Domains → remove peterhua.fyi.
- [ ] Tick Enforce HTTPS once the Pages domain check passes.
- [ ] After it's live: open peterhua.fyi on phone and desktop, check favicon, Résumé download, Email button, theme switch.

### Hiring-team review: to change (24 Oct)
Ranked by how much a research hiring team would weigh it.
- [ ] **1. Professional research on the page.** All three research pieces are coursework; Designity and DOROT have no case and no result. Write one short case (DOROT or Designity): question, method, finding, what changed. Needs Peter's facts.
- [ ] **2. Show impact, not only findings.** Each case should end with what changed or was decided because of the research. Current endings are possible directions.
- [ ] **3. RM2 scoring.** The paper reverse-codes Brief Resilience Scale items 1, 3, 5; the scale's reverse-coded items are 2, 4, 6. That likely flips resilience and explains the unexpected negative correlation with life satisfaction. The paper also claims mediation although the Sobel test was not significant. Re-run with corrected coding if the data exists; until then the site shows only the neuroticism result.
- [ ] **4. Human factors evidence.** No task metrics, error analysis or safety framing yet. Add one usability study with task success and time on task, or reframe an existing project with those measures if the data exists.
- [ ] **5. Research artifacts.** Add the interview guide (paper's Appendix A) to the Technology and well-being case. Consider an affinity or coding snapshot for the ethnography.
- [ ] **6. Home picture for the paper.** The codebook reads as real research but is still text-heavy at a glance; replace with a cleaner figure if one exists.
- [ ] **7. Stat triplets** (three boxed numbers on case pages) read as a template pattern. Keep only where the numbers are the finding.
- [ ] **8. Case length.** Case pages are long; the Key finding now leads, but sections could be trimmed once impact is added.

### Content and decisions needed from Peter
- [ ] **Review round 6** (branch `round-6`): Profile button pair removed, story stepping, logo weight, new photo crop, NYU underline, heading order and home-link name fixes (axe scan clean, 8 screen sizes clean).
- [ ] **Confirm** the mission timeline sentences (chapters 3–7) and the Chorvivo confidential note wording.
- [ ] **Confirm** the paper title, "school project" for Glenergy, the Key finding sentences, and the work context lines.
- [ ] **GPA** on the PDF: which number, or leave off.
- [ ] **Theme switching**: Peter saw visibility problems; not reproduced in Chromium. If it still happens, note the page and browser (Safari untested).
- [ ] **Palette decision** (§5). Choose one, then apply it in one pass.
- [ ] **Designity**: 2–3 specific projects and one concrete result (feeds review item 1).
- [ ] **Links to check by hand**: YouTube demo, both Figma decks ("anyone with the link"), LinkedIn, Substack.
- [ ] **Conflicts flagged, Peter's text kept:**
  - Wayfarer: "two-day sprint" vs event banner "April 17–19, three-day". Devpost confirms solo build, 1st place; "solo" isn't in Peter's text.
  - Paper: ages 20–23 in Peter's text vs Table 1's 19–24 (page uses 19–24). Page date Oct 2025; paper dated Dec 16, 2025.
  - Glenergy: 4 weeks vs "two-week sprint"; slide also lists Adobe InDesign.
  - Designity title: old PDF said "UX Intern, NYC"; site and new PDF say "UI/UX intern, remote".
- [ ] **Music**: SoundCloud or Bandcamp links.
- [ ] **Repo `CLAUDE.md`** still describes an older version (signature logo, first-visit intro). Rewrite it from this file.

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
- Pairs "paddleboarder / hiker", "patience / humility" and "presence / humility" (corny). Unused: pianist / hobbyist, philosopher / humanist, piano / harmony, perception / heuristics.
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
- Résumé + Email pair under Profile's work section.
- Light (300) weight for the rolling traits in the logo.
- Scroll-scrubbed story drawing (text lagged the drawing).
- Description lines and dates on Home featured projects. Home shows title, type / format and picture only.
- Field and date parts in project context lines.
- Paper title page as the Home picture.
- App-tile animation on the first mission chapter.
- Separate Profile copies of work data (`DATA.work`, `DATA.field`, `PROFILE.skills`) and the dl "What I do / Setting / Outcome" layout. Replaced by the shared résumé entries.
