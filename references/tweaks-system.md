# Tweaks (real-time parameters)

In this sandbox environment there is **no postMessage bridge**. Always implement Tweaks as pure localStorage UI state:

- Controls (sliders, selects, toggles) write to **`localStorage`** keys prefixed by project/slide ID.
- On load, hydrate defaults from storage so refreshes preserve explorations.
- Optionally show a "reset" control.

Expose **named parameters** (e.g. `accentHue`, `density`, `motionScale`) rather than opaque raw numbers so the user can request changes conversationally.

```js
// Example localStorage Tweaks pattern
const TWEAKS_KEY = 'myproject:tweaks';

function loadTweaks(defaults) {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(TWEAKS_KEY) || '{}') };
  } catch { return defaults; }
}

function saveTweaks(tweaks) {
  localStorage.setItem(TWEAKS_KEY, JSON.stringify(tweaks));
}
```

In Svelte 5:
```svelte
<script lang="ts">
  let tweaks = $state(loadTweaks({ accentHue: 220, density: 'compact' }));
  $effect(() => saveTweaks(tweaks));
</script>
```
