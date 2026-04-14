# HeyAtom – Personal Portfolio

Personal portfolio and website of **Andrea Tombolato**, built with Nuxt 4, Vuetify 3 and Nuxt Content.
Live at [heyatom.dev](https://heyatom.dev).

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 (SSR) |
| UI | Vuetify 3 |
| Language | TypeScript |
| State | Pinia |
| Content | @nuxt/content v3 |
| i18n | @nuxtjs/i18n (IT default, EN) |
| Fonts | Inter + JetBrains Mono (@nuxtjs/google-fonts) |
| Animations | GSAP 3 |
| SEO | @nuxtjs/seo · @nuxtjs/robots |
| Utilities | @vueuse/nuxt · better-sqlite3 |
| Containerisation | Docker |

---

## Pages

| Route | Description |
|---|---|
| `/` | Home – hero with typewriter effect, about section with photo stack, work experience, skills grid and section previews |
| `/projects` | Portfolio – filterable grid of personal and professional projects (Vue/Nuxt, Node/Nest, Java, UI/UX) |
| `/travels` | Travel diary – card gallery of trips, driven by Markdown content |
| `/utilities` | Personal tools hub – links to Modding Backup, Arma 3 Altis Life and Star Citizen hangar pages |
| `/utilities/star-citizen-hangar` | Star Citizen ship collection (JSON data via Nuxt Content) |
| `/utilities/arma3-altis-life` | Arma 3 Altis Life reference page |
| `/utilities/modding-backup` | Game-modding backup reference |

---

## Content collections

Managed by **@nuxt/content** and configured in `content.config.ts`:

| Collection | Source | Type |
|---|---|---|
| `projects` | `content/projects/**/*.md` | Markdown pages with tech metadata |
| `travels` | `content/travels/**/*.md` | Markdown pages with cover & gallery |
| `starships` | `content/utilities/star-citizen/**/*.json` | JSON data (Star Citizen ships) |
| `pages` | `content/*.md` | Generic markdown pages |

---

## Pinia stores

| Store | Description |
|---|---|
| `theme.ts` | Light / Dark theme with `localStorage` persistence and `prefers-color-scheme` detection |
| `experience.ts` | Work and volunteer experience entries (Medas Solutions, Element Gaming, ProCiv Settimo Milanese) |
| `skills.ts` | Technical skills list (Node.js, Grails, Nest.js, Vue.js, Nuxt.js, Java, TypeScript, Docker, Git) |

---

## Project structure

```
app/
├── app.vue
├── assets/
│   ├── main.scss           # Global styles
│   └── settings.scss       # Vuetify SCSS variables
├── components/
│   ├── home/               # HeroSection, AboutSection, ExperienceSection, SkillsSection, PreviewSection
│   ├── layout/             # SiteHeader (app bar + mobile drawer)
│   ├── projects/           # ProjectCard
│   ├── star-citizen/       # ShipCard
│   └── travels/            # TravelCard
├── composables/
│   └── useTypewriter.ts    # Typewriter animation composable
├── layouts/
│   └── default.vue         # Main layout: header + footer + social links
├── pages/
│   ├── index.vue           # Home
│   ├── travels.vue         # Travel diary
│   ├── projects/
│   │   ├── index.vue       # Projects list with filters
│   │   └── [slug].vue      # Project detail
│   └── utilities/
│       ├── index.vue       # Utilities hub
│       ├── star-citizen-hangar.vue
│       ├── arma3-altis-life.vue
│       └── modding-backup.vue
└── stores/
    ├── theme.ts
    ├── experience.ts
    └── skills.ts
content/
├── projects/               # One .md file per project
├── travels/                # One .md file per trip
└── utilities/
    └── star-citizen/       # One .json file per ship
i18n/
└── locales/
    ├── it.json             # Italiano (default)
    └── en.json             # English
public/
├── assets/
│   ├── docs/               # cv-2024.pdf
│   ├── icons/
│   │   ├── flags/          # SVG flag icons
│   │   ├── languages/      # SVG technology icons
│   │   └── social/
│   ├── images/
│   │   └── ui/             # ht-pattern-1.svg
│   ├── logos/
│   │   ├── brand/
│   │   ├── company/
│   │   └── partners/
│   └── seo/                # social-card.v1.jpg
└── favicon/
```

---

## i18n

- Default locale: **Italiano** (`it`)
- Secondary locale: **English** (`en`)
- Strategy: `prefix_except_default` (Italian URLs have no prefix)
- Browser-language detection with cookie persistence (`i18n_redirected`)

---

## Theme

Custom green brand palette (`#00a86b`) applied to both light and dark Vuetify themes.
Default theme at first visit: **dark**.
User preference is persisted in `localStorage` and `prefers-color-scheme` is respected on first load.

---

## Quick Start

```bash
# Install dependencies (pnpm recommended)
pnpm install

# Start development server
pnpm dev        # http://localhost:3000
```

### Build

```bash
pnpm build      # SSR build
pnpm preview    # Preview production build
pnpm generate   # Static site generation
pnpm start      # Run built SSR server
```

---

## Docker

```bash
docker build -t heyatom-website .
docker run -p 3000:3000 heyatom-website
```

---

## Runtime config

| Key | Default | Env override |
|---|---|---|
| `public.version` | from `package.json` | – |
| `public.apiBaseUrl` | `http://localhost:8080` | `NUXT_PUBLIC_API_BASE_URL` |

---

## License

[MIT](LICENSE.md)

### Flags 
https://www.svgrepo.com/collection/decathlon-payment-vectors/2
