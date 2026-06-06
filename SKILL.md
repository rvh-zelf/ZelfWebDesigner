---
name: frontend-design
description: >-
  Build, style, and critique production-grade browser UI and HTML-first design
  artefacts: landing pages, dashboards, Svelte/SvelteKit components, DaisyUI /
  Flowbite UI layouts, WordPress themes, React+Babel single-file prototypes,
  HTML slide decks, motion/animation demos, app prototypes, design variants,
  and posters. Provides design-direction advice, anti-slop quality gates,
  WCAG 2.2 AA accessibility checks, deceptive-design audits, and structured
  critique. Includes 6 research-backed pattern libraries: Navigation Layer
  Architecture, Advertising Accommodation, Hero Variant Taxonomy, Modal and
  Overlay Layer Management, Card Design System, and Animation as Functional
  Feedback (intent taxonomy, performance tiers, WCAG SC 2.3.3). Use when
  building or styling any web UI, frontend component, prototype, deck,
  animation, or when reviewing design quality. Uses Context7 HTTP API to fetch current, version-specific library docs before writing code (SvelteKit, DaisyUI, Flowbite, WordPress REST API, Tailwind).
---

# Frontend Design (HTML-first + Production UI)

Build **real, working** interfaces with a clear aesthetic point of view. The
primary stack is **Svelte 5 / SvelteKit + DaisyUI + Flowbite UI**; React+Babel
is kept for throwaway `file://` proofs-of-concept. WordPress outputs
PHP/HTML/CSS. All outputs go to `/workspace/data/<project-slug>/`.

**Embody the right expert**: slide designer for decks, motion designer for
timeline-driven demos, UX prototyper for flows, visual designer for marketing
UI. A deck should not read as a dashboard; an app prototype should not read as
a documentation site.

## Scope

**In scope**
- Polished websites, landing pages, dashboards, Svelte/SvelteKit components,
  DaisyUI/Flowbite UI pages, WordPress themes/blocks.
- Hi-fi interactive prototypes, HTML slide decks (e.g. 1920×1080), motion/animation
  demos, infographics, design variant explorations.
- Design direction when the brief is vague; optional structured critique after delivery.
- Visual-layer guidance for larger apps (tokens, layout, motion).

**Out of scope as primary deliverable**
- Production backend, auth, or SEO implementation — apply this skill to the UI shell;
  use normal engineering practices for the rest.

Paths in this skill are **relative to the skill root** (`references/…`, `assets/…`).

---

## Principle #0 · Verify facts before designing (highest priority)

For **concrete products, releases, version numbers, specs, or people**: search first,
then design. Write facts into `product-facts.md`; design from the file, not from memory.

**Forbidden without a search**: "I remember X is version N", "X is probably not released."

---

## Principle #0a · Fetch live library docs before writing code (Context7)

Before writing any code that uses a third-party library or framework — SvelteKit,
DaisyUI, Flowbite UI, WordPress REST API, Tailwind, or any other dependency — fetch
current, version-specific documentation from Context7 via its HTTP API.

**This is mandatory.** Do not rely on training-data knowledge of library APIs.
Training data is frozen; libraries are not. Wrong API versions produce code that is
syntactically valid, passes linters, and fails at runtime — the worst kind of bug.

### How to fetch docs

```python
import requests

def fetch_context7_docs(library_name: str, topic: str, tokens: int = 3000) -> str:
    """Fetch current library docs from Context7 before writing code."""
    # Step 1: resolve library name → Context7 ID
    search = requests.get(
        "https://context7.com/api/v1/search",
        params={"query": f"{library_name} {topic}"}
    )
    results = search.json().get("results", [])
    if not results:
        return f"[Context7: no results for {library_name}]"
    
    library_id = results[0]["id"]  # e.g. "/sveltejs/kit"
    
    # Step 2: fetch docs for that library + topic
    docs = requests.get(
        f"https://context7.com/api/v1{library_id}",
        params={"topic": topic, "tokens": tokens}
    )
    return docs.text

# Examples:
# fetch_context7_docs("SvelteKit", "routing")
# fetch_context7_docs("DaisyUI", "button component")
# fetch_context7_docs("Flowbite", "modal")
# fetch_context7_docs("WordPress REST API", "authentication")
# fetch_context7_docs("Tailwind CSS", "grid layout")
```

### When to call this

| Trigger | Action |
|---------|--------|
| Writing any SvelteKit route, layout, or server action | `fetch_context7_docs("SvelteKit", "<specific topic>")` |
| Using any DaisyUI component | `fetch_context7_docs("DaisyUI", "<component name>")` |
| Using any Flowbite component | `fetch_context7_docs("Flowbite UI", "<component name>")` |
| Calling WordPress REST API endpoints | `fetch_context7_docs("WordPress REST API", "<endpoint topic>")` |
| Using Tailwind utilities beyond basic layout | `fetch_context7_docs("Tailwind CSS", "<topic>")` |
| Any library you are not 100% certain of the current API | Always fetch |

### Rules

- **Call Context7 before you write the relevant code**, not after.
- **Use the returned docs as the source of truth** — not your training data.
- **If Context7 returns no results**, fall back to `web_search` for the official docs URL, then `url_resolver` to read it.
- **Do not skip this step** because you "already know" the API. The test generator confirmed SvelteKit docs in Context7 were last updated 2026-05-19 — less than two weeks old. Your training data is not.
- Fetching is fast (one HTTP call). It is never the bottleneck.

### Context7 API reference

| Endpoint | Purpose |
|----------|---------|
| `GET https://context7.com/api/v1/search?query=<name+topic>` | Resolve library name → Context7 ID |
| `GET https://context7.com/api/v1/<library-id>?topic=<topic>&tokens=3000` | Fetch topic-specific docs |

No authentication required. The sandbox proxy allows `context7.com` outbound.

---

## Principle #1 · Start from context; core asset protocol

Strong hi-fi work grows from context: design system, UI kit, repo, Figma, screenshots,
or brand site. For vague briefs use the design direction advisor
([references/design-direction-advisor.md](references/design-direction-advisor.md)).

### Named brand or product → run core asset protocol

| Asset | Role | Rule |
|-------|------|------|
| **Logo** | Highest recognition | Required — stop and ask if unavailable. |
| **Product renders** | Hero for physical goods | Required — no CSS silhouette as "the product". |
| **UI screenshots** | Hero for digital products | Required — real UI, not only palette tokens. |
| **Colours / type** | Supporting | Derive from site, SVG, CSS, or guidelines. |

> **Local asset check first**: before searching the web for brand assets, check your project's workspace for existing brand assets. If a `brand-spec.md` exists for the brand in your workspace, treat it as canonical and skip the web search step.

> **Logo variant reconciliation**: logo variant selection (dark, light, white, stacked) must be made *after* finalising the background colour of each surface — not before. Once you decide a nav, hero, or footer background colour, check its luminosity and select the matching logo variant at that point. Never carry forward a logo variant assumption made before the background colour was decided.

**Five steps**: ask (checklist-style) → search official paths → download to
`/workspace/data/<slug>/assets/<brand>-brand/` → validate → freeze in `brand-spec.md`.

### Design token discipline

- Read your project's brand guidelines **before any branded output** — colours and typography.
- If the project has `DESIGN.md`, treat its tokens as **canonical** — no ad-hoc hex values.
- DaisyUI CSS custom properties (e.g. `--p`, `--s`, `--a`) take precedence over arbitrary
  Tailwind colour utilities.
- Token drift warning: when using Tailwind/DaisyUI utilities, map spacing and colour
  **consistently** — do not pick "closest" utility arbitrarily.

#### 60/30/10 colour role rule

- **~60% dominant/background** — the main site or section colour.
- **~30% secondary/support** — headers, cards, structural elements.
- **~10% accent** — reserved exclusively for CTAs, highlights, and interactive affordances.
- **Goal**: the accent colour should feel scarce and therefore draw the eye reliably to the
  primary action.
- Apply this split when allocating DaisyUI tokens (`--p`, `--s`, `--a`) across a layout.

---

---

## Principle #5 · Content-First Design

Content should drive layout decisions, not the other way around. Design exists to surface content value — it does not create that value on its own.

- Before laying out any page section, identify what real content (text, image, video, diagram) will occupy it. Never design a section around a stock photo or placeholder that assumes generic imagery will fill it.
- Every visual slot in a layout must have a declared **image intent** — one of: `process-shot`, `result/outcome`, `context/environment`, `custom-diagram`, `portrait/person`, `branded-item`. Decorative-only imagery with no informational purpose should be flagged as a design smell in critique.
- Layouts should accommodate **media variety**: step-by-step photo strips, inline diagram blocks, video embed slots, before/after panels, and "behind the scenes" sections. These are first-class layout patterns, not afterthoughts.
- When building how-to, tutorial, or instructional content sections: structure the layout as `result first → steps with inline media`. Show the outcome at the top, then walk through steps with accompanying visuals.

**Audit before replacing**
Before proposing to replace any existing asset — photography, copy, structural layout, product descriptions — evaluate whether the problem is the asset itself or its placement, framing, or context. Strong existing photography surfaced poorly is a placement problem, not a photography problem. Replacing it with new (or AI-generated) imagery when the original is genuinely good wastes client budget and loses authenticity. The correct response is to reframe, reposition, and foreground what already works. Only recommend replacement when the asset is genuinely weak (low resolution, wrong subject, off-brand) or unavailable.

**AI placeholder images in prototypes:**  
When building a prototype before real photography is available, use AI-generated placeholder images for every declared image intent slot — do not use grey boxes. Grey boxes tell a stakeholder nothing about how the page will feel with real content. An AI-generated image that represents the correct intent (a practitioner at a desk, a process shot, a branded item) gives the stakeholder a meaningful visual reference and makes design reviews far more productive.

Rules:
- Use the `text_to_image` tool to generate one image per declared intent slot.
- Write prompts that match the intent type exactly — use the prompt writing guide in the `content-creator` skill as the reference.
- Save generated images to `data/<project-slug>/images/` and reference them in the HTML.
- Keep the intent label visible as a caption below each image (e.g. `[context/environment]`) — this is essential for design handoff. The label tells the photographer or art director exactly what kind of real image replaces this placeholder at go-live.
- **Diagram intent slots (`custom-diagram`) are always rendered as SVG or HTML** — never replaced with a generated image.
- Add an HTML comment at the top of the file listing all AI-generated images and the intent type they represent, so anyone opening the file knows which images are placeholders.

**Go-live rule:** AI-generated placeholder images must never be published to a live site. They exist solely to make prototypes reviewable. The shot list from the `content-creator` brief defines what real photography replaces each one.


## Execution philosophy

- **Junior designer pass**: state assumptions, reasoning, and placeholders early; confirm
  direction before deep implementation.
