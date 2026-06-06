# Modal & Overlay Layer Management

> **Full reference for overlay architecture, z-index tokens, ARIA dialog requirements, focus
> management, and overlay choreography. Referenced from `SKILL.md` — read this before building
> any overlay component.**

---

## The Z-Index Token Scale (canonical — use in every project)

Declare these in `:root` on every project. No exceptions.

```css
:root {
  /* ─────────────────────────────────────────────────────
     Z-INDEX TOKEN SCALE — Standard
     Rules:
     1. NEVER use bare integers. Always var(--z-*)
     2. Gaps of 10 allow insertion without renaming
     3. Values < 200 prevent arms-race escalation
     4. Each token documents its intent in its name
  ───────────────────────────────────────────────────── */
  --z-base:            0;   /* Default document flow */
  --z-lift:           10;   /* Elevated cards, sticky footers */
  --z-brand-bar:      10;   /* Thin top utility/brand bar */
  --z-nav:            20;   /* Primary navigation bar */
  --z-dropdown:       30;   /* Nav dropdowns, popovers */
  --z-sticky:         40;   /* In-page sticky elements (TOC, table headers) */
  --z-drawer:         45;   /* Side drawer / off-canvas navigation */
  --z-search:         50;   /* Full-width search overlay */
  --z-toast:          60;   /* Toast/snackbar notifications */
  --z-modal-backdrop: 90;   /* Modal backdrop (semi-transparent overlay) */
  --z-modal:         100;   /* Modal dialog container */
  --z-tooltip:       110;   /* Tooltips — must exceed --z-modal for in-dialog tooltips */
  --z-skip-link:     200;   /* Skip-to-content — always topmost, accessibility */
}
```

| Token | Value | Layer |
|---|---|---|
| `--z-base` | 0 | Normal document flow |
| `--z-brand-bar` | 10 | Top utility/brand bar |
| `--z-nav` | 20 | Primary navigation |
| `--z-dropdown` | 30 | Nav dropdowns |
| `--z-sticky` | 40 | Sticky elements (sidebar, table headers) |
| `--z-drawer` | 45 | Side/off-canvas drawer |
| `--z-search` | 50 | Search overlay |
| `--z-toast` | 60 | Notification toasts |
| `--z-modal-backdrop` | 90 | Modal backdrop |
| `--z-modal` | 100 | Modal dialog |
| `--z-tooltip` | 110 | Tooltips (always above modal) |
| `--z-skip-link` | 200 | Accessibility skip link (always topmost) |

**Rule: `z-index: 9999` is ALWAYS wrong. Never use a magic number.**  
**Rule: Always declare these as CSS custom properties in `:root`.**

---

## Why Stacking Contexts Break Z-Index Assumptions

A new stacking context is created when an element has any of:
- `position: fixed` or `position: sticky`
- `position: relative/absolute` + `z-index` not `auto`
- `opacity < 1`
- `transform` not `none`
- `filter` not `none`
- `will-change: transform/opacity`
- `isolation: isolate`
- `contain: layout/paint/strict/content`
- `mix-blend-mode` not `normal`

**The trap:** A tooltip inside a card with `transform: translateY(-2px)` (a common hover effect)
will never appear above a fixed nav — the card's stacking context caps the tooltip's effective z-index,
regardless of how high the number is. `z-index: 9999` on a child of a `z-index: 1` parent cannot
escape that parent.

**Why z-index: 9999 is an anti-pattern:**
1. Arms-race escalation: Dev A uses 9999, Dev B uses 10000, Dev C uses 99999. No end state.
2. Stacking context traps: child elements cannot exceed parent layer regardless of value.
3. Intent invisible: the number communicates nothing about WHY this layer is at the top.
4. Debugging is painful: requires inspecting computed styles to find conflicting values.
5. Conflicts are inevitable: two developers will independently assign the same high value.

**The correct fix: portal pattern.** Move overlay elements to `document.body` root — not inside
the component that triggers them. This escapes all stacking context traps.

```javascript
// Portal pattern — append to body, not inside component
const modal = document.createElement('div');
modal.setAttribute('role', 'dialog');
document.body.appendChild(modal);
```

---

## The 5 Overlay Types — When to Use Each

| Type | Use case | z-index token | Mobile behaviour |
|---|---|---|---|
| **Modal dialog** | Requires user decision | `--z-modal` | Full-screen |
| **Alert dialog** | Destructive/irreversible action | `--z-modal` | Full-screen |
| **Search overlay** | Full-page search | `--z-search` | Full-screen |
| **Toast notification** | Non-blocking feedback | `--z-toast` | Bottom of screen |
| **Drawer / Bottom sheet** | Secondary navigation, filters | `--z-modal` | Bottom sheet |

**Rule: Never use a modal for information that doesn't require a decision.**  
**Rule: Never trigger a modal immediately on page load — minimum scroll trigger or user action.**

### Decision matrix: modal vs toast vs inline

