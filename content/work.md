Sei il mio sviluppatore senior. Crea il mio sito personale andreatombolato.dev
da zero usando Nuxt 3, Vuetify 3 e TypeScript.

============================
CONTESTO PERSONALE
============================

Nome: Andrea Tombolato
Brand secondario: heyatom (usato su heyatom.dev per presentarmi come freelance)
Ruolo: Full-stack developer dal 2016 (Medas Solutions – sanità, Java/Node.js stack)
Altro: membro consiglio direttivo Element Gaming (no-profit gaming),
freelance per piccoli progetti,
volontario Protezione Civile – responsabile comunicazione pubblica,
appassionato di escursioni in montagna e viaggi.
Stack personale: Node.js, Grails, Nest.js, Vue.js, Nuxt.js, Java.
Interessi UX/UI: design pulito, accessibile, attenzione ai dettagli.

============================
IDENTITÀ VISIVA
============================

Colore primario: #00a86b (verde smeraldo)
Vuetify theme:
primary: '#00a86b'
secondary: '#007a4d'
accent: '#33bf89'
surface e background adattati per light e dark mode.
Font: Inter (Google Fonts) per UI, JetBrains Mono per codice/accenti tecnici.
Configura entrambi in vuetify.config come defaultFont.
Stile: moderno 2026, micro-animazioni con Vuetify transitions + CSS,
dark mode obbligatorio con v-theme-provider e toggle,
usa v-app-bar con elevation-on-scroll per effetto glassmorphism leggero,
no gradient aggressivi, privilegia spazio bianco e tipografia forte.
Accessibilità: Vuetify è già WCAG AA compliant, assicura aria-label
su icone standalone, skip-to-content link in AppHeader.

Header (AppHeader.vue):
- Logo: v-btn text con testo doppio stack:
  "Andrea Tombolato" (text-h6, font-weight-semibold)
    + "heyatom" sotto (font-mono, color="primary", text-caption)
- Nav: v-tabs o v-btn text per Home, Portfolio, Viaggi, Utilities, Contatti
- Toggle dark/light: v-btn icon con mdi-weather-sunny / mdi-weather-night
- Mobile: v-navigation-drawer temporaneo con hamburger v-app-bar-nav-icon

Footer (AppFooter.vue):
- Link social con v-btn icon: GitHub (mdi-github), LinkedIn (mdi-linkedin),
  heyatom.dev (mdi-web)
- "© Andrea Tombolato – heyatom" con anno dinamico
- Piccola nota Protezione Civile volontario

============================
STEP 1 — SETUP PROGETTO
============================

- Inizializza Nuxt 3 con TypeScript strict
- Installa: vuetify 3, vite-plugin-vuetify, @nuxt/image,
  @nuxt/content, @vueuse/nuxt, @mdi/font, gsap
- Configura nuxt.config.ts:
    - plugin vite-plugin-vuetify con treeshaking abilitato
    - CSS: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css']
    - transpile: ['vuetify']
- Crea plugins/vuetify.ts con:
    - tema "heyatom" light + dark (colori come sopra)
    - defaults globali: VBtn rounded="lg", VCard rounded="lg",
      VTextField variant="outlined", VChip size="small"
    - Inter come font di default nelle variabili Vuetify
- Configura dark mode: useTheme() di Vuetify + useColorMode() di Nuxt,
  sincronizzati tra loro
- Struttura cartelle:
  /pages, /components/ui, /components/sections,
  /content (Nuxt Content per portfolio e blog futuro),
  /public/images/travels, /public/images/portfolio
- Crea layouts/default.vue con AppHeader + AppFooter + v-main
- SEO base: useSeoMeta per ogni pagina
- Font: Inter + JetBrains Mono via Google Fonts in nuxt.config (link preconnect)

============================
STEP 2 — PAGINA HOME (/)
============================

Sezioni nell'ordine, tutte dentro v-container con max-width appropriato:

2a. HERO
- v-row full viewport height (min-height: 100dvh)
- Headline con v-responsive: "Andrea Tombolato" in text-h2,
  sotto "Full-stack Developer & heyatom" in text-h5 color="primary"
- Sottotitolo con typed-text animation (custom composable useTypewriter)
  che cicla tra:
  ["Building web products since 2016",
  "Vue.js · Nuxt.js · Node.js · Nest.js",
  "Freelancer · Montagna · Viaggi · Gaming"]
