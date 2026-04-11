<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n';
import TravelsCountryChips from '~/components/travels/CountryChips.vue';
import TravelsGalleryFilters from '~/components/travels/GalleryFilters.vue';
import TravelsLightbox from '~/components/travels/PhotoLightbox.vue';
import TravelsPhotoCard from '~/components/travels/PhotoCard.vue';
import TravelsStats from '~/components/travels/TravelsStats.vue';
import type { Country, TravelCategory, TravelPhoto } from '~/types/travels';

const { t } = useI18n();
const { smAndDown, mdAndDown } = useDisplay();

useSeo(() => ({
  title: t('travels.seo.title'),
  description: t('travels.seo.description'),
  ogTitle: t('travels.seo.ogTitle'),
  ogDescription: t('travels.seo.ogDescription'),
  pageType: 'website',
  breadcrumb: [{ name: t('nav.travels'), url: '/travels' }],
}));

const normalizeCategory = (category?: string): TravelCategory => {
  const normalized = category?.trim().toLowerCase();
  if (normalized === 'citta' || normalized === 'città' || normalized === 'city') return 'città';
  if (normalized === 'mare' || normalized === 'sea') return 'mare';
  if (normalized === 'montagna' || normalized === 'mountain') return 'montagna';
  return 'natura';
};

const normalizeAspect = (aspect?: string): TravelPhoto['aspect'] => {
  if (aspect === 'tall' || aspect === 'wide' || aspect === 'square') return aspect;
  return 'wide';
};

const { data: countries, pending: countriesPending } = await useAsyncData<Country[]>('travels-countries', async () => {
  const items = await queryCollection('travels').order('year', 'DESC').all();

  return items.map((country) => ({
    name: country.name,
    flag: country.flag,
    year: country.year,
    continent: country.continent,
    visited: country.visited,
    highlight: country.highlight,
    body: country.body,
  }));
});

const { data: allPhotos, pending: photosPending } = await useAsyncData<TravelPhoto[]>('travels-photos', async () => {
  const items = await queryCollection('travelsPhotos').order('year', 'DESC').all();

  return items
    .filter((photo) => !!photo.src)
    .map((photo) => ({
      id: photo.id,
      location: photo.location,
      country: photo.country ?? '',
      countrySlug: photo.countrySlug,
      year: photo.year,
      category: normalizeCategory(photo.category),
      aspect: normalizeAspect(photo.aspect),
      src: photo.src,
      alt: photo.alt,
      featured: photo.featured ?? false,
      body: photo.body,
    }));
});

type GalleryFilter = 'all' | TravelCategory;

const activeFilter = ref<GalleryFilter>('all');
const selectedPhoto = ref<TravelPhoto | null>(null);

const visitedCountries = computed(() => {
  return (countries.value ?? []).filter((country) => country.visited);
});

const filteredPhotos = computed(() => {
  if (activeFilter.value === 'all') return allPhotos.value ?? [];
  return (allPhotos.value ?? []).filter((photo) => photo.category === activeFilter.value);
});

watch(filteredPhotos, (photos) => {
  if (!selectedPhoto.value) return;
  const stillVisible = photos.some((photo) => photo.id === selectedPhoto.value?.id);
  if (!stillVisible) {
    selectedPhoto.value = null;
  }
});

const isLoading = computed(() => countriesPending.value || photosPending.value);

const masonryColumns = computed(() => {
  if (smAndDown.value) return 1;
  if (mdAndDown.value) return 2;
  return 3;
});

const onCountrySelect = (_countryName: string | null) => {
  // Country chip currently provides visual selection only.
};

const onPhotoOpen = (photo: TravelPhoto) => {
  selectedPhoto.value = photo;
};
</script>

<template>
  <div class="travels-page">
    <v-container max-width="1280" class="px-4 px-md-6 py-8 py-md-12">

      <!-- ─── Hero ─────────────────────────────────────────────── -->
      <section class="travels-hero mb-10" aria-labelledby="travels-title">
        <p class="text-overline text-primary font-weight-bold mb-2 brand-mono">
          {{ t('travels.hero.eyebrow') }}
        </p>
        <h1 id="travels-title" class="text-h3 font-weight-bold mb-4">
          {{ t('travels.hero.title') }}
        </h1>
        <p class="text-body-1 text-medium-emphasis mt-4 mb-0">
          {{ t('travels.hero.description') }}
        </p>
      </section>

      <section class="mb-10" aria-label="Statistiche viaggio">
        <v-skeleton-loader
          v-if="isLoading"
          type="article"
          class="rounded-xl"
        />
        <TravelsStats v-else :countries="visitedCountries" :photos="allPhotos ?? []" />
      </section>

      <section class="mb-10" aria-label="Paesi visitati">
        <p class="text-overline font-weight-bold text-primary mb-3 brand-mono">Paesi</p>
        <v-skeleton-loader v-if="isLoading" type="chip" />
        <TravelsCountryChips v-else :countries="visitedCountries" @select="onCountrySelect" />
      </section>

      <section class="mb-10" aria-label="Galleria viaggi">
        <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
          <p class="text-overline font-weight-bold text-primary mb-0 brand-mono">Galleria</p>
          <TravelsGalleryFilters v-model="activeFilter" />
        </div>

        <v-skeleton-loader
          v-if="isLoading"
          type="image, image, image"
          class="rounded-xl"
        />

        <div
          v-else-if="filteredPhotos.length"
          class="masonry-grid"
          :style="{ columns: masonryColumns }"
        >
          <div v-for="photo in filteredPhotos" :key="photo.id" class="masonry-item">
            <TravelsPhotoCard :photo="photo" @open="onPhotoOpen" />
          </div>
        </div>

        <v-empty-state
          v-else
          icon="mdi-image-off"
          :title="t('travels.filters.empty')"
          :text="t('travels.filters.empty')"
          class="empty-state"
        />

      </section>

      <TravelsLightbox v-model="selectedPhoto" :photos="filteredPhotos" />
    </v-container>
  </div>
</template>

<style scoped>
.travels-page {
  min-height: calc(100dvh - 80px);
}

.brand-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.1em;
}

.travel-quote {
  padding: 20px 24px;
  border-left: 3px solid rgba(var(--v-theme-primary), 0.7);
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 0 16px 16px 0;
}

.masonry-grid {
  columns: 3;
  column-gap: 12px;
}

.masonry-item {
  display: block;
  break-inside: avoid;
  margin-bottom: 12px;
}

@media (max-width: 960px) {
  .masonry-grid {
    columns: 2;
  }
}

@media (max-width: 600px) {
  .masonry-grid {
    columns: 1;
  }
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
