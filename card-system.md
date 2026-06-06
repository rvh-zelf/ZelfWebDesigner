# Card Design System

> **Source**: card-system research (industry benchmarks and publisher analysis)
> **Key finding**: Cards are not one component — there are 9 distinct variants serving different reading modes. Uniform templates are the single most common failure mode in editorial UI.

---

## The 9 Card Variants (Full Taxonomy)

### CV-1: Hero Card

- **Job**: Anchors the page; signals the most important story; sets editorial tone. Dominant, full-width, one per page.
- **Mandatory elements**: Full-bleed image (16:9 or 5:3), category label, H1-weight headline, author, date
- **Optional elements**: Excerpt (1–2 sentences), CTA link, sponsored/featured badge
- **Image requirements**: Min 1200px wide, 16:9 or 5:3, editorial quality (no generic stock). Subject must be meaningful.
- **Alt text**: Descriptive — describes the scene, not the filename.
- **Correct use**: Top of homepage, top of category page, single most-important story only
- **Anti-patterns**: Multiple hero cards on same page; hero inside a grid column; articles of equal importance all presented as hero
- **Real-world example**: Guardian homepage lead story; BBC News featured story; Medscape featured CME case

---

### CV-2: Featured Card (Horizontal Split)

- **Job**: Second-tier importance; gives more information scent than a standard card; works as a "lead" within a section.
- **Mandatory elements**: Image (left, 40–45% width, 3:2 or 16:9), category label, headline (H2-weight), excerpt (2–3 lines)
- **Optional elements**: Author, date, read time, CPD badge
- **Image requirements**: Min 400×270px, 3:2 preferred, left-aligned within split. Object-fit: cover fills full card height.
- **Alt text**: Descriptive of the actual editorial image content.
- **Correct use**: First card in a section, featured story in a category, 2-col featured position, sponsored content slot
- **Anti-patterns**: In a uniform 3-col grid (creates visual inconsistency); for text-only content types with no image available
- **Real-world example**: BMJ featured research; Healio specialty lead; Medscape CME featured
- **CTR note**: Horizontal-split cards outperform vertical by +15–22% CTR in editorial contexts (Parse.ly 2023, 2.3B page views)

---

### CV-3: Standard Grid Card (Vertical)

- **Job**: Workhorse of editorial grids; enables scanning across multiple content items simultaneously.
- **Mandatory elements**: Image (full card width, **16:9 — not 3:2, not 4:3**), category label, headline (2-line max, `line-clamp: 2`)
- **Optional elements**: Excerpt (3-line max, `line-clamp: 3`), author, date, read time
- **Image requirements**: **16:9, min 400×225px**, consistent ratio across all cards in grid — never mix ratios within the same grid.
- **Alt text**: Mandatory, descriptive.
- **Correct use**: 2–4 col grids, category index pages, related articles sections
- **Anti-patterns**: As the single card on a page (use hero or featured instead); in a 1-col mobile layout without condensing; mixing 16:9 and 3:2 images in the same grid row
- **Real-world example**: Medscape article index; Healio news grid; BBC topic index

---

### CV-4: Compact List Card (Horizontal Thumbnail + Text)

