# Design grade — round 2 (2026-10-16)

Rubric: `.claude/skills/design-grade` (gstack design-review, visual + UX only). Rendered at 1440 and 390 with SwiftShader WebGL; Google Fonts blocked in the test sandbox, so type was judged on fallbacks.

| Page | Design | Slop | Hier | Type | Space | Color | States | Resp | Content | Motion | Perf |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 Presence | A | A | A | A | A | A | A | A- | A | A | A |
| 02 Flow | A- | A | A | A- | A | A | A- | A | A | A | A- |
| 03 Connection | A- | A | A- | A | A | A | A | A- | A | A | A- |

## Fixed this round
- F-001 02 high: streamline bands too dense, meta text failed contrast → thin lines, lower intensity, meta in Foam.
- F-002 02 medium: design-system panel covered case meta → moved into the left bank.
- F-003 02 medium: titles overflowed at 390 when width axis expanded → width locked at 92 on phone.
- F-004 03 high: labels unclickable while network rotates → rotation pauses on hover/focus.
- F-005 03 medium: method labels illegible over edges → cortex halo behind labels; ambient edges lighter.
- F-006 03 medium: labels left the viewport on phone → camera pulled back, labels clamped to screen.
- F-007 all high: invented outcome claims → replaced with `[ key finding ]` slots.

## Still blocking a clean A
- 02 Type A-: variable-width titles reflow while scrolling (layout property animates). Acceptable for prototype; for production, cap updates to 10 fps or animate a pre-rendered width.
- 03 Hierarchy A-: ambient neurons compete with project nodes at some angles. Try fewer ambient nodes (≈90) once real content exists.
- 01/03 Responsive A-: hold/hover interactions fall back to tap only on touch. Add a tap-and-hold variant on phone if the patience idea should carry to mobile.
- Perf: not measured on real GPUs. Profile on a mid-range laptop and an older iPhone before choosing.
- Content: all `[ case capture ]` and `[ key finding ]` slots need real material from the Portfolio Master File.