| Condition | Use Toast | Use Modal | Use Inline |
|---|---|---|---|
| Low urgency, non-blocking | ✅ | ✗ | ✗ |
| Action confirmation ("saved") | ✅ | ✗ | ✗ |
| Requires user decision | ✗ | ✅ | ✗ |
| Irreversible action confirmation | ✗ | ✅ `alertdialog` | ✗ |
| Error that blocks progress | ✗ | ✅ | ✗ |
| Background process complete | ✅ | ✗ | ✗ |
| Session timeout warning | ✗ | ✅ `alertdialog` | ✗ |
| Marketing/newsletter prompt | ✗ | ✗ | ✅ slide-in |
| Inline validation error | ✗ | ✗ | ✅ field-level |

---

## WCAG 2.2 & WAI-ARIA Dialog Requirements (full checklist)

**~73% of modal dialogs fail at least one WCAG 2.1 criterion** (WebAIM 2021). This section is
non-negotiable — inaccessible modals are broken modals.

### Required ARIA attributes

| Attribute | Where | Why |
|---|---|---|
| `role="dialog"` | Dialog container | Communicates semantics to AT |
| `role="alertdialog"` | Destructive/irreversible | AT interrupts user — use only for time-critical alerts |
| `aria-modal="true"` | Dialog container | Instructs AT to treat background as inert |
| `aria-labelledby="[heading-id]"` | Dialog container | Accessible name = visible heading text |
| `aria-describedby="[desc-id]"` | Dialog container | Supplementary description read after name |
| `tabindex="-1"` | Dialog container | Allows programmatic focus via `dialog.focus()` |
| `aria-label="Close dialog"` | Close button (✕) | Icon-only buttons need explicit labels |
| `aria-hidden="true"` | Background content | Prevents AT navigating behind open modal |
| `inert` | Background content | Removes from tab order + AT tree + pointer interactions |

### `role="dialog"` vs `role="alertdialog"`

| Scenario | Role |
|---|---|
| Registration / subscribe form | `role="dialog"` |
| Image lightbox | `role="dialog"` |
| Cookie consent | `role="dialog"` |
| Session timeout warning | `role="alertdialog"` |
| Delete confirmation (irreversible) | `role="alertdialog"` |
| Marketing/newsletter prompt | `role="dialog"` (not alertdialog) |

### `aria-modal` VoiceOver bug mitigation

VoiceOver on macOS/iOS sometimes ignores `aria-modal` and allows AT navigation into background
content. Use belt-and-braces approach:
1. `aria-modal="true"` on dialog container
2. `aria-hidden="true"` on all background content
3. `inert` attribute on all background content

### Required keyboard interactions (WAI-ARIA APG)

| Key | Behaviour |
|---|---|
| `Tab` | Next focusable element within dialog (wraps) |
| `Shift+Tab` | Previous focusable element within dialog (wraps) |
| `Escape` | Dialog closes; focus returns to trigger |

### `inert` attribute

Browser support 2025: Chrome 102+, Firefox 112+, Safari 15.5+ — **~96% global support**.
Production-ready. Apply to `<main>`, `<header>`, `<footer>` etc. when modal is open.

```javascript
// Open modal — set inert + aria-hidden on background
document.querySelectorAll('body > *:not(#modal-dialog):not(#modal-backdrop)')
  .forEach(el => { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); });

// Close modal — remove inert + aria-hidden
document.querySelectorAll('[inert]')
  .forEach(el => { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); });
```

---

## Focus Management (on open and on close)

**WCAG SC 2.4.3 Focus Order (Level AA)**

### On open:
1. Store reference to triggering element: `const trigger = document.activeElement`
2. Add `aria-hidden="true"` and `inert` to all background content
3. Lock body scroll: `document.body.style.overflow = 'hidden'`
4. Wait one animation frame, then focus the dialog or its first interactive child
5. Attach keydown handler for Tab trap and Escape

### On close:
1. Remove `aria-hidden` and `inert` from background content
2. Restore body scroll: `document.body.style.overflow = ''`
3. Remove keydown handler
4. `trigger.focus()` — return focus to the exact element that opened the dialog

### Critical failure modes observed in the wild:
- Escape closes dialog but focus goes to `body` — user is lost
- Tab escapes the dialog into background content — modal becomes non-modal
- Focus goes to first input on open but heading is never read — AT user has no context
- Close button not keyboard-reachable (outside tab order or `pointer-events: none`)

---

## Focus Trap Implementation (correct pattern)

```javascript
function trapFocus(dialog) {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const focusable = [...dialog.querySelectorAll(focusableSelectors)];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  dialog.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal(); // restores focus to trigger
      return;
    }
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift+Tab: if on first, loop to last
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: if on last, loop to first
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
```

---

## Overlay Choreography (animation)

All animations must respect `prefers-reduced-motion`.

### Entry animations
- **Centred modal**: `scale(0.95) + opacity(0)` → `scale(1) + opacity(1)`
- **Top-entry overlay** (search): `translateY(-100%)` → `translateY(0)`
- **Bottom sheet**: `translateY(100%)` → `translateY(0)`
- **Duration**: 200–300ms
- **Easing**: `ease-out` (decelerates into place)
- **Backdrop**: `opacity(0)` → `opacity(1)`, 200ms, `linear`

