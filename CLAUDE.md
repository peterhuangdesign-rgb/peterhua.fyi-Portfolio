# Portfolio Lab — Peter Huang

UX research + design portfolio for peterhua.fyi. The live site is the repo root (served by GitHub Pages); design explorations and notes live in `design/`. Read this whole file before touching a page.

## Who it's for

- **Owner:** Peter Huang. B.S. Applied Psychology (NYU, 2026), minors in Philosophy and Integrated Design & Media.
- **Positioning:** researcher first, designer second. Targets: human factors engineer roles and UX research master's programs; UX research jobs.
- **Contact:** peterhuangdesign@gmail.com · linkedin.com/in/peterhuaux · Orange County, California.
- **Résumés:** three versions (human factors PDF, NY PDF, Pages with HereNow). The site uses the human factors one (`media/resume-human-factors.pdf`). GPA differs across versions (3.57 / 3.54 / 3.56), so the site leaves it out. The PDF still shows the NYU email and Irvine.
- **Reader:** a hiring researcher or design lead with ~90 seconds. They need to find: what Peter studies, how he studies it, one proof of outcome. Everything else is optional depth.

## Content (source of truth lives in the Portfolio Master File doc — sync from there, never invent)

| Project | One line | Proof |
|---|---|---|
| Chorvivo | Design · startup | Head of design |
| Wayfarer | Design · design-a-thon win | 1st place, CUXD Design-a-thon 2026 (Cornell) |
| Glenergy | Design · school project, collaboration | — |
| Technology, Social Connection, and Life Satisfaction | Research · qualitative | — |
| Student Outcomes amidst AI | Research · mixed methods | — |
| Ethnographic Study on Pilipino Culture | Research · qualitative | — |
| Outside of work | Profile: music (mp3), photography, photos of Peter | separate from work |
| Contact | Email, LinkedIn, résumé, location | — |

Never fabricate participant or judge quotes. Leave `[quote]` slots for Peter to fill.

## Hard rules (every direction)

1. **Text is minimal.** One title, at most one line under it. No kicker/eyebrow above a title *and* subtitle below it. No welcome copy, no instructions longer than three words.
2. **Square corners.** `border-radius: 0` on buttons, inputs, media, panels. No pill buttons.
3. **All sans-serif.** Banned as display: Inter, Roboto, Arial, Helvetica, Open Sans, Lato, Space Grotesk, Clash Display, Raleway, system-ui.
4. **No AI tropes:** purple/blue gradients, 3-up icon feature grids, centered everything, glass panels, glow-on-black, emoji, stat triplets, "Get started / Learn more", marketing verbs ("unlock", "elevate", "seamless").
5. **Motion has a job.** One authored motion idea per direction, driven by the GPU (WebGL fragment shaders or three.js). `transform`/`opacity` only for DOM. Every effect has a `prefers-reduced-motion` still frame. Cap DPR at 1.5; pause rendering when the tab is hidden.
6. **Complete at rest.** The first still frame shows name, role, and the project list. Animation enhances; it never gates reading.
7. **Keyboard + touch parity.** Every hover interaction has a click/tap and Enter equivalent. Focus rings visible. Targets ≥ 44px.
8. **Contrast AA** for all readable text, including text over shaders (shader luminance is clamped behind text).

## The site

