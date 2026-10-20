# Portfolio — handoff for a new chat

Paste this file (and `CLAUDE.md`) into the new chat, or attach `portfolio-lab.zip`. It covers what exists, where it lives, decisions made, and what is still open.

## Who and why
- **Owner:** Peter Huang. NYU 2026, B.S. Applied Psychology, minors in Integrated Design & Media and Philosophy. Based in Orange County, CA.
- **Contact for the site:** peterhuangdesign@gmail.com · linkedin.com/in/peterhuaux · Substack: petersworld.substack.com
- **Goal of the site:** UX research master's applications and jobs; human factors engineer roles. Research comes first, design second.
- **Domain:** peterhua.fyi (currently Framer). Plan: first-time visitors see the intro story at peterhua.fyi; the main site lives at peterhua.fyi/home.

## Where things are
- **Live artifact (private):** "Peter Huang Portfolio" — claude.ai/artifact/83J6u88WPmagR5GSvvcx3S. To keep editing it from another chat, pass that URL to the Artifact tool (read it first, then publish to the same URL).
- **Source:** `portfolio-lab.zip` → `portfolio-lab/`
  - `prototypes/site.html` — the website (hash routes)
  - `prototypes/site/app.js` — router, first-visit story, theme picker
  - `prototypes/site/app.css` — layout, themes, story styles
  - `prototypes/shared/core.js` — all content (`DATA`, `RESUME`, `CONTACT`), theme colours (`THEMES`), background shader
  - `prototypes/shared/core.css` — base tokens and shared components (buttons, case layout, player, lightbox)
  - `prototypes/media/` — placeholder mp3s and photos, `resume-human-factors.pdf`
  - `prototypes/concepts.html` — seven low-fi motion concepts (reference only)
  - `prototypes/index.html` — current artifact hub (tabs: Site / Motion concepts)
  - `archive/` — retired directions (Surface, Recurrence, Connection, branches A/B)
  - `CLAUDE.md` — design rules, system, research notes
  - `.claude/skills/design-grade/` — grading rubric trimmed from Garry Tan's gstack `design-review` (MIT): 10 weighted categories, A–F, fix-and-regrade loop
- **Figma:** file "Portfolio map illustration" in Peter's drafts holds the AI-generated town map (Soft town concept). The account is a Starter plan with a View seat.

## How we got here (short)
1. Three directions built (Presence / Flow / Connection), then Surface and Recurrence. **Presence won** (fog shader, cursor lens that reveals contour lines, patience rewarded).
2. Three navigation branches of Presence: A Index, B Field (map), **C Read (split pane) chosen** as cleanest: readable, one thing on screen at a time.
3. C built into a full site with four buttons and per-project pages.
4. Seven low-fi motion concepts made (line puzzle after The Witness, soft town map, bike ride, story, affinity board, darkroom, piano roll). The **story** concept became the first-visit intro.
5. Latest round: first-visit story, research first, résumé data, three themes, white start, calmer project pages, new email/LinkedIn/location.

## Current site
- **Rail (desktop) / bottom bar (phone):** name (once, links home) + four buttons: **Research · Design · Profile · Contact**. Email in the rail, "Replay intro", theme picker.
- **Routes:** `#story`, `#home`, `#research`, `#design`, `#profile`, `#contact`, and project pages `#connection`, `#students-ai`, `#pilipino`, `#nordoff`, `#dorot`, `#chorvivo`, `#wayfarer`, `#glenergy`.
- **First visit:** no history → `#story`; "Enter portfolio" / "Skip intro" stores `ph-visited` in localStorage → `#home`. Returning visitors land on `#home`.
- **Research:** papers — Technology, Social Connection, and Life Satisfaction (qualitative); Student Outcomes amidst AI (mixed methods); Ethnographic Study on Pilipino Culture (qualitative). "In the field" — Nordoff-Robbins (clinical observation) and DOROT (behavioral data), written from the résumé.
- **Design:** Chorvivo (startup), Wayfarer (design-a-thon win, 1st place CUXD 2026), Glenergy (school project, collaboration).
- **Placeholders:** paper and design case text is lorem ipsum; covers/figures are hatched boxes; mp3s and photos are generated stand-ins.
- **Background shader:** starts on plain page colour and eases in; strongest on the story, light on home, near-plain on project/profile/contact pages.
- **Themes (saved per visitor):** light (fog + contours), dark (navy airbrush ribbons), "effervescent" (coloured rounded tile paths).

## Design rules (keep)
Square corners everywhere · all sans-serif (Darker Grotesque display, Albert Sans body) · minimal text, no text both above and below a title · no AI tropes (purple gradients, icon grids, glass, emoji, marketing verbs) · one motion idea with a purpose · reduced-motion still frame · keyboard and touch parity, 44px targets · AA contrast, including over the shader.

## Résumé facts (from Peter's three résumés)
- Human factors version is the primary one (`media/resume-human-factors.pdf`). It still shows ph2344@nyu.edu and Irvine; Peter should update the PDF.
- GPA differs across versions (3.57 / 3.54 / 3.56) — left off the site until Peter confirms.
- HereNow (UX Researcher & Designer, Feb 2026–present) appears only on the Pages résumé; not on the site yet.
- Roles: Designity UX Intern (Aug–Sep 2026); DOROT Research & Operations Assistant (Aug–Dec 2025); Nordoff-Robbins Clinical Observational Researcher (Jan–May 2025); NOVA Kitchen and Bar Operations Intern (Jul–Aug 2024).

