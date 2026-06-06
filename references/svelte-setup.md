# Svelte 5 / SvelteKit + DaisyUI + Flowbite UI

> ⚠️ **Always use Svelte 5 Runes.** AI agents commonly generate Svelte 4 patterns.
> The patterns below are the only acceptable defaults for new code.

## Svelte 5 Runes — mandatory patterns

```svelte
<script lang="ts">
  // ✅ Svelte 5 Runes
  let count = $state(0);
  let doubled = $derived(count * 2);
  $effect(() => { console.log('count changed', count); });

  // ❌ NEVER — Svelte 4 stores
  // import { writable, derived } from 'svelte/store';
  // const count = writable(0);
</script>
```

### Props (Svelte 5)
```svelte
<script lang="ts">
  // ✅ Svelte 5
  let { label, disabled = false }: { label: string; disabled?: boolean } = $props();

  // ❌ NEVER — Svelte 4
  // export let label: string;
</script>
```

### Event handling (Svelte 5)
```svelte
<!-- ✅ Svelte 5 -->
<button onclick={() => count++}>Click</button>

<!-- ❌ NEVER — Svelte 4 -->
<!-- <button on:click={() => count++}> -->
```

---

## SvelteKit project init

Use `npx sv create` via the `interactive-cli` skill (it requires terminal arrow keys).
Standard pattern for the sandbox:

```bash
# Open a terminal for interactive project init
# See skills/interactive-cli/SKILL.md for terminal_open/terminal_send workflow

cd /workspace/data/<project-slug>
# Via terminal_open:
# npx sv create . --template minimal --types ts --no-add-ons
# Then: npm install
```

Non-interactive alternative (use `--yes` flag if available in the installed version):
```bash
npx sv create /workspace/data/<slug> --template minimal --types ts
```

After init:
```bash
cd /workspace/data/<slug>
npm install
npm install -D daisyui @tailwindcss/vite tailwindcss
```

---

## DaisyUI setup in SvelteKit

`tailwind.config.ts`:
```ts
import daisyui from 'daisyui';
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'],  // or custom theme
  },
};
```

`src/app.css`:
```css
@import 'tailwindcss';
```

### Token discipline
- Always use DaisyUI semantic tokens: `btn-primary`, `bg-base-100`, `text-base-content`.
- Do **not** use arbitrary Tailwind colours (e.g. `bg-blue-500`) when a DaisyUI token exists.
- Read `skills/brand-guidelines/SKILL.md` before any branded output to get brand tokens.

### DaisyUI accessibility anti-patterns
```html
<!-- ❌ Wrong — utility class alone is not accessible -->
<div class="btn btn-primary" onclick="...">Submit</div>

<!-- ✅ Correct — semantic element + ARIA -->
<button class="btn btn-primary" type="submit" aria-label="Submit form">
  Submit
</button>

<!-- ❌ Wrong — icon-only button without label -->
<button class="btn btn-ghost"><svg>...</svg></button>

<!-- ✅ Correct -->
<button class="btn btn-ghost" aria-label="Close menu"><svg aria-hidden="true">...</svg></button>
```

---

## Flowbite Svelte components

Install alongside DaisyUI for richer component coverage:
```bash
npm install flowbite-svelte flowbite
```

`tailwind.config.ts` — add Flowbite content path:
```ts
content: [
  './src/**/*.{html,js,svelte,ts}',
  './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
],
plugins: [daisyui, require('flowbite/plugin')],
```

Use Flowbite for: `<Modal>`, `<Drawer>`, `<Datepicker>`, `<Tooltip>` — components where
DaisyUI lacks JS behaviour. Use DaisyUI tokens for all colour/spacing.

---

## SvelteKit streaming (for AI / agent UIs)

For streaming responses in AI interfaces:

```ts
// +page.server.ts
export async function load() {
  // ✅ SvelteKit deferred promises — not client polling
  return {
    streamed: {
      result: fetch('/api/slow-endpoint').then(r => r.json()),
    },
  };
}
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  let { data } = $props();
</script>

{#await data.streamed.result}
  <span class="loading loading-spinner" aria-label="Loading..." role="status"></span>
{:then result}
  <div role="log" aria-live="polite">{result.text}</div>
{/await}
```

Use `role="log"` and `aria-live="polite"` for any streaming/chat UI region.

---

## Preview and deployment

```bash
# Dev server (background)
npm run dev -- --host 0.0.0.0 --port 5173 &

# Screenshot via Playwright CLI
npx playwright screenshot "http://localhost:5173" --viewport-size=1440,900 \
  /workspace/data/<slug>/screenshots/preview.png

# Deploy via deploying-apps skill
# See skills/deploying-apps/SKILL.md
```

---

## Component interaction states (mandatory)

Every interactive component must define all states:

```svelte
<button
  class="btn btn-primary"
  class:btn-disabled={disabled}
  aria-disabled={disabled}
  {disabled}
>
  <!-- hover, focus, active handled by DaisyUI -->
  <!-- Verify focus ring is visible in verification step -->
  {label}
</button>
```

States to verify: **hover**, **focus** (visible ring), **active** (pressed), **disabled**.

---

## WordPress with Svelte

For WordPress blocks that need Svelte interactivity:
1. Build the Svelte component separately, compile to a web component.
2. Register as a WordPress block with `register_block_type`.
3. For themes: output PHP/HTML/CSS only — no build pipeline on the server.
4. Read `skills/brand-guidelines/SKILL.md` for colour tokens before writing any CSS.
