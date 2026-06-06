# Video export pipeline (optional)

**Only promise this when `scripts/` and media assets exist** in the user's checkout of the skill pack.

## Intended pipeline (checklist)

1. **Record** RGB video (often **25fps** intermediate) via headless Chromium driving the HTML timeline.
2. **Derive** **60fps** MP4 + **palette-optimised GIF** if conversion scripts exist.
3. **Audio**
   - **BGM** bed (scene-appropriate, not ear-fatiguing).
   - **SFX** on key beats (`assets/sfx/...` when present).
4. **QA** — `ffprobe -select_streams a` confirms an **audio stream** exists when "final mix" is claimed.
5. **Skip audio** only if the user explicitly wants silent output or will dub later.

If scripts are missing: **describe** the intended ffmpeg / Playwright steps and let the user run them manually.

## Sandbox notes

Outputs go to `/workspace/data/<project-slug>/exports/`.
Playwright-based recording uses the `webapp-testing` skill for headless Chromium access.