- **Scope discipline under constraints**: when time or budget is limited, identify the single user journey that, if broken, costs the client money today — and make that the entire first phase. Queue conversion enhancements (navigation improvements, richer content, animation, visual polish) as a defined phase two. Shipping a functional, unpolished site on time beats shipping a polished, broken one late. Name the phase two items explicitly so they are not lost.
- **Variations, not one answer**: default 3+ directions when the user asks for design.
  Use Tweaks or side-by-side canvases ([references/tweaks-system.md](references/tweaks-system.md)).
- **Placeholder > fake**: grey box + label, or HTML comment — never plausible-but-false metrics.
- **No filler**: every element earns its place; prefer composition and negative space.
- **Anti-slop**: avoid training-default purple-on-white SaaS gradients, emoji-as-icon crutch,
  rounded card + left accent bar (unless brand-owned), SVG "photos" of faces/products, CSS
  silhouettes instead of real product art, Inter/Roboto/Arial as lazy display.
  Extended patterns: [references/content-guidelines.md](references/content-guidelines.md).
- **Stock photography as hero or section background**: full-bleed stock imagery (especially "person typing on laptop", "handshake", "diverse team smiling") with text overlay. Replace with real contextual photos, authentic diagrams, or a strong typographic treatment.
- **Corporate-style generic graphics**: abstract swooshes, generic icons-as-illustrations, or recycled SaaS-style vector art that conveys no specific information about the actual product, service, or process. These signal low effort and reduce trust the same way stock photos do.
- **Purely decorative images with no informational value**: if removing the image would not reduce the user's comprehension of the page, the image is not earning its place.
- **Dated patterns**: skeuomorphic textures used unintentionally, early-2010s gradient buttons,
  bevel/emboss effects, Comic Sans or Papyrus for anything serious, CSS3 ribbon badges,
  full-bleed stock photography with white text overlay and no contrast treatment. Flag and
  replace these the same as training-default tropes.
- **Backgrounds bleed, content doesn't.** Full-width section backgrounds (hero, feature bands, CTA strips, footers) are correct and desirable. But the content inside those sections — headings, body copy, buttons, images — must always be wrapped in the same inner container div as every other section on the page. A consistent `max-width` container with `margin: 0 auto` and uniform horizontal padding must be applied inside every section without exception. Failure to do this causes text to start at different x-positions as the user scrolls, which registers as a layout inconsistency even when the user cannot name it.
- **Positive craft**: `text-wrap: pretty`, grid/flex discipline, `oklch()` for new neutrals,
  one hero detail at 120% polish and the rest at ~80%, motion as orchestrated beats.
- **Reading pattern discipline**: for LTR layouts, place the primary message and CTA where users
  naturally look first. Text-heavy pages follow an F-pattern (top bar, left rail); sparse/visual
  pages follow a Z-pattern (top-left → top-right → bottom-left → bottom-right). Never bury the
  primary action below the fold or in a visually weak position.
- **Attention-decay discipline**: user attention declines steeply with scroll depth. Above-the-fold content receives the majority of fixations; content 2–3 screenfuls down receives a fraction. Design accordingly:
  - Every section more than two screenfuls down must earn its position — use a compelling heading, a strong visual anchor, or a meaningful information-scent cue (a preview, a teaser, a pull quote) to justify continued scrolling.
  - Long pages must be structured for scanning: clear H2 hierarchy, summary or intro text per section, and visual anchors at regular intervals.
  - For lists and grids: the most important items go first. Attention per item falls sharply with position. Use filters, sorting, or visual emphasis to surface lower-positioned items you need seen.
  - Primacy and recency both apply: lead with your strongest item; a strategically placed item at the end of a short scannable list can also benefit from recency recall.
  - Long scrolling pages are preferable to paginated "next page" designs for article content — but only if the above structure and scent rules are applied.
- **Alignment discipline**: Left-align all long-form body text. Centre-align only hero headlines
  and narrow pull-quotes. Creative or staggered alignment is reserved for decorative,
  non-essential elements only — never apply it to primary navigation, body copy, or CTAs.
- **Accessibility first**: WCAG 2.2 AA is not optional — see
  [references/verification.md](references/verification.md) and
  [references/anti-slop-checklist.md](references/anti-slop-checklist.md).
- **Typographic contrast**: H1, H2, and body text must be visibly distinct at a glance —
  through size, weight, or colour. WCAG contrast compliance is required but not sufficient;
  typographic hierarchy must also be legible when the page is viewed at reduced size or squinted at.

---

---

## Form Design

Forms are a primary conversion and trust surface. Apply these rules whenever any task includes a form, checkout, login, registration, survey, or multi-field input.

### Standing rules (non-negotiable)

**Labels**
- Always use persistent labels positioned above or beside the field — never rely solely on placeholder text to identify a field.
- Placeholder text is for format hints only (e.g. `e.g. 01/01/1990`) and must not be the only label.
- Provide format/help text as a persistent element (a `<small>` or helper span) below the field — not inside it.

**Input appearance**
- Every input must look interactive: visible border or contrasted background. Underline-only and background-matched inputs are forbidden.
- Field width should signal expected input length — short for CVV/postcode, wider for address/email. Do not make all fields the same width.
- Checkboxes and radios must share the same visual language (stroke weight, size, border-radius) as text inputs — no unstyled browser defaults.

**Focus and error states**
- Focus state is mandatory: border colour change, full-border highlight, or background shift — keyboard users must always know where they are.
- Show per-field inline errors: outline the field in the error colour + place a descriptive message directly beneath it.
- Do not rely on a global error list alone — also mark the specific failing field.
- Do not fire validation on blur before the user has typed anything. Validate on submit, or after meaningful input, then re-validate on blur.
- **Never change `border-width` on focus.** Switching from `1px` to `2px` border on focus causes elements below to shift down by 2px (the box grows). Always declare inputs with `border: 2px solid <neutral-colour>` by default, then on `:focus` change only `border-color`. Alternatively use `outline` or `box-shadow: 0 0 0 2px <accent>` for the focus ring — both are layout-neutral.

**CTAs and buttons**
- CTA placement is a system-level decision — keep it consistent across the product.
- The primary CTA must be the last interactive element in the vertical flow.
- For LTR layouts with side-by-side buttons, place the primary action on the right.
- Use title case for button labels. All-caps is acceptable only for very short labels (2–3 words max).
- The CTA must be visually dominant — never compete with decorative elements or look like another input.

**Links within forms**
- Links (e.g. terms & conditions, forgot password) must be underlined and coloured — never styled as plain body text. Plain-text links are both a UX failure and a deceptive-design risk.

**Layout and grouping**
- Single-column layout by default. Two-column is acceptable only for a small number of closely related fields (e.g. first name / last name).
- Group related fields with tighter spacing; use larger gaps between distinct groups.
- Wrap the form in a card or contained section — a form floating in open whitespace feels unfinished.
- For long forms, break into multi-step flows at logical group boundaries rather than presenting one long scroll.

**Progressive disclosure**
- Only reveal a field when the user has opted into the condition that makes it relevant. A logo upload field should not be visible unless the user has selected "include logo". A notes field tied to a specific product option should appear only when that option is active.
- Use conditional show/hide (CSS `display` toggle or JS class switch) — not disabling/greying out. A greyed-out field still occupies cognitive space and invites questions. A hidden field costs nothing until it is needed.
- This pattern is especially valuable in product customisation flows (e-commerce, booking, configurators) where different user paths require genuinely different field sets.
- Add the corresponding gate item to the Form pre-emit gate: **Progressive disclosure**: no fields visible that are not yet relevant to the user's current selections.

### Form pre-emit gate

Run this gate **in addition to** the standard pre-emit checks whenever the output includes a form:

- **Labels**: every field has a persistent visible label. No placeholder-only fields.
- **Input appearance**: all inputs have visible borders or contrasted backgrounds. Field widths vary by expected content length.
- **Control consistency**: checkboxes and radios match the visual language of text inputs.
- **Focus state**: visible focus indicator on all interactive elements.
- **Error states**: per-field inline errors defined (outline + message). Global-only error handling is not present.
- **CTA**: last in flow, visually dominant, title case, consistent placement.
- **Links**: all links within the form are underlined and coloured.
- **Layout**: single-column unless justified; related fields grouped; form is contained.
- **No border-width change on focus**: input default border is `2px`; focus only changes colour, not width.
- **Progressive disclosure**: no fields are visible that are not yet relevant to the user's current selections. Conditional fields are hidden (not disabled) until their trigger condition is met.

State result inline: `✓ Form design` or flag specific failures.

---

## Navigation Design

Navigation is the primary wayfinding surface. Apply these rules whenever any task includes a site header, nav bar, sidebar, mobile menu, or dropdown structure.

### Standing rules (non-negotiable)

**Layout convention**
- Follow the established desktop convention: logo top-left, primary menu centred (or left), primary CTA top-right. Deviating from this pattern requires explicit justification — users have strong expectations here.
- Only include important pages and actions in the primary nav. Do not overcrowd.
- Never place social media links in primary navigation — they pull users away from conversion paths.

**Desktop vs. mobile**
- Primary navigation must always be visible on desktop. Never hide it behind a hamburger or toggle on screens where space permits a full nav.
- Hamburger menus are appropriate on mobile only. Use a standard, recognisable hamburger icon — no custom unlabelled icons.
- If space forces the primary nav off a larger screen, the answer is to redesign the nav, not hide it.

**Sticky navigation**
- Sticky nav is recommended on most sites. Prefer the hide-on-scroll-down / reveal-on-scroll-up pattern — it saves vertical space while keeping the nav accessible when users need it.

**Dropdowns and submenus**
- Always indicate the presence of a submenu with a visible chevron or arrow — users must know it exists before hovering or clicking.
- Avoid hover-only dropdown activation. The "hover tunnel" problem (diagonal mouse movement accidentally closes the menu) is a known failure mode. Prefer click-toggled dropdowns, or implement a hover delay / trajectory technique if hover activation is required.
- Use vertical dropdown lists (standard and familiar). Horizontal dropdown layouts are uncommon and harder for users to parse.

**Mega menus**
- Use mega menus only for large catalogues (e-commerce, large content libraries). Not appropriate for general marketing or content sites.
- Include columns and product/category images in mega menus to improve findability.

**Breadcrumbs**

Use on any hierarchical site with more than two levels of depth. Non-negotiable on content sites, intranets, e-commerce, and medical/academic sites. Do not use on flat single-level sites or in linear checkout/funnel flows — they encourage abandonment.

