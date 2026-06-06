# Advertising Accommodation — Layout Architecture

Full reference for ad slot architecture in editorial publisher layouts.
Companion to the Advertising Accommodation section in `SKILL.md`.

---

## Core mental model

> **Ads are structural constraints, not content. Reserve IAB dimensions in CSS BEFORE designing the editorial layout.**

This is how print publishing has always worked: the designer receives the ad sizes before laying out the page, and leaves those holes. The web has foolishly tried to do it backwards. Do not make that mistake.

A leaderboard slot is not "a div where an ad will appear later." It is a **125px-tall reservation** (14px label + 111px ad content) that exists in the document whether or not an ad fills it. Design the editorial layout around this reserved space — never the other way around.

The five-step process:
1. Identify which IAB units appear on this page type (article, category, homepage)
2. Reserve their exact dimensions in CSS **before** any other layout decisions
3. Design the editorial layout to fill the remaining space
4. Style empty slots with "Advertisement" labels and neutral placeholder backgrounds
5. When ads load, they fill the reserved space — nothing moves

---

## Example House Standard Sizes

Example house standard sizes for an editorial publisher. Adapt to your own IAB unit selection.

| Unit | Size | Total Slot Height | Placement | Sidebar Breakpoint |
|------|------|------------------|-----------|-------------------|
| **Leaderboard** | **1200 × 111px** | 125px (14px label + 111px) | Above nav; inline between sections | N/A — full width |
| **MPU / Medium Rectangle** | **300 × 250px** | 264px (14px label + 250px) | Sidebar top | ≥ 1280px only |
| **Half-Page** | **300 × 600px** | 614px (14px label + 600px) | Sidebar below MPU | ≥ 1280px only |

**Leaderboard basis:** 970×90 Billboard ratio (10.78:1) scaled to 1200px container. Applies to all full-width leaderboard placements.

**Sidebar:** activates at **1280px** viewport width minimum. Below 1280px, sidebar and all sidebar ad units are hidden entirely (`display: none`). On mobile and tablet, sidebar MPU/half-page is replaced by an in-content MPU post-paragraph 3.

---

## IAB Standard Reference (Full Portfolio)

For reference when communicating with ad operations or third-party networks:

| Unit Name | Dimensions (px) | Status | CPM Tier | Notes |
|-----------|-----------------|--------|----------|-------|
| Billboard | 970 × 250 | Rising Star | Premium | Above-fold impact; rarely used |
| Leaderboard | 728 × 90 | Standard | Standard (£2.50–4) | Tablet/desktop primary |
| Super Leaderboard / Billboard | 970 × 90 | Rising Star | Premium (£4–7) | Desktop primary; above nav preferred |
| **Half Page / Double MPU** | **300 × 600** | Rising Star | Premium (£6–12) | Sidebar lower position; high engagement |
| **Medium Rectangle (MPU)** | **300 × 250** | Standard | Premium (£5–9 pharma) | Highest CPM in sidebar; most traded unit |
| Wide Skyscraper | 160 × 600 | Standard | Standard (£3–5) | Sidebar alternative to half-page |
| Mobile Banner | 320 × 50 | Mobile | Base (£0.80–2) | Mobile-first default |
| Large Mobile Banner | 320 × 100 | Mobile | Base-Standard | Mobile alternative to MPU |





---

## The Reserved-Space Pattern — Preventing CLS

### Why CLS matters

Cumulative Layout Shift (CLS) is a Google Core Web Vitals ranking signal. It measures unexpected visual shift of page content during load.

- **CLS thresholds:** Good < 0.1 | Needs Improvement 0.1–0.25 | Poor > 0.25
- **Without reserved space:** A typical editorial article page (leaderboard + MPU + half-page + 1 in-content unit) scores CLS 0.18–0.31 — "Poor" range. This actively harms search ranking.
- **With reserved space:** Same page scores CLS = **0.00**.
- **Above-fold leaderboard without reservation:** impact fraction ~1.0 × distance fraction 0.1 = 0.10 (at the boundary of "Needs Improvement") per unit.

