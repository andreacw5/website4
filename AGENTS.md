# AGENTS.md — HeyAtom Personal Portfolio

Personal portfolio of Andrea Tombolato. **Nuxt 4 · Vuetify 3 · TypeScript · Pinia · @nuxt/content v3**.  
Package manager: **pnpm**. Deploy target: **SSR (Node)** via Docker.

---

## Dev Workflows

```bash
pnpm install          # install deps (postinstall runs nuxt prepare)
pnpm dev              # dev server → http://localhost:3000
pnpm build            # SSR build → .output/
pnpm preview          # preview production build
pnpm generate         # static site generation
```

No test suite exists. Lint/type-check via `nuxt prepare` (auto-runs on install).

---

## Project Layout

Nuxt 4 uses the **`app/`** directory convention — source files live under `app/`, not the project root.

```
app/            # Nuxt source (pages, components, composables, stores, layouts, assets)
content/        # @nuxt/content markdown & JSON files
i18n/locales/   # it.json (default), en.json
types/          # Shared TypeScript types (travels.ts, volunteering.ts)
content.config.ts  # Collection schemas (Zod)
nuxt.config.ts
```

---

## Content Collections (`content.config.ts`)

All collections are defined with **Zod schemas**. Query them in pages via:

```ts
const { data } = await useAsyncData('key', () =>
  queryCollection('projects').order('startDate', 'DESC').all()
)
```

Collections: `projects`, `travels`, `travelsPhotos`, `volunteeringProjects`, `uses`, `pages`.

**Localised fields** in content frontmatter can be either a plain `string` or `{ it?: string; en?: string }`.  
Resolve them in components with the `loc()` helper pattern (see `app/pages/projects/index.vue`):

```ts
const loc = (field: LocaleString): string => {
  if (typeof field === 'string') return field
  return field[locale.value as 'it' | 'en'] ?? field.it ?? field.en ?? ''
}
```

---

## i18n

- Default locale: **Italiano** (`it`) — no URL prefix.  
- English uses `/en/` prefix (`prefix_except_default` strategy).  
- All UI strings live in `i18n/locales/it.json` and `en.json` — always add keys to **both** files.  
- Use `useLocalePath()` for generating locale-aware links; `useI18n()` for `t()`.

---

## SEO Pattern

Every page **must** call `useSeo()` (auto-imported composable). For reactive/dynamic pages pass a factory:

```ts
useSeo(() => ({
  title: t('page.seo.title'),
  description: t('page.seo.description'),
  pageType: 'website',
  breadcrumb: [{ name: t('nav.travels'), url: '/travels' }],
}))
```

`useSeo` handles OG tags, Twitter Card, canonical, hreflang (`it`/`en`/`x-default`), and JSON-LD automatically. Source: `app/composables/useSeo.ts`.

---

## Theming & Styling

- Brand primary: **`#00a86b`**. Dark-first — default theme is `dark`.  
- Theme state is managed by `useThemeStore` (`app/stores/theme.ts`) with `localStorage` persistence.  
- Apply theme-conditional styles with `:global(.v-theme--dark)` or `:root:has(.v-theme--light)` (not Vuetify's `useTheme` API).
- Global utility classes in `assets/main.scss`: `.glass-card`, `.text-gradient`, `.brand-glow`, `.hover-lift`, `.animated-gradient`, `.floating`, `.jetbrain`.  
- Vuetify SCSS variables overridden in `assets/settings.scss`.
- Global Vuetify component defaults (rounded, elevation, etc.) are set in `nuxt.config.ts` under `vuetify.vuetifyOptions.defaults`.

---

## Component Conventions

- Components are **auto-imported** by Nuxt; prefixed by their directory:  
  `components/home/HeroSection.vue` → `<HomeHeroSection />`  
  `components/layout/PageTitle.vue` → `<LayoutPageTitle />`
- Pinia stores use the **Options API** style (`defineStore('id', { state, actions, getters })`).
- Composables (`useTypewriter`, `useSeo`) are auto-imported from `app/composables/`.

---

## External Assets & Icons

- Canonical static assets path: `public/assets/`. Use URL paths starting with `/assets/...`.  
- Technology/language SVG icons: `public/assets/icons/languages/` (referenced as `/assets/icons/languages/xxx.svg`).  
- Flag SVGs: `public/assets/icons/flags/` (referenced as `/assets/icons/flags/xx.svg`).  
- Company logos: `public/assets/logos/company/` (referenced as `/assets/logos/company/xxx.svg`).  
- Brand logos: `public/assets/logos/brand/` (referenced as `/assets/logos/brand/xxx.svg`).  
- SEO/social image: `public/assets/seo/social-card.v1.jpg`; CV: `public/assets/docs/cv-2024.pdf`; UI pattern: `public/assets/images/ui/ht-pattern-1.svg`.
- Project preview images and logos are hosted externally on **`fileharbor.heyatom.dev`**.
- MDI icons used via `vuetify` (e.g., `mdi-briefcase-outline`); Iconify icons via `@iconify/vue`.

---

## Runtime Config & Environment

| Variable                          | Default                              | Purpose                        |
|-----------------------------------|--------------------------------------|--------------------------------|
| `NUXT_PUBLIC_API_BASE_URL`        | `http://localhost:8080`              | External API base              |
| `NUXT_PUBLIC_BASIN_URL`           | `https://usebasin.com/f/placeholder` | Contact form endpoint          |
| `NUXT_PUBLIC_FREELANCE_AVAILABLE` | `'true'`                             | Availability badge on homepage |

Analytics (Simple Analytics) is **skipped outside production** (`NODE_ENV !== 'production'`).