**Type: location-based only.** Breadcrumbs must reflect site hierarchy, not session history. Path-based breadcrumbs (recording the user's click trail) are obsolete — they duplicate the browser's Back button without adding structural context.

**Placement**

- Position: **below the global navigation bar, above the `<h1>` page title**. Absolute consensus across NN/g, W3C, Carbon, GOV.UK, and Baymard. Never below the H1 — it breaks orientation before the user reads the title.
- DOM order: `<nav aria-label="Breadcrumb">` must appear in the HTML before the `<h1>` so screen readers encounter the location cue first.
- Vertical spacing: `margin-block-start: 20px` (gap from global nav); `margin-block-end: 20px` (gap to `<h1>`); `margin-block-end: 32–48px` (gap from heading area to main content body).
- Horizontal: left-aligned, flush with the content column.
- Must appear at the same position on every page — consistency is non-negotiable.

**Typography**

| Property | Value | Rationale |
|---|---|---|
| Font size | `0.875rem` / `14px` | 87.5% of 16px body — unanimous across Carbon, DaisyUI, Flowbite, shadcn/ui, GOV.UK, MUI |
| Link weight | `500` (medium) | Slightly heavier than body prose (400) to signal navigability |
| Current page weight | `400` (regular) | Contrast with linked items without bold emphasis |
| Minimum font size | `12px` | Floor — below this, legibility and WCAG 1.4.3 risk increases |
| Link contrast | ≥ 4.5:1 against background | WCAG 1.4.3 AA — test in both light and dark mode |
| Separator contrast | ≥ 3:1 against background | WCAG 1.4.11 Non-text Contrast |

**Spacing (exact values — 4px/8px grid)**

```css
.breadcrumb {
  display: flex;
  align-items: center;
  overflow-x: auto;          /* horizontal scroll fallback on mobile */
  padding-block: 0.5rem;     /* 8px — DaisyUI source */
  padding-inline: 0;
  margin-block-end: 1.25rem; /* 20px — before h1 */
}
.breadcrumb__list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}
/* Separator: CSS-only, hidden from assistive tech */
.breadcrumb__item + .breadcrumb__item::before {
  content: "/";              /* or "›" — pick one, use it everywhere */
  margin-inline: 0.5rem;    /* 8px each side — Carbon/MUI/Bootstrap consensus */
  font-size: 0.75rem;
  opacity: 0.45;
  color: currentColor;
}
.breadcrumb__item:last-child::before { content: none; }
.breadcrumb__link {
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: underline;
  color: var(--color-link);
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;       /* 44px — WCAG 2.5.5 tap target via flex, not inflated text */
  padding-inline: 0.25rem;
}
.breadcrumb__current {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--color-text);
  text-decoration: none;
  cursor: default;
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding-inline: 0.25rem;
}
.breadcrumb__link:focus-visible {
  outline: 3px solid currentColor;
  outline-offset: 3px;
  border-radius: 4px;
}
```

**Touch Targets**

- WCAG 2.5.8 (AA): 24 × 24 CSS px minimum. The `min-height: 2.75rem` approach achieves this.
- WCAG 2.5.5 (AAA) / Apple HIG / Material: 44 × 44 CSS px — aim for this in all new implementations. Use `min-height: 2.75rem` on the flex item; `align-items: center` keeps visual text compact.
- The "44px rule" is **not** WCAG AA — it is WCAG AAA and Apple HIG. Frequently misquoted. WCAG AA only requires 24px. Aim for 44px anyway — the usability gain is real.
- Ellipsis collapse button: `min-height: 2.75rem; min-width: 2.75rem` minimum. Must be a `<button>`, never a `<span>`.

**Separator Rules**

- Render via CSS `::before`/`::after` pseudo-elements only — never inject separator characters into the DOM as readable text.
- If using an explicit DOM separator element: add `aria-hidden="true"`.
- Sizing: 6–14px (0.375–0.875rem). DaisyUI: 6px rotated square. Flowbite/shadcn/ui: 14px SVG chevron. Carbon: `/` at 14px. All acceptable — pick one per project.
- Opacity: 0.40–0.50 of `currentColor` — keeps separator quieter than label text.
- Suppress after last item: `.breadcrumb__item:last-child::before { content: none; }`.
- RTL mirroring:
  ```css
  .breadcrumb__item + .breadcrumb__item::before { content: "›"; }
  [dir="rtl"] .breadcrumb__item + .breadcrumb__item::before { content: "‹"; }
  ```
  Use CSS logical properties (`margin-inline-start`, `margin-inline-end`) throughout — never `margin-left`/`margin-right`.
- Avoid `|` (vertical bar) as separator — NN/g: it implies OR/alternative, not hierarchy.

**Responsive and Mobile Collapse**

Breadcrumbs must **never** wrap to multiple lines. If the trail is too long: collapse or scroll — never wrap.

| Viewport | Behaviour |
|---|---|
| ≥ 1024px desktop | Full trail, all levels |
| 768–1023px tablet | Full trail if ≤ 4 items; collapse middle to `…` if more |
| < 768px mobile | Collapse to: `Home > […] > Parent > Current`. Or parent-only back-link. |

Collapse implementation: the `…` must be a `<button>` (not static text) with `aria-label="Show full path"` and `aria-expanded="false/true"`. Activation reveals hidden middle levels in a dropdown/popover. Animate with `opacity 150ms ease, transform 150ms ease`; wrap in `@media (prefers-reduced-motion: no-preference)`.

CSS horizontal scroll fallback (no-JS): `overflow-x: auto; scrollbar-width: none` with faded edges via `mask-image` gradient on the container.

Individual label truncation: `max-width: 12rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap` — pair with `title` attribute for the full text.

**Dark Mode**

WCAG contrast requirements (4.5:1 for text links and current page label; 3:1 for separators and focus rings) apply identically in dark mode. Test both themes explicitly.

```css
@media (prefers-color-scheme: dark) {
  .breadcrumb__link  { color: var(--color-link-dark);  /* ≥ 4.5:1 against dark bg */ }
  .breadcrumb__current { color: var(--color-text-dark); }
}
```

If using a fixed separator colour (not `currentColor`), calculate contrast against the dark background explicitly. `opacity: 0.45` on `currentColor` is safe in most cases, but verify.

**Structured Data (JSON-LD)**

Inject in `<head>` as `<script type="application/ld+json">`. Must be server-rendered — client-side JS injection is not seen by Google on first crawl.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Category", "item": "https://example.com/category/" },
    { "@type": "ListItem", "position": 3, "name": "Current Page Title" }
  ]
}
```

Rules:
- `position` starts at 1, sequential, no gaps.
- `name` must match the visible breadcrumb label exactly — discrepancies risk Google manual actions.
- Minimum 2 `ListItem` elements (Google requirement).
- `item` (URL) required for every level except the final item.
- **Always represent the full, untruncated hierarchy** — even when the visible UI is collapsed on mobile.
- Google removed visual breadcrumb display from mobile SERPs in January 2025 — JSON-LD is now the primary hierarchy signal.
- Validate with Google Rich Results Test before deployment.

**Accessibility (full spec)**

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/category/">Category</a></li>
    <li><span aria-current="page">Current Page</span></li>
  </ol>
</nav>
```

- `<nav aria-label="Breadcrumb">` — named navigation landmark. Do not say "Breadcrumb Navigation" — "navigation" is already implicit in the `<nav>` role.
- `<ol>` — ordered list, not `<ul>`. Ordered conveys sequential hierarchy to screen readers.
- `aria-current="page"` — on the final item only. One instance per breadcrumb. Required even if the item is non-linked `<span>`.
- Separators: CSS pseudo-elements are skipped by screen readers. Explicit DOM separator elements need `aria-hidden="true"`.
- Keyboard navigation: all links reachable by Tab in DOM order; Enter activates; no extra ARIA needed beyond standard link behaviour.
- Focus indicators: `:focus-visible` — `outline: 3px solid currentColor; outline-offset: 3px; border-radius: 4px`. Never `outline: none` globally without a `:focus-visible` replacement.
- Relevant WCAG criteria: 2.4.8 Location (AA); 2.4.5 Multiple Ways (AA); 1.4.3 Contrast (AA); 1.4.11 Non-text Contrast (AA); 2.5.8 Target Size (AA); 2.5.5 Target Size Enhanced (AAA); 2.4.11–2.4.13 Focus Appearance (AA/AAA).

**Faceted / Attribute Breadcrumbs**

Used in e-commerce and filtered content sites. The trail reflects applied filters, not just static hierarchy.

Example: `Home > Women > Jackets > Brand: Arc'teryx > Size: M`

Rules:
1. Each filter segment is a link that removes that specific filter and returns to the broader set.
2. Establish one **canonical primary category path** per product — use in `<link rel="canonical">` and in the JSON-LD BreadcrumbList. The filter trail never becomes the canonical path.
3. JSON-LD schema = clean hierarchical path only. Faceted trail = user orientation only. Never conflate the two.
4. On mobile, collapse filter attributes first (keep category hierarchy; collapse brand/colour/size).
5. Polyhierarchy (product in multiple categories): pick one canonical path and use it consistently across breadcrumbs, canonical URLs, and schema.
6. Faceted URLs: use `rel="canonical"` pointing to the clean category URL, or `noindex`, to prevent crawl budget waste.

**When NOT to Use Breadcrumbs**

- Flat sites with only 1–2 levels of depth — primary navigation is sufficient.
- Linear checkout or signup funnels — breadcrumbs invite abandonment. Remove them entirely.
- Single-page applications where URL hierarchy doesn't exist — use step indicators instead.

**Conversion pages**
- On dedicated landing or sales pages, consider removing the navigation entirely. Fewer exit routes increases conversion. Use selectively and test.

**Semantic markup and accessibility**
- Use `<nav>` element with `aria-label="Primary navigation"`.
- Render menu items as an unordered list (`<ul>` / `<li>`).
- Mark the active/current page with `aria-current="page"`.
- All dropdown controls must be keyboard accessible: tab to reach, Enter/Space to open, Escape to close.
- Visible focus states are required on all nav items — same rule as forms.

### Navigation layer architecture — utility vs. primary separation

Every site header operates across two cognitively distinct functions: **wayfinding** (where can I go?) and **task execution** (what can I do?). These must occupy separate visual layers. Mixing them in one bar forces users to parse all items on every visit — increasing cognitive load and driving navigation abandonment by up to 28% (Baymard Institute, 2023).

**Anti-pattern: never do this.** A single bar containing primary nav links + brand switcher + subscribe + account + CPD/notifications = 11+ items in one visual chunk. This exceeds Miller's Law 7±2 working memory limit, forces System 2 (effortful) cognition instead of System 1 (automatic) pattern-matching, and dilutes navigation scent — users cannot distinguish "where to go" from "what to do" before reading labels. See `nav-patterns.md` § Anti-patterns for specific failure modes, with research citations.

**The two-layer pattern:**

| Layer | Height | Background | Contents |
|---|---|---|---|
| **Utility bar** (top) | **36px** | Dark / brand-contrasted | Brand switcher (left), subscribe CTA, account, CPD tracker, notifications (all right) |
| **Primary nav** (below) | **64px** | White / light | Logo (left), primary wayfinding links, search (right anchor) |

**Hard rules:**

