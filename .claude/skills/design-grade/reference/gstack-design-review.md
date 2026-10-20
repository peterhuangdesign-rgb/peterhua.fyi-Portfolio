<!-- Extracted from github.com/garrytan/gstack design-review/SKILL.md (MIT, (c) 2026 Garry Tan). Visual design + UX sections only. CLI tooling, telemetry, git, tests, mockup generator and browser-binary setup removed. -->
## UX Principles: How Users Actually Behave

These principles govern how real humans interact with interfaces. They are observed
behavior, not preferences. Apply them before, during, and after every design decision.

### The Three Laws of Usability

1. **Don't make me think.** Every page should be self-evident. If a user stops
   to think "What do I click?" or "What does this mean?", the design has failed.
   Self-evident > self-explanatory > requires explanation.

2. **Clicks don't matter, thinking does.** Three mindless, unambiguous clicks
   beat one click that requires thought. Each step should feel like an obvious
   choice (animal, vegetable, or mineral), not a puzzle.

3. **Omit, then omit again.** Get rid of half the words on each page, then get
   rid of half of what's left. Happy talk (self-congratulatory text) must die.
   Instructions must die. If they need reading, the design has failed.

### How Users Actually Behave

- **Users scan, they don't read.** Design for scanning: visual hierarchy
  (prominence = importance), clearly defined areas, headings and bullet lists,
  highlighted key terms. We're designing billboards going by at 60 mph, not
  product brochures people will study.
- **Users satisfice.** They pick the first reasonable option, not the best.
  Make the right choice the most visible choice.
- **Users muddle through.** They don't figure out how things work. They wing
  it. If they accomplish their goal by accident, they won't seek the "right" way.
  Once they find something that works, no matter how badly, they stick to it.
- **Users don't read instructions.** They dive in. Guidance must be brief,
  timely, and unavoidable, or it won't be seen.

### Billboard Design for Interfaces

- **Use conventions.** Logo top-left, nav top/left, search = magnifying glass.
  Don't innovate on navigation to be clever. Innovate when you KNOW you have a
  better idea, otherwise use conventions. Even across languages and cultures,
  web conventions let people identify the logo, nav, search, and main content.
- **Visual hierarchy is everything.** Related things are visually grouped. Nested
  things are visually contained. More important = more prominent. If everything
  shouts, nothing is heard. Start with the assumption everything is visual noise,
  guilty until proven innocent.
- **Make clickable things obviously clickable.** No relying on hover states for
  discoverability, especially on mobile where hover doesn't exist. Shape, location,
  and formatting (color, underlining) must signal clickability without interaction.
- **Eliminate noise.** Three sources: too many things shouting for attention
  (shouting), things not organized logically (disorganization), and too much stuff
  (clutter). Fix noise by removal, not addition.
- **Clarity trumps consistency.** If making something significantly clearer
  requires making it slightly inconsistent, choose clarity every time.

### Navigation as Wayfinding

Users on the web have no sense of scale, direction, or location. Navigation
must always answer: What site is this? What page am I on? What are the major
sections? What are my options at this level? Where am I? How can I search?

Persistent navigation on every page. Breadcrumbs for deep hierarchies.
Current section visually indicated. The "trunk test": cover everything except
the navigation. You should still know what site this is, what page you're on,
and what the major sections are. If not, the navigation has failed.

### The Goodwill Reservoir

Users start with a reservoir of goodwill. Every friction point depletes it.

**Deplete faster:** Hiding info users want (pricing, contact, shipping). Punishing
users for not doing things your way (formatting requirements on phone numbers).
Asking for unnecessary information. Putting sizzle in their way (splash screens,
forced tours, interstitials). Unprofessional or sloppy appearance.

**Replenish:** Know what users want to do and make it obvious. Tell them what they
want to know upfront. Save them steps wherever possible. Make it easy to recover
from errors. When in doubt, apologize.

### Mobile: Same Rules, Higher Stakes

All the above applies on mobile, just more so. Real estate is scarce, but never
sacrifice usability for space savings. Affordances must be VISIBLE: no cursor
means no hover-to-discover. Touch targets must be big enough (44px minimum).
Flat design can strip away useful visual information that signals interactivity.
Prioritize ruthlessly: things needed in a hurry go close at hand, everything
else a few taps away with an obvious path to get there.

