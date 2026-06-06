# Anti-slop, Accessibility & Deceptive Design Checklist

Run this self-critique **before declaring any UI complete**. State results inline:
`✓ Anti-slop`, `✓ A11y`, `✓ No deceptive patterns` (or flag what needs fixing).

---

## Gate 1 — Anti-slop visual quality

Check each item. A "hit" means the pattern is present **without brand justification**:

| # | Pattern | Verdict |
|---|---------|---------|
| 1 | Purple / violet gradient on white background | ☐ |
| 2 | Emoji used as section icons (🚀 ✅ 💡) | ☐ |
| 3 | Card + left coloured accent bar | ☐ |
| 4 | SVG "illustration" standing in for a product photo | ☐ |
| 5 | CSS silhouette as hero product art | ☐ |
| 6 | Inter / Roboto / Arial used as display / headline face | ☐ |
| 7 | Fake browser chrome drawn inside the canvas | ☐ |
| 8 | "Inspirational" decorative stock photo unrelated to content | ☐ |
| 9 | Identical stagger on 20+ elements (random micro-jitter) | ☐ |
| 10 | Gratuitous gradient blobs / mesh backgrounds | ☐ |

**Action**: for each hit, either remove, replace with brand-appropriate alternative, or
document explicitly why the brand genuinely uses that pattern.

---

## Gate 2 — Accessibility (WCAG 2.2 AA)

### Semantics & structure
- [ ] Page has a single `<h1>`; heading hierarchy is logical (no skipped levels).
- [ ] Landmark regions used: `<header>`, `<main>`, `<nav>`, `<footer>`, `<aside>`.
- [ ] Lists use `<ul>` / `<ol>` / `<dl>` — not `<div>` chains.
- [ ] Images have meaningful `alt` text; decorative images have `alt=""` and `aria-hidden="true"`.
- [ ] Form inputs have associated `<label>` elements (not just placeholder text).
- [ ] Error messages are associated with their input via `aria-describedby`.

### ARIA usage
- [ ] No redundant ARIA (e.g. `role="button"` on `<button>`).
- [ ] Streaming / chat regions use `role="log"` and `aria-live="polite"`.
- [ ] Icon-only buttons have `aria-label`.
- [ ] Modal dialogs use `role="dialog"` + `aria-modal="true"` + `aria-labelledby`.
- [ ] DaisyUI / Flowbite components have ARIA labels added explicitly — do not rely on
  utility classes alone to communicate meaning.

### Colour contrast
- [ ] Normal text: ≥ 4.5:1 contrast ratio against background.
- [ ] Large text (≥ 18pt / 14pt bold): ≥ 3:1.
- [ ] UI components and focus indicators: ≥ 3:1.
- [ ] Do not communicate information by colour alone — use icon, pattern, or label too.
- [ ] DaisyUI tokens checked: confirm the active theme passes contrast for `base-content`
  on `base-100` and for `btn-primary` label on `primary` background.

### Keyboard & focus
- [ ] All interactive elements reachable via Tab in a logical order.
- [ ] Focus ring is visible on all interactive elements (not `outline: none` without
  a custom focus indicator).
- [ ] Modals trap focus while open; focus returns to trigger on close.
- [ ] No keyboard trap outside intentional modal contexts.

### Touch targets
- [ ] All interactive elements ≥ 44×44 CSS pixels (WCAG 2.5.8).
- [ ] Sufficient spacing between adjacent targets.

### Motion
- [ ] `@media (prefers-reduced-motion: reduce)` is handled — either no animation, or a
  meaningful static alternative.
- [ ] Animations do not flash more than 3 times per second.
- [ ] Parallax / auto-playing carousels can be paused.

### Interactive component states
- [ ] Every interactive component has all states styled: **hover**, **focus**, **active**,
  **disabled**.
- [ ] Disabled state uses `disabled` attribute (not just visual styling) so screen readers
  announce it correctly.

---

## Gate 3 — Deceptive design audit (forms, checkout, sign-up)

**Skip this gate** if the component is not a form, checkout, subscription, or sign-up flow.

| # | Pattern | Status |
|---|---------|--------|
| 1 | **Hidden costs** — shipping, taxes, fees revealed only at final step | ☐ |
| 2 | **Fake scarcity** — "Only 3 left!" / countdown timers not based on real data | ☐ |
| 3 | **Pre-ticked boxes** — newsletter opt-in, upsell, or third-party sharing checked by default | ☐ |
| 4 | **Misdirection** — "No thanks, I hate saving money" as a decline link | ☐ |
| 5 | **Buried opt-out** — unsubscribe / cancel link hidden in small grey text | ☐ |
| 6 | **Confirm-shaming** — decline option worded to induce guilt | ☐ |
| 7 | **Roach motel** — easy to sign up; cancel requires calling / emailing | ☐ |
| 8 | **Disguised ads** — sponsored content styled identically to editorial | ☐ |

**Action**: any hit must be corrected before shipping. Flag to the user if a hit was
already in the brief — do not implement it silently.

---

## Reporting format

After running all gates, include in your reply:

```
Pre-emit self-critique:
✓ Anti-slop — [summary of any corrections made]
✓ A11y — [summary; note any items requiring manual verification]
✓ No deceptive patterns — [or "Gate 3 skipped — no form/checkout component"]
```