- Utility bar `z-index: 200`; primary nav `z-index: 190`; primary nav `position: sticky; top: 36px`.
- Primary nav bottom border: 2–3px solid brand primary colour.
- Total header height must not exceed **120px** — if it does, items are in the wrong layer, not in need of more height.
- **Brand switcher** (multi-brand publisher, e.g. a publisher running multiple titles): always utility bar, always **left-aligned**. Never in the primary nav.
- **Subscribe CTA**: always utility bar, right anchor. Never in the primary nav.
- **CPD tracker, account, notifications**: always utility bar, right anchor. Never in the primary nav or footer.
- **Advertising (leaderboard slot):** the IAB 728×90 leaderboard sits **between** the utility bar and the primary nav — not inside either layer. Primary nav `top` adjusts to account for the ad unit height using `IntersectionObserver`.
- **Mobile (< 768px):** utility bar abbreviates to active brand + subscribe only; primary nav links collapse to hamburger (primary links only — utility actions are NOT inside the hamburger).

**The dividing test:** If removing an item changes where users can navigate → primary nav. If removing it prevents them from doing something (signing in, subscribing, checking CPD) → utility bar.

**Impact (from research, cited in `nav-patterns.md`):**
- −23 to −35% faster to identify primary nav (NN/g Eye-tracking, 2010/2017)
- +175% improvement in "navigation clarity" rating (Baymard, 2023)
- +180–310% subscribe click-through (CXL Institute, 2022)
- −28% navigation abandonment (Baymard, 2023)

**Progressive/scroll-aware variant** (long-form content pages only): utility bar collapses on scroll-down, restores on scroll-up. Primary nav always stays. Use RAF-throttled JS (not raw scroll event), collapse with `max-height + opacity` (not `display: none`), `pointer-events: none` when collapsed, `prefers-reduced-motion` transitions disabled (behaviour retained). Full JS pattern and CSS in `nav-patterns.md` § Progressive / scroll-aware variant.

**Full reference:** `skills/frontend-design/nav-patterns.md`

### Navigation pre-emit gate

Run this gate whenever the output includes any navigation structure:

- **Layout convention**: logo top-left, menu centred/left, CTA top-right (or justified deviation documented).
- **Desktop visibility**: primary nav is fully visible on desktop — not hidden behind a toggle.
- **Mobile**: hamburger used on mobile only; standard icon; full link set inside.
- **Sticky**: nav stickiness and scroll behaviour considered and implemented.
- **Dropdown indicators**: chevrons present on all items with submenus.
- **Hover tunnel**: dropdown is click-toggled or uses delay/trajectory — not raw hover-only.
- **Semantic HTML**: `<nav>`, `<ul>`/`<li>`, `aria-label`, `aria-current` present.
- **Focus states**: keyboard navigation works; focus visible on all items.
- **No social links** in primary nav.
- **Utility/primary separation**: if the site has both task actions (sign-in, subscribe, account, notifications, CPD) and wayfinding links, these must be in separate visual layers. A single bar with both categories is a navigation architecture failure — flag and require redesign before delivery.
- **Brand switcher in utility bar**: if the site serves multiple brands (e.g. a multi-title publisher), the brand switcher must be in the utility bar (left-aligned), not the primary nav.
- **Subscribe CTA in utility bar**: not in the primary nav. Subscribe must be a visually prominent branded button in the utility bar's right anchor.
- **Utility bar height ≤ 40px**: visibly slimmer than the primary nav — proportion communicates secondary status.

- **Breadcrumbs**: present on hierarchical/content sites with >2 levels; location-based; above `<h1>`, below global nav; 14px/0.875rem font, weight 500 links; 8px separator margin-inline, opacity 0.45 currentColor separator; 44px min-height touch targets; mobile collapse via `<button>` ellipsis; JSON-LD BreadcrumbList in `<head>` (server-rendered, always untruncated); `<nav aria-label="Breadcrumb">` + `<ol>` + `aria-current="page"` + `:focus-visible` outline; dark mode contrast verified ≥ 4.5:1 links, ≥ 3:1 separators.

State result inline: `✓ Navigation` or flag specific failures.


---

## Advertising Accommodation

Advertising is a **structural constraint**, not content. Ad slots must be reserved in CSS with their exact pixel dimensions **before** any editorial layout decisions are made. Designing layouts first and inserting ad divs afterwards causes Cumulative Layout Shift (CLS) scores of 0.18–0.31 — "Poor" range — actively harming search ranking and UX.

**Mental model:** A leaderboard is not "a box where an ad will appear." It is a 125px-tall reservation (14px label + 111px creative) that exists in the document whether or not an ad fills it. The editorial layout is designed around this reserved space.

Full detail and complete CSS implementation: `skills/frontend-design/ad-slots.md`

### Example house standard sizes

| Unit | Size | Total Slot Height | Placement | Sidebar breakpoint |
|------|------|------------------|-----------|-------------------|
| **Leaderboard** | **1200 × 111px** | 125px | Above nav; inline between sections | N/A — full width |
| **MPU / Medium Rectangle** | **300 × 250px** | 264px | Sidebar top | **≥ 1280px only** |
| **Half-Page** | **300 × 600px** | 614px | Sidebar below MPU | **≥ 1280px only** |

Slot height = 14px "Advertisement" label row + IAB creative height. Declare as `min-height` (not `height`) to allow taller rich-media creatives.

### CLS prevention — the hard rule

**CLS target: 0.00.** Achieved by one rule: declare `min-height` on every ad slot container in CSS before any editorial layout is written. Never use `display: none` to hide a slot that is waiting for an ad to load — when the ad arrives and `display: block` is applied, the height injection causes CLS equal to the slot height × impact fraction.

```css
.ad-rect  { width: 300px; min-height: 264px; } /* MPU */
.ad-half  { width: 300px; min-height: 614px; } /* Half-page */
.ad-leaderboard { width: 100%; max-width: 1200px; min-height: 125px; }
```

Every slot must also carry a visible "Advertisement" label (ASASA/CAP compliance): `<div class="ad-slot__label">Advertisement</div>`.

### Sidebar architecture

Sidebar activates at **1280px** viewport width and uses `position: sticky`:

```css
@media (min-width: 1280px) {
  .main-with-sidebar { display: grid; grid-template-columns: 1fr 300px; gap: 40px; }
  .sidebar { position: sticky; top: calc(var(--header-height, 100px) + 16px); height: fit-content; }
}
@media (max-width: 1279px) {
  .main-with-sidebar > .sidebar { display: none; }
}
```

Below 1280px, the sidebar disappears entirely and sidebar ad units are replaced by an in-content MPU (300×250) placed post-paragraph 3.

### Breakpoint behaviour

| Viewport | Sidebar | Leaderboard | Strategy |
|----------|---------|-------------|---------|
| ≥ 1280px | ✅ Sticky | 1200px | Full layout |
| 1024px–1279px | ❌ Hidden | 1200px (max-width) | In-content MPU replaces sidebar |
| 768px–1023px | ❌ Hidden | 1200px (max-width) | In-content MPU replaces sidebar |
| < 768px | ❌ Hidden | ❌ Hidden (`display: none`) | In-content 300×250 only |

**On mobile hide:** use `display: none` on the wrapper element — not `width: 0` or `height: 0`. The wrapper is intentionally removed, not waiting to load.

### Four CSS anti-patterns that BREAK with ads

1. **`overflow: hidden` on a parent containing a sticky sidebar** — creates a new containing block; `position: sticky` stops working. Remove the rule or use `overflow: clip` on the perpendicular axis only.
2. **Fixed-width containers (`width: 1200px` not `max-width`)** — leaderboard + sidebar + gap may exceed the fixed width → horizontal overflow. Always use `max-width`.
3. **Negative margins on pull-quotes or breakout elements** — interacts unpredictably with variable ad widths at medium viewports. Use padding on the parent instead.
4. **`display: none` pre-load** — when the ad loads and `display: block` fires, the slot height injects into the layout → CLS. Always use `min-height` to hold the space open.

### Impact metrics (from research report)

| Metric | Without reserved space | With reserved space |
|--------|----------------------|---------------------|
| CLS (leaderboard + MPU + inline) | 0.18–0.31 ("Poor") | **0.00** |
| Sticky sidebar MPU viewability | 72–82% | **85–92%** |
| In-content MPU CPM | £3–6 | £5–9 (+40–65%) |
| Search ranking (CLS "Poor" vs "Good") | −5 to −15% organic visibility | Neutral |
| Ad blocker rate (medical/clinical desktop) | 22–30% | 22–30% |

Sources: Google web.dev CLS documentation; IAS Publisher Benchmarks H2 2024; Google CWV documentation; PageFair 2024. See `ad-slots.md` for full citations.

### LEAN principles (brief)

**L**ight (200KB initial, 300KB max) · **E**ncrypted (HTTPS only) · **A**d Choices (opt-out icon required for behavioural targeting) · **N**on-invasive (no audio autoplay, no content-obscuring overlays, no fake close buttons).

### Advertising pre-emit gate

Run this gate whenever the output includes any ad-bearing layout:

- **Reserved dimensions**: every ad slot has `min-height` and `width` declared in CSS. No slot uses `display: none` as a pre-load state.
- **Advertisement labels**: every slot has a visible "Advertisement" disclosure label (`<div class="ad-slot__label">Advertisement</div>`). ASASA/CAP required.
- **Sidebar breakpoint**: sidebar only appears at ≥ 1280px. Below that, sidebar column is `display: none` — no orphaned 300px column.
- **In-content replacement**: on mobile/tablet, sidebar MPU is replaced by an in-content 300×250 unit post-paragraph 3.
- **No overflow: hidden on sticky parent**: checked and removed/replaced.
- **max-width containers**: all page wrappers use `max-width`, not `width`. No fixed-width containers.

State result inline: `✓ Advertising` or flag specific failures.

---

## Modal & Overlay Layer Management

> **Full implementation detail**: [`skills/frontend-design/overlay-system.md`](overlay-system.md)

### Z-Index Token Scale (canonical — every project, no exceptions)

Declare in `:root` at the top of every project's CSS. Never use bare integers.

| Token | Value | Layer |
|---|---|---|
| `--z-base` | 0 | Normal document flow |
| `--z-brand-bar` | 10 | Top utility/brand bar |
| `--z-nav` | 20 | Primary navigation |
| `--z-dropdown` | 30 | Nav dropdowns |
| `--z-sticky` | 40 | Sticky elements |
| `--z-drawer` | 45 | Side/off-canvas drawer |
| `--z-search` | 50 | Search overlay |
| `--z-toast` | 60 | Notification toasts |
| `--z-modal-backdrop` | 90 | Modal backdrop |
| `--z-modal` | 100 | Modal dialog |
| `--z-tooltip` | 110 | Tooltips (always above modal) |
| `--z-skip-link` | 200 | Accessibility skip link (always topmost) |

**`z-index: 9999` is ALWAYS wrong. Never use a magic number — ever.**

### Stacking context trap (why it breaks)

Adding `transform`, `opacity < 1`, `filter`, `will-change`, or `isolation: isolate` to ANY
element creates a new stacking context. Child elements cannot exceed the parent's layer,
regardless of z-index value. A `z-index: 9999` child inside a `z-index: 1` parent is capped
at z-index 1.