- CTA: v-btn color="primary" size="large" → /portfolio,
  v-btn variant="outlined" color="primary" size="large" → /contatti
- Background: pattern SVG sottile inline, dark-mode aware
- Scroll indicator: v-icon mdi-chevron-double-down con animazione CSS pulse

2b. ABOUT
- v-row con due v-col (12 mobile, 6 desktop):
  testo + v-avatar / v-img placeholder a destra
- Testo biografico completo (Medas, Element Gaming, freelance,
  Protezione Civile, montagna, viaggi)
- Timeline con v-timeline (Vuetify built-in) verticale/orizzontale:
  2016 Medas Solutions | Element Gaming | Freelance | Prot. Civile
  Ogni item: v-timeline-item con dot color="primary" e v-card inside

2c. COMPETENZE
- v-chip-group non-selectable, wrap=true:
  ogni v-chip con prepend-icon (mdi o devicon SVG inline):
  Node.js, Grails, Nest.js, Vue.js, Nuxt.js, Java, TypeScript,
  Docker, Git, UX/UI Design
- color="primary" variant="tonal" per tutti i chip

2d. PREVIEW SEZIONI
- v-row con 3 v-card (Portfolio, Viaggi):
  v-card con hover elevation, v-card-title, v-card-text breve,
  v-card-actions con v-btn "Scopri di più" → pagina corrispondente
- Animazione stagger ingresso con GSAP ScrollTrigger

============================
STEP 3 — PAGINA PORTFOLIO (/portfolio)
============================

- v-container con page hero (v-row + titolo animato)
- Filtri: v-btn-toggle mandatory con variante "outlined":
  Tutti | Vue/Nuxt | Node/Nest | Java | UI/UX | Altro
  Reactive: filtra array progetti senza toccare il router
- Grid: v-row con v-col (12 mobile, 6 tablet, 4 desktop) per ogni progetto
- ProjectCard.vue (componente custom che wrappa v-card):
  v-img per thumbnail (lazy, @nuxt/image)
  v-card-title: nome progetto
  v-card-subtitle: anno + status badge (v-chip color in base a status)
  v-card-text: descrizione breve
  v-chip-group per tech stack (color="primary" variant="tonal")
  v-card-actions: v-btn icon mdi-github + mdi-open-in-new (se disponibili)
- Status badge colori:
  "In produzione" → color="success"
  "Open source"   → color="primary"
  "Archivio"      → color="grey"
