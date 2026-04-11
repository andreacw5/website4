<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

// Helper per leggere un campo localizzato (stringa o { it, en })
type LocaleString = string | { it?: string; en?: string } | null | undefined;
const loc = (field: LocaleString): string => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[locale.value as 'it' | 'en'] ?? field.it ?? field.en ?? '';
};

// SEO
useSeoMeta({
  title: t('projects.seo.title'),
  description: t('projects.seo.description'),
  ogTitle: t('projects.seo.ogTitle'),
  ogDescription: t('projects.seo.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

// Recupera tutti i progetti dalla collection Nuxt Content
const { data: allProjects } = await useAsyncData('projects-list', () =>
  queryCollection('projects').order('startDate', 'DESC').all(),
);

// Definizione filtri con i valori che corrispondono a technical.main.name
type FilterKey = 'all' | 'vueNuxt' | 'nodeNest' | 'java' | 'uiUx' | 'other';

interface FilterItem {
  key: FilterKey;
  icon: string;
  match: string[]; // nomi (lowercase) di technical.main.name da matchare
}

const filters: FilterItem[] = [
  { key: 'all',      icon: 'mdi-apps',             match: [] },
  { key: 'vueNuxt',  icon: 'mdi-vuejs',             match: ['vue', 'nuxt', 'vue.js', 'nuxt.js'] },
  { key: 'nodeNest', icon: 'mdi-nodejs',             match: ['node', 'nest', 'node.js', 'nest.js'] },
  { key: 'java',     icon: 'mdi-language-java',      match: ['java', 'grails', 'spring'] },
  { key: 'uiUx',    icon: 'mdi-palette-outline',    match: ['ui', 'ux', 'figma', 'design'] },
  { key: 'other',    icon: 'mdi-dots-horizontal',    match: [] },
];

// Filtro attivo
const activeFilter = ref<FilterKey>('all');

// Progetti filtrati — reattivi al filtro senza toccare il router
const filteredProjects = computed(() => {
  const projects = allProjects.value ?? [];

  let result: typeof projects;
  if (activeFilter.value === 'all') {
    result = projects;
  } else {
    const selected = filters.find(f => f.key === activeFilter.value);
    if (!selected) {
      result = projects;
    } else {
      result = projects.filter(p => {
        const mainName = (p.technical?.main?.name ?? '').toLowerCase();

        if (selected.key === 'other') {
          const knownMatches = filters
            .filter(f => f.key !== 'all' && f.key !== 'other')
            .flatMap(f => f.match);
          return !knownMatches.some(m => mainName.includes(m));
        }

        return selected.match.some(m => mainName.includes(m));
      });
    }
  }

  // Featured sempre in cima
  return [...result].sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    return bf - af;
  });
});

// Filtri con conteggio reattivo dei progetti corrispondenti
const filtersWithCount = computed(() => {
  const projects = allProjects.value ?? [];
  const knownMatches = filters
    .filter(f => f.key !== 'all' && f.key !== 'other')
    .flatMap(f => f.match);

  return filters.map(f => {
    let count: number;
    if (f.key === 'all') {
      count = projects.length;
    } else if (f.key === 'other') {
      count = projects.filter(p => {
        const mainName = (p.technical?.main?.name ?? '').toLowerCase();
        return !knownMatches.some(m => mainName.includes(m));
      }).length;
    } else {
      count = projects.filter(p => {
        const mainName = (p.technical?.main?.name ?? '').toLowerCase();
        return f.match.some(m => mainName.includes(m));
      }).length;
    }
    return { ...f, count };
  });
});

// GSAP stagger sull'ingresso delle card quando il filtro cambia
const gridRef = ref<HTMLElement | null>(null);

const animateGrid = async () => {
  if (!import.meta.client || !gridRef.value) return;
  const gsapMod = await import('gsap');
  const cards = Array.from(gridRef.value.querySelectorAll<HTMLElement>('[data-project-card]'));
  if (!cards.length) return;
  gsapMod.gsap.fromTo(
    cards,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.07 },
  );
};

// Anima all'ingresso iniziale della pagina
onMounted(animateGrid);

// Ri-anima quando il filtro cambia (aspetta il prossimo tick per le nuove card)
watch(activeFilter, () => nextTick(animateGrid));
</script>

