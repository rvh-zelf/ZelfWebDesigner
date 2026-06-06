# Design direction advisor (fallback)

Use when the brief is vague, user asks for "directions", or there is **no** usable design context.

**Skip** when references, DS, or a single clear direction already exist.

## Lightweight path

1. Restate understanding in **~100–200 words**.
2. Propose **three** directions from **three different lanes** (informational / kinetic / minimal / experimental / Eastern-philosophy — see `design-styles.md`). Each: named designer or studio **style** (not generic "minimal"), why it fits, 3–4 visual traits, 3–5 mood keywords.
3. Wait for pick or hybrid ("A colours + C grid").

## Full eight-phase path (when user wants depth)

1. **Understand** — audience, message, tone, output format (≤3 questions if still unclear).
2. **Reframe** — advisor-style summary ending with "here are three directions".
3. **Philosophies** — three picks, **different schools**, 50–100 words each + traits (`design-styles.md`).
4. **Showcases** — if `assets/showcases/INDEX.md` lists PNGs for the scenario, **read** matching images before building live demos; else skip honestly.
5. **Three HTML demos** — one per direction, user's real topic (not Lorem), saved under `/workspace/data/<slug>/design-demos/`; screenshot via Playwright CLI (`npx playwright screenshot "file:///workspace/data/<slug>/..." --viewport-size=1200,900 /workspace/data/<slug>/screenshots/demo-A.png`). Use the `webapp-testing` skill if interactive verification is needed.
6. **User choice** — refine, hybrid, or restart from phase 3.
7. **Prompt pack** — for external image/video tools: concrete traits, HEX, ratios, output size — avoid vague "minimal".
8. **Handoff** — merge chosen direction into main workflow (`SKILL.md`): assets, four questions, build.

## Personal assets (privacy)

If the subject is the **user's face, home, or private data**: check the user's private asset index (if maintained); if missing, **ask** — never invent personal photos.