### Exit animations
- Reverse of entry
- **Duration**: 150–200ms (exits faster than entries — user is done)
- **Easing**: `ease-in` (accelerates away)

### CSS template

```css
/* Centred modal */
.modal {
  transform: scale(0.95);
  opacity: 0;
  transition: transform 250ms ease-out, opacity 250ms ease-out;
}
.modal.is-open {
  transform: scale(1);
  opacity: 1;
}
.modal-backdrop {
  opacity: 0;
  transition: opacity 200ms linear;
}
.modal-backdrop.is-open {
  opacity: 1;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .modal, .modal-backdrop {
    transition: opacity 100ms linear;
    transform: none;
  }
}
```

### Body scroll lock

```javascript
// Lock
document.body.style.overflow = 'hidden';
// Unlock
document.body.style.overflow = '';
```

### `backdrop-filter: blur()` performance warning

`backdrop-filter: blur(Npx)` promotes the element to its own GPU layer. On pages with many
layers, this causes composite layer explosion — measurable frame-rate drops on mid-range
mobile hardware. Limit blur to 4–8px maximum, on the backdrop div only. Alternative: dark
semi-transparent background without blur (`background: rgba(0,0,0,0.5)`) has zero performance cost.

---

## Impact Metrics (from research)

| Metric | Value | Source | Confidence |
|---|---|---|---|
| Modal dialogs failing ≥1 WCAG 2.1 criterion | ~73% | WebAIM Screen Reader Survey 2021 | Medium |
| Keyboard-only user task failure on inaccessible modals | ~40–60% | Deque accessibility audits 2020–2023 | Medium |
| Screen reader abandonment when modal focus fails | Est. 80%+ | NNGroup qualitative studies | Low |
| User abandonment — immediate-trigger modal (<5 seconds) | 65–85% dismiss within 2s | NNGroup 2022 | High |
| Conversion improvement — scroll-triggered vs immediate modal | 2–4× at 50% scroll depth | OptinMonster 2021 | Medium |
| `backdrop-filter: blur(8px)` frame rate impact | ~3–8ms additional per-frame on mid-range mobile | Chrome DevTools GPU profiling | Medium |
| Mobile bottom sheet vs modal completion rate | Bottom sheet ~15–25% higher | Google Material Design internal research | Medium |
| Modal fatigue — newsletter modal CTR decay | 40–60% drop after 3rd exposure (same user) | Sumo/ConvertKit 2022 | Medium |
| `inert` attribute browser support | ~96% global | caniuse.com 2025 | High |

---

## Anti-Patterns (with explanations)

| Anti-pattern | Why it's wrong | Fix |
|---|---|---|
| `z-index: 9999` (or any magic number) | Causes arms-race escalation; breaks inside stacking contexts | Use `var(--z-modal)` |
| No focus trap | Tab key escapes dialog into background content — modal becomes non-modal | Implement Tab/Shift+Tab loop within dialog |
| No Escape key handler | Keyboard users cannot close modal | Close on `keydown` Escape, restore focus |
| Focus drops to `body` on close | Screen reader user loses position | `trigger.focus()` on close |
| `aria-hidden` missing on background | VoiceOver navigates behind open modal | Set `aria-hidden="true"` + `inert` on background |
| `role="alertdialog"` on marketing modal | AT interrupts user for non-critical content | Use `role="dialog"` |
| No `aria-labelledby` | Dialog has no accessible name — AT announces "dialog" with no context | Point to visible heading inside dialog |
| Modal on page load (immediate trigger) | 65–85% dismiss within 2 seconds without reading | Trigger at 50%+ scroll depth or on user action |
| `backdrop-filter: blur(>8px)` | GPU layer explosion on mid-range mobile | Reduce blur or use `rgba()` backdrop only |
| Modal instead of toast | Interrupts user for non-decision information | Use toast for confirmations, modal for decisions only |
| No body scroll lock | Users scroll background behind open modal | `document.body.style.overflow = 'hidden'` on open |
| No `prefers-reduced-motion` path | Causes vestibular disturbance for affected users | Disable translate/scale; keep opacity fade only |

---

## Full Example Reference

See the overlay examples and verified implementations in your project's design references.
- `example-1-z-index-chaos.html` — anti-pattern chaos vs token-based fix (toggle)
- `example-2-accessible-dialog.html` — fully accessible modal with all ARIA and keyboard requirements
- `example-3-overlay-system.html` — complete overlay stack with all 5 overlay types running simultaneously

---

*Sources: WAI-ARIA APG Dialog Pattern (w3.org); WebAIM Screen Reader User Survey 2021; NNGroup modal research; Smashing Magazine accessible overlays; web.dev prefers-reduced-motion; caniuse.com inert attribute. Sites analysed: stripe.com (best-in-class), linear.app (best-in-class), theguardian.com, nytimes.com, medscape.com, bmj.com.*