**Fix: portal pattern.** Append overlay elements to `document.body`, not inside the component
that triggers them. This escapes all stacking context traps.

### The 5 overlay types — decision rule

| Type | Use case | z-index token | Mobile |
|---|---|---|---|
| Modal dialog | Requires user decision | `--z-modal` | Full-screen |
| Alert dialog | Destructive/irreversible action | `--z-modal` | Full-screen |
| Search overlay | Full-page search | `--z-search` | Full-screen |
| Toast notification | Non-blocking feedback | `--z-toast` | Bottom of screen |
| Drawer / Bottom sheet | Navigation, filters | `--z-modal` | Bottom sheet |

**Rule: Never use a modal for information that doesn't require a decision.**  
**Rule: Never trigger a modal immediately on page load.**  
On mobile: bottom sheets outperform centred modals by ~15–25% completion rate (Google M3 research).

### WCAG 2.2 dialog requirements — compact checklist

~73% of web modals fail at least one WCAG 2.1 criterion (WebAIM 2021). Inaccessible modals are broken modals.

- `role="dialog"` (non-destructive) vs `role="alertdialog"` (destructive/irreversible — not for marketing)
- `aria-modal="true"` — and the VoiceOver bug: also set `aria-hidden` on background (belt-and-braces)
- `aria-labelledby` → must point to dialog's visible heading ID
- `aria-describedby` → optional; points to supplementary descriptive text
- `inert` attribute on background content (~96% browser support — production ready)
- Background content: `aria-hidden="true"` OR `inert` when dialog is open

### Focus management rules

| Moment | Required behaviour |
|---|---|
| On open | Store trigger element; focus first focusable inside dialog |
| Tab | Cycles WITHIN dialog only — wraps from last to first |
| Shift+Tab | Cycles WITHIN dialog only — wraps from first to last |
| Escape | Closes dialog; returns focus to trigger element |
| On close | Remove `inert`/`aria-hidden` from background; `trigger.focus()` |

**Body scroll lock:** `document.body.style.overflow = 'hidden'` on open; restore on close.

### Overlay choreography

- **Entry**: `scale(0.95) + opacity(0)` → `scale(1) + opacity(1)`, 200–300ms, `ease-out`
- **Exit**: reverse, 150–200ms, `ease-in` (exits faster than entries)
- **Backdrop**: `opacity(0)` → `opacity(1)`, 200ms, `linear`
- **`backdrop-filter: blur()`**: triggers GPU layer promotion — measurable perf cost on mobile; limit to 4–8px or use `rgba()` backdrop instead
- All animations must respect `prefers-reduced-motion`

### Overlay pre-emit gate (8 checks)

Run this gate **before outputting any overlay component**:

1. **Z-index tokens**: all z-index values use `var(--z-*)` — no bare integers anywhere
2. **Portal pattern**: overlay element is appended to `document.body` (or equivalent root), not inside a potentially stacking-context-creating parent
3. **ARIA roles**: `role="dialog"` or `role="alertdialog"` present and correctly chosen; `aria-modal="true"` set
4. **Accessible name**: `aria-labelledby` points to the dialog's visible heading; heading has a matching `id`
5. **Background inertia**: background content gets `aria-hidden="true"` AND `inert` when dialog opens; both removed on close
6. **Focus management**: trigger stored on open; first focusable element receives focus; `trigger.focus()` called on close
7. **Focus trap**: Tab and Shift+Tab cycle within dialog only; Escape closes and returns focus
8. **Animation + motion**: entry/exit uses translate/opacity (not display:none); `prefers-reduced-motion` path provided

State result inline: `✓ Overlay` or flag specific failures.

> Full z-index token CSS, focus trap JS utility, animation templates, stacking context
> explanation, and impact metrics: [`overlay-system.md`](overlay-system.md)


## Hero / Above-the-Fold Design

Navigation is the primary wayfinding surface. The hero is the first content surface. Apply these rules whenever any task includes a hero section, homepage banner, or top-of-page visual unit.

### Standing rules (non-negotiable)

**Height and scrollability**
- The hero must never occupy 100% of the viewport height. Cap at `max-height: 85vh` (80–90vh range) so content below the fold always peeks into view, signalling that there is more to see.
- Never design a hero that makes the page look "done." If the viewport shows a full, self-contained visual with no hint of what follows, users will not scroll. This is the illusion of completeness — it is a silent conversion failure.

**The three-question rule (homepages and top-level landing pages)**
- The hero must immediately answer three questions without scrolling:
  1. **Who are you?** (logo, brand name)
  2. **What do you do?** (primary H1)
  3. **How can you help me?** (supporting sentence or CTA)
- If the hero cannot answer all three, it is decorative at the expense of conversion. Flag this explicitly.
- Baseline pattern: `H1` + 1–3 sentence paragraph + CTA button. All deviations require justification.

**Background type selection**
- **Solid colour**: strongest for text readability and message clarity. Use when the message must be absorbed quickly.
- **Image**: adds emotional or contextual value. Requires sufficient overlay/darkening for text contrast — never rely on the image alone to provide contrast.
- **Video**: see Video Background rules below. Use sparingly; never rely on audio.
- **Combination** (coloured half + image half): safe and common. Left column text, right column visual is the most established desktop pattern.

**Video backgrounds**
- Muted autoplay only — never design for audio to carry meaning. Chrome and all modern browsers block autoplay-with-sound by default (Chrome autoplay policy, in force since 2018).
- Always handle `.play()` as a Promise. It will reject with a `NotAllowedError` if autoplay is blocked. Catch the rejection and show a static poster image or play button fallback — never leave the UI in a broken state (pause icon showing when nothing is playing).
- Required HTML attributes: `autoplay muted loop playsinline`. Wrap the `.play()` call in `.catch()`.
- Video motion must be slow, simple, and cinematic. Busy, fast, or distracting video behind a hero headline kills comprehension and delays the user's ability to read the message. If in doubt, use a static image instead.
- Text over video requires an overlay treatment (semi-transparent dark or light layer) — do not rely on a single frame of the video being light or dark enough.

**Subpage heroes**
- Use a simple title bar — left-aligned or centred title, consistent across all subpages.
- An optional short descriptive paragraph beneath the title is beneficial.
- Keep subpage hero height much smaller than the homepage hero — it should not compete with the content below it.
- Include breadcrumbs on subpages (see Breadcrumb rules above).

### Hero pre-emit gate

Run this gate whenever the output includes a hero section:

- **Height**: hero does not exceed ~85vh. Content below is visible or strongly implied.
- **Three questions**: on homepages, H1 answers who/what/how without scrolling.
- **Contrast**: text over image or video has an overlay; WCAG AA contrast met.
- **Video**: muted, `playsinline`, `.play()` Promise handled with a fallback.
- **No illusion of completeness**: the hero does not look like a finished, self-contained page.

State result inline: `✓ Hero / above-the-fold` or flag specific failures.


## Hero Variant Taxonomy

> Heroes are not a single component. They are a **taxonomy of 10 distinct layout types**, each with a specific brand personality fit, reading pattern, and conversion implication. Defaulting to a generic hero is an active mistake for editorial, academic, and medical brands.
>
> Full taxonomy reference: [`skills/frontend-design/hero-variants.md`](hero-variants.md)

### The carousel rule — no exceptions

**Never use a carousel/slider as a hero.** Replacing a rotating hero carousel with a single static hero increases conversion by **+22.7%** (VWO, 2022). Carousels are banner-blindness accelerators — users treat auto-rotating elements as advertising and skip them. This is the most replicated negative finding in hero section research (Baymard Institute, 2023).

### Typography-led advantage (B2B/editorial/medical contexts)

For B2B and professional audiences, typography-led heroes outperform image-led heroes by **+27% conversion** (Conversion Rate Experts, 2022). For medical and academic brands specifically, the type-led or editorial grid pattern is the norm — not the exception.

### The 10 variants — compact reference

| Code | Variant name | One-line description | Best for |
|---|---|---|---|
| HV-1 | Full-Bleed Image | Full-width photography + overlay, single message | Lifestyle, consumer, aspirational brands |
| HV-2 | Editorial Split | Dark/brand panel left (60%), editorial image right (40%) | Editorial publications with strong brand colour |
| HV-3 | Editorial Grid | Featured story (left 2/3) + secondary stack (right 1/3) | Journals, news, magazines, multi-article publishers |
| HV-4 | Full-Bleed Typographic | Massive display type, no image — type IS the design | Academic institutions, prestige publications |
| HV-5 | Magazine Cover | 3-column: teasers | main headline | cover image | Consumer health, issue-based magazines |
| HV-6 | Academic/Journal | White bg, journal metadata, featured article, small inset | Specialist journals, peer-reviewed publications |
| HV-7 | Video Lead | Autoplay muted video background, text overlay | Tourism, hospitality, lifestyle — NOT medical/academic |
| HV-8 | Dashboard/App | Authenticated, personalised stats above fold | CPD platforms, member portals (V2 feature) |
| HV-9 | Topic/Category Navigator | Category tile grid — hero IS navigation | Large content libraries, multi-specialty platforms |
| HV-10 | Campaign/Announcement | Time-bounded event overlay — sits ABOVE the permanent hero | Webinars, CPD events, product launches |

### The 5-question decision framework

Before building any hero, answer these in order:

1. **Brand personality?** Academic / Editorial / Clinical / Consumer / Platform / Event
2. **Primary goal above the fold?** Read article / Browse topics / Register / Attend event / Check CPD
3. **Content type?** Journal / Magazine / CPD platform / News / Product / Database / Event
4. **Image assets available?** High-quality editorial photography / Stock only (→ pivot to HV-4 or HV-6) / None (→ HV-4)
5. **Mobile-first or desktop-first audience?** Mobile-primary → HV-3, HV-10, HV-1 (weight-controlled); Desktop-primary → HV-3, HV-2, HV-5

See `hero-variants.md` for the full decision matrix mapping these answers to specific variants.



### Hero pre-emit gate — variant justification (added requirement)

The existing pre-emit gate (height, three questions, contrast, video, illusion of completeness) now includes a **mandatory variant justification step**:

- **Variant identification**: name the hero variant (HV-1 through HV-10) before writing a line of code.
- **Justification**: state the brand personality, content type, primary goal, and audience that justify the choice.
- **Mismatch flag**: if the variant is HV-1 (Full-Bleed Image) or HV-2 (Editorial Split) for an academic or clinical brand — flag as probable mismatch and propose HV-3 or HV-6 instead.
- **No carousel**: if the brief requests a carousel, reject it explicitly and propose HV-3 (editorial grid) as the correct alternative.

A generator that builds a hero without identifying its variant has skipped this gate. That is a pre-emit failure.

---

## Card Design System

> **Full reference**: [`card-system.md`](card-system.md) — all 9 variants fully documented with mandatory/optional elements, image specs, anti-patterns, CSS architecture, and impact metrics.
>
> **Core finding**: Cards are not one component — there are **9 distinct variants** serving different reading modes. Using one template for all contexts is the single most common failure mode in editorial UI.

