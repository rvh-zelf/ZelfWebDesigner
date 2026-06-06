# Animation pitfalls (field notes)

Skim **before** large motion work. Each item avoids a common re-record loop.

1. **Off-stage overflow** — absolutely positioned sprites leak hit areas and export bounds; clip the stage.
2. **Sub-pixel jitter** — round transforms; avoid animating `box-shadow` on huge blurs at 60fps unless budgeted.
3. **Layout thrash** — read layout once per frame batch; don't interleave reads/writes.
4. **CSS vs JS clock mismatch** — pick one driver for orchestration when recording.
5. **`prefers-reduced-motion` (mandatory)** — always provide a reduced or static path. This is a WCAG 2.2 AA requirement, not an optional nicety. Flashing > 3 times/second can trigger seizures. Implement:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```
6. **Easing defaults** — `cubic-bezier` beats linear for UI; avoid identical stagger on 20 elements.
7. **Font swap pop** — webfonts: account for metrics shift mid-animation.
8. **Video chrome duplication** — do not draw fake timeline bars inside the canvas if the exporter adds chrome — see `content-guidelines.md`.
9. **Raster scale** — export at target resolution, not upscale tiny canvases.
10. **Colour banding** — add subtle noise in post when using wide gradients.
11. **Loop seams** — if looping, match first/last frame; **respect recording flags** below.
12. **Audio latency** — if pairing sound, test drift vs `requestVideoFrameCallback` / timeline.
13. **Scroll hijack** — nested scroll + `scrollIntoView` breaks prototypes (`react-setup.md`).
14. **Recording contract** — custom engines must:
    - Set `window.__ready = true` on **first painted tick** so headless capture does not grab a blank frame.
    - When `window.__recording === true`, force sensible **`loop`** policy (often `false`) and deterministic duration.

If `assets/animations.jsx` exists, prefer its Stage/Sprite/time helpers over reinventing poorly.

---

## Live Web Animation

15. **Scroll-linked animation jitter** — Native `window.scrollY` / `scroll` event listeners produce janky scroll-linked animations because they fire off the main thread rhythm.
    - Always use **Lenis** as the scroll driver for any scroll-linked animation. Lenis runs scroll in the main thread, is under 4kb, and explicitly restores `position: sticky` and `IntersectionObserver` compatibility that other smooth-scroll libraries (Locomotive Scroll, ScrollSmoother) break.
    - Integrate Lenis with GSAP by feeding `lenis.raf(time * 1000)` into `gsap.ticker.add()`.
    - Known Lenis limitations: capped to 60fps on Safari, 30fps on low-power mode; no native CSS scroll-snap support (use `lenis/snap`); smooth scroll breaks inside iframes.

16. **Recommended scroll animation stack (SvelteKit)** — GSAP ScrollTrigger + Lenis is the correct stack for scroll-driven animations in SvelteKit projects.
    - Framer Motion's `useScroll` and `useInView` are React hooks — they are **not usable in SvelteKit**. Do not suggest or implement Framer Motion in Svelte/SvelteKit projects.
    - Motion (formerly Framer Motion) does have a vanilla JS API, but GSAP ScrollTrigger is better documented, more capable, and the correct default.

17. **Text splitting — accessibility and resize risks** — Text splitting (breaking text into lines/words/characters for animation) has two hard requirements:
    1. **Accessibility**: Always use GSAP SplitText with the default `aria-label` behaviour enabled. SplitText adds `aria-label` to the parent and `aria-hidden` to the split children — this is the minimum. Even so, it does not work reliably across all screen readers and platforms. As of Feb 2026, accessibility advocate Adrian Roselli filed an issue with GSAP noting screen readers do not consistently expose SplitText. Recommendation: test with VoiceOver and NVDA before shipping; consider whether the animation is necessary at all.
    2. **Resize / reflow**: If splitting by lines, the line elements break on container resize or late font load. Always use `autoSplit: true` on GSAP SplitText — it uses a `ResizeObserver` and `document.fonts` listener to automatically revert and re-split, debounced at 200ms.
    - SplitType is a lighter alternative but has no built-in accessibility or auto-reflow handling — apply both manually if using it.

18. **`lerp` and `map` — continuous animation primitives** — For continuous animations (cursor follow, canvas, shape interpolation): use `lerp` (linear interpolation) inside a `requestAnimationFrame` loop, not CSS transitions. CSS transitions are duration-fixed; `lerp` adapts to the screen refresh rate.
    - Formula: `current = lerp(current, target, factor)` where factor is typically 0.05–0.15.
    - Use a `map()` utility to convert normalised scroll progress (0→1) to usable values (pixels, degrees, opacity). GSAP provides `gsap.utils.mapRange()`; Framer Motion provides `useTransform()` (React only).
    - Do not reinvent these — use GSAP utilities or a small shared helper.

19. **CSS sticky — prefer over JS for pinned sections** — `position: sticky` is Baseline Widely Available since March 2022. Prefer it over JavaScript-driven pinning for simple scroll-sticky effects.
    - Common failure modes: element must have an explicit `top`/`bottom` inset value; element must be shorter than its containing scroll area; no ancestor can have `overflow: hidden` unless that ancestor is the intended scroll container.
    - Lenis explicitly re-enables `position: sticky` compatibility — it does not interfere with it the way Locomotive Scroll and ScrollSmoother do.

20. **Shaders / WebGL — use sparingly** — GLSL fragment shaders (via Three.js, OGL, or libraries like VFX-JS, quad-shader) are powerful for distinctive visual effects but carry real performance costs.
    - VFX-JS (a DOM-overlay WebGL library) has documented scrolling lag issues as of 2025. Use with caution and always performance-test on mid-range mobile.
    - Only reach for shaders when the creative brief explicitly demands it. For most projects, GSAP + CSS is sufficient.
    - Always pause/stop shader animation loops when the canvas element is off-screen (use `IntersectionObserver`).

21. **Reveal.js (and any ES-module presentation) — never use `type="module"` for local file delivery** — When a Reveal.js presentation is opened via `file://` (i.e. a user double-clicks `index.html`), browsers enforce a CORS same-origin policy that **silently blocks ES module imports**. The `import` statements fail with no visible error. Reveal never initialises. The result: black screen, no keyboard navigation, no slides.
    - This affects Chrome, Firefox, Edge, and Safari — all modern browsers. It is not a browser bug; it is correct CORS behaviour.
    - **Hard rule:** Any Reveal.js presentation intended for local file delivery (downloaded zip, offline use, emailed file) must use the **UMD build** (`reveal/dist/reveal.js`) loaded via plain `<script src="...">` tags — no `type="module"`, no `import` statements.
    - The same rule applies to plugin loading: use `reveal/dist/plugin/highlight.js`, `notes.js`, `search.js` — not the `.mjs` equivalents.
    - The `.mjs` / ES module builds are only appropriate when the presentation is served over HTTP/HTTPS (a local dev server, a hosted URL). If in doubt, always use the UMD build — it works in both contexts.
    - **Secondary trap:** If GSAP (or any animation library) is used to reveal elements that start at `opacity: 0`, and Reveal fails to initialise, those elements stay permanently invisible — compounding the black screen. Always add a safety fallback:
      ```js
      setTimeout(() => {
          document.querySelectorAll('.gsap-hidden').forEach(el => el.classList.remove('gsap-hidden'));
      }, 1500);
      ```
      This ensures content is never permanently hidden regardless of initialisation failures.