Source: Google web.dev, "Cumulative Layout Shift (CLS)" — Philip Walton, December 2023.

### The correct CSS — reserve height BEFORE the ad loads

```css
/* =============================================================
   AD SLOT BASE — RESERVED SPACE PATTERN
   All dimensions declared upfront. Slot exists in layout
   regardless of ad load state. CLS = 0.00.
   ============================================================= */

.ad-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #c8d4e0;
  overflow: hidden;
  position: relative;
}

.ad-slot__label {
  /* "Advertisement" disclosure — ASASA/CAP required */
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10px;
  color: #8a9bb0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 0 2px;
  text-align: center;
  width: 100%;
  border-bottom: 1px solid #c8d4e0;
  flex-shrink: 0;
  height: 14px; /* Fixed — counts toward total slot height */
}

.ad-slot__body {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Use `min-height`, not `height` — allows taller creatives

```css
/* min-height allows rich-media or expanded creatives to grow
   without overflow. Use height only when the spec is truly fixed. */
.ad-mpu {
  width: 300px;
  min-height: 264px; /* 14px label + 250px creative */
}

.ad-half {
  width: 300px;
  min-height: 614px; /* 14px label + 600px creative */
}
```

### "Advertisement" label — ASASA/ASA compliance

Every ad slot **must** carry a visible "Advertisement" disclosure label. This is required by ASASA (Advertising Standards Authority of South Africa) and its CAP/ASA equivalents.

- Position: above the ad creative, inside the slot container
- Style: small (10px), uppercase, muted grey (`#8a9bb0` or similar)
- Must be visible at all times — not hidden when the ad loads

```html
<div class="ad-slot ad-leaderboard" aria-label="Advertisement">
  <div class="ad-slot__label" aria-hidden="true">Advertisement</div>
  <div class="ad-slot__body" id="ad-leaderboard-top"></div>
</div>
```

### Skeleton placeholder while ad loads

```css
/* Animated skeleton while ad is loading — prevents blank grey box feel */
.ad-slot--loading .ad-slot__body {
  background: linear-gradient(
    90deg,
    #f0f4f8 0%,
    #e0e8f0 50%,
    #f0f4f8 100%
  );
  background-size: 200% 100%;
  animation: ad-skeleton 1.5s ease infinite;
}

@media (prefers-reduced-motion: reduce) {
  .ad-slot--loading .ad-slot__body {
    animation: none;
    background: #f0f4f8;
  }
}

@keyframes ad-skeleton {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## Full CSS Implementation — All Ad Slot Classes

```css
/* ================================================================
   EDITORIAL PUBLISHER — COMPLETE AD SLOT CSS
   Example house standard sizes.
   All slots use reserved-space pattern. CLS = 0.00.
   ================================================================ */

:root {
  /* Ad unit dimensions as CSS custom properties */
  --ad-leaderboard-w: 1200px;   /* house standard */
  --ad-leaderboard-h: 111px;    /* house standard */
  --ad-mpu-w:         300px;    /* IAB standard */
  --ad-mpu-h:         250px;    /* IAB standard */
  --ad-half-w:        300px;    /* IAB standard */
  --ad-half-h:        600px;    /* IAB standard */
  --ad-label-h:       14px;     /* "Advertisement" label row */
  --ad-bg:            #f8f9fa;
  --ad-border:        #c8d4e0;
  --ad-label-color:   #8a9bb0;
}

/* ---- Base slot ---- */
.ad-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--ad-bg);
  border: 1px solid var(--ad-border);
  overflow: hidden;
  position: relative;
}

.ad-slot__label {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10px;
  color: var(--ad-label-color);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 0 2px;
  text-align: center;
  width: 100%;
  border-bottom: 1px solid var(--ad-border);
  flex-shrink: 0;
  height: var(--ad-label-h);
}

