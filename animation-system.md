# Animation as Functional Feedback

> **Source**: research/06-animation-intent/report.md (Research #6 of 6, 31 May 2026)
> **Core finding**: Animation is the most abused tool in UI. Every animation must answer the question: "What does this motion tell the user?" If you cannot answer that, remove it.

---

## The core principle

Every animation must communicate something to the user.
If you cannot answer "what does this motion tell the user?", remove it.
Animation is feedback, not decoration.

**The test**: Can you state, in one plain-English sentence, what the user learns from this animation? If not, cut it. If the answer is "it looks nice", cut it.

---

## The 8 animation intent classes (full taxonomy)

### ENT — Entrance
- **What it communicates**: "New content has appeared in this context. Your attention should be here."
- **Canonical example**: Modal appearing with fade + scale(0.95→1); notification sliding in from top; article cards appearing on scroll
- **Duration range**: 150–300ms (small elements), 250–400ms (large elements / modals)
- **Easing**: `ease-out` — `cubic-bezier(0, 0, 0.2, 1)` — fast arrival, settled end communicates landing
- **CSS properties (composited only)**: `opacity` (0→1) + `transform: translateY(16px→0)` or `scale(0.97→1)`
- **Performance tier**: GPU-safe — composited layer; no layout or paint cost
- **When it becomes noise**: >2 elements animating simultaneously; content above the fold animating on load (delays first interaction); duration >400ms; stagger delay >120ms between siblings
- **Reduced-motion alternative**: Immediate appearance at full opacity; preserve layout (no jump)

---

### EXT — Exit
- **What it communicates**: "This content is leaving. Your action was accepted. Context is changing."
- **Canonical example**: Toast notification fading out after 3s; modal closing with scale(1→0.95) + fade; deleted item collapsing
- **Duration range**: 100–200ms — faster than entrance. Exit must feel decisive, not dramatic.
- **Easing**: `ease-in` — `cubic-bezier(0.4, 0, 1, 1)` — accelerates out, communicates departure
- **CSS properties (composited only)**: `opacity` (1→0) + `transform: scale(1→0.95)` or `translateY(0→-8px)`
- **Performance tier**: GPU-safe — composited
- **When it becomes noise**: Exit animation delays the user's next action; competes with newly-appearing content
- **Reduced-motion alternative**: Immediate removal — disappearance is instantly understood without animation

---

### STA — State Change
- **What it communicates**: "This element's state has changed. Notice the difference."
- **Canonical example**: Button colour on hover; checkbox state; toggle switching; nav link active state; form field focus
- **Duration range**: 100–200ms — must feel instantaneous; state changes are synchronous with user action
- **Easing**: `ease-in-out` for symmetrical state changes; `ease-out` for hover (responsive to approach)
- **CSS properties**: `color`, `background-color`, `border-color` — paint-triggering but acceptable as one-time transitions (not loops)
- **Performance tier**: Paint-triggering — acceptable for one-time transitions; **never loop these**
- **When it becomes noise**: Duration >200ms (feels sluggish); hover animations across an entire section simultaneously
- **Reduced-motion alternative**: Provide non-motion state indicator as primary signal (border, background, icon); animation is enhancement only

---

### LOD — Loading / Progress
- **What it communicates**: "Work is happening. Please wait. Here is what is being prepared."
- **Canonical example**: Skeleton loading shimmer; indeterminate progress bar; spinner for form submission
- **Duration range**: Indeterminate loop until complete. Shimmer cycle: 1.5–2s. Spinner: 1s rotation.
- **Easing**: `linear` for spinners and progress bars (mechanical precision = computation); `ease-in-out` for shimmer (organic breathing quality)
- **CSS properties (composited only)**: `transform: rotate()` for spinners; `background-position` for shimmer
- **Performance tier**: GPU-safe when using `transform` — watch shimmer (gradient repaint on some engines)
- **When it becomes noise**: Loading state persists after content arrived; multiple simultaneous spinners; spinner for full-page load (use skeleton loading instead)
- **Reduced-motion alternative**: Static loading indicator — retain the skeleton structure, remove the shimmer animation. Loading indicators are **essential** — do not remove them entirely.

---

### ATT — Attention Direction
- **What it communicates**: "Look at this specific element. It requires your attention right now."
- **Canonical example**: Notification badge pulse; CPD reminder highlight; error state shake; "new" badge glow
- **Duration range**: Pulse: 2–3s cycle (infinite, subtle); shake: 300ms one-shot; glow: 1s `ease-in-out`
- **Easing**: Custom spring or `ease-in-out` for pulse; `linear` for shake; `ease-out` for glow
- **CSS properties (composited only)**: `transform: scale()` for pulse; `opacity` for glow; `transform: translateX()` for shake
- **Performance tier**: GPU-safe — composited
- **When it becomes noise**: >1 element pulsing simultaneously; scale beyond 1.05 (too aggressive); pulse continues after user has acknowledged; looping ATT after user interaction
- **Reduced-motion alternative**: Static border or background highlight — the semantic signal must not rely solely on motion

---

### SPA — Spatial Navigation
- **What it communicates**: "You have moved to a different location. Here is where you came from / where you are going."
- **Canonical example**: Tab panel sliding between content; sidebar expanding/collapsing; multi-step form advancing; page route transition
- **Duration range**: 250–400ms — long enough to establish spatial relationship, short enough not to frustrate
- **Easing**: `ease-in-out` — symmetrical, communicates equal weight at departure and arrival
- **CSS properties (composited only)**: `transform: translateX()` or `translateY()` + `opacity`
- **Performance tier**: GPU-safe — composited
- **When it becomes noise**: Slide direction contradicts spatial model (sliding right when going "back"); >400ms duration; used for non-spatial content changes (use ENT instead)
- **Reduced-motion alternative**: Immediate destination state — no slide; cross-fade at most (short opacity transition)

---

### FBC — Feedback Confirmation
- **What it communicates**: "Your action was received and processed successfully."
- **Canonical example**: CPD submission checkmark drawing; form save confirmation; "added to basket" micro-animation; success state reveal
- **Duration range**: 300–500ms — complete within one "breath" after the action
- **Easing**: `ease-out` — fast arrival communicates immediacy of confirmation
- **CSS properties (composited only)**: `opacity` + `transform: scale()` for checkmark reveal; SVG stroke-dashoffset for draw animation
- **Performance tier**: GPU-safe — composited (SVG path animation uses compositor)
- **When it becomes noise**: Confirmation animation on every click (vs. only meaningful completions); duration >500ms; animation so subtle users miss it
- **Reduced-motion alternative**: Static icon + colour change (green checkmark appearing immediately, no draw); the state must be visually distinct without motion

---

### AMB — Ambient / Decorative
- **What it communicates**: Pure visual texture. No semantic meaning. Background enrichment only.
- **Canonical example**: Subtle gradient drift in hero background; particle effect in brand illustration; background geometric shapes shifting slowly
- **Duration range**: Varies — typically slow (3–10s) and looping
- **Easing**: `ease-in-out` or `linear` for infinite loops
- **CSS properties**: Any — but contained in decorative elements, never interactive ones
- **Performance tier**: Treat as GPU-safe only; `backdrop-filter: blur()` on AMB elements = banned on mobile (3–8ms/frame)
- **When it becomes noise**: **Always assume it's noise until proven otherwise.** AMB must not distract from content. Maximum 1 AMB element per viewport. Stops entirely under `prefers-reduced-motion`.
- **Reduced-motion alternative**: Remove entirely — no fallback needed. AMB carries no information.

---

## The animation token system

Define as CSS custom properties in `:root`. These tokens ensure every animation in the system automatically respects `prefers-reduced-motion` — set all durations to 0ms and elements appear instantly in their final state.

```css
:root {
  /* Duration tokens — named by feel, not by ms */
  --anim-duration-instant:    100ms;  /* STA — hover micro-changes */
  --anim-duration-fast:       150ms;  /* EXT, small STA */
  --anim-duration-base:       300ms;  /* ENT, FBC, SPA */
  --anim-duration-slow:       400ms;  /* ENT hero, ATT */
  --anim-duration-deliberate: 500ms;  /* Complex entrance, page-level */

  /* Easing tokens — named by intent */
  --anim-ease-entrance: cubic-bezier(0, 0, 0.2, 1);       /* Fast in, settle (ease-out) */
  --anim-ease-exit:     cubic-bezier(0.4, 0, 1, 1);       /* Accelerate out (ease-in) */
  --anim-ease-state:    cubic-bezier(0.4, 0, 0.2, 1);     /* Symmetric (ease-in-out) */
  --anim-ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);/* Springy — use rarely */
  --anim-ease-linear:   linear;                            /* Loading, progress bars */

  /* Stagger tokens — for sequential entrance */
  --anim-stagger-tight:  50ms;  /* Dense card grids */
  --anim-stagger-normal: 80ms;  /* Standard lists */
  --anim-stagger-loose:  120ms; /* Hero sections */
}

/* Reduced-motion: zero all durations — elements appear in final state */
@media (prefers-reduced-motion: reduce) {
  :root {
    --anim-duration-instant:    0.01ms;
    --anim-duration-fast:       0.01ms;
    --anim-duration-base:       0.01ms;
    --anim-duration-slow:       0.01ms;
    --anim-duration-deliberate: 0.01ms;
    --anim-stagger-tight:       0ms;
    --anim-stagger-normal:      0ms;
    --anim-stagger-loose:       0ms;
  }
}
```

**Why 0.01ms and not 0ms**: Setting duration to 0ms can cause some browsers to skip `transitionend` / `animationend` events, breaking JS that listens for them. 0.01ms is effectively instant but fires the event correctly.

---

## CSS performance tiers (CRITICAL)

The browser rendering pipeline: **Style → Layout → Paint → Composite**. Only `transform` and `opacity` skip directly to Composite (GPU). Everything else is expensive.

### Tier 1 — GPU-composited (SAFE — animate freely)
```
transform: translate() scale() rotate() skew()
opacity
```
These bypass layout and paint entirely. The GPU handles them on a separate thread. Animating these costs ~0.1ms per frame.

### Tier 2 — Paint-triggering (USE CAUTIOUSLY — no loops)
```
background-color
color
border-color
box-shadow
border-radius
outline
```
Trigger the Paint stage — GPU compositing still applies after. Acceptable for **one-time state transitions** (hover, focus, toggle). **Never loop these.** Looping paint-triggering properties costs 4–10× more frame budget than composited properties.

### Tier 3 — Layout-triggering (NEVER ANIMATE)
```
width, height
top, left, right, bottom
margin, padding
display (use opacity + pointer-events instead)
visibility (use opacity instead)
flex-basis, grid-template
```
These invalidate the entire layout tree. On a complex page, one layout-triggering animation can consume the entire 11ms frame budget. Result: jank, dropped frames, sluggish UI.

**Rule**: Use `transform: translateY(-1000px)` not `top: -1000px`. Use `transform: scale(0)` not `width: 0`.

### The `will-change` property

`will-change` tells the GPU to promote an element to its own compositor layer in advance:

```css
/* CORRECT — applied immediately before, removed after */
.card:hover { will-change: transform; }
.card:not(:hover) { will-change: auto; }

/* WRONG — applied globally to all cards */
.card { will-change: transform; } /* Wastes GPU memory for every card on the page */
```

- Apply only to elements that **will animate within the next frame**
- Remove immediately after animation completes (`element.style.willChange = 'auto'`)
- Do NOT apply globally — each `will-change` element costs GPU memory
- Do NOT use for simple hover effects that already animate transform/opacity (compositor handles these without the hint)

---

## WCAG 2.1 SC 2.3.3 — Animation from Interactions

**Level**: AAA — but essential for vestibular safety and any medical/academic audience.
**Full criterion**: "Motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information of the web page."

### The correct `prefers-reduced-motion` implementation

```css
/* WRONG — breaks UI, misses the nuance */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}

/* CORRECT — replace motion with non-motion alternatives */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* Override: essential animations must be explicitly re-enabled */
  .spinner { animation: spin 1s linear infinite !important; } /* Essential — retained */
}
```

**"Reduce" does not mean "remove."** It means reduce. Provide a meaningful static alternative. Do not cut to black; do not make the UI feel broken.

### What "essential" means

An animation is **essential** only when:
1. The animation IS the content (e.g., previewing an animation you authored)
2. The animation conveys information that cannot be conveyed statically (loading state = dynamic — spinner is essential)
3. Removing it causes functional breakage (not merely aesthetic degradation)

Loading spinner: **essential** — static alternative is a static indicator, not removal.
Entrance fade-in: **not essential** — content can appear immediately.
Skeleton shimmer: **not essential** — the skeleton structure is essential, the shimmer is not.

### Vestibular triggers — avoid or provide reduced-motion alternatives

| Animation type | Risk level | Why |
|---|---|---|
| Parallax scrolling | **Critical** | Background/foreground at different rates — disrupts spatial orientation |
| Zoom >10% viewport | **High** | Spatial disorientation from apparent distance change |
| Rotation / continuous spin | **High** | Vestibular conflict with inner ear |
| Large translateX/Y (>200px or >25% viewport) | **High** | Rapid apparent movement across field of view |
| Auto-playing background video | **High** | Constant motion with no user control |
| Rapid opacity flash (>3Hz) | **Seizure risk** | WCAG SC 2.3.1 — hard failure |
| Subtle fade (opacity only) | **Low** | Minimal spatial disruption |
| Colour transitions | **Low** | No spatial component |
| Small pulse (scale 1→1.03) | **Low** | Minimal spatial change |

~35% of adults over 40 have vestibular disorders (NIDCD). 25–30% of macOS users have `prefers-reduced-motion` enabled (WebAIM 2023). For a medical or academic audience, these numbers are not theoretical.

### `prefers-reduced-motion` — per-class alternatives

| Class | Animation | Reduced-motion alternative |
|---|---|---|
| ENT | Fade + translateY | Immediate appearance at full opacity |
| EXT | Fade + scale | Immediate removal |
| STA | Scale + colour | Preserve colour/border change; remove scale/translate |
| LOD | Shimmer / spin | Static skeleton structure (no shimmer); static spinner graphic |
| ATT | Pulse / shake | Static border or background highlight |
| SPA | Slide | Immediate destination state; short crossfade at most |
| FBC | Draw / scale | Static icon + colour change |
| AMB | Any | Remove entirely — no alternative needed |

---

## IntersectionObserver for scroll animations (correct pattern)

**NEVER** use scroll event listeners for animation triggers — they run on the main thread and fire synchronously, costing 2–8ms per scroll event at 60fps.

**ALWAYS** use `IntersectionObserver` — it fires off the main thread at ~0.1ms per check.

```javascript
// Correct scroll-animation pattern
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // Trigger once only
    }
  });
}, {
  rootMargin: '0px 0px -80px 0px', // Trigger 80px before fully in viewport
  threshold: 0.1
});

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

```css
/* CSS side — initial state (hidden) */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--anim-duration-base) var(--anim-ease-entrance),
              transform var(--anim-duration-base) var(--anim-ease-entrance);
}