22. **Chart.js in Reveal.js — use a fragment-wired glue layer, not direct imperative calls**

Embedding Chart.js charts in a Reveal.js presentation requires a deliberate architecture. Direct imperative calls (creating and mutating charts inline per-slide) lead to: charts initialising before the slide is visible, mismatched fragment sequences, and no reusability across slides.

### The correct architecture — three components:

**1. Registry**
Maintain a JS object that maps string IDs to Chart.js instances. Every chart registers itself on creation:
```js
const chartRegistry = {};
// After creating a chart:
chartRegistry['campaign-performance'] = new Chart(ctx, config);
```
Fragment handlers look up charts by ID — they never hold direct references.

**2. Action DSL**
Define named action handlers that mutate chart config and call `chart.update()`. Keep them pure and reusable:
```js
const chartActions = {
  showDataset(chart, { index }) {
    chart.data.datasets[index].hidden = false;
    chart.update();
  },
  hideDataset(chart, { index }) {
    chart.data.datasets[index].hidden = true;
    chart.update();
  },
  dimDataset(chart, { index, alpha = 0.2 }) {
    const ds = chart.data.datasets[index];
    ds.borderColor = toAlpha(ds.borderColor, alpha);
    ds.backgroundColor = toAlpha(ds.backgroundColor, alpha);
    chart.update();
  },
  highlightDataset(chart, { index, color }) {
    chart.data.datasets[index].borderColor = color;
    chart.update();
  }
};
```

**3. Fragment wiring**
Hook Reveal's `fragmentshown` and `fragmenthidden` events. Fragments declare intent via `data-` attributes — no logic in the HTML:
```js
deck.on('fragmentshown', ({ fragment }) => {
  const action = fragment.dataset.chartAction;
  const chartId = fragment.dataset.chartId;
  const params  = JSON.parse(fragment.dataset.chartParams || '{}');
  if (action && chartId && chartActions[action]) {
    chartActions[action](chartRegistry[chartId], params);
  }
});

deck.on('fragmenthidden', ({ fragment }) => {
  // Mirror/reverse the action if needed
});
```

Slide HTML stays declarative:
```html
<span class="fragment" data-chart-action="showDataset" data-chart-id="campaign-performance" data-chart-params='{"index":1}'></span>
```

### UX rules for chart fragments

- **Never show a full chart on entry.** Start with axes and an empty or single-dataset state. Reveal datasets one fragment at a time.
- **Sequence:** axes → dataset 1 → uncertainty band or annotation → dataset 2 → summary callout.
- **De-emphasise with alpha** — when a new dataset enters, dim previous ones using a colour utility (`toAlpha(color, 0.25)`). Accent colour reserved for the active dataset.
- **Global Chart.js defaults** — define `Chart.defaults` (font family, font size, colour) once at script init. Every chart inherits them. No per-chart boilerplate.
- **Spaghetti chart warning** — showing all datasets at once overwhelms the audience. If you feel the urge to show everything at once, that is a sign you need more fragments, not fewer.

### File delivery rule
Chart.js must be installed locally (`npm install chart.js`) and the UMD build copied to `./lib/chart.umd.min.js`. Load it as a plain `<script src="lib/chart.umd.min.js">` — no CDN. The same `file://` CORS rule from pitfall 21 applies.
