# React + Babel "sketch" setup

> **Use case**: throwaway `file://` prototypes only. For anything requiring a build step,
> multi-screen flows, or team collaboration, use SvelteKit (see `svelte-setup.md`).

For **double-clickable** prototypes, prefer **one HTML** with:

```html
<!-- Pinned versions — intentional CDN exception for file:// sketches -->
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel" data-presets="react">
  // code
</script>
```

**Pin versions** — do not float `@latest` for repeatability.

## Hard rules

1. **Unique style objects** — `const screenAStyles = { … }`; never shared `styles` identifier across components in one bundle.
2. **Cross-script visibility** — each `text/babel` block is isolated unless you `Object.assign(window, { ScreenA, … })` after definitions.
3. **No `scrollIntoView`** inside nested scroll prototypes — use `element.scrollTop` / `scrollTo` on the intended container.
4. **`file://` images** — prefer **data URLs**; document when `python3 -m http.server 8080 &` is required.
5. **Splitting** — if >~1000 lines, extract `components.jsx` + `data.js` but then **require** a local server; state that explicitly.

## Fixed-size stages

Slides and video frames: implement **scale-to-fit** with letterboxing (transform + wrapper), not accidental overflow offstage.

## LLM calls from the browser

No assumed host helper. Provide **mock** responses or a textarea for the user to paste API keys — never imply free unlimited inference.

## Sandbox notes

There is no `~/Downloads` in this environment. Write output files to
`/workspace/data/<project-slug>/`. Preview via `python3 -m http.server 8080 &`
at `http://localhost:8080`, then screenshot with Playwright CLI.
