# Verification

## Playwright CLI

Screenshot a local file:
```bash
npx playwright screenshot "file:///workspace/data/<slug>/index.html" \
  --viewport-size=1440,900 /workspace/data/<slug>/screenshots/preview.png
```

Screenshot a running dev server:
```bash
# Start server first
python3 -m http.server 8080 &
# or: npm run dev -- --host 0.0.0.0 --port 5173 &

npx playwright screenshot "http://localhost:8080" \
  --viewport-size=1440,900 /workspace/data/<slug>/screenshots/preview.png
```

For multi-route flows, use the `webapp-testing` skill for full Playwright browser control
(`chromium.launch()`, `page.goto()`, click selectors, assert no `pageerror`).

## Manual pass (required)

Automations miss: z-index bugs, focus rings, hover gaps, font baseline nudges, colour
contrast edge cases. **Open in a real browser** before calling work "done".

## Console

Zero unexpected errors; warnings about deprecated APIs should be triaged.

## Accessibility (WCAG 2.2 AA) checklist

Run through [anti-slop-checklist.md](anti-slop-checklist.md) Gate 2 before sign-off:

- [ ] Semantic HTML (landmarks, headings, lists, forms)
- [ ] ARIA labels on icon-only buttons, modals, streaming regions (`role="log"`)
- [ ] Focus order is logical; focus ring is visible on all interactive elements
- [ ] Colour contrast ≥ 4.5:1 for normal text; ≥ 3:1 for large text and UI components
- [ ] Keyboard navigation works — Tab, Shift-Tab, Enter, Space, Escape
- [ ] Touch targets ≥ 44×44 CSS pixels
- [ ] `prefers-reduced-motion` path is implemented
- [ ] All interactive states present: hover, focus, active, disabled

## App prototypes

Minimum Playwright interactions before handoff: **primary navigation**, **one modal or detail**,
**tab switch** — see `app-prototype.md`.