### 9-Variant Reference Table

| Code | Variant | Job | Image Ratio | When to Use |
|------|---------|-----|-------------|-------------|
| CV-1 | Hero Card | Anchors page; most important story | 16:9 or 5:3, full-bleed | Top of homepage / category — one per page only |
| CV-2 | Featured Card (H-split) | Second-tier; image left 40%, content right 60% | 3:2 preferred | First card in a section; +15–22% CTR vs vertical |
| CV-3 | Standard Grid Card | Workhorse; vertical 3-col grid | **16:9 — not 3:2, not 4:3** | Category index pages, related articles |
| CV-4 | Compact List Card | Maximum density; thumbnail + headline only | 1:1 or 4:3, 80px max | Mobile, sidebar, search results, archives |
| CV-5 | Text-Only Card | No image; typography-led | None | Opinion, rapid responses, letters, no-image content |
| CV-6 | Podcast/Audio Card | Episode number prominent; horizontal strip | 1:1 (cover art) | Podcast index; audio sections |
| CV-7 | Webinar/Video Card | Play icon overlay; date chip; speaker info | **16:9** + play icon | Webinar library; on-demand video; CPD video |
| CV-8 | Journal Article Card | DOI / volume / issue metadata; abstract excerpt | Optional 3:2/16:9 | Academic journal listings; search results |
| CV-9 | CPD Card | Points display prominent; outlined pill badge; progress indicator | 16:9 (video) or 1:1 (speaker) | CPD library; professional learning platforms |

### 4-Tier Information Hierarchy (rule, not suggestion)

| Tier | Element | Spec |
|------|---------|------|
| **1 — Orientation** | Category label / content type badge | 10–11px, uppercase, letter-spacing 0.12em, brand primary colour |
| **2 — Decision** | Headline | 16–20px, weight 600–700, line-height 1.2–1.3, `line-clamp: 2` |
| **3 — Confirmation** | Excerpt | 13–14px, weight 400, line-height 1.5, mid grey, `line-clamp: 3` — **hide on compact cards** |
| **4 — Trust signals** | Author, date, read time | 11–12px, weight 400, mid grey, 55–60% opacity — always last |

Placing date before headline, or omitting category label, disrupts cognitive flow and reduces CTR 10–15% (Baymard).

### Interaction States (all 5 required — no exceptions)

| State | Behaviour |
|-------|-----------|
| **Default** | Clean — no decoration |
| **Hover** | Headline → brand primary (0.15s ease-out); image overlay (brand primary, 15% opacity via `::after`) |
| **Focus (keyboard)** | `outline: 3px solid var(--brand-primary); outline-offset: 2px` — **never remove** |
| **Active** | `transform: scale(0.98)` |
| **Read/Visited** | 0.7 opacity on image; ✓ or "Read" indicator |

Hover animation: 150–200ms ease-out. Always provide `@media (prefers-reduced-motion)` path.
**No overt CTA button** on editorial cards — implicit card-click outperforms explicit "Read article" button (Parse.ly 2023).

### Key Rules — Standalone

- **16:9 for CV-3 grid cards** — not 3:2, not 4:3. Never mix ratios within the same grid row.
- **CPD badge: outlined pill** (`border: 1.5px solid var(--brand-primary); border-radius: 999px; background: transparent`) — not a filled rectangle.
- **Sharp corners by default** (`border-radius: 0`) for editorial contexts. Rounded corners only for app/product contexts.
- **Excerpt visibility**: remove at < 768px (except hero). Never show on CV-4 compact list at any viewport.
- **Tap target floor**: 44×44px minimum — cards < 44px tall on mobile cause 12–18% miss-tap rates (Hoober 2013).
- **CPD badge always retained** at all viewports — primary decision signal for medical users.
- **Entire card is the click target** — headline is the screen-reader link text. No nested interactive elements.
- **Skeleton loading** over spinners — reduces perceived wait time 15–20% and abandonment up to 20%.

### Responsive Collapse Rules

| Viewport | Grid | What Disappears |
|---|---|---|
| ≥ 1280px | 3-col + featured spans wider | Nothing hidden |
| 1024–1279px | 2-col | CV-2 H-split collapses to vertical |
| 768–1023px | 2-col condensed | Excerpts hidden; author optional |
| < 768px | 1-col list | All → CV-4 style; excerpts gone; author gone |

### Card Pre-Emit Gate (7 checks)

Before outputting any card component, confirm:

1. ☐ **Variant identified** — which of CV-1 through CV-9 is this, and why?
2. ☐ **Image ratio correct** — CV-3 is 16:9; no 3:2 or 4:3 in a standard grid
3. ☐ **Hierarchy order correct** — category label → headline → excerpt → meta (date last)
4. ☐ **All 5 interaction states implemented** — default, hover, focus, active, visited
5. ☐ **CPD badge is outlined pill** — not filled, not a rectangle
6. ☐ **No overt CTA button** — editorial cards rely on implicit card-click
7. ☐ **`prefers-reduced-motion`** — all hover/active transitions wrapped

See [`card-system.md`](card-system.md) for full taxonomy detail, CSS architecture, decision matrix, and cited metrics.


---


---

## Animation as Functional Feedback

> **Full reference**: [`animation-system.md`](animation-system.md) — 8-class taxonomy, token system, WCAG implementation, IntersectionObserver pattern, vestibular guidance.
> **Source**: animation-system.md

**The core rule**: Every animation must communicate something. If you cannot answer "what does this motion tell the user?" in one sentence, remove the animation.

Animation is feedback, not decoration.

---

### The 8 intent classes — compact reference

| Code | Name | What it communicates | Duration | Easing |
|---|---|---|---|---|
| **ENT** | Entrance | "New content has appeared" | 150–400ms | ease-out |
| **EXT** | Exit | "Content is leaving / action confirmed" | 100–200ms | ease-in |
| **STA** | State Change | "This element's state has changed" | 100–200ms | ease-in-out |
| **LOD** | Loading/Progress | "Work is happening, please wait" | Loop | linear |
| **ATT** | Attention Direction | "Look at this specific thing" | 2–3s loop | ease-in-out |
| **SPA** | Spatial Navigation | "You have moved to a different location" | 250–400ms | ease-in-out |
| **FBC** | Feedback Confirmation | "Your action was received and processed" | 300–500ms | ease-out |
| **AMB** | Ambient/Decorative | "Pure visual texture — no semantic meaning" | Slow loop | ease-in-out |

**Always** classify an animation before adding it. If it does not fit one of these 8 classes, it should not exist.

---

### Animation token system

```css
:root {
  --anim-duration-instant:    100ms;  /* STA — hover micro-changes */
  --anim-duration-fast:       150ms;  /* EXT, small STA */
  --anim-duration-base:       300ms;  /* ENT, FBC, SPA */
  --anim-duration-slow:       400ms;  /* ENT hero, ATT */
  --anim-duration-deliberate: 500ms;  /* Complex entrance */

  --anim-ease-entrance: cubic-bezier(0, 0, 0.2, 1);        /* Fast in, settle */
  --anim-ease-exit:     cubic-bezier(0.4, 0, 1, 1);        /* Accelerate out */
  --anim-ease-state:    cubic-bezier(0.4, 0, 0.2, 1);      /* Symmetric */
  --anim-ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* Springy — use rarely */
  --anim-ease-linear:   linear;                             /* Loading, progress */

  --anim-stagger-tight:  50ms;   /* Dense card grids */
  --anim-stagger-normal: 80ms;   /* Standard lists */
  --anim-stagger-loose:  120ms;  /* Hero sections */
}

/* Reduced-motion: all durations collapse to near-zero */
@media (prefers-reduced-motion: reduce) {
  :root {
    --anim-duration-instant:    0.01ms;
    --anim-duration-fast:       0.01ms;
    --anim-duration-base:       0.01ms;
    --anim-duration-slow:       0.01ms;
    --anim-duration-deliberate: 0.01ms;
    --anim-stagger-tight:  0ms;
    --anim-stagger-normal: 0ms;
    --anim-stagger-loose:  0ms;
  }
}
```

Using these tokens means every animation in the system **automatically respects `prefers-reduced-motion`** — elements snap to their final state with no motion.

---

### CSS performance tiers (HARD RULES)

**Tier 1 — GPU-composited: animate freely**
```
transform (translate, scale, rotate, skew)
opacity
```

**Tier 2 — Paint-triggering: one-time transitions only, never loop**
```
background-color, color, border-color, box-shadow, border-radius
```

**Tier 3 — Layout-triggering: NEVER ANIMATE**
```
width, height, top, left, right, bottom, margin, padding, display, visibility
```

Replace `top`/`left` with `transform: translate()`. Replace `width: 0` with `transform: scaleX(0)`. Replace `display: none` with `opacity: 0; pointer-events: none`.

**`will-change` rule**: Apply only immediately before animation; remove after. Never apply `will-change` to all cards or all elements globally — it wastes GPU memory and degrades overall performance.

```css
.card:hover { will-change: transform; }
.card:not(:hover) { will-change: auto; }
```

---

### WCAG 2.1 SC 2.3.3 — Animation from Interactions

Level AAA — but non-negotiable for any medical or professional audience.

**Correct implementation** (not the naive "animation: none" approach):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* Essential animations must be explicitly re-enabled */
  .spinner { animation: spin 1s linear infinite !important; } /* Loading is essential */
}
```

**"Reduce" does not mean "remove."** Provide a static alternative. Loading spinners and progress bars are **essential** — do not remove them. Entrance fades and decorative motion are **not essential** — elements appear immediately.

**Vestibular triggers — avoid or handle with reduced-motion**:
- Parallax scrolling (critical risk)
- Zoom animations >10% viewport (high risk)
- Continuous rotation / spinning (high risk)
- Large-scale translateX/Y >200px (high risk)
- Auto-playing background video (high risk)
- Rapid opacity flash >3Hz (seizure risk — WCAG SC 2.3.1 hard failure)

~35% of adults 40+ have vestibular disorders (NIDCD). For a medical or academic audience this is not an edge case.

---

### IntersectionObserver rule

**Never use scroll event listeners for animation triggers** — they run on the main thread and cost 2–8ms per scroll event at 60fps.

**Always use IntersectionObserver** — fires off the main thread at ~0.1ms per check.

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // Trigger once only
    }
  });
}, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

---

### Animation pre-emit gate (6 checks)

Before adding **any animation** to a deliverable, verify all 6:

1. **Intent check** — Does this animation map to one of the 8 intent classes? State which one. If it doesn't map, remove it.
2. **Performance check** — Are only `transform` and `opacity` animated? If STA class, are colour transitions one-time only (not looped)?
3. **Duration check** — Is duration within the class range? Nothing above 500ms. Nothing below 100ms (imperceptible).
4. **Simultaneous count** — Are there ≤2 animations playing at the same time? If card grid, is stagger ≤120ms and capped at 3–4 items?
5. **Reduced-motion check** — Is `prefers-reduced-motion` handled, either via the token system or explicit `@media` rules? Are essential animations retained?
6. **Vestibular check** — Does any animation involve parallax, large-scale translation (>200px), continuous rotation, or zoom? If yes, is it behind a reduced-motion guard?

State results inline: `✓ Animation` or list each failed check with the specific animation and fix required.

See [`animation-system.md`](animation-system.md) for full taxonomy, vestibular guidance, IntersectionObserver pattern, and impact metrics.


## Stack selection

### Svelte 5 / SvelteKit (primary — use by default)

See [references/svelte-setup.md](references/svelte-setup.md) for full setup.

> ⚠️ **AI agents commonly generate Svelte 4 store patterns. Always use Svelte 5 Runes:
> `$state`, `$derived`, `$effect`. Never use `writable()`, `readable()`, or `derived()`
> from `svelte/store` in new code.**

- Use **DaisyUI** theme tokens and components as the first choice.
- Use **Flowbite UI** Svelte components where DaisyUI lacks coverage.
- For streaming / AI agent UIs: use SvelteKit `+page.server.ts` deferred promises, not
  client polling.
- Preview via `deploying-apps` skill; screenshot via Playwright CLI.

### React + Babel (single-file throwaway prototypes only)

See [references/react-setup.md](references/react-setup.md).

- Use only when a `file://` double-click is required (no server, no build step).
- Pin CDN versions — intentional exception to no-external-CDN rule for this use case only.
- For anything beyond ~1000 lines or multi-screen flows, switch to SvelteKit.

