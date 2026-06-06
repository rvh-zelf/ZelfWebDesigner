# Content and anti-slop guidelines

## Why "anti-slop"

"Slop" = high-frequency **training-default** visuals that **erase brand recognition**. The fix is both **positive** (real logos, product/UI art, verified palette) and **negative** (avoid clichéd patterns unless brand-owned).

## Element-level guide

| Pattern | Why it reads as slop | Allowed when |
|---------|----------------------|----------------|
| Aggressive purple gradients on white | Default "AI SaaS" trope | Brand actually uses it, or satire of the trope |
| Emoji bullets as "icons" | Substitute for professional iconography | Brand voice is playful/kids |
| Card + left coloured rail | Exhausted 2020–24 pattern | Explicit user request or brand spec |
| SVG "photos" of people/products | Wrong tool, uncanny | Almost never — use photo, illustration, or honest placeholder |
| CSS silhouette as hero product | Any hardware looks identical | Never — use official/pr licensed/user-approved generated still |
| Inter/Roboto/Arial as display | Anonymous "demo page" | Brand mandates (even then consider optical tuning) |
| Fake chrome inside canvas | Fights real player chrome | Keep narrative inside stage; UI chrome outside (`animation-pitfalls.md`) |

## DaisyUI / Flowbite anti-patterns

- Do not rely on **utility classes alone** to convey meaning — add explicit ARIA labels and roles.
- When using DaisyUI components like `.btn`, `.card`, `.modal`: verify that semantic HTML and keyboard interaction are correct — utilities style, but they do not replace `<button>`, `role="dialog"`, or focus management.

## Didactic "bad examples"

When teaching what *not* to do: wrap samples in a labelled **bad-example** container (dashed border + caption). Do not let the whole page become slop.

## Typography and copy (Chinese contexts)

When UI copy is Chinese, prefer **「」** over ASCII quotes for published-feel polish where appropriate.

## Imagery honesty test

Ask: "If I remove this image, is information lost?" Decorative stock on essay/notes apps → **omit**.
