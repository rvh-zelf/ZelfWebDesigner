# Starter pack inventory (optional)

Documents common filenames in the frontend-design skill pack. **Check paths before claiming files exist** — some binaries may be absent.

## Current assets in this skill

```
assets/
  ios_frame.jsx              ← Minimal iPhone frame for Babel bundles
  showcases/INDEX.md         ← Gallery index (stub — populate with PNGs)
```

## Expected optional layout (extend as needed)

```
assets/
  deck_index.html
  deck_stage.js
  design_canvas.jsx
  animations.jsx
  ios_frame.jsx
  android_frame.jsx
  macos_window.jsx
  browser_window.jsx
  showcases/INDEX.md + PNGs
  sfx/<category>/*.mp3   (user-supplied)
scripts/
  render-video.js
  convert-formats.sh
  add-music.sh
  export_deck_pdf.mjs
  verify.py
```

## How to extend

1. Drop real files into the same relative paths beside `SKILL.md`.
2. Update this inventory when filenames change.
3. Never commit **third-party** press photos without licence clarity — prefer links + user download.
4. All project outputs go to `/workspace/data/<project-slug>/` — not to the skill's `assets/` folder.

## `ios_frame.jsx`

Bundled minimal implementation at `../assets/ios_frame.jsx` — copy-paste into Babel bundles.
For pixel-perfect marketing specs, replace with a calibrated version.