### WordPress themes / blocks

- Output standard PHP/HTML/CSS following WordPress template hierarchy.
- Read `skills/brand-guidelines/SKILL.md` for colour tokens before writing any theme CSS.
- Use DaisyUI/Tailwind only if the theme's `package.json` already includes it.
- **Assess client manageability early.** Before choosing a technical approach, establish whether the client will manage the site without developer involvement. If yes — and this is the default assumption for small-to-medium WordPress builds — prefer plugins and theme options over custom code wherever a maintained plugin covers the requirement. Custom code has a lower short-term cost and a higher long-term one; a client who cannot update their own products, shipping rules, or page content is a client who will call you every week. Document the chosen approach and its manageability implications in a comment at the top of any custom template file.

---

## Design direction advisor (fallback)

**Trigger** when: vague brief, no references, no DS, or user asks for directions/styles.
**Skip** when: concrete references, clear single direction, or tiny mechanical edits.

Lightweight default: **three differentiated directions** — expand only if asked.
Full eight-phase flow: [references/design-direction-advisor.md](references/design-direction-advisor.md).
Philosophy catalogue: [references/design-styles.md](references/design-styles.md).

---

## App / iOS-style prototype annex

**Triggers**: "app prototype", "iOS mockup", "mobile app".

- **Default**: SvelteKit for interactive multi-screen flows; single-file React+Babel only
  for simple `file://` demos.
- **Delivery modes**: ask — overview grid (all screens, static frames) vs single-device flow.
- **Before handoff**: Playwright click path (tabs, primary CTA, back) — zero `pageerror`.
- **Device chrome**: use [assets/ios_frame.jsx](assets/ios_frame.jsx) — do not hand-roll
  Dynamic Island geometry.

---

## Design Quality Checklist

Run these six checks on every UI deliverable before calling it done. Each rule maps to a gate item in the Pre-emit section below.

---

### 1. Typography — Anchor-First Font Pairing

Fonts work in levels. Level 1: one font, no pairing needed. Level 2: super-families — serif + sans + mono from the same extended family (e.g. Fraunces + Fraunces Italic). Level 3: deliberate cross-foundry combos for personality and contrast.

**Rules:**
- Choose the headline font first — it sets the personality of the page. Find a body font that feels like it belongs to the same world but provides contrast (not similarity).
- Never pair two fonts that are too similar (e.g. Georgia + Times New Roman) — it reads as accidental, not intentional. Contrast is the point.
- Condensed display fonts for headlines + wider body fonts is a reliable high-contrast pairing technique.
- Proven free combo: **Instrument Serif** (headline) + **Geist Sans** (body). Use Fonts In Use to find proven pairings before inventing your own.
- This supplements — does not replace — the existing typographic contrast rule in the Pre-emit gate. Size and weight hierarchy is still required; font pairing adds personality on top.

---

### 2. Star of the Show

Every page must have one dominant visual element that anchors attention. Not "something that looks cool" — it must be conceptually tied to the brand or product story.

**Rules:**
- The star is chosen before anything else is designed. Everything else on the page supports it.
- The star earns its place through size, motion, interaction, or distinctive imagery — and through conceptual relevance. A star that is visually dominant but conceptually arbitrary is decoration, not design.
- Examples: an abstract chart-like gradient for a SaaS dashboard product; a bold typographic treatment for a publication brand.
- If you cannot name what the star is and why it belongs to this brand, it is not a star — it is a hero image.

**Gate item: Star of the show** — one dominant visual element is present; it is conceptually tied to the brand or product; it is the most visually distinctive element on the page.

---

### 3. Visual Rhyming

Once the star is established, its motifs — shapes, colours, textures, gradients — must echo across the rest of the UI: buttons, icons, card overlays, dividers, arrows.

**Rules:**
- Do not copy the star wholesale. Extract components of it and reuse them in varied ways. Example: triangles from a logo become CSS `clip-path` masks on images, CTA arrow icons, and divider shapes.
- The goal is a site that reads as a single visual system, not a collection of individually designed components.
- If the rest of the UI could belong to a different design system, rhyming has not been applied.

**Gate item: Visual rhyming** — motifs from the star echo in at least 2–3 other UI elements (buttons, icons, shapes, textures). The site reads as a system, not a collection.

---

### 4. Depth and Tactility

Flat pixel interfaces feel weightless. Subtle depth makes a UI feel tangible and considered.

**Rules:**
- Apply at least one depth technique: noise/grain overlay, glass/frosted blur effect, soft layered shadows, or gentle 3D-feeling transforms.
- Depth elements must be "settled" — they support the star without competing with it. If a texture draws more attention than the star, it is wrong.
- **Practical CSS:**
  - Glass card/nav: `backdrop-filter: blur(Npx)` + semi-transparent `rgba()` background.
  - Noise: semi-transparent noise PNG overlay, or SVG `feTurbulence` filter.
  - Elevation: `box-shadow` with low opacity and large spread (e.g. `0 8px 32px rgba(0,0,0,0.12)`).
- **Accessibility caveat**: `backdrop-filter` can reduce text contrast on glass surfaces. Always verify WCAG AA contrast on any glass element — do not assume it passes.

**Gate item: Depth and tactility** — at least one depth technique (texture, glass, layered shadow) is present; it does not compete with the star; contrast on glass surfaces is WCAG AA compliant.

---

### 5. Opacity for Typographic Hierarchy

Do not rely only on font size and weight to establish hierarchy. Opacity communicates secondary and tertiary emphasis levels with subtlety.

**Rules:**
- Recommended opacity scale (adapted from Material Design):
  - Primary / headline text: **100%** opacity
  - Secondary / subheadings: **~87%** opacity
  - Body or supporting text: **~70%** opacity
  - De-emphasised / captions / metadata: **~60%** opacity
- Use `color` with alpha (e.g. `rgba(255,255,255,0.7)` on dark backgrounds) rather than `opacity` on the element — `opacity` affects all children too.
- This is additive to the existing typographic contrast gate — size and weight hierarchy is still required; opacity layering enhances it.
- At least two distinct opacity levels must be present. All text at 100% opacity is a failure of this rule.

**Gate item: Opacity hierarchy** — text elements use opacity variation (not just size/weight) to communicate emphasis levels. At least two distinct opacity levels are present.

---

### 6. Radical Iteration

Never stop at the first good direction. Before settling on a design, generate at least 2–3 meaningfully different versions.

**Rules:**
- "Meaningfully different" means different enough that choosing between them is a real decision — not minor colour tweaks. Different star, different colour scheme, light vs dark, different layout structure.
- Radical alternates are required to escape confirmation bias. The first direction that works is a local maximum, not the best answer.
- This maps to the existing "Variations, not one answer" rule in the execution philosophy — it is not optional polish, it is the process.
- **Time-constrained or mid-build projects** (e.g. a live client build): apply radical iteration at the component level — not the full-page level. Iterate on the hero treatment, the card design, or the CTA section — not the entire site architecture.

---

## Pre-emit self-critique (mandatory before declaring UI complete)

Before any UI is called done, run through [references/anti-slop-checklist.md](references/anti-slop-checklist.md):

1. Anti-slop visual gate — no training-default tropes unless brand-owned.
2. WCAG 2.2 AA accessibility gate — semantics, ARIA, contrast, focus, touch targets.
2a. **Typography size gate** — body text minimum size check:
    - Body text (paragraphs, list items, captions, form labels, helper text) must be **no smaller than 16px**.
    - Prefer **17–18px** for content targeting medical, academic, senior, or accessibility-sensitive audiences.
    - This applies regardless of how clean or minimal the design looks at small sizes.
    - Flag any instance of `font-size` below 16px on body-level text — include the element and the size found.
    - State result inline: `✓ Typography size` or flag specific elements and their sizes.
3. Deceptive design gate (forms/checkout only) — no hidden costs, fake scarcity,
   pre-ticked boxes, or buried opt-outs.
   - Cross-reference the Form Design section above — plain-text links hiding terms, and aggressive validation used as friction, are also deceptive-design violations.

3a. **Icon gate** (any UI with icons) — run the Icon pre-emit gate in
    [references/iconography.md](references/iconography.md): style consistency, size
    consistency, `currentColor`, no emoji substitutes, accessibility, animated icon
    trade-off, trigger consistency, license verified, select chevrons.
    State result inline: `✓ Iconography` or flag issues.

4. **Conversion clarity gate** (landing pages, marketing UI, any page with a primary action)
   - Is there one visually dominant CTA? Can a new visitor identify it within 3 seconds?
   - Does the layout follow natural reading patterns? Primary message and CTA should land where
     the eye goes first — top-left or hero area for LTR layouts (F-pattern for text-heavy pages,
     Z-pattern for visual/sparse layouts).
   - Is the CTA clearly interactive — sufficient contrast, obvious affordance, not competing with
     decorative elements?
   - **CTA label specificity:**
     - CTA button labels must be action-specific and describe what the user gets or does.
     - Flag any button using these generic labels: "Learn more", "Click here", "Submit", "Get started" (without context), "Read more", "Find out more", "View more".
     - A flagged label must be rewritten to be specific — e.g. "View CPD webinars", "Download the programme", "Request a quote", "Book your spot".
     - Exception: "Learn more" is acceptable **only** when used as a secondary action alongside a clearly labelled primary CTA, and when the page or card context makes the subject unambiguous.
     - State result inline: `✓ CTA labels` or list the offending labels and proposed rewrites.
   - State result inline: `✓ Conversion clarity` or flag issues.