.ad-slot__body {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ---- Leaderboard — above nav (house standard: 1200×111px) ---- */
.ad-leaderboard {
  width: 100%;
  max-width: var(--ad-leaderboard-w);
  min-height: calc(var(--ad-label-h) + var(--ad-leaderboard-h)); /* 125px */
  margin: 0 auto;
}

/* ---- Leaderboard — inline between content sections ---- */
.ad-leaderboard-inline {
  width: 100%;
  max-width: var(--ad-leaderboard-w);
  min-height: calc(var(--ad-label-h) + var(--ad-leaderboard-h)); /* 125px */
  margin: 32px auto;
}

/* ---- Leaderboard wrapper (full-width background strip) ---- */
.ad-leaderboard-wrap {
  width: 100%;
  background: #fff;
  border-top: 1px solid var(--ad-border);
  border-bottom: 1px solid var(--ad-border);
  display: flex;
  justify-content: center;
  padding: 0;
}

/* ---- MPU / Medium Rectangle (300×250px) ---- */
.ad-rect {
  width: var(--ad-mpu-w);
  min-height: calc(var(--ad-label-h) + var(--ad-mpu-h)); /* 264px */
  max-width: 100%;
}

/* ---- Half-Page (300×600px) ---- */
.ad-half {
  width: var(--ad-half-w);
  min-height: calc(var(--ad-label-h) + var(--ad-half-h)); /* 614px */
  max-width: 100%;
}

/* ---- Sidebar container ---- */
.ad-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 300px;
}

/* ================================================================
   RESPONSIVE LEADERBOARD — mobile-first
   Hides on mobile (<768px). 1200px at desktop.
   ================================================================ */

.ad-leaderboard-wrap {
  display: none; /* Hidden on mobile — do not collapse to zero inline */
}

@media (min-width: 768px) {
  .ad-leaderboard-wrap {
    display: flex;
  }
}

/* ================================================================
   AD BLOCKER GRACEFUL COLLAPSE
   JavaScript adds .ad-slot--empty after timeout.
   Transition prevents jarring layout jump.
   ================================================================ */
.ad-slot--empty {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden;
  border-width: 0;
  margin-top: 0;
  margin-bottom: 0;
  transition: min-height 0.3s ease, height 0.3s ease;
}
```

### Ad blocker collapse JavaScript

```javascript
// Collapse empty ad slots gracefully after load + timeout
function collapseEmptyAdSlots() {
  document.querySelectorAll('.ad-slot').forEach(slot => {
    const body = slot.querySelector('.ad-slot__body');
    const hasContent = body && body.children.length > 0 &&
                       body.offsetHeight > 0;
    if (!hasContent) {
      slot.classList.add('ad-slot--empty');
    }
  });
}
// Call after page load + ad timeout (typically 3–5s)
window.addEventListener('load', () => setTimeout(collapseEmptyAdSlots, 3000));
```

---

## Page Layout Architecture with Ads

### Correct page structure (document order)

```
[Brand bar / utility bar]         ← 36px
[Leaderboard wrap — 1200×111px]   ← 125px — ABOVE nav
[Primary navigation]              ← 60px (sticky: top: 0 after leaderboard scrolls away)
[Page content]
  ├── [Main article column]       ← calc(100% - 340px) at 1280px+
  │     ├── [Article content]
  │     └── [Inline leaderboard] ← between Featured and Latest sections
  └── [Sidebar — 300px]          ← position: sticky; top: [nav-height + gap]
        ├── [MPU — 300×250]
        └── [Half-page — 300×600]