## Phase 1: First Impression

The most uniquely designer-like output. Form a gut reaction before analyzing anything.

1. Open the target URL in Aside and take a full-page desktop screenshot, in one script:

```bash
aside repl '
const pg = await openTab("<url>");
await pg.screenshot({ path: "first-impression.jpg", type: "jpeg", quality: 60, fullPage: true });
console.log("URL=" + pg.url());
console.log("ASIDE_DIR=" + pwd);
await closeTab(pg);
console.log("GSTACK_STEP_OK");
'
```

2. `cp "<ASIDE_DIR>/first-impression.jpg" "$REPORT_DIR/screenshots/"` and Read it. Check the `URL=` line against Auth Detection (Phase 3) before you critique a login wall by mistake.
3. Write the **First Impression** using this structured critique format:
   - "The site communicates **[what]**." (what it says at a glance — competence? playfulness? confusion?)
   - "I notice **[observation]**." (what stands out, positive or negative — be specific)
   - "The first 3 things my eye goes to are: **[1]**, **[2]**, **[3]**." (hierarchy check — are these the 3 things the designer intended? If not, the visual hierarchy is lying.)
   - "If I had to describe this in one word: **[word]**." (gut verdict)

**Narration mode:** Write this section in first person, as if you are a user scanning the page for the first time. "I'm looking at this page... my eye goes to the logo, then a wall of text I skip entirely, then... wait, is that a button?" Name the specific element, its position, its visual weight. If you can't name it specifically, you're not actually scanning, you're generating platitudes.

**Page Area Test:** Point at each clearly defined area of the page. Can you instantly name its purpose? ("Things I can buy," "Today's deals," "How to search.") Areas you can't name in 2 seconds are poorly defined. List them.

This is the section users read first. Be opinionated. A designer doesn't hedge — they react.

---

## Phase 2: Design System Extraction