5. **Proximity check** (all layouts)
   - Is every heading closer to the content it introduces than to the section above it?
   - Are related controls, labels, and supporting copy grouped together?
   - Are unrelated sections clearly separated with increased spacing?
   - State result inline: `✓ Proximity` or flag issues.

6. **Repetition check** (multi-page / multi-screen work)
   - Do hero/title sections use consistent styling across all pages and screens?
   - Are button treatments, card styles, and type scales uniform throughout?
   - Is the header/footer identical (or intentionally varied) across views?
   - **Container consistency**: does the content in every section — including the hero, any full-bleed sections, and the footer — sit inside the same container (same `max-width`, same horizontal padding, same `margin: 0 auto`)? The background of a section may be full-bleed. The content inside it must not be. If the hero text starts at a different x-position than the text in the section below it, this is a container alignment failure. Flag it explicitly.
   - State result inline: `✓ Repetition` or flag issues.

7. **Visual balance check** (all layouts)
   - Does any column or block visually dominate without a counterbalancing element (image, white space, or secondary content)?
   - Is visual weight distributed — not just pixel count, but perceived heaviness of type, imagery, and colour?
   - State result inline: `✓ Visual balance` or flag issues.

8. **Illusion of completeness check** (all layouts)
   - Does any full-width section — hero, divider, ad unit, promo block — make the page look visually "done"? If yes: add a peek of the next section, reduce vertical whitespace, or add an explicit scroll cue.
   - Full-width horizontal rules and oversized vertical gutters between sections must be reviewed — they can read as "end of page." Use consistent section delineation that suggests continuation, not finality.
   - Carousels and horizontally scrolling containers must:
     - Bleed the next item off the right edge to signal more content.
     - Provide explicit arrow/prev-next controls (not hover-only, not dot-only).
     - Never carry critical content that is not discoverable another way.
   - Test across multiple viewport heights — what peeks on a 1080p monitor may disappear on a 768p laptop. Check at 768px, 900px, and 1080px height minimally.
   - State result inline: `✓ No illusion of completeness` or flag specific failures.

9. **Content & Imagery gate** (all pages with images or visual sections)
   - Every image slot has a declared image intent (`process-shot`, `outcome`, `context`, `diagram`, `portrait`, `branded-item`). No undeclared decorative-only images.
   - No stock photography or generic corporate-style graphics used as primary visual assets (hero, section backgrounds, key feature illustrations).
     > AI-generated placeholder images are permitted in prototypes — they are not stock photography. They must be labelled with their image intent and replaced with real photography before go-live. A note to this effect must appear in the pre-emit gate comment.
   - Media variety considered: where the content type warrants it (how-to, tutorial, service explanation), at least one non-photo media type is accommodated (video embed slot, custom diagram, annotated screenshot).
   - For how-to or step-based content: result/outcome is shown first, then steps with inline imagery.
   - State result inline: `✓ Content & Imagery` or flag specific failures.


10. **Design Quality gate** (all UI deliverables)
   - ✓ **Star of the show**: one dominant, brand-relevant visual anchor is present.
   - ✓ **Visual rhyming**: motifs from the star echo in ≥2 other UI elements.
   - ✓ **Depth**: at least one tactile technique (noise, glass, shadow) is present and does not compete with the star. Contrast verified on glass surfaces.
   - ✓ **Opacity hierarchy**: text uses opacity variation across ≥2 emphasis levels.
   - ✓ **Typography levels**: font pairing (if more than one font) follows anchor-first method; fonts provide contrast, not similarity.

   State result inline: `✓ Design Quality` or flag specific failures.

State results inline: `✓ Anti-slop`, `✓ A11y`, `✓ Typography size`, `✓ No deceptive patterns`, `✓ Conversion clarity`, `✓ Proximity`, `✓ Repetition`, `✓ Visual balance`, `✓ No illusion of completeness`, `✓ Form design (forms only)`, `✓ Navigation (nav present)`, `✓ Advertising (ad-bearing layouts)`, `✓ Hero / above-the-fold (hero present)`, `✓ Content & Imagery (pages with images/visual sections)`, `✓ Overlay (any modal/dialog/overlay component)`, `✓ Animation (any animated element)`, `✓ Design Quality` (or flag issues).

---

## Standard workflow (checklist)

1. **Facts (#0)** for any concrete product/version claim → `product-facts.md`.
1a. **Flow triage** — before any visual work, identify whether any critical user journey (checkout, product customisation, sign-up, primary CTA path) is currently broken or producing errors. If yes, that journey is the entire first phase. Do not begin visual redesign until the broken flow is resolved. A polished homepage on a broken checkout is a net negative.
2. **Clarify** per [references/workflow.md](references/workflow.md) — batch questions; wait
   for answers. Deck work: HTML aggregate deck is always the canonical artefact
   ([references/slide-decks.md](references/slide-decks.md)); for ≥5 slides, 2-page showcase first.
3. **Assets (#1)** for named brands → `brand-spec.md` + files on disk.
4. **Design contract**: read `DESIGN.md` if present; treat its tokens as canonical.
5. **Four design questions** per screen/slide: narrative role; viewing distance; emotional
   temperature; capacity (thumbnail mentally) — state answers; prefer user nod before build.
6. **Stack choice**: Svelte 5 + DaisyUI by default; React+Babel only for `file://` demos.
7. **Scaffold** under `/workspace/data/<project-slug>/`; descriptive filenames.
7a. **Image placeholders**: for each declared image intent slot, generate an AI placeholder image using `text_to_image`. Save to `data/<project-slug>/images/`. Reference in HTML with intent label caption. Skip for `custom-diagram` slots — render as SVG/HTML instead.
8. **Junior pass** then **full pass**; mid-build reshow for long work.
9. **Pre-emit self-critique**: anti-slop + accessibility + deceptive-design gates.
10. **Verify**: Playwright screenshots, console clean, human pass in browser
    ([references/verification.md](references/verification.md)).
11. **Summarise**: caveats, assumptions, next steps — short.
12. **Animation exports (optional)**: only when scripts and media assets exist
    ([references/video-export.md](references/video-export.md)).
12a. **Delivery packaging**
    - Single self-contained HTML file: deliver as-is.
    - Multi-page projects or any project with external assets (images, separate CSS/JS files, fonts):
      package the entire project folder as a `.zip` file alongside the deliverable directory.
      Name the zip `<project-slug>-<version>.zip` and place it in `data/<project-slug>/`.
      Note the zip path in your completion summary.
13. **Critique (optional)** on request: [references/critique-guide.md](references/critique-guide.md).

**Checkpoint rule**: whenever this doc says "stop and confirm", do not continue the heavy
build in the same turn without acknowledgement.

---

## Sandbox execution notes

- **No editor, no browser auto-open**: screenshot via Playwright CLI:
  `npx playwright screenshot "file:///workspace/data/<slug>/index.html" --viewport-size=1440,900 out.png`
  or use the `webapp-testing` skill for interactive flows.
- **Local server**: `python3 -m http.server 8080 &` then reference `http://localhost:8080`.
- **Outputs**: always write to `/workspace/data/<project-slug>/` — never to `~/Downloads`.
- **Tweaks**: always use localStorage fallback — no postMessage bridge available.
  See [references/tweaks-system.md](references/tweaks-system.md).

---

## Technical redlines (React + Babel sketches)

- Never reuse `const styles = {}` across components — use `const fooStyles = {}` per component.
- No cross-`<script type="text/babel">` scope — export with `Object.assign(window, { Foo, … })`.
- Avoid `scrollIntoView` inside nested scroll prototypes.
- Fixed-stage slides/video frames: implement letterboxed scaling, not accidental overflow.

Slides: [references/slide-decks.md](references/slide-decks.md).
Motion pitfalls: [references/animation-pitfalls.md](references/animation-pitfalls.md).

---

## Starter pack index

| Area | File | Notes |
|------|------|-------|
| Device frame | `assets/ios_frame.jsx` | Copy into Babel bundle. |
| Showcase gallery | `assets/showcases/INDEX.md` | Reference PNGs for advisor mode. |
| Iconography | `references/iconography.md` | Icon design rules, resource list, pre-emit gate. |

Scene templates: [references/scene-templates.md](references/scene-templates.md).

---

## Related skills

- **`content-creator`** — when a task requires writing copy, generating image briefs, producing shot lists, auditing existing page content, or pairing copy with image intent for each section, invoke the `content-creator` skill. The frontend-design skill handles layout and visual execution; content-creator handles the content strategy and copy that feeds into that layout. These two skills are designed to work together: content-creator produces the brief, frontend-design builds from it.

## Quick reminders

- **#0 search** before factual claims → `product-facts.md`.
- **#1 assets** before brand-heavy pixels → `brand-spec.md`; no silhouette-as-product.
- **Brand guidelines** skill before any branded output.
- **Svelte 5 Runes always** — never Svelte 4 store patterns.
- **DaisyUI tokens** over ad-hoc hex values.
- **Pre-emit self-critique** before calling UI done.
- **Junior pass first**; batched questions; stop at checkpoints.
- **Anti-slop** protects recognition, not aesthetic LARPing.
- **`prefers-reduced-motion`** — always provide a reduced path.
- **Overlay gate**: before any modal/dialog/overlay — 8 checks must pass. See `overlay-system.md`.
- **Card gate**: before any card component — 7 checks in the Card Design System section. See `card-system.md` for full taxonomy. CV-3 grid cards are **16:9 only**. CPD badge is **outlined pill**, never filled.
- **Animation gate**: before any animation in a deliverable — 6 checks must pass (intent, performance, duration, simultaneous count, reduced-motion, vestibular). See `animation-system.md` for full taxonomy.
- **z-index: 9999 is always wrong** — use `var(--z-modal)` etc. from the token scale.
- Before ambitious motion: read [references/animation-pitfalls.md](references/animation-pitfalls.md).
- **Iconography rules** — read `references/iconography.md` before placing any icon in a UI.
- **Content-first**: every visual slot needs a declared image intent before layout is finalised. No stock photos or generic corporate graphics as primary assets.
- **`content-creator` skill** for copy, image briefs, and shot lists — invoke it before or alongside layout work on content-heavy pages.
- **Backgrounds bleed, content doesn't**: hero and full-bleed sections must have their content in the same `.container` as all other sections. A content left-edge that shifts between sections is a Repetition failure.
- **AI placeholder images**: use `text_to_image` for every photo-intent slot in prototypes. Label with intent. Replace with real photography at go-live. Never use grey boxes when a generated image is available.
- **CTA labels must be specific** — flag "Learn more", "Click here", "Submit", "Read more" and rewrite them in the pre-emit gate.
- **Design Quality Checklist**: Apply the Design Quality Checklist — star, rhyming, depth, opacity hierarchy, anchor-first typography — before any UI is called done.
- **Body text ≥ 16px** (prefer 17–18px for medical/academic/senior audiences) — flag anything smaller in the pre-emit gate.
