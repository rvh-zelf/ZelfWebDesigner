# Slide decks · HTML-first

## Canonical artefact

The **browser-presentable HTML deck** is always the **source of truth**, even if the user later wants PDF or PPTX.

**Default multi-file pattern**

- One HTML per slide (isolates CSS).
- Aggregator `index.html` with `MANIFEST` array listing slide URLs (relative paths).
- Keyboard navigation, scaling, optional print merge.
- Outputs to `/workspace/data/<project-slug>/deck/`.

**Single-file pattern (≤~10 slides or shared state)**

- Inline `<style>` + `<script>` in one file; auto-scale with transform + wrapper.
- Snapshot via Playwright CLI before handoff.

## Decision tree

1. **≥10 slides**, academic structure, or multi-agent parallel authoring → **multi-file + index**.
2. **≤10 slides**, pitch, cross-slide state → **single file** (simpler in sandbox context).
3. **Editable PPTX** requested → read **`editable-pptx.md` first** — HTML must obey four hard constraints from the start; retrofitting costs hours.

## Batch rule

For **≥5** slides: build **two showcase slides** to lock typography, margins, and motion grammar — then duplicate the system across the rest.

## PDF export

Use Playwright via the `webapp-testing` skill: `page.pdf()` per page then merge with `pdf-lib`. Or use the `pdf` skill directly.