- **First visit vs returning:** a visitor with no history lands on `#story`: three chapters, one sentence each (copy in `STORY` in `site/app.js`). 1) "Technology can bring us closer, or distance us from each other." Generic app tiles (chat, photo, assistant, team chat, video, mail, heart; no brand logos) pop in one by one, stacked, then drift apart. 2) "How we use this power depends upon how we research, develop, and apply it in society." Research ↔ Theory ↔ Practice drawn as a line diagram (redrawn, not the published figure). 3) "I believe that through quality, focused research, we can steer technology towards a better world for our friends, family, and future." Sentence alone, centred column, for now; its illustration is a separate exploration (abstract options to iterate on). "Enter portfolio" or "Skip intro" sets `ph-visited` and goes to `#home`. Returning visitors and the bare URL go straight to `#home`. "Replay intro" in the rail. Production mapping: peterhua.fyi → story for first-timers, peterhua.fyi/home → main page.
- **Four buttons, research first:** Research · Design · Profile · Contact (no counts). Rail on desktop; bottom bar on phones. Peter's handwritten signature (`media/signature.png`, transparent, used as a CSS mask so it takes the theme's ink colour) sits top-left and returns Home. Rail foot: email, then Résumé (PDF), then Replay intro.
- **Home:** a place for projects and case studies only. "Hello! I'm Peter Huang." then "I'm a UX researcher with a background in psychology, digital media, and design. I'm curious about how we design safer systems and more pleasurable experiences.", credential line (NYU graduate · B.S. Applied Psychology · Minor in Integrated Design and Media), then the case-study index (three papers, three design projects). No text under any other page title.
- **Research:** the three papers only (lorem until the Master File text arrives). Nordoff-Robbins and DOROT moved to Profile → Research experience.
- **Profile:** researcher first, personal last. Portrait + About me → Skills → Research experience (Nordoff-Robbins, DOROT: setting, what I did, outcome) → What is my why? (Peter's why text with the NYU passage and quote folded in after the NYU paragraph; Substack link at its end) → photos of Peter (no heading; `DATA.mePhotos`) → Outside of work → My music → Photography. No Teal section. The résumé lives in the rail and on Contact.
- **Background:** every page starts on plain page colour and the pattern eases in. Strength by page: story strongest, home light, section pages lighter, project/profile/contact pages almost plain with the lens subdued.
- **Themes (one toggle in the rail; it shows the split swatch of the theme it switches to; saved per visitor):** **Land** (fog + altitude contours, earth-brown index lines) and **Sea** (lighter underwater teal; muted at rest like Land, so caustic webs, light shafts and bokeh surface mainly inside the cursor lens; shader luminance clamped so light text stays AA). Both share the cursor lens: rest the pointer and the surface clears to reveal contour lines (altitude on Land, depth on Sea). Sky was removed; saved light/dark/fx/sky map to land/sea. Colour check (Oct 2026): all body text ≥ 4.5:1 in both, Sea text over the brightest shader 5.2:1 (ink) / 4.6:1 (graphite); themes are clearly distinct (ΔE_OK 45–78 between counterpart tokens) but related: Land ink and Sea ground share a blue undertone (hue 237° / 217°), Land moss → Sea teal accents are analogous (121° → 180°), earth brown vs aqua is near-complementary (137° apart).
- **Code:** content and résumé in `shared/core.js` (`DATA`, `RESUME`, `CONTACT`, `THEMES`, shader), router + story in `site/app.js`, styles in `site/app.css`.

## Motion concepts (awaiting a pick)

`design/concepts.html` — seven low-fidelity, working wireframes. One will be added to the site.

| # | Concept | Interaction | Library to build with |
|---|---|---|---|
| 1 | Line puzzle | The Witness rules: start circle, rounded exit, pass every hexagon dot, no self-crossing. Solving powers the next panel and swaps the fog palette. | Canvas + existing shader |
| 2 | Soft town | Figma-generated illustrated town (file: "Portfolio map illustration"). Seven hotspots: garden, pier (seals, pelican), market, schoolhouse, library, piano cottage, lighthouse. View eases toward the hovered place. | Layered PNG + CSS, Rive for animals |
| 3 | Bike ride | Horizontal ride; six stops (stall, finish banner, schoolyard, library, café, post box); wheels turn with distance; settles on stops. | GSAP ScrollTrigger / PixiJS |
| 4 | Story | Six chapters, one sentence each; a line drawing builds with scroll. | SVG stroke + ScrollTrigger / Lottie |
| 5 | Affinity board | Drag sticky notes; three from one study form a labelled cluster that opens the paper. | Pointer events / Matter.js |
| 6 | Darkroom | Agitate the tray to develop a case-study print; fully developed prints are fixed and open. | Fragment shader per cover |
| 7 | Piano roll | Projects as notes; hover plays, Play runs the phrase; silent until Sound on. | Tone.js / Web Audio |

Map image note: the cloud workspace cannot reach figma.com, so the concept uses the 256px preview upscaled. Export the full image from Figma before its asset link expires.

## Research — what makes award-winning portfolios engaging

Sampled 15 from Awwwards (Portfolio Honors, WebGL, SOTD), a 2026 juror's list, and Muzli's 2026 roundup. Insights come from those write-ups plus well-documented sites; not every site was inspected live.

| Site | What earns attention |
|---|---|
| Bruno Simon | Portfolio is a drivable 3D world; navigation *is* play |
| Iventions | Three.js spotlights each project like an installation; GSAP paces reveals as a guided walk |
| By-Kin | Weighted smooth scroll + editorial type; transitions so quiet the page reads as one surface |
| Mat Voyce | Kinetic type tied to scroll, tuned never to block reading |
| Uncommon Studio | Grid breaks on purpose; section transitions behave like camera moves |
| Minh Pham | WebGL frames the work without competing with it |
| Jesper Landberg | WebGL image distortion on hover; work-first, very little copy |
| Léo Parpeix | Tight typographic system, motion only at transitions |
| Gil Huybrecht | Strong single interaction idea carried through every page |
| bleibtgleich | Developer-designer hybrid; code is visibly the craft |
| Maria Vasilyeva | SOTD + Developer Award; craft at both design and build level |
| Samsy Ninja | Computational/generative 3D as identity |
| Alche | Immersive real-time 3D world as the index |
| Cappen | Scroll-driven layered animation over a modular system |
| Twice | Restraint: clean categorized index, video carries the emotion |

**Patterns to steal:**
1. **One idea, executed everywhere.** Winners have a single interaction metaphor, not a pile of effects.
2. **The index is the experience.** Navigation is the memorable part (a world, a network, a river), not a nav bar.
3. **Work first, words last.** Copy is sparse; projects carry the page.
4. **Motion paced to reading.** Reveals are guided, never blocking; reading speed sets the tempo.
5. **Craft is visible in the build.** Smooth 60fps and tuned performance read as competence (especially for a researcher who claims attention to detail).
6. **Researcher twist:** almost none of these show *process*. Peter's edge is showing method and evidence inside the same immersive frame.

## Tooling

- **Design grading:** `.claude/skills/design-grade/` — trimmed from Garry Tan's gstack `design-review` (MIT). Visual design + UX rubric only: 10 weighted categories, A–F per category, AI-slop score, triage → fix → regrade until every page is A. Run it after any visual change.
- **Plugins noted from Reddit threads** (use at discretion, claims unverified):
  - `/frontend-design` — installed here; use for aesthetic direction.
  - Figma MCP — connected, but the account is a view-only seat, so it can't read layer data yet.
  - `/claude-canvas`, `/claude-code-plugins-plus`, 48-style skill files — not installed; only add if a specific gap appears.
  - ACF / Elementor / Semplice / Noxfolio are WordPress tools. Skip unless the site moves to WordPress; current site is Framer, and these prototypes are hand-built HTML/WebGL.
- **Layouts considered:** split pane (fixed profile / scrolling work) informs 02; bento grid rejected (reads as template); terminal rejected (wrong audience for a researcher).

## File map

```
index.html          the website (peterhua.fyi). Hash routes: #story #home #research #design #profile #contact + project ids
home/index.html     redirects /home → /#home (production mapping for the main page)
site/app.js         router, intro story, theme toggle
site/app.css        layout, themes, story, profile styles
shared/core.js      all content (DATA, PROFILE, RESUME, CONTACT), themes, background shader
shared/core.css     base tokens and shared components
media/              signature.png, portrait.jpg, me-0N.jpg, resume PDF (real); photo-0N.jpg + track-0N.mp3 (placeholders)
CNAME  .nojekyll    GitHub Pages custom domain; serve files as-is
design/concepts.html  seven low-fi motion concepts (reference only)
design/archive/     retired directions and branches (may not render; their shared files were replaced)
design/notes/       HANDOFF, first-visitor navigation test, design-grade report
.claude/skills/design-grade/  grading rubric
```

## Working agreement

- Content first, then visuals. Pull copy from the Master File.
- Change one direction per session. Regrade after every change.
- Before shipping: test at 375 / 768 / 1440, reduced motion on, keyboard only.
- Pushing to `main` updates the live site (GitHub Pages). Try bigger changes on a branch first.
