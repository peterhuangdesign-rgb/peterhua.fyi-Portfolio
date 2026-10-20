# First-time visitor test — portfolio (baseline, 2026-10-20)

**Method.** A scripted agent opened the bare URL with no history, as a first-time visitor would, at 1440×900 and 390×844. It read the intro, entered the site, then visited Home, Research, one paper, Design, Profile and Contact. On each page it ran the ux-ui-audit probes (structure, contrast, tap targets, Hick/Fitts, Gestalt, LTR copy). After that came a screenshot pass and a reading pass. Fonts were blocked in the test sandbox, so type was judged on fallback faces. WebGL ran in software, so performance numbers say nothing about real GPUs.

**Standards used:** the project's own `CLAUDE.md` rules first, then WCAG 2.2 AA and Nielsen's heuristics.

## Summary
2 critical · 5 major · 2 accessibility · 3 notes. Contrast is already solid: 33 of 33 text samples on Home passed AA, and so did every page tested. The keyboard skip target and heading outline are correct.

## Findings

**01 · Critical · Home.** The first screen never says who Peter is or what he does beyond "Psychology, NYU 2026."
A reader with 90 seconds sees a generic title ("Research & design") and then a list of eight titles. There is no mission, no claim, and nothing to anchor what follows.
`H1: Research & design` · lede: "Psychology, NYU 2026. Working toward UX research and human factors."
FIX (done): a time-of-day greeting, the mission statement and the NYU credential, placed above the index.

**02 · Critical · All case pages.** Placeholder copy is still shipped: lorem ipsum on Design, on every paper line, and in case sections.
`Design lede: "Lorem ipsum dolor sit amet, consectetur adipiscing."`
FIX: the lorem lines under titles are removed now. Case sections still need text from the Master File before launch.

**03 · Major · Research.** The strongest real evidence was buried. Nordoff-Robbins and DOROT (written from the résumé) came 4th and 5th, after three papers that are still placeholders.
FIX (done): "In the field" now comes first, on the Research page, in the Home index and in the rail list.

**04 · Major · Navigation model.** Each project appears in four places: the Home list, a large block on its section page, the rail sub-list and the project page with its pager. The rail sub-list jumped within the page on section pages but opened the project on project pages, so the same list did two different things.
FIX (done): the rail list now always opens the project page and only highlights your position while you scroll. Still open: decide whether section pages should become compact lists like Home (see "Where to start").

**05 · Major · Naming.** The nav button says "Profile", but the page was titled "Off the clock" and held the résumé. Contact then linked to the résumé "On this site", which pointed at Profile.
FIX (done): the page is titled Profile and the résumé is gone from it. Résumé now lives under the email in the rail and on Contact.

**06 · Major · Nav counts.** "RESEARCH 05" and "DESIGN 03" read as section numbers, not counts.
FIX (done): the counts are removed.

**07 · Major · Intro.** The intro read as a résumé, with numbers and a weak ending ("Based in Orange County.").
FIX (done): rewritten as six short sentences with one drawing each.

**08 · Accessibility · 2.5.8 Target Size.** Several standalone links were below the 24 px minimum:
`All research 78×21 · All design 65×21 · rail email 312×21 · Contact links 231×20, 206×20, 219×20, 84×20`
FIX (done): these are now 44 px tall.

**09 · Accessibility · Theme picker.** The three swatches had no visible names, and on phones they were 36 px.
FIX (done): labelled buttons (Land · Sea · Sky), 44 px tall.

**10 · Note · Contact.** The email appeared twice in a row (large output, then the Email row). FIX (done): the row now says "Write an email".

**11 · Note · Head.** No meta description or Open Graph tags (`description: null, openGraph: []`), so a shared link previews as a bare URL. FIX (done).

**12 · Note · Positioning.** The rail says "UX research & design". The mission says "I'm a UX designer". Targets are UX research and human factors. Left as written; it's Peter's call.

## What works
- Contrast: 0 failures across all pages, in both widths.
- Phone navigation: the bottom bar is within easy thumb reach (Fitts index 1.2–1.9 at 390 px).
- First-screen load: 14–17 interactive targets, which is within the typical 8–15 range plus the nav.
- Type system: 7–8 distinct sizes and 2 families, consistent.

## Where to start (impact ÷ effort)
1. Fill case text from the Master File (02). Nothing else matters as much once the structure is fixed.
2. Real covers for the section pages. While they're hatched placeholders, Research and Design are mostly empty boxes, and that is what makes the middle layer feel redundant (04).
3. If that still feels like too many layers once covers exist, make Research and Design compact lists like Home and keep the large blocks only on project pages.
