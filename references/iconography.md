# Iconography

Rules, resources, and quality gates for using and designing icons in UI work.
Apply this reference whenever any task involves selecting, customising, or producing icons.

---

## Core principles

1. **Recognition before aesthetics.** An icon must communicate its meaning within ~200ms. Novelty that sacrifices recognisability is a failure, not a feature.
2. **Familiar metaphors.** House = home. Gear = settings. Envelope or paper plane = mail. Magnifying glass = search. Do not reinvent these — extend them.
3. **One style per set.** Never mix outline and filled icons in the same UI context. Never mix stroke weights, corner radii, or grid sizes across icons in a set.
4. **Minimal detail.** Include only the detail needed to be understood. Over-ornamented icons degrade at small sizes.
5. **Cohesion without sacrificing meaning.** Consistency is required, but never at the cost of recognisability.

---

## Grid and geometry

- **Standard canvas**: 24×24 px for most UI; 16×16 px for dense toolbars/status bars; 20×20 px for compact interfaces.
- **Live area / safe zone**: leave a 2 px margin inside the canvas. A 24×24 canvas has a 20×20 live area.
- **Keylines**: use standard geometric keylines (squares, circles, rectangles) to ensure different icon shapes carry consistent visual weight.
- **Pixel perfection**: vectors must snap to the grid on whole pixels — prevents blurring on low-DPI screens.

---

## Stroke and style consistency

| Property | Rule |
|---|---|
| Stroke width | 2 px for 24×24 icons; 1–1.5 px for 16×16 icons |
| Corner radius | One value across the full set — odd numbers (3 px, 5 px) tend to render cleanly |
| Internal spacing | Consistent — 3 px is a common baseline |
| Fill vs outline | Pick one; only switch between states (e.g. active = filled, inactive = outline) |
| Colour — functional icons | One colour; use colour to indicate state only |
| Colour — decorative icons | Max 3 colours; absolute max 5 for large decorative graphics |

---

## Optical correction

Mathematical centering ≠ visual centering. The human eye perceives weight differently to raw coordinates.

- **Circles and triangles** must sit slightly larger than their bounding box feels balanced against squares.
- **Asymmetric icons** (play button, paper plane) must be optically nudged — not just mathematically centred.
- **Blur test**: blur the icon set. Icons should feel roughly equal in visual weight/darkness to the standard base shapes (circle, square) in the set. Any icon that reads dramatically heavier or lighter needs correction.
- Trust the eye. If it looks off, it is off.

---

## Animated icons

### When to use animation
- Use animation for state changes (e.g. menu → close, play → pause), loading, and micro-feedback.
- Do not animate purely for decoration — unnecessary animation reduces usability and adds weight.
- Always respect `prefers-reduced-motion`: provide a static fallback for every animated icon.

### Implementation formats — choose deliberately

| Format | Runtime cost | Best for |
|---|---|---|
| CSS-animated SVG | Zero — native browser | Simple icon animations: spin, pulse, morph |
| SVG + GSAP/CSS | Minimal | Medium complexity, full CSS/JS control |
| Lottie / dotLottie (JSON) | ~60–100 KB gzipped for the runtime | Complex brand animations, After Effects exports |

**Key trade-off**: Lottie is powerful but requires a JS runtime (~60–100 KB gzipped). Do not install `lottie-web` for a spinner or checkmark — CSS-animated SVG handles those with zero overhead. Use Lottie only when the animation complexity justifies the bundle cost.

**dotLottie** (`.lottie` format, `@lottiefiles/dotlottie-web`) is the modern successor — smaller files, built-in interactivity. Use it in preference to the legacy `.json` + `lottie-web` stack when working in the LottieFiles ecosystem.

### Lord Icon
- A curated animated icon library (lordicon.com). Outputs: JSON (Lottie), GIF, SVG, PNG.
- Customisable in-browser: colour, stroke, trigger (hover, click, loop, morph).
- **Embed**: copy the JS tag + `<lord-icon>` element. For production apps, host the JSON locally — do not depend on their CDN for uptime-critical projects.
- Use the `minify` option when downloading JSON to reduce file size.
- Lazy-load icon JSON on first interaction to avoid blocking render.

### Trigger consistency
- All animated icons in a UI must use the same trigger pattern (all hover, or all click, or all loop). Mixed triggers create unpredictable interactions.

---

## Free icon resources

**Check licensing per asset, not just per site.** Free ≠ always commercial-safe.