- Dati da /content/portfolio/*.md con frontmatter:
  title, description, tech[], year, status, github, demo, image
- Crea 3 progetti demo fittizi
- Transizione lista con v-fade-transition o TransitionGroup staggered

============================
STEP 4 — PAGINA VIAGGI (/viaggi)
============================

- v-container con hero e citazione ispirazionale in v-card variant="tonal"
  color="primary"
- Paesi visitati: v-chip-group scrollable:
  ogni v-chip: bandierina emoji + nome paese
  dati da /content/travels/countries.json: [{ name, emoji, year }]
- Galleria foto: CSS columns masonry (Vuetify non ha masonry nativo,
  usa CSS columns: 1 mobile / 2 tablet / 3 desktop):
  ogni foto: v-card con v-img lazy (@nuxt/image provider ipx)
  overlay al hover (v-overlay inside v-card) con luogo + paese + anno
  click: apre v-dialog fullscreen con v-img grande (lightbox custom)
  v-btn icon mdi-close per chiudere il dialog
- Foto placeholder: picsum.photos per il dev
- Mappa interattiva (v-card che contiene leaflet.js):
  plugin Nuxt client-only per leaflet (no SSR),
  marker color="#00a86b" su ogni paese visitato,
  tooltip con nome paese
- Dati foto da /content/travels/photos.json:
  { src, alt, location, country, year }

============================
STEP 5 — PAGINA UTILITIES (/utilities)
============================

Struttura con v-tabs (scrollable su mobile) per separare le sezioni:

5a. GTA IV MODS BACKUP (prima tab)
- v-text-field con prepend-icon="mdi-magnify" per filtrare live
- v-chip-group per filtrare per categoria:
  Grafica | Gameplay | Veicoli | Audio | Altro
- Lista con v-list + v-list-item per ogni mod:
  v-list-item-title: nome mod
  v-list-item-subtitle: descrizione + versione
  v-chip piccolo per categoria (color="primary" variant="tonal")
  v-btn icon mdi-content-copy (copia link) + mdi-open-in-new (se link)
  oppure v-data-table se le mod sono molte (più pratico da filtrare)
- Dati da /content/utilities/gta4-mods.json
- Crea 6-8 entry demo

5b. PROSSIMAMENTE (seconda tab)
- v-expansion-panels con 2-3 panel vuoti, titolo "Coming soon",
  testo placeholder e v-chip "In arrivo" color="warning"
- Commento nel codice con istruzioni per aggiungere nuove tab/utility

============================
STEP 6 — PAGINA CONTATTI (/contatti)
============================

- v-form con validazione Vuetify (rules):
  v-text-field: nome (required), email (required + formato)
  v-textarea: messaggio (required, min 10 chars)
  v-btn color="primary" type="submit" con loading state
  action: Formspree placeholder URL in .env (NUXT_PUBLIC_FORMSPREE_URL)
    - v-snackbar per feedback submit success/error
- Social links: v-row con v-btn grandi variant="tonal" color="primary":
  mdi-github → github.com/andreatombolato (placeholder)
  mdi-linkedin → linkedin placeholder
  mdi-web → heyatom.dev
- Disponibilità freelance:
  v-alert con icona:
  color="success" se NUXT_PUBLIC_FREELANCE_AVAILABLE=true
  → "Sono disponibile per nuovi progetti freelance"
  color="warning" se false
  → "Attualmente non disponibile, ma contattami comunque"
- Mappa: v-card con iframe OpenStreetMap (Veneto, Italia) client-only

============================
STEP 7 — COMPONENTI TRASVERSALI
============================

- AppHeader.vue: logo doppio, v-tabs nav, theme toggle, v-navigation-drawer mobile
- AppFooter.vue: social icons, copyright, anno dinamico
- ProjectCard.vue: v-card riutilizzabile per portfolio
- TravelPhotoCard.vue: v-card con overlay hover per galleria viaggi
- UtilityModItem.vue: v-list-item con chip e azioni per le mod
- PageHero.vue: v-container + v-row riutilizzabile con slot title e subtitle
- ScrollProgress.vue: v-progress-linear fixed top (color="primary")
  visibile solo su pagine con contenuto lungo, usa useScroll() VueUse
- BackToTop.vue: v-btn fab fixed bottom-right (color="primary")
  visibile dopo 300px di scroll, smooth scroll to top
- Animazioni: useIntersectionObserver (VueUse) per v-fade-transition
  on-scroll su v-card e sezioni; Nuxt page transitions crossfade 200ms

============================
STEP 8 — SEO, PERFORMANCE, DEPLOY
============================

- useSeoMeta per ogni pagina: title, description, og:image, og:title
- robots.txt e sitemap automatici con nuxt-simple-sitemap
- @nuxt/image con provider ipx, lazy loading su tutti i v-img
- Vuetify treeshaking attivo (vite-plugin-vuetify) per bundle size
- Configura SSG in nuxt.config:
  nitro: { prerender: { routes: ['/', '/portfolio', '/viaggi',
  '/utilities', '/contatti'] } }
- .env.example con tutte le variabili:
  NUXT_PUBLIC_FORMSPREE_URL, NUXT_PUBLIC_FREELANCE_AVAILABLE
- README.md con istruzioni per:
  aggiungere progetti (content/portfolio/*.md)
  aggiungere foto viaggi (content/travels/photos.json)
  aggiungere mod GTA (content/utilities/gta4-mods.json)
  deploy su Netlify/Vercel: nuxt generate → cartella .output/public

============================
NOTE FINALI
============================

- Usa sempre <script setup lang="ts"> e Composition API
- Composables riutilizzabili: useProjects(), useTravels(), useGtaMods()
- Gestisci loading state con v-skeleton-loader di Vuetify e
  empty state con v-empty-state (Vuetify 3.4+)
- Mobile-first: sfrutta i breakpoint Vuetify (xs, sm, md, lg, xl)
  tramite useDisplay() composable
- Nessun backend: tutto statico con Nuxt Content + JSON locali
- Struttura il codice per aggiungere facilmente in futuro:
  /blog con Nuxt Content markdown
  pannello admin leggero per gestire foto e mod
- Commenta il codice in italiano dove opportuno
