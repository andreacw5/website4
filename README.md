# Nuxt Starter Template

A modern, clean Nuxt 4 starter template with Vuetify 3, Pinia state management, i18n support, and TypeScript.

## Features

✨ **Modern Stack**
- Nuxt 4 (compatibility date: 2026-04-07)
- Vue 3 with Composition API
- Vuetify 3 UI Framework
- TypeScript
- Pinia for state management
- Vue Router

🌍 **Internationalisation**
- `@nuxtjs/i18n` with `prefix_except_default` strategy
- Browser-language detection with cookie persistence
- Locale files: `en` (English) and `it` (Italiano – default)
- Flag assets included for each locale

🎨 **Pre-configured UI**
- Responsive app bar with desktop & mobile navigation
- Light / Dark theme toggle (persisted in `localStorage`, respects `prefers-color-scheme`)
- Language switcher with flag avatars
- User menu with profile, settings and logout dialogs
- Snackbar notifications
- Full CRUD data table with search, type filter and stats

🔍 **SEO & Bots**
- `@nuxtjs/seo` for `useSeoMeta` / `useHead` helpers
- `@nuxtjs/robots` – blocks non-SEO and AI bots; allows `*`
- `@nuxtjs/google-fonts` – Inter 400/700, display swap, self-hosted download

📦 **Ready to Customise**
- Generic item management example (no seed data)
- Extensible Pinia store architecture
- Clean, commented code structure

---

## Quick Start

### Installation

```bash
# Install dependencies (pnpm recommended)
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
pnpm build
pnpm preview
```

### Generate Static Site

```bash
pnpm generate
```

---

## Project Structure

```
app/
├── app.vue                  # Root component with layout transitions
├── assets/
│   ├── main.scss            # Global styles
│   └── settings.scss        # Vuetify SCSS variables
├── layouts/
│   └── default.vue          # Main layout: app bar, nav drawer, dialogs
├── pages/
│   └── index.vue            # Item management page (CRUD table)
├── plugins/                 # Place auto-imported Nuxt plugins here
└── stores/
    ├── index.ts             # Item store (useItemStore)
    └── theme.ts             # Theme store (useThemeStore)
i18n/
└── locales/
    ├── en.json              # English translations
    └── it.json              # Italian translations (default locale)
public/
├── flags/                   # SVG flag icons (de, es, fr, gb, it)
└── socials/                 # SVG social icons
```

---

## Key Files

### `app/stores/index.ts`
Generic item store with full CRUD operations.

```typescript
export interface Item {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  type: string;
  priority?: number;
}

export const useItemStore = defineStore('items', {
  state: () => ({ items: [] as Item[], nextId: 1 }),
  actions: { addItem, removeItem, updateItem },
});
```

### `app/stores/theme.ts`
Manages light/dark theme with `localStorage` persistence and system-preference detection.

```typescript
export const useThemeStore = defineStore('theme', {
  state: () => ({ isDark: false }),
  getters: { currentTheme: (state) => state.isDark ? 'dark' : 'light' },
  actions: { toggleTheme, setTheme, initTheme },
});
```

### `app/layouts/default.vue`
Main application layout including:
- Responsive app bar with desktop navigation buttons and a mobile drawer
- Light/Dark theme toggle
- Language switcher (flag + locale code)
- User menu with profile/settings links and logout confirmation dialog
- Named slot `event-dialog` for page-level dialogs

### `app/pages/index.vue`
Home page with:
- Stats row (total / enabled / disabled items)
- Searchable, filterable `v-data-table`
- Add / Edit / Delete dialogs with form validation
- Inline enable/disable toggle
- Snackbar feedback

---

## Customisation

### Adding New Pages

Create a file in `app/pages/` (e.g., `events.vue`):

```vue
<script setup lang="ts">
const { t } = useI18n();
useHead(() => ({ title: t('nav.events') }));
</script>

<template>
  <v-container class="py-8">
    <!-- Your content here -->
  </v-container>
</template>
```

### Adding a New Store

```typescript
// app/stores/myStore.ts
import { defineStore } from 'pinia';

export interface MyModel { id: number; /* ... */ }

export const useMyStore = defineStore('my', {
  state: () => ({ items: [] as MyModel[] }),
  actions: {
    addItem(item: Omit<MyModel, 'id'>) { /* ... */ },
  },
});
```

### Updating Navigation

Edit `navItems` in `app/layouts/default.vue`:

```typescript
const navItems = computed(() => [
  { title: t('nav.home'),     icon: 'mdi-view-dashboard-outline', to: '/'         },
  { title: t('nav.events'),   icon: 'mdi-calendar-clock-outline', to: '/events'   },
  { title: t('nav.settings'), icon: 'mdi-cog-outline',            to: '/settings' },
]);
```

### Adding Locales

1. Add a new entry to the `i18n.locales` array in `nuxt.config.ts`.
2. Create the matching file in `i18n/locales/` (e.g., `de.json`).
3. Add the flag SVG to `public/flags/`.
4. Register it in `getFlagPath` and `getLanguageName` inside `default.vue`.

---

## Theme Customisation

Colours are defined in `nuxt.config.ts` under `vuetify.vuetifyOptions.theme`.

| Token | Light | Dark |
|---|---|---|
| `primary` | `#1976D2` | `#BB86FC` |
| `secondary` | `#546E7A` | `#03DAC6` |
| `accent` | `#0091EA` | `#FF6E40` |
| `error` | `#D32F2F` | `#CF6679` |
| `success` | `#388E3C` | `#4CAF50` |
| `warning` | `#F57C00` | `#FFC107` |
| `background` | `#FAFAFA` | `#1A1A1A` |
| `surface` | `#FFFFFF` | `#252525` |

The Vuetify SCSS override file is `app/assets/settings.scss`.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with Nuxt DevTools |
| `pnpm build` | Build for production (SSR) |
| `pnpm preview` | Preview production build locally |
| `pnpm generate` | Generate static site |
| `pnpm start` | Run built SSR server |

---

## Runtime Config

| Key | Default | Override |
|---|---|---|
| `public.version` | from `package.json` | – |
| `public.apiBaseUrl` | `http://localhost:8080` | `NUXT_PUBLIC_API_BASE_URL` |

---

## Docker Support

A `Dockerfile` and `docker-compose.yml` are included for containerised deployment.

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or manually
docker build -t nuxt-starter .
docker run -p 3000:3000 nuxt-starter
```

---

## License

This template is open source and available under the [MIT License](LICENSE.md).
