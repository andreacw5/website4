<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import TravelsCountryChips from '~/components/travels/CountryChips.vue';
import TravelsPhotoCard from '~/components/travels/PhotoCard.vue';

const { t } = useI18n();

useSeoMeta({
  title: t('travels.seo.title'),
  description: t('travels.seo.description'),
  ogTitle: t('travels.seo.ogTitle'),
  ogDescription: t('travels.seo.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

const { data: travels } = await useAsyncData('travels-countries', () =>
  queryCollection('travels').order('year', 'DESC').all(),
);

const { data: travelPhotos } = await useAsyncData('travels-photos', () =>
  queryCollection('travelsPhotos').order('year', 'DESC').all(),
);

type GalleryFilter = 'all' | 'citta' | 'mare' | 'montagna' | 'natura';

const quote = '"Viaggiare è l\'unica cosa che compri e che ti rende più ricco." — ogni viaggio lascia qualcosa di irripetibile.';

const visitedCountries = computed(() => {
  if (!travels.value?.length) return [];

  return travels.value
    .filter((travel) => travel.visited)
    .map((travel) => ({
      flag: travel.flag,
      name: travel.name,
      year: travel.year,
    }))
    .sort((a, b) => b.year - a.year);
});

const stats = computed(() => {
  const countries = travels.value ?? [];
  const photos = travelPhotos.value ?? [];
  const firstYear = countries.length
    ? Math.min(...countries.map((country) => country.year))
    : new Date().getFullYear();
  const continentCount = new Set(countries.map((country) => country.continent)).size;

  return [
    { value: `${visitedCountries.value.length}`, label: 'Paesi visitati', icon: 'mdi-earth' },
    { value: `${continentCount}`, label: 'Continenti', icon: 'mdi-map-legend' },
    { value: `${photos.length}`, label: 'Foto in archivio', icon: 'mdi-image-multiple-outline' },
    { value: `${firstYear}`, label: 'Primo viaggio', icon: 'mdi-calendar-start' },
  ];
});

const onCountrySelect = (_country: { flag: string; name: string; year: number }) => {
  // Placeholder for future gallery/list filtering by country.
};

const onPhotoOpen = (_photo: {
  id: string;
  src: string;
  alt: string;
  location: string;
  country: string;
  year: number;
  category: string;
}) => {
  // Placeholder for future lightbox/modal opening.
};

const galleryFilters: Array<{ label: string; value: GalleryFilter }> = [
  { label: 'Tutti', value: 'all' },
  { label: 'Citta', value: 'citta' },
  { label: 'Mare', value: 'mare' },
  { label: 'Montagna', value: 'montagna' },
  { label: 'Natura', value: 'natura' },
];

const galleryTypeLabel: Record<Exclude<GalleryFilter, 'all'>, string> = {
  citta: 'Citta',
  mare: 'Mare',
  montagna: 'Montagna',
  natura: 'Natura',
};

const activeGalleryFilter = ref<GalleryFilter>('all');

const normalizeCategory = (category?: string) => category?.toLowerCase().trim();

const toGalleryFilter = (category?: string): Exclude<GalleryFilter, 'all'> => {
  const normalized = normalizeCategory(category);
  if (normalized === 'citta' || normalized === 'city') return 'citta';
  if (normalized === 'mare' || normalized === 'sea') return 'mare';
  if (normalized === 'montagna' || normalized === 'mountain') return 'montagna';
  return 'natura';
};

const galleryItems = computed(() => {
  if (!travelPhotos.value?.length) return [];

  return travelPhotos.value
    .filter((photo) => !!photo.src)
    .map((photo) => {
      const type = toGalleryFilter(photo.category);
      return {
        id: photo.id,
        type,
        photo: {
          id: photo.id,
          src: photo.src,
          alt: photo.alt,
          location: photo.location,
          country: photo.country ?? '',
          year: photo.year,
          category: galleryTypeLabel[type],
        },
      };
    });
});

const filteredGalleryItems = computed(() => {
  if (activeGalleryFilter.value === 'all') return galleryItems.value;
  return galleryItems.value.filter((item) => item.type === activeGalleryFilter.value);
});
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
        <blockquote class="travel-quote text-body-1 mb-0">
          {{ quote }}
        </blockquote>
        <p class="text-body-1 text-medium-emphasis mt-4 mb-0">
          {{ t('travels.hero.description') }}
        </p>
      </section>

      <section class="mb-10" aria-label="Statistiche viaggio">
        <v-row>
          <v-col
            v-for="item in stats"
            :key="item.label"
            cols="12"
            sm="6"
            lg="3"
          >
            <v-card rounded="xl" elevation="0" class="stat-card pa-5 h-100">
              <div class="d-flex align-center ga-3 mb-3">
                <v-icon :icon="item.icon" color="primary" size="20" />
                <span class="text-caption text-medium-emphasis">{{ item.label }}</span>
              </div>
              <div class="text-h4 font-weight-bold">{{ item.value }}</div>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <section class="mb-10" aria-label="Paesi visitati">
        <p class="text-overline font-weight-bold text-primary mb-3 brand-mono">Paesi</p>
        <TravelsCountryChips :countries="visitedCountries" @select="onCountrySelect" />
      </section>

      <section class="mb-10" aria-label="Galleria viaggi">
        <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
          <p class="text-overline font-weight-bold text-primary mb-0 brand-mono">Galleria</p>
          <v-chip-group v-model="activeGalleryFilter" selected-class="text-primary" mandatory>
            <v-chip
              v-for="filter in galleryFilters"
              :key="filter.value"
              :value="filter.value"
              filter
              variant="outlined"
              rounded="pill"
            >
              {{ filter.label }}
            </v-chip>
          </v-chip-group>
        </div>

        <v-row v-if="filteredGalleryItems.length">
          <v-col
            v-for="item in filteredGalleryItems"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
          >
            <TravelsPhotoCard :photo="item.photo" @open="onPhotoOpen" />
          </v-col>
        </v-row>

        <v-empty-state
          v-else
          icon="mdi-image-off-outline"
          title="Nessuna foto trovata"
          text="Nessun elemento corrisponde al filtro selezionato."
          class="empty-state"
        />

      </section>
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

.stat-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background: rgba(var(--v-theme-surface), 1);
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