<template>
  <div class="projects-page">
    <v-container max-width="1280" class="px-4 px-md-6 py-8 py-md-12">

      <!-- ─── Hero ─────────────────────────────────────────────── -->
      <section class="projects-hero mb-10" aria-labelledby="projects-title">
        <p class="text-overline text-primary font-weight-bold mb-2 brand-mono">
          {{ t('projects.hero.eyebrow') }}
        </p>
        <h1 id="projects-title" class="text-h3 font-weight-bold mb-4">
          {{ t('projects.hero.title') }}
        </h1>
        <p class="text-body-1 text-medium-emphasis projects-hero-desc">
          {{ t('projects.hero.description') }}
        </p>
      </section>

      <!-- ─── Filtri ────────────────────────────────────────────── -->
      <section class="mb-8 filters-section" aria-label="Filtri progetti">
        <div class="filters-scroll-wrap">
          <v-btn-toggle
            v-model="activeFilter"
            mandatory
            variant="text"
            color="primary"
            class="filter-toggle"
          >
            <v-btn
              v-for="f in filtersWithCount"
              :key="f.key"
              :value="f.key"
              :prepend-icon="f.icon"
              size="default"
              rounded="pill"
              class="text-none filter-btn"
            >
              {{ t(`projects.filters.${f.key}`) }}
              <span
                class="filter-count ml-2"
                :class="activeFilter === f.key ? 'filter-count--active' : ''"
              >{{ f.count }}</span>
            </v-btn>
          </v-btn-toggle>
        </div>
      </section>

      <!-- ─── Grid progetti ─────────────────────────────────────── -->
      <section ref="gridRef" aria-label="Elenco progetti">

        <!-- Skeleton loader durante il fetch -->
        <v-row v-if="!allProjects">
          <v-col v-for="i in 6" :key="i" cols="12" sm="6" lg="4">
            <v-skeleton-loader type="card" rounded="xl" />
          </v-col>
        </v-row>

        <!-- Empty state quando nessun progetto corrisponde al filtro -->
        <v-empty-state
          v-else-if="filteredProjects.length === 0"
          icon="mdi-briefcase-off-outline"
          :title="t('projects.empty.title')"
          :text="t('projects.empty.description')"
          class="empty-state"
        >
          <template #actions>
            <v-btn
              color="primary"
              variant="tonal"
              @click="activeFilter = 'all'"
            >
              {{ t('projects.filters.all') }}
            </v-btn>
          </template>
        </v-empty-state>

        <!-- Griglia card -->
        <v-row v-else>
          <v-col
            v-for="project in filteredProjects"
            :key="project.path"
            cols="12"
            sm="6"
            lg="4"
            data-project-card
          >
            <ProjectsProjectCard
              :title="loc(project.title as LocaleString)"
              :preview="project.preview"
              :slug="project.path"
              :featured="project.featured ?? false"
              :client="project.client"
            />
          </v-col>
        </v-row>
      </section>

    </v-container>
  </div>
</template>

<style scoped>
.projects-page {
  min-height: calc(100dvh - 80px);
}

.brand-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.1em;
}

/* ── Filtri ─────────────────────────────────────────────────── */

/* Contenitore con scroll orizzontale su mobile + fade ai bordi */
.filters-scroll-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  /* fade laterale per indicare lo scroll */
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0px,
    black 20px,
    black calc(100% - 20px),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0px,
    black 20px,
    black calc(100% - 20px),
    transparent 100%
  );
  padding: 6px 20px 8px;
  margin: 0 -20px; /* compensa il padding laterale per allinearsi al container */
}

.filters-scroll-wrap::-webkit-scrollbar {
  display: none;
}

/* Riga di pill non wrappata */
.filter-toggle {
  height: auto !important;
  flex-wrap: nowrap !important;
  gap: 8px !important;
  min-width: max-content;
  background: transparent !important;
  padding: 0 !important;
}

.filter-btn {
  font-size: 13.5px !important;
  font-weight: 500 !important;
  letter-spacing: 0 !important;
  border-radius: 999px !important;
  min-height: 42px !important;
  padding: 0 20px !important;
  border: 1.5px solid color-mix(in srgb, currentColor 12%, transparent) !important;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
}

/* Stato attivo: ombra leggera */
:deep(.filter-btn.v-btn--active) {
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.13) !important;
}

/* Badge contatore progetto */
.filter-count {
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
  opacity: 0.4;
  font-weight: 700;
  line-height: 1;
  min-width: 16px;
  text-align: center;
  transition: opacity 0.2s ease;
}

.filter-count--active {
  opacity: 0.8;
}

/* ── Empty state ─────────────────────────────────────────────── */
.empty-state {
  margin: 80px auto;
  padding: 48px 32px;
  max-width: 480px;
  border-radius: 24px;
  border: 1px dashed rgba(128, 128, 128, 0.2);
  background: rgba(128, 128, 128, 0.03);
}
</style>
