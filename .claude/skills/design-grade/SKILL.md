---
name: design-grade
description: Grade a portfolio page against the visual design + UX rubric (A–F), fix findings, and regrade until every category is A. Use after any visual change or when asked to score, audit, or polish a page.
---

# design-grade

Trimmed from gstack `design-review` (Garry Tan, MIT — see `reference/GSTACK-LICENSE`). Only the visual design and UX parts are kept. The full checklist lives in `reference/gstack-design-review.md`; this file is the loop.

## Loop

1. **Render.** Screenshot each page at 375, 768, 1440 (Playwright, `reducedMotion` both on and off). Capture console errors.
2. **First impression (3 s).** Write one line each: what is this, who made it, where do I click first. If any answer is unclear, that is a High finding.
3. **Audit.** Walk the 10 categories in the reference checklist. Log each finding as `FINDING-NNN | category | high/medium/polish | what | fix`.
4. **Portfolio-specific checks** (High if failed):
   - Text both above and below a title anywhere.
   - Any rounded button, pill, or card radius > 0.
   - Copy longer than one line under a title; any instruction text.
   - Display face on the banned list in `CLAUDE.md`.
   - Readable text over a shader below 4.5:1.
   - Interaction that only works on hover.
   - Motion with no reduced-motion still frame.
5. **Score.** Each category starts at A. High = −1 letter, Medium = −½, Polish = 0.
   Weights: Hierarchy 15, Typography 15, Spacing 15, Color 10, States 10, Responsive 10, Content 10, AI-slop 5, Motion 5, Performance 5. Report Design Score and AI-Slop Score separately.
6. **Triage.** High first, then Medium. Polish only if all categories are already A.
7. **Fix.** Smallest change that resolves the finding. CSS before structure. One finding per edit.
8. **Regrade** the touched categories. Stop when all are A, or after 3 rounds — then list what still blocks A and why.

## Report format

```
PAGE  Design: A-  Slop: A
Hierarchy A | Type A | Spacing A- | Color A | States B+ | Responsive A | Content A | Slop A | Motion A | Perf A
FINDING-004 states medium — no visible focus on project rows → add :focus-visible outline 2px Ink
```

Critique language: "I notice…", "I wonder…", "What if…", "I think… because…". Tie every finding to what the reader is trying to do.
