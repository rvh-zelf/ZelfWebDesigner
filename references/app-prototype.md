# App / mobile prototypes

## Architecture defaults

- **Svelte 5 / SvelteKit** for interactive multi-screen flows (default).
- **Single-file inline React + Babel** only for `file://` double-click demos.
- Images: **data URLs** for `file://`; accept `python3 -m http.server 8080 &` for file-serving.
- Split files only when >~1000 lines or multi-author — then require a server.

## Imagery

- **Museum / history / geography**: Wikimedia Commons, Met Open Access, institutional APIs.
- **Lifestyle / texture**: Unsplash / Pexels with licence awareness.
- **Decorative stock** that does not support comprehension → **omit** (see `content-guidelines.md`).

## Overview vs flow

| Mode | When | Implementation sketch |
|------|------|-------------------------|
| Overview | Design review, compare all screens | Grid of `<IosFrame>` frames with labels |
| Flow demo | Walk one journey | Single state machine: `{ screen, modal }` |

## Device shell

Use `assets/ios_frame.jsx` when present — **do not** re-author Dynamic Island geometry ad hoc.
(124×36 px island, top inset ≈12px for iPhone 15 Pro class — constants live in the starter file.)

## Interaction polish

`cursor: pointer`, visible pressed/hover/focus states, no dead hitboxes under safe areas.

## Testing

Three Playwright interactions minimum before handoff: **primary navigation**, **one modal or detail**, **tab switch** — see `verification.md`.

## Sandbox notes

Outputs go to `/workspace/data/<project-slug>/`. No `~/Downloads`.
Preview via `python3 -m http.server 8080 &` at `http://localhost:8080`.