- **Job**: Maximum information density for scanning; browse mode for users who know what they want.
- **Mandatory elements**: Small thumbnail (1:1 or 4:3, max 80px wide), category label, headline (1-line, `line-clamp: 1`)
- **Optional elements**: Date, read time — no excerpt on compact cards
- **Image requirements**: Square or 4:3, min 80×60px. May be omitted entirely for text-only content. Alt text required when image present.
- **Alt text**: Brief — image is decorative at this size, but still required.
- **Correct use**: Mobile card layout, "More articles" sections, sidebar, search results, archive browsing
- **Anti-patterns**: As primary grid layout on desktop (too dense; doesn't signal importance hierarchy); for video content (needs 16:9 context)
- **Real-world example**: BBC mobile news list; Nature mobile article list; Guardian sidebar

---

### CV-5: Text-Only Card

- **Job**: Serves content without suitable imagery; maintains grid rhythm when images unavailable or inappropriate.
- **Mandatory elements**: Category label (colour-coded), headline (2-line max), minimal metadata (date, type)
- **Optional elements**: Author, excerpt (if space permits), border-left accent (3–4px, brand primary)
- **Image requirements**: None by definition. If an appropriate image becomes available, upgrade to CV-3.
- **Alt text**: N/A
- **Correct use**: Opinion/editorial content, rapid responses, letters to the editor, breaking news without photo, academic papers without figure
- **Anti-patterns**: As a cost-saving measure when an appropriate image exists; mixing text-only cards with image cards in the same grid without size/weight compensation
- **Real-world example**: Nature rapid communication; BMJ letter; Guardian opinion column without photo

---

### CV-6: Podcast/Audio Card

- **Job**: Signals audio content type; communicates episode identity and length; drives stream/download.
- **Mandatory elements**: Audio waveform or speaker icon overlay, episode title, podcast series name, **duration (mandatory — users decide based on duration)**
- **Optional elements**: Episode number (prominent), thumbnail (1:1), summary excerpt, host name
- **Image requirements**: 1:1 square (podcast cover art convention), min 200×200px; show art or speaker portrait
- **Alt text**: Podcast cover or speaker name + context.
- **Correct use**: Podcast index pages, audio content sections, "Listen now" featured slots
- **Anti-patterns**: For video content (use CV-7 instead); without the duration indicator (critical for audio decisions); using 16:9 thumbnail (wrong convention for audio)
- **Real-world example**: Medscape podcast section; BMJ podcast; NEJM podcast

---

### CV-7: Webinar/Video Card

- **Job**: Signals video content type; communicates duration and CPD value; drives registration or viewing.
- **Mandatory elements**: 16:9 thumbnail with play icon overlay, event title, **duration (mandatory)**, date (for upcoming) or "On Demand" label
- **Optional elements**: Speaker name/photo, CPD point badge, specialty category, registration CTA (upcoming), view count (on-demand)
- **Image requirements**: 16:9, must show speaker or visual content (not generic); min 640×360px; play button overlay (semi-transparent circle, min 40px diameter)
- **Alt text**: Describes the speaker or visual content of the video thumbnail.
- **Correct use**: Webinar library, video content sections, CPD webinar listings, on-demand video archives
- **Anti-patterns**: For audio-only content (use CV-6); without duration; play icon omitted
- **Real-world example**: Medscape video library; Healio CME videos; BMJ Learning

---

### CV-8: Journal Article Card

- **Job**: Serves academic reading mode; surfaces credibility signals (journal, DOI, access type) alongside content.
- **Mandatory elements**: Article type label (Research, Review, Case Report, Editorial), headline, journal name, author(s) (up to 3 + "et al."), publication date, **access badge (Open / Subscription)**
- **Optional elements**: Abstract excerpt (2–3 sentences), DOI, citation count, supplementary data indicator, figure thumbnail
- **Image requirements**: Optional — figure/illustration if available, 3:2 or 16:9. Many journal cards are legitimately text-only.
- **Alt text**: Describes the figure content if a figure is used.
- **Correct use**: Journal homepage, search results, related articles on article pages, academic citation lists
- **Anti-patterns**: For news or opinion content (wrong credibility frame); without access status indicator (critical for user decision); omitting article type label
- **Real-world example**: Nature article card; BMJ article listing; NEJM article card

---

### CV-9: CPD Card

- **Job**: Drives CPD/CME engagement; communicates accreditation value, point allocation, and completion status.
- **Mandatory elements**: **CPD badge (prominent, outlined pill — not filled rectangle)**, **point value ("1 CPD Point")**, content type (Webinar, Article, Case Study), title, specialty category
- **Optional elements**: Completion status (✓ completed, ○ not started, ● in progress), expiry date, accreditation body (e.g. your relevant accreditation body), duration
- **Image requirements**: 16:9 for video-based CPD; 1:1 speaker portrait for webinar; text-only acceptable for article-based CPD
- **Alt text**: Speaker name and context, or descriptive of clinical imagery.
- **Correct use**: CPD library, CPD dashboard, CPD content within specialty sections, homepage CPD featured slot
- **Anti-patterns**: Without point value (defeats the purpose); without completion state management; CPD badge as filled rectangle (looks promotional, not credentialing)
- **Real-world example**: CPD webinar listing on a professional learning platform
- **CTR note**: CPD badge drives +18–24% CTR from verified medical professionals (Medscape internal, cited NEJM Catalyst 2022)

---

## Information Hierarchy Within a Card (The 4-Tier Reading Order)

Cards are processed in a predictable cognitive sequence. Breaking this order disrupts decision-making and reduces CTR by 10–15% (Baymard).

| Tier | Read When | Element | Spec |
|------|-----------|---------|------|
| **Tier 1** | Read first | Category label / content type badge | 10–11px, uppercase, letter-spacing 0.12em, brand primary colour |
| **Tier 2** | Read second | Headline — most important, highest visual weight | 16–20px (card-size dependent), weight 600–700, line-height 1.2–1.3, `line-clamp: 2` |
| **Tier 3** | Read third | Excerpt — confirmation signal | 13–14px, weight 400, line-height 1.5, mid grey — hide on compact cards; `line-clamp: 3` |
| **Tier 4** | Read last | Meta (author, date, read time) + action badges (CPD, peer-reviewed) | 11–12px, weight 400, mid grey, 55–60% opacity |

### CPD badge exception

CPD badges break normal hierarchy — they appear **after the category label but before the headline** (or overlaid on image corner). They must use a colour distinct from the category label. Minimum 11px for point value text. Completion state (✓ / ○ / ●) must be integrated into the badge in CPD library contexts.

### Visual weight scale

| Element | Opacity / Weight | Purpose |
|---------|-----------------|---------|
| Headline | 100%, weight 600–700 | Primary decision signal |
| Category label | 100%, weight 500 + colour accent | Content type filter |
| CPD badge | 100%, outlined pill | Accreditation signal |
| Excerpt | 87%, weight 400 | Confirmation detail |
| Author name | 60%, weight 400 | Trust signal |
| Date / read time | 55%, weight 400 | Freshness / effort signal |

### When to show/hide excerpts

| Card Variant | Desktop | Tablet | Mobile |
|---|---|---|---|
| Hero Card (CV-1) | Always (2 sentences) | Always | 1 sentence to 480px |
| Featured Card (CV-2) | Always (3 lines) | Show | Hide |
| Standard Grid (CV-3) | Show (2–3 lines) | Show (2 lines) | **Hide** |
| Compact List (CV-4) | Never | Never | Never |
| Text-Only (CV-5) | Show if space allows | Show | Hide |
| Webinar/Video (CV-7) | Show duration always | Show duration | Duration only |
| CPD Card (CV-9) | Show (point value priority) | Show | Point value only |

---

## Interaction States (All Cards Must Implement All 5 States)

| State | Behaviour | CSS |
|-------|-----------|-----|
| **Default** | Clean, no decoration | Base card styles only |
| **Hover** | Headline → brand primary colour (0.15s ease-out); image overlay (brand colour, 15% opacity via `::after` pseudo) | `transition: color 0.15s ease-out` on headline; `::after { background: var(--brand-primary); opacity: 0.15; }` |
| **Focus (keyboard)** | Visible outline — **do not remove** | `outline: 3px solid var(--brand-primary); outline-offset: 2px; border-radius: inherit;` |
| **Active** | Slight press | `transform: scale(0.98);` |
| **Read / Visited** | 0.7 opacity on image; ✓ or "Read" indicator | `.card--visited img { opacity: 0.7; }` + badge |

### Additional interaction rules

- Hover animation timing: 150–200ms ease-out. Faster = unintentional; slower = sluggish (CXL 2023).
- Image hover zoom: `transform: scale(1.03)` on `img` within `overflow: hidden` card — effective; higher values feel bouncy.
- **`prefers-reduced-motion`**: wrap all transforms in `@media (prefers-reduced-motion: no-preference)`.
- **Entire card as click target** (not just the title link). Use `<a>` wrapping the card or a stretched link pattern.
- **No overt CTA button** in card footer for editorial contexts — implicit card-click outperforms explicit "Read article" button (Parse.ly 2023); overt buttons make editorial feel promotional and reduce CTR.
- Skeleton loading: use proportionally-correct placeholder shapes (not spinner); reduces perceived wait time by 15–20% and abandonment by up to 20% (UX Collective meta-analysis 2022).

---

## Image Rules

| Card Variant | Ratio | Min Dimensions | Notes |
|---|---|---|---|
| Hero (CV-1) | **16:9 or 5:3** | 1200px wide | Full-bleed; editorial quality only |
| Featured (CV-2) | **3:2** preferred | 400×270px | Fills left 40–45%, object-fit: cover |
| Standard Grid (CV-3) | **16:9 — not 3:2, not 4:3** | 400×225px | Consistent across entire grid |
| Compact List (CV-4) | 1:1 or 4:3 | 80×60px | Small thumbnail; may be omitted |
| Podcast (CV-6) | **1:1** | 200×200px | Cover art convention |
| Webinar/Video (CV-7) | **16:9** | 640×360px | Play icon overlay required |
| Journal Article (CV-8) | 3:2 or 16:9 | 300×200px | Optional — many are text-only |
| CPD (CV-9) | 16:9 (video) or 1:1 (speaker) | 640×360px | Per content type |

**Image overlay on hover**: `::after` pseudo-element, `position: absolute; inset: 0; background: var(--brand-primary); opacity: 0.15; pointer-events: none;` — visibility toggled via parent `:hover`.

**Alt text rule**: Mandatory on all images. Must be descriptive of the actual content. Never the filename. Never "image" or "photo". For decorative thumbnails at compact size, use `alt=""` only if the same information is conveyed in adjacent text.

---

## Responsive Behaviour

| Viewport | Grid | Card Adaptations |
|---|---|---|
| **≥ 1280px** | 3-col + hero/featured spans wider | Full hierarchy: CV-1 hero, CV-2 featured (H-split), CV-3 standard |
| **1024–1279px** | 2-col | CV-2 featured → vertical (H-split collapses); CV-3 retained |
| **768–1023px** | 2-col condensed | Excerpts hidden on CV-3; smaller images; author optional |
| **< 768px** | 1-col list | All cards → CV-4 compact list style (thumbnail + headline only) |

### Adaptation rules by element

1. **Excerpts**: Remove at < 768px — except hero (keep 1 sentence to 480px)
2. **Image ratio**: Maintain 16:9 across all sizes — never force 1:1 crop on resize (distorts composition)
3. **Featured → Vertical**: Below 1024px, CV-2 H-split flips to vertical stacking
4. **Author/Date**: Date always retained (freshness signal); author optional below 768px
5. **CPD Badge**: Always retained at all sizes — primary decision signal for medical users
6. **Grid gaps**: 24px desktop → 16px tablet → 12px mobile
7. **Headline typography**: Never below 16px on mobile (readability floor)
8. **Tap targets**: Minimum 44×44px (Apple HIG) / 48×48dp (Material). Cards < 44px tall on mobile produce 12–18% miss-tap rates (Hoober 2013)

---

## Impact Metrics (Cited)

| Metric | Finding | Source | Data Quality |
|---|---|---|---|
| H-split vs vertical CTR | +15–22% CTR for horizontal-split featured cards | Parse.ly (2023), 2.3B page views | High |
| CPD badge CTR | +18–24% CTR for verified medical professionals | Medscape internal / NEJM Catalyst (2022) | Medium |
| Varied grid vs uniform | +23–31% scroll depth with mixed card sizes | CXL Institute (2021) | Medium |
| Skeleton loading abandonment | −20% abandonment vs spinner | UX Collective meta-analysis (2022) | Medium |
| Category label presence | +8–12% CTR for returning visitors | Chartbeat (2022) | Medium |
| Excerpt present | +18% engagement (CTR + time on page) | Parse.ly (2023) | Medium |
| Mobile miss-tap (< 44px) | 12–18% miss-tap rate | Hoober (2013) | Medium |
| Skeleton perceived performance | −15–20% perceived wait time | Viget (2016), NNg (2020) | High |
| Grid position CTR decay | Positions 1–3 receive 60% of clicks; position 7+ < 5% | Parse.ly (2023) | High |

---

## Decision Framework — Which Card Variant When

| Situation | Use Variant | Rationale |
|---|---|---|
| Most important story on page | **CV-1 Hero** | Signals editorial importance; dominates hierarchy |
| Second-tier featured story | **CV-2 Featured (H-split)** | +15–22% CTR; more detail than standard |
| General content index grid | **CV-3 Standard Grid** | Balanced density and information scent |
| Mobile / sidebar / archive | **CV-4 Compact List** | Maximum density for scanning mode |
| Opinion / no suitable image | **CV-5 Text-Only** | Avoids wrong imagery; honest design |
| Podcast content | **CV-6 Podcast/Audio** | Duration + audio type are mandatory signals |
| Webinar / video content | **CV-7 Webinar/Video** | 16:9 + play icon + duration mandatory |
| Academic journal article | **CV-8 Journal Article** | Author(s), journal, access status mandatory |
| CPD-accredited content | **CV-9 CPD Card** | Point value + completion state mandatory |
| Search results | **CV-4 Compact List** | Scanning mode; user knows what they want |
| Related articles sidebar | **CV-4 Compact List** | Space-constrained; secondary importance |
| Homepage featured section | CV-1 + 2× CV-2 + CV-3 grid | Editorial hierarchy: 1 hero, 2 featured, then standard |


---

## CSS Architecture

```css
/* Base card class — shared by all variants */
.card {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-radius: 0;          /* Sharp corners by default (editorial context) */
  background: var(--surface);
  transition: box-shadow 0.15s ease-out;
}

/* Rounded corners ONLY for app/product contexts */
.card--app {
  border-radius: 8px;
}

/* Variant modifier classes */
.card--hero      { /* CV-1: full-width, image dominant */ }
.card--featured  { /* CV-2: flex-row, image left 40-45% */ }
.card--grid      { /* CV-3: flex-col, 16:9 image top */ }
.card--compact   { /* CV-4: flex-row, thumbnail 80px */ }
.card--text      { /* CV-5: no image, border-left accent */ }
.card--podcast   { /* CV-6: 1:1 art, waveform icon */ }
.card--video     { /* CV-7: 16:9 + play overlay */ }
.card--journal   { /* CV-8: text-forward, access badge */ }
.card--cpd       { /* CV-9: CPD badge, point value, progress */ }

/* Hover image overlay — via ::after pseudo */
.card__image-wrap {
  position: relative;
  overflow: hidden;
}
.card__image-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--brand-primary);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease-out;
}
.card:hover .card__image-wrap::after {
  opacity: 0.15;
}

/* Focus state — never remove */
.card:focus-within {
  outline: 3px solid var(--brand-primary);
  outline-offset: 2px;
}

/* Active state */
.card:active {
  transform: scale(0.98);
}

/* CPD badge — outlined pill, never filled rectangle */
.badge--cpd {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border: 1.5px solid var(--brand-primary);
  border-radius: 999px;          /* pill shape */
  background: transparent;       /* outlined, not filled */
  color: var(--brand-primary);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .card, .card__image-wrap::after, .card__image img {
    transition: none;
  }
  .card:active { transform: none; }
}
```

### Architecture rules

- **Sharp corners by default** for all editorial contexts — `border-radius: 0`
- **Rounded corners only** for app/product contexts — use `.card--app` modifier
- **Never use card-specific z-index** — use `overlay-system.md` tokens if stacking is needed
- Variant styles are **modifier classes** — never fork a separate component per variant
- The image wrapper uses `overflow: hidden` to contain the hover-zoom effect
- Card link wraps the entire card (`<a class="card">`) — the headline is the readable link text for accessibility

---

## Sources

1. Parse.ly (2023). Content Analytics Report — 2.3B page views sample.
2. Chartbeat (2022). Editorial Engagement Research.
3. CXL Institute (2021). Scroll Depth and Layout Variety.
4. Medscape Internal Research, cited in NEJM Catalyst (2022).
5. Nielsen Norman Group (2023). Cards Component.
6. Nielsen Norman Group (2020). List View vs. Grid View.
7. Baymard Institute (2022). Content List vs. Grid.
8. Steven Hoober (2013). How Do Users Really Hold Mobile Devices? UX Matters.
9. Viget (2016) / Nielsen Norman Group (2020). Skeleton Loading Research.
10. UX Collective (2022). Skeleton Loading Meta-Analysis.
11. Smashing Magazine (2022). Card Component Design Best Practices.
12. ConversionXL (2021). Image Ratio Testing.
13. Readability Group (2021). Text Truncation in UI.