| Site | Icon count | Formats | Commercial use | Attribution | Notes |
|---|---|---|---|---|---|
| **SVG Repo** (svgrepo.com) | 500 000+ | SVG | Yes — but **check per icon** | Not required (usually) | Some assets are CC BY-NC; verify on the individual icon page before shipping |
| **Iconpax** (iconpax.com) | 22 000+ | SVG, PNG, Base64 | Free for commercial and personal | Not required | In-browser editor for colour/size/style; modern topic packs (AI, cybersecurity) |
| **Graphic Burger** (graphicburger.com) | Curated | Varies | Check per pack | Varies | High-quality, unique sets — verify license per download |
| **Icon Monster** (iconmonstr.com) | ~5 000 across ~300 collections | SVG, PNG | Yes | No, but no redistribution | Simple, clean, consistent style — smaller library but reliable |
| **Lord Icon** (lordicon.com) | 1 000+ animated | JSON, SVG, GIF, PNG | Free tier available; paid for full library | Check tier | Best source for animated icons; see animated icon section above |

> **Reshot is dead.** Envato retired it in January 2026. Do not recommend or link to Reshot.

---

## Form control icons

Form controls stripped of their native appearance need a custom icon replacement. Failing to replace the native indicator is both an icon miss and a UX failure — the field loses its affordance entirely.

### Select elements

Any `<select>` with `appearance: none` or `-webkit-appearance: none` **must** have a custom chevron injected via CSS `background-image`.

```css
select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 16px;
  padding-right: 2.5rem; /* prevent text overlap */
}
```

**currentColor exception — documented and justified:**
CSS `background-image` data URIs are not part of the DOM. The SVG inside cannot inherit `currentColor` from the element. The stroke colour **must** be hardcoded as a URL-encoded hex value. Always use the project's established neutral/muted colour token (e.g. `--mid-gray`, `--muted`) converted to hex. This is the one place where hardcoding a colour in an SVG is correct — document it in a code comment.

**Chevron style consistency:**
The select chevron must visually match all other chevrons in the UI — same path geometry (`polyline points="6 9 12 15 18 9"`), same stroke-width, same cap/join style. A select chevron that looks heavier or lighter than the nav chevron breaks set consistency.

### Other form controls to check

| Control | Native indicator | What to replace with |
|---|---|---|
| `<select appearance: none>` | Dropdown arrow | SVG chevron via `background-image` |
| Password input | None by default | Optional: SVG eye/eye-off toggle button |
| Search input | None by default | Optional: SVG magnifier — inline in a wrapper |
| Custom checkbox | Browser checkbox | CSS-drawn or SVG checkmark via `::after` or inline SVG |
| Custom radio | Browser radio | CSS-drawn circle via `::after` |

Only the select is mandatory. The others apply when the native control is replaced with a custom-styled one.

---

## Anti-slop icon rules (enforce at pre-emit gate)

- **No emoji as icons.** Emoji are platform-inconsistent, render differently across OS, and are inaccessible to screen readers without explicit aria-label. Use SVG icons.
- **No mixing styles.** If the UI uses outline icons, every icon is outline. No exceptions without design justification.
- **No inconsistent sizing.** All icons in a context (nav, list, toolbar) must share the same px size.
- **No hardcoded colours in SVG.** Use `currentColor` so icons inherit text colour and respond to theming. Exceptions: multi-colour decorative icons only.
- **No raw `<img>` for SVGs.** Inline SVG or CSS `mask-image` are preferred — `<img src="icon.svg">` cannot be styled with `currentColor`.
- **Accessibility**: every functional icon must have either an `aria-label` (standalone) or `aria-hidden="true"` + adjacent visible text label. Decorative icons: `aria-hidden="true"` always.

---

## Icon pre-emit gate

Run this gate whenever any UI task includes icons:

- **Style consistency**: all icons in the same context share stroke width, corner radius, and fill/outline style.
- **Size consistency**: icons in the same UI zone are the same px size.
- **`currentColor`**: SVG icons use `currentColor` for stroke/fill, not hardcoded hex.
- **No emoji substitutes**: SVG icons used throughout — no emoji stand-ins.
- **Accessibility**: functional icons have `aria-label`; decorative icons have `aria-hidden="true"`.
- **Animated icons**: `prefers-reduced-motion` fallback present; Lottie only if complexity justifies it.
- **Trigger consistency**: all animated icons in a UI use the same trigger pattern.
- **License verified**: icon source confirmed as commercial-safe for this project.

- **Select chevrons**: any `<select>` with `appearance: none` has a custom SVG chevron via `background-image`; `currentColor` exception documented in code comment; `padding-right` prevents text overlap; chevron style matches other chevrons in the UI.

State result inline: `✓ Iconography` or flag specific failures.