[Footer]
```

### `main-with-sidebar` grid pattern

```css
/* Mobile first — single column */
.main-with-sidebar {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Sidebar activates at 1280px */
@media (min-width: 1280px) {
  .main-with-sidebar {
    grid-template-columns: 1fr 300px;
    gap: 40px;
  }
}

/* Sidebar hidden below 1280px */
@media (max-width: 1279px) {
  .main-with-sidebar > .sidebar {
    display: none;
  }
}
```

### Sidebar sticky pattern

```css
@media (min-width: 1280px) {
  .sidebar {
    position: sticky;
    top: calc(var(--header-height, 100px) + 16px); /* nav height + gap */
    height: fit-content;
    max-height: calc(100vh - var(--header-height, 100px) - 32px);
    overflow-y: auto;
    scrollbar-width: none;
  }
}
```

**Note:** `--header-height` must account for the full sticky header stack: utility bar (36px) + leaderboard (125px, when still in viewport) + primary nav (60px) = 221px initially, reducing to 96px (utility + nav) once the leaderboard scrolls out of view. Use `IntersectionObserver` or CSS custom property updates via JS to track this.

### Viewability impact of sticky sidebar (from IAS Publisher Benchmarks H2 2024)

| Position | Non-sticky viewability | Sticky viewability |
|----------|----------------------|-------------------|
| Above-fold leaderboard | 68–78% | Same (not sticky) |
| Sidebar MPU (top) | 72–82% | **85–92%** |
| Sidebar half-page | 55–68% | Improves with sticky |

Sticky sidebar = directly measurable CPM improvement. This is a revenue decision.

---

## Breakpoint Behaviour

| Viewport | Sidebar | Leaderboard | In-content MPU |
|----------|---------|-------------|----------------|
| **≥ 1280px** | ✅ Visible, sticky | 1200px wide | Optional (post-para 3) |
| **1024px–1279px** | ❌ Hidden | 1200px wide (max-width) | ✅ Replaces sidebar MPU |
| **768px–1023px** | ❌ Hidden | 1200px wide (max-width) | ✅ Replaces sidebar MPU |
| **< 768px** | ❌ Hidden | ❌ Hidden (display: none) | ✅ 300×250 in-content |

**Rule for hiding leaderboard on mobile:** Use `display: none` on the wrapper — not `width: 0` or `height: 0`. The wrapper must not leave a collapsed empty element that contributes to layout jank. The `display: none` approach is correct here because the slot is being intentionally removed, not waiting to load.

**Rule for sidebar hidden below 1280px:** Apply `display: none` on the sidebar grid column child. The grid itself resets to single column.

---

## CSS Patterns That BREAK With Ads (Anti-patterns)

### ❌ Anti-pattern 1: `overflow: hidden` on a parent that contains a sticky sidebar

```css
/* BROKEN */
.content-wrapper { overflow: hidden; } /* clips sticky sidebar — it will not stick */

/* ✅ CORRECT */
.content-wrapper { overflow: visible; } /* or remove the rule entirely */
/* Use overflow: clip only if you need to suppress scrollbar on the axis perpendicular to sticky */
```

**Why:** `overflow: hidden` creates a new containing block, which breaks `position: sticky`. The sidebar will scroll with the page instead of sticking. This is one of the most common bugs in ad sidebar implementations.

### ❌ Anti-pattern 2: Fixed-width containers

```css
/* BROKEN — width not max-width */
.page-wrapper { width: 1200px; }
/* A 1200px leaderboard + 300px sidebar + 40px gap = 1540px > 1200px → overflow */

/* ✅ CORRECT */
.page-wrapper { max-width: 1280px; width: 100%; margin: 0 auto; }
```

### ❌ Anti-pattern 3: Negative margins on breakout elements

```css
/* BROKEN — negative margin on pull-quotes or breakout elements */
.pull-quote { margin: 16px -20px; }
/* When in-content ad has variable width → negative margin interacts unpredictably */

/* ✅ CORRECT — full-width approach using padding on parent */
.article-body { padding: 0 24px; }
.pull-quote { margin: 16px 0; width: 100%; }
```

### ❌ Anti-pattern 4: `display: none` pre-load (causes CLS on reveal)

```css
/* BROKEN — hiding the slot before ad loads */
.ad-slot { display: none; }
/* When ad loads and display: block is added → layout shift equal to slot height */

/* ✅ CORRECT — reserve space always */
.ad-slot {
  min-height: 264px; /* Space reserved whether or not ad loads */
  display: flex;
}
/* If ad never loads, JavaScript adds .ad-slot--empty to collapse gracefully */
```

---

## IAB LEAN Principles (Reference)

| Letter | Principle | Rule |
|--------|-----------|------|
| **L** | Light | Ads must not exceed 15 seconds auto-play animation. Display: 200KB initial, 300KB max. |
| **E** | Encrypted | All ads served over HTTPS. HTTP ads blocked by all modern browsers. |
| **A** | Ad Choices supported | IAB AdChoices icon required for behavioural targeting. Click must link to opt-out. |
| **N** | Non-invasive / Non-deceptive | Ad must not obscure content, auto-play audio, mimic system alerts, or use fake close buttons. |

---

## Impact Metrics (From Research Report)

All figures from published research and industry benchmarks (see Sources below).

| Metric | Without Reserved Space | With Reserved Space | Source | Confidence |
|--------|----------------------|---------------------|--------|-----------|
| CLS score (leaderboard + MPU + inline) | 0.18–0.31 ("Poor") | **0.00** | Google web.dev | High |
| Viewability — above-fold leaderboard | 68–78% | 72–82% (stable) | IAB/IAS benchmarks | High |
| Viewability — sticky sidebar MPU | 72–82% | **85–92%** (sticky) | IAS Publisher Benchmarks H2 2024 | High |
| CPM — above-nav leaderboard | £4–7 | £4–7 | Industry estimates | Medium |
| CPM — pharma-targeted MPU | £8–15 (est.) | £8–15 (est.) | Medscape/BMJ rate cards (est.) | Low |
| CPM — in-content MPU (post-para 3) | £3–6 | £5–9 (+40–65%) | IAS/Moat engagement data | Medium |
| Search ranking impact (CLS "Poor" vs "Good") | -5 to -15% organic visibility | Neutral | Google CWV documentation | Medium |
| Ad blocker rate (medical/clinical desktop) | 22–30% | 22–30% | PageFair 2024 | High |
| Revenue per session — good vs poor layout | — | +25–40% (est.) | Baymard Institute estimates | Low |

> **CPM flag:** Figures are estimates from public rate cards and industry benchmarks. Actual CPM depends on audience demographics, advertiser targeting, and programmatic floor prices.

---

## In-Content Ad Density Rules

From IAB guidelines and publisher research:

- Maximum **1 in-content ad unit per 1,000 words** of article content
- Maximum **2 in-content units per article**, regardless of article length
- Minimum gap between consecutive in-content ads: **500px of content**
- First in-content unit: post-paragraph 3 minimum (user must engage before seeing in-content ad)
- No ads within the first 2 paragraphs — this is a Coalition for Better Ads standard violation

Ad density beyond **30% of screen area** measurably reduces reading comprehension (Pieters, Wedel & Batra, Journal of Advertising, 2012).

---

## Sources

| # | Source | Date |
|---|--------|------|
| 1 | Google web.dev — CLS documentation | 31 May 2026 |
| 2 | IAB New Ad Portfolio | 31 May 2026 |
| 3 | Nielsen Norman Group — Banner Blindness | 31 May 2026 |
| 4 | Integral Ad Science — Industry Benchmarks H2 2024 | 2024 |
| 5 | PageFair/Blockthrough — Ad Blocking Report 2024 | 2024 |
| 6 | Guardian, BMJ, Medscape, The Lancet, Healio, Smashing Magazine — site analyses | 31 May 2026 |
| 7 | Pieters, Wedel & Batra — Ad Density Research | Journal of Advertising, 2012 |
| 8 | IAB "LEAN" Principles | 2024 |
| 9 | Coalition for Better Ads Standards | 2024 |