/* Triggered state (visible) */
.animate-on-scroll.is-visible {
  opacity: 1;
  transform: none;
}
```

### Stagger pattern for card grids

Apply `transition-delay` inline via JS or CSS nth-child:

```css
/* 3-column grid stagger */
.card:nth-child(1) { transition-delay: 0ms; }
.card:nth-child(2) { transition-delay: var(--anim-stagger-normal); }    /* 80ms */
.card:nth-child(3) { transition-delay: calc(var(--anim-stagger-normal) * 2); } /* 160ms */
/* Cap stagger at 3–4 items — beyond that, late cards feel forgotten */
```

---

## Impact metrics (from research)

| Metric | Finding | Source |
|---|---|---|
| Skeleton vs. spinner | −20% abandonment with skeleton loading | UX Collective meta-analysis 2022 |
| `prefers-reduced-motion` adoption | 25–30% macOS, ~7% Windows (growing) | WebAIM 2023 |
| Layout-triggering animations | 4–10× worse frame budget than composited | Chrome DevTools team (Lewis, 2020) |
| Aggressive landing animation | +15–20% bounce rate when >5 simultaneous animations | Baymard Institute 2022 |
| Vestibular disorder prevalence | ~35% of adults 40+ | NIDCD |
| Subtle hover animation CTA | +12–19% CTR vs. static | CXL Institute 2019 |
| Aggressive CTA animation | −8–11% CTR for bouncing/flashing CTAs | CXL Institute 2019 |
| Task completion confidence | +18% with animated micro-interaction feedback | Adaptive Path 2019 |

---

## Anti-patterns (with explanations)

| Anti-pattern | Why it's wrong | Fix |
|---|---|---|
| Animating `width` / `height` | Layout-triggering — causes jank and dropped frames | Use `transform: scaleX()` / `max-height` with `overflow: hidden` (still paint, not layout) |
| Looping ATT (attention) animations | Users learn to ignore them within seconds; they become background noise | Fire once on appearance; stop after user interaction |
| Animation before content is readable | Delays first meaningful interaction; increases bounce | Animate after content is in DOM and readable |
| `backdrop-filter: blur()` on mobile | 3–8ms per frame on low-end mobile — entire frame budget | Use solid background on mobile; blur only on desktop with `@supports` |
| `will-change` on all cards globally | Wastes GPU memory for every card — degrades overall performance | Apply only on hover start; remove on hover end |
| No `prefers-reduced-motion` handling | Genuine accessibility failure; affects 25–30% of macOS users | Implement the token system — durations zero out automatically |
| Entrance animations >600ms | Feels sluggish; users perceive it as broken or slow | Cap ENT at 400ms; hero at 500ms maximum |
| >2 simultaneous animations | Involuntary attention capture overwhelms users; 2.3× task abandonment rate | Stagger or reduce; maximum 2 simultaneous |
| Slide direction contradicts spatial model | Cognitive dissonance — slide-right for "back" feels wrong | Map direction to spatial metaphor: forward=right, back=left, deeper=down |

---