## Open requests (Peter's latest message — not yet done)

**1. AI navigation test.** Install or use plugins so an AI agent navigates the portfolio like a first-time user. Report problems with user testing and information hierarchy. Peter finds the current information organization a bit confusing. (A plugin search was started and cancelled; nothing installed yet.)

**2. Themes renamed and reworked as Land / Sea / Sky, each with a small visible label or indicator.**
- **Land** = current light theme (altitude contours). Palette is good; add some earth brown.
- **Sea** = current dark theme (reads as underwater). Palette is great; keep.
- **Sky** = replace the effervescent theme entirely. Airy, dreamy, cloud-like, fluffy, ethereal. Reference image: blurred pastel lilac and white with coral, gold and peach liquid reflections and faint columns of tiny glyphs. New palette needed.

**3. Intro story rewrite.**
- Very few words, story-like, no numbers or statistics, no mention of experience.
- Theme to convey: grew up with technology and was affected by it; believes ethical and pleasurable experiences need depth in testing, presence with people, observation and patience.
- Visuals: **not** one connected line. As in the motion concept: one simple, elegant illustration drawn, then erased, then the next, each matching its sentence.

**4. Home page.**
- Remove the text under main titles on all pages.
- The home page ("Research & design") holds the mission statement, opening with a time-of-day greeting: good morning / good afternoon / good evening / a night phrase. Text: "I'm Peter. I'm a UX designer with a background in psychology, digital media, and design. I'm exploring how technology shapes how we flourish: through design & research in healthtech, entertainment, and human factors."
- State clearly: NYU graduate, B.S. Applied Psychology, Minor in Integrated Design and Media.

**5. Résumé placement.**
- Résumé link sits directly under the email link in the rail.
- Remove the résumé from Profile; it stays in Contact.

**6. Profile text.**
- Use Peter's text with grammar fixes only: About me, skills, the "To feel the memory forming while living the moment." passage, "What is my why?", and the Substack link.
- Longer passages go in Profile. Full text is below.

**7. Artifact = the website only.**
- Remove the Motion concepts tab and the name in the hub bar.
- The artifact should show exactly what peterhua.fyi will host (make `index.html` the site itself).

### Peter's profile text (verbatim from peterhua.fyi; patchy — fix grammar only)
> (Greeting by time of day) I'm Peter.
> I'm a UX designer with a background in psychology, digital media, and design.
> I'm exploring how technology shapes how we flourish: through design & research in healthtech, entertainment, and human factors.
>
> **About me**
> My foundation in psychology is important for human-centric design— a skill needed in a future empowered by AI.
> I translate quantitative & qualitative data into a clear direction for design.
> I'm fascinated by art and science, I prioritize physical and mental health, and I'm inspired to build a future with integrity and humility.
> My approach is guided by curiosity, creativity, and a constant search for better ways to understand the human experience.
>
> **Skills**
> UX Design: Figma, Adobe Illustrator, Adobe InDesign, Photoshop.
> UX Research: SPSS, Excel, R, Qualitative & Quantitative Analysis.
>
> **"To feel the memory forming while living the moment."**
> During my time at NYU in NYC, I've met many unique individuals, each with their own story and journey.
> I've explored topics in philosophy + art, music + media, and research + science. I'm now an avid climber, jazz enthusiast, and cat owner.
> I'm fascinated by how people think, which drives me to pursue a career in UX design. In the future, I hope to travel, read, and create a podcast one day.
>
> **What is my why?**
> I find joy in the dynamics of human connection. Through my biology or my upbringing, I notice that being seen by others truthfully is a guiding value that I identify with. Technology has influenced these human connections, for better or for worse. It is a goal of mine to improve the connection that people have with others through digital means. As technology leaps further and further, our humanity is questioned again and again: What defines a human? What are the ideals we strive for? What makes us feel truly alive? My professional aspirations are to enhance the human experience with technology through observation, discussion, and analysis.
>
> I graduated from NYU with a Bachelor's in Applied Psychology, an experience that helped me build analytical, statistical, and empathetic skills. In addition, I focused my efforts on an Integrated Design Media minor, familiarizing common design tools and processes like ideation, interviews, and agile product design.
>
> These experiences, coupled with my work helping disadvantaged communities, such as children with disorders or adults with functional impairments, are a testament to my goal of improving how humans interact with the world and one another.
>
> As an emerging professional, I am currently driven to craft digital experiences for human connection. This is where the unfinished story stands. I'm eager, creative, and curious about future opportunities related to User Experience Design and Product Design.
>
> I hope to explore and excel in this career, with communication, agency, and an open curiosity.
> My Substack (https://petersworld.substack.com/): where I share all things philosophy, art, and meaning.

## Notes for whoever picks this up
- **Positioning:** his text says "UX designer", but his targets are UX research and human factors. Raise this with him; don't silently change his wording.
- **Network limits:** the cloud workspace cannot reach figma.com. Figma assets must be exported by Peter or moved through his linked computer.
- **A1 Gallery:** the plugin is installed, but its MCP server was not connected, so no measured references were used.
- **Contact form:** none yet. It needs a form service (e.g. Formspree) before launch.
- **Before shipping, test:** 375 / 768 / 1440 px, reduced motion, keyboard only, and all themes on every page.