Extract the actual design system the site uses (not what a DESIGN.md says, but what's rendered):

One Aside script; every probe runs inside the page and returns a JSON string (element scans capped at 500 to stay inside the script budget):

```bash
aside repl '
const pg = await openTab("<url>");
console.log("FONTS=" + await pg.evaluate(() => JSON.stringify([...new Set([...document.querySelectorAll("*")].slice(0, 500).map(e => getComputedStyle(e).fontFamily))])));
console.log("COLORS=" + await pg.evaluate(() => JSON.stringify([...new Set([...document.querySelectorAll("*")].slice(0, 500).flatMap(e => [getComputedStyle(e).color, getComputedStyle(e).backgroundColor]).filter(c => c !== "rgba(0, 0, 0, 0)"))])));
console.log("HEADINGS=" + await pg.evaluate(() => JSON.stringify([...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(h => ({ tag: h.tagName, text: h.textContent.trim().slice(0, 50), size: getComputedStyle(h).fontSize, weight: getComputedStyle(h).fontWeight })))));
console.log("TOUCH_TARGETS=" + await pg.evaluate(() => JSON.stringify([...document.querySelectorAll("a,button,input,[role=button]")].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.width < 44 || r.height < 44); }).map(e => ({ tag: e.tagName, text: (e.textContent || "").trim().slice(0, 30), w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height) })).slice(0, 20))));
console.log("NAV=" + await pg.evaluate(() => JSON.stringify(performance.getEntriesByType("navigation")[0])));   // stringify IN the page: PerformanceEntry fields are getters and serialize to {} across the bridge
await closeTab(pg);
console.log("GSTACK_STEP_OK");
'
```

Structure findings as an **Inferred Design System**:
- **Fonts:** list with usage counts. Flag if >3 distinct font families.
- **Colors:** palette extracted. Flag if >12 unique non-gray colors. Note warm/cool/mixed.
- **Heading Scale:** h1-h6 sizes. Flag skipped levels, non-systematic size jumps.
- **Spacing Patterns:** sample padding/margin values. Flag non-scale values.

After extraction, offer: *"Want me to save this as your DESIGN.md? I can lock in these observations as your project's design system baseline."*

---

### Trunk Test (run on every page)

Imagine being dropped on this page with no context. Can you immediately answer:
1. What site is this? (Site ID visible and identifiable)
2. What page am I on? (Page name prominent, matches what I clicked)
3. What are the major sections? (Primary nav visible and clear)
4. What are my options at this level? (Local nav or content choices obvious)
5. Where am I in the scheme of things? ("You are here" indicator, breadcrumbs)
6. How can I search? (Search box findable without hunting)

Score: PASS (all 6 clear) / PARTIAL (4-5 clear) / FAIL (3 or fewer clear).
A FAIL on the trunk test is a HIGH-impact finding regardless of how polished the visual design is.

### Design Audit Checklist (10 categories, ~80 items)

Apply these at each page. Each finding gets an impact rating (high/medium/polish) and category.

**1. Visual Hierarchy & Composition** (8 items)
- Clear focal point? One primary CTA per view?
- Eye flows naturally top-left to bottom-right?
- Visual noise — competing elements fighting for attention?
- Information density appropriate for content type?
- Z-index clarity — nothing unexpectedly overlapping?
- Above-the-fold content communicates purpose in 3 seconds?
- Squint test: hierarchy still visible when blurred?
- White space is intentional, not leftover?

**2. Typography** (15 items)
- Font count <=3 (flag if more)
- Scale follows ratio (1.25 major third or 1.333 perfect fourth)
- Line-height: 1.5x body, 1.15-1.25x headings
- Measure: 45-75 chars per line (66 ideal)
- Heading hierarchy: no skipped levels (h1→h3 without h2)
- Weight contrast: >=2 weights used for hierarchy
- No banned fonts (Papyrus, Comic Sans, Lobster, Impact, Jokerman, Bleeding Cowboys, Permanent Marker, Bradley Hand, Brush Script, Hobo, Trajan, Raleway, Clash Display, Courier New)
- Display face on the overused list (Inter, Roboto, Arial, Helvetica, Open Sans, Lato, ...) → flag `[overused-font]`; as body/UI on an Operate or Read surface it passes when DESIGN.md says so
- `text-wrap: balance` or `text-pretty` on headings (check via `await pg.evaluate(() => getComputedStyle(document.querySelector("h1")).textWrap)`)
- Curly quotes used, not straight quotes
- Ellipsis character (`…`) not three dots (`...`)
- `font-variant-numeric: tabular-nums` on number columns
- Body text >= 16px
- Caption/label >= 12px
- No letterspacing on lowercase text

**3. Color & Contrast** (10 items)
- Palette coherent (<=12 unique non-gray colors)
- WCAG AA: body text 4.5:1, large text (18px+) 3:1, UI components 3:1
- Semantic colors consistent (success=green, error=red, warning=yellow/amber)
- No color-only encoding (always add labels, icons, or patterns)
- Dark mode: surfaces use elevation, not just lightness inversion
- Dark mode: text off-white (~#E0E0E0), not pure white
- Primary accent desaturated 10-20% in dark mode
- `color-scheme: dark` on html element (if dark mode present)
- No red/green only combinations (8% of men have red-green deficiency)
- Neutral palette is warm or cool consistently — not mixed

**4. Spacing & Layout** (12 items)
- Grid consistent at all breakpoints
- Spacing uses a scale (4px or 8px base), not arbitrary values
- Alignment is consistent — nothing floats outside the grid
- Rhythm: related items closer together, distinct sections further apart
- Border-radius hierarchy (not uniform bubbly radius on everything)
- Inner radius = outer radius - gap (nested elements)
- No horizontal scroll on mobile
- Max content width set (no full-bleed body text)
- `env(safe-area-inset-*)` for notch devices
- URL reflects state (filters, tabs, pagination in query params)
- Flex/grid used for layout (not JS measurement)
- Breakpoints: mobile (375), tablet (768), desktop (1024), wide (1440)

**5. Interaction States** (12 items)
- Hover state on all interactive elements
- `focus-visible` ring present (never `outline: none` without replacement)
- Active/pressed state with depth effect or color shift
- Disabled state: reduced opacity + `cursor: not-allowed`
- Loading: skeleton shapes match real content layout
- Empty states: warm message + primary action + visual (not just "No items.")
- Error messages: specific + include fix/next step
- Success: confirmation animation or color, auto-dismiss
- Touch targets >= 44px on all interactive elements
- `cursor: pointer` on all clickable elements
- Mindless choice audit: every decision point (button, link, dropdown, modal choice) is a mindless click (obvious what happens). If a click requires thought about whether it's the right choice, flag as HIGH.
- Browser surfaces themed from the palette: `::selection`, caret, scrollbars, focus ring, underline offset, tabular numerals. Left at defaults, the page reads as assembled, not designed

**6. Responsive Design** (8 items)
- Mobile layout makes *design* sense (not just stacked desktop columns)
- Touch targets sufficient on mobile (>= 44px)
- No horizontal scroll on any viewport
- Images handle responsive (srcset, sizes, or CSS containment)
- Text readable without zooming on mobile (>= 16px body)
- Navigation collapses appropriately (hamburger, bottom nav, etc.)
- Forms usable on mobile (correct input types, no autoFocus on mobile)
- No `user-scalable=no` or `maximum-scale=1` in viewport meta

**7. Motion & Animation** (7 items)
- Easing: ease-out for entering, ease-in for exiting, ease-in-out for moving
- Duration: 50-700ms range (nothing slower unless page transition)
- Purpose: every animation communicates something (state change, attention, spatial relationship)
- `prefers-reduced-motion` respected (check: `await pg.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)`)
- No `transition: all` — properties listed explicitly
- Only `transform` and `opacity` animated (not layout properties like width, height, top, left)
- One authored motion moment per page: not the same entrance on every section, not a hover effect on everything. Ease-out from an already-visible default; content never hides behind animation timing

**8. Content & Microcopy** (11 items)
- Empty states designed with warmth (message + action + illustration/icon)
- Error messages specific: what happened + why + what to do next
- Button labels specific ("Save API Key" not "Continue" or "Submit")
- No placeholder/lorem ipsum text visible in production
- Truncation handled (`text-overflow: ellipsis`, `line-clamp`, or `break-words`)
- Active voice ("Install the CLI" not "The CLI will be installed")
- Loading states end with `…` ("Saving…" not "Saving...")
- Destructive actions have confirmation modal or undo window
- Happy talk detection: scan for introductory paragraphs that start with "Welcome to..." or tell users how great the site is. If you can hear "blah blah blah", it's happy talk. Flag for removal.
- Instructions detection: any visible instructions longer than one sentence. If users need to read instructions, the design has failed. Flag the instructions AND the interaction they're compensating for.
- Happy talk word count: count total visible words on the page. Classify each text block as "useful content" vs "happy talk" (welcome paragraphs, self-congratulatory text, instructions nobody reads). Report: "This page has X words. Y (Z%) are happy talk."

**9. AI Slop Detection** (11 blacklist patterns, 30 detector rules, 16 judgment tells; polish-level ones on the last line)

The test: would a human designer at a respected studio ever ship this? A `[rule-id]` is the detector's name for the same pattern; a scan hit and a judgment hit on one element are one finding.

- Purple/violet/indigo gradient backgrounds or blue-to-purple color schemes
- **The 3-column feature grid:** icon-in-colored-circle + bold title + 2-line description, repeated 3x symmetrically. THE most recognizable AI layout.
- Icons in colored circles as section decoration (SaaS starter template look)
- Centered everything (`text-align: center` on all headings, descriptions, cards)
- Uniform bubbly border-radius on every element (same large radius on everything)
- Decorative blobs, floating circles, wavy SVG dividers (if a section feels empty, it needs better content, not decoration)
- Emoji as design elements (rockets in headings, emoji as bullet points)
- Colored left-border on cards (`border-left: 3px solid <accent>`)
- Generic hero copy ("Welcome to [X]", "Unlock the power of...", "Your all-in-one solution for...")
- Cookie-cutter section rhythm (hero → 3 features → testimonials → pricing → CTA, every section same height)
- system-ui or `-apple-system` as the PRIMARY display/body font — the "I gave up on typography" signal. Pick a real typeface.


Judgment tells (no detector rule; you are the detector):
- Gradient buttons as the primary call to action. One solid color the palette owns.
- A generic stock-photo hero, or a gray placeholder div standing in for one. Show the product or show nothing.
- Rounded cards with drop shadows as the container for everything. App UI made of stacked cards is not layout.
- A testimonial row with avatars, five stars, and quotes nobody said. Real names with real claims, or cut it.
- The cookie-cutter hero: headline left, screenshot right, two buttons. The first template every generator reaches for.
- "Get Started" and "Learn More" as the only calls to action. Name the outcome the click buys.
- Three big numbers with tiny labels under the hero ("10k+ users", "99.9%"). The template counts, not the product.
- A grid of cards with the same shape, the same icon slot, the same two lines. Content of unequal weight given equal boxes.
- Frosted-glass panels with blurred backdrops as the default surface. One translucent layer where it explains depth, not everywhere.
- Generated SVG doodles and mascots in place of art direction. Commission or license an asset, or ship none.
- Every secondary action in a modal. Inline, a side panel, or a new page usually costs the user less.
- Sparklines, progress rings, and fake avatars filling space where content should be. Real data or an honest empty state.
- Dark because it is a dev tool, light because it is health. Light or dark comes from the use scene: who, where, under what light.
- Only the happy path is designed. Empty, loading, error, and long-content states are part of the component.

Polish-level tells, note but do not grade: [monotonous-spacing], [bounce-easing], [pulsing-dot], [blinking-cursor], [numbered-section-labels], [em-dash-overuse], [extreme-negative-tracking], [gpt-thin-border-wide-shadow], [repeating-stripes-gradient], [codex-grid-background], [image-hover-transform], monospace as costume, unthemed browser surfaces.

**10. Performance as Design** (6 items)
- LCP < 2.0s (web apps), < 1.5s (informational sites)
- CLS < 0.1 (no visible layout shifts during load)
- Skeleton quality: shapes match real content layout, shimmer animation
- Images: `loading="lazy"`, width/height dimensions set, WebP/AVIF format
- Fonts: `font-display: swap`, preconnect to CDN origins
- No visible font swap flash (FOUT) — critical fonts preloaded

---

## Phase 4: Interaction Flow Review

Walk 2-3 key user flows and evaluate the *feel*, not just the function. One flow per Aside script — open, act, diff, evidence:

```bash
aside repl '
const HOOK = `(() => { window.__gstackErrs = window.__gstackErrs || []; const oe = console.error; console.error = (...a) => { window.__gstackErrs.push(a.map(String).join(" ")); oe.apply(console, a); }; window.addEventListener("error", e => window.__gstackErrs.push("uncaught: " + e.message)); })()`;
const pg = await openTab("about:blank");
await pg._sendToTarget("Page.addScriptToEvaluateOnNewDocument", { source: HOOK });
await pg.goto("<url>");
await snapshot(pg, { interactive: true });                            // baseline for .diff; refs like [ref=e3] name every control
await pg.screenshot({ path: "flow-<name>-step-1.jpg", type: "jpeg", quality: 60 });
await pg.locator("e3").click();                                        // perform the action — or pg.getByRole("button", { name: "Sign Up" })
await sleep(500);                                                      // or: await pg.waitForSelector("<selector>"); await pg.waitForURL(/dashboard/)
const s = await snapshot(pg);
console.log("DIFF_START"); console.log(s.diff); console.log("DIFF_END");   // what changed since the baseline
console.log("URL=" + pg.url());
console.log("CONSOLE_ERRORS=" + JSON.stringify(await pg.evaluate(() => window.__gstackErrs)));
await pg.screenshot({ path: "flow-<name>-result.jpg", type: "jpeg", quality: 60 });
console.log("ASIDE_DIR=" + pwd);
await closeTab(pg);
console.log("GSTACK_STEP_OK");
'
```

Chain more steps inside the same script for a longer flow (re-snapshot before clicking by ref again). Forms may be filled but not submitted on a non-local target without the one-time consent in BROWSER SETUP.

Evaluate:
- **Response feel:** Does clicking feel responsive? Any delays or missing loading states?
- **Transition quality:** Are transitions intentional or generic/absent?
- **Feedback clarity:** Did the action clearly succeed or fail? Is the feedback immediate?
- **Form polish:** Focus states visible? Validation timing correct? Errors near the source?

**Narration mode:** Narrate the flow in first person. "I click 'Sign Up'... spinner appears... 3 seconds pass... still spinning... I'm getting nervous. Finally the dashboard loads, but where am I? The nav doesn't highlight anything." Name the specific element, its position, its visual weight. If you can't name it specifically, you're not actually experiencing the flow, you're generating platitudes.

### Goodwill Reservoir (track across the flow)

As you walk the user flow, maintain a mental goodwill meter (starts at 70/100).
These scores are heuristic, not measured. The value is in identifying specific
drains and fills, not in the final number.

Subtract points for:
- Hidden information the user would want (pricing, contact, shipping): subtract 15
- Format punishment (rejecting valid input like dashes in phone numbers): subtract 10
- Unnecessary information requests: subtract 10
- Interstitials, splash screens, forced tours blocking the task: subtract 15
- Sloppy or unprofessional appearance: subtract 10
- Ambiguous choices that require thinking: subtract 5 each

Add points for:
- Top user tasks are obvious and prominent: add 10
- Upfront about costs and limitations: add 5
- Saves steps (direct links, smart defaults, autofill): add 5 each
- Graceful error recovery with specific fix instructions: add 10
- Apologizes when things go wrong: add 5

Report the final goodwill score with a visual dashboard:

```
Goodwill: 70 ████████████████████░░░░░░░░░░
  Step 1: Login page        70 → 75  (+5 obvious primary action)
  Step 2: Dashboard          75 → 60  (-15 interstitial tour popup)
  Step 3: Settings           60 → 50  (-10 format punishment on phone)
  Step 4: Billing            50 → 35  (-15 hidden pricing info)
  FINAL: 35/100 ⚠️ CRITICAL UX DEBT
```

Below 30 = critical UX debt. 30-60 = needs work. Above 60 = healthy.
Include the biggest drains and fills as specific findings.

---

## Phase 5: Cross-Page Consistency

Compare screenshots and observations across pages for:
- Navigation bar consistent across all pages?
- Footer consistent?
- Component reuse vs one-off designs (same button styled differently on different pages?)
- Tone consistency (one page playful while another is corporate?)
- Spacing rhythm carries across pages?

---

### Scoring System

**Dual headline scores:**
- **Design Score: {A-F}** — weighted average of all 10 categories
- **AI Slop Score: {A-F}** — standalone grade with pithy verdict

**Per-category grades:**
- **A:** Intentional, polished, delightful. Shows design thinking.
- **B:** Solid fundamentals, minor inconsistencies. Looks professional.
- **C:** Functional but generic. No major problems, no design point of view.
- **D:** Noticeable problems. Feels unfinished or careless.
- **F:** Actively hurting user experience. Needs significant rework.

**Grade computation:** Each category starts at A. Each High-impact finding drops one letter grade. Each Medium-impact finding drops half a letter grade. Polish findings are noted but do not affect grade. Minimum is F.

**Category weights for Design Score:**
| Category | Weight |
|----------|--------|
| Visual Hierarchy | 15% |
| Typography | 15% |
| Spacing & Layout | 15% |
| Color & Contrast | 10% |
| Interaction States | 10% |
| Responsive | 10% |
| Content Quality | 10% |
| AI Slop | 5% |
| Motion | 5% |
| Performance Feel | 5% |

AI Slop is 5% of Design Score but also graded independently as a headline metric.
## Phase 7: Triage

Sort all discovered findings by impact, then decide which to fix:

- **High Impact:** Fix first. These affect the first impression and hurt user trust.
- **Medium Impact:** Fix next. These reduce polish and are felt subconsciously.
- **Polish:** Fix if time allows. These separate good from great.

Mark findings that cannot be fixed from source code (e.g., third-party widget issues, content problems requiring copy from the team) as "deferred" regardless of impact.


---
