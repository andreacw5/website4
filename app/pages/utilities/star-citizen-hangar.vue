<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

useSeo(() => ({
  title: t('utilities.categories.starCitizen.title'),
  description: t('utilities.categories.starCitizen.description'),
  ogTitle: `${t('utilities.categories.starCitizen.title')} · ${t('utilities.seo.title')}`,
  pageType: 'website',
  canonical: '/utilities/star-citizen-hangar',
  breadcrumb: [
    { name: t('nav.utilities'), url: '/utilities' },
    { name: t('utilities.categories.starCitizen.title'), url: '/utilities/star-citizen-hangar' },
  ],
}));

// ── Data ────────────────────────────────────────────────────
const { data: ships } = await useAsyncData('starships', () =>
  queryCollection('starships').order('name', 'ASC').all(),
);

// ── Filters ─────────────────────────────────────────────────
const search = ref('');
const filterClass = ref<string | null>(null);

const classifications = computed(() => {
  if (!ships.value) return [];
  return [...new Set(ships.value.map(s => s.classification))].sort();
});

const filteredShips = computed(() => {
  if (!ships.value) return [];
  return ships.value.filter(s => {
    const q = search.value.toLowerCase();
    const matchSearch = !q ||
      s.name.toLowerCase().includes(q) ||
      s.manufacturer.toLowerCase().includes(q) ||
      s.focus?.toLowerCase().includes(q);
    const matchClass = !filterClass.value || s.classification === filterClass.value;
    return matchSearch && matchClass;
  });
});

// ── GSAP entrance ────────────────────────────────────────────
const contentRef = ref<HTMLElement | null>(null);
onMounted(async () => {
  if (!import.meta.client || !contentRef.value) return;
  const { gsap } = await import('gsap');
  gsap.fromTo(
    contentRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
  );
});
</script>

<template>
  <div class="utility-sub-page">
    <v-container max-width="1280" class="px-4 px-md-6 py-8 py-md-12">

      <!-- ─── Back ──────────────────────────────────────────────────── -->
      <v-btn
        :to="localePath('/utilities')"
        variant="text"
        color="blue"
        prepend-icon="mdi-arrow-left"
        class="text-none mb-6 back-btn"
        size="small"
      >
        {{ t('utilities.back') }}
      </v-btn>

      <!-- ─── Hero ─────────────────────────────────────────────── -->
      <section class="sub-hero mb-8" aria-labelledby="page-title">
        <div class="d-flex align-center ga-3 mb-4">
          <v-avatar color="blue" variant="tonal" size="52" rounded="lg">
            <v-icon size="26">mdi-rocket-launch-outline</v-icon>
          </v-avatar>
          <div>
            <p class="text-overline text-blue font-weight-bold mb-0 brand-mono" style="line-height:1">
              {{ t('utilities.categories.starCitizen.eyebrow') }}
            </p>
            <h1 id="page-title" class="text-h4 font-weight-bold">
              {{ t('utilities.categories.starCitizen.title') }}
            </h1>
          </div>
        </div>
        <p class="text-body-1 text-medium-emphasis sub-hero-desc">
          {{ t('utilities.categories.starCitizen.description') }}
        </p>
      </section>

      <!-- ─── Content ──────────────────────────────────────────── -->
      <div ref="contentRef">

        <!-- Filters -->
        <div class="d-flex flex-wrap align-center ga-3 mb-6">
          <v-text-field
            v-model="search"
            placeholder="Search ships…"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            rounded="lg"
            style="max-width: 300px"
          />
          <v-chip-group v-model="filterClass" selected-class="text-blue" column>
            <v-chip
              v-for="cls in classifications"
              :key="cls"
              :value="cls"
              size="small"
              variant="outlined"
              filter
            >
              {{ cls }}
            </v-chip>
          </v-chip-group>
          <v-spacer />
          <span class="text-caption text-medium-emphasis">
            {{ filteredShips.length }} / {{ ships?.length ?? 0 }} ships
          </span>
        </div>

        <!-- Skeleton loading -->
        <v-row v-if="!ships">
          <v-col v-for="i in 6" :key="i" cols="12" sm="6" lg="4">
            <v-skeleton-loader type="card" rounded="xl" />
          </v-col>
        </v-row>

        <!-- Empty state -->
        <v-empty-state
          v-else-if="filteredShips.length === 0"
          icon="mdi-rocket-off-outline"
          title="No ships found"
          text="Try adjusting the search or filters."
          class="empty-state"
        />

        <!-- Ship grid -->
        <v-row v-else>
          <v-col
            v-for="ship in filteredShips"
            :key="ship.slug"
            cols="12"
            sm="6"
            lg="4"
          >
            <StarCitizenShipCard
              :name="ship.name"
              :custom-name="ship.customName"
              :manufacturer="ship.manufacturer"
              :manufacturer-code="ship.manufacturerCode"
              :classification="ship.classification"
              :focus="ship.focus"
              :description="ship.description"
              :in-game="ship.inGame"
              :production-status="ship.productionStatus"
              :pledge-price="ship.pledgePrice"
              :size="ship.size"
              :length="ship.length"
              :beam="ship.beam"
              :height="ship.height"
              :cargo="ship.cargo"
              :crew-min="ship.crewMin"
              :crew-max="ship.crewMax"
              :scm-speed="ship.scmSpeed"
              :store-url="ship.storeUrl"
              :image="ship.image"
              :flagship="ship.flagship"
            />
          </v-col>
        </v-row>

      </div>

    </v-container>
  </div>
</template>

<style scoped>
.utility-sub-page {
  min-height: calc(100dvh - 80px);
}

.brand-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.1em;
}

.sub-hero-desc {
  max-width: 640px;
}

.back-btn {
  margin-left: -8px;
}

.empty-state {
  margin: 80px auto;
  padding: 48px 32px;
  max-width: 480px;
  border-radius: 24px;
  border: 1px dashed rgba(128, 128, 128, 0.2);
  background: rgba(128, 128, 128, 0.03);
}
</style>
