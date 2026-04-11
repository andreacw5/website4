<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Country, TravelPhoto } from '~~/types/travels';

const { t } = useI18n();

const props = withDefaults(defineProps<{
  countries: Country[];
  photos: TravelPhoto[];
}>(), {
  countries: () => [],
  photos: () => [],
});

const metrics = computed(() => {
  const firstYear = props.countries.length
    ? Math.min(...props.countries.map((country) => country.year))
    : null;

  return [
    {
      label: t('travels.stats.countries'),
      value: `${props.countries.length}`,
      icon: 'mdi-earth',
    },
    {
      label: t('travels.stats.continents'),
      value: `${new Set(props.countries.map((country) => country.continent)).size}`,
      icon: 'mdi-map-legend',
    },
    {
      label: t('travels.stats.photos'),
      value: `${props.photos.length}`,
      icon: 'mdi-image-multiple-outline',
    },
    {
      label: t('travels.stats.since'),
      value: firstYear ? `${firstYear}` : '-',
      icon: 'mdi-calendar-start',
    },
  ];
});
</script>

<template>
  <v-row class="stats-surface py-2 px-1 rounded-xl" aria-label="Statistiche viaggio">
    <v-col
      v-for="metric in metrics"
      :key="metric.label"
      cols="6"
      md="3"
      class="py-4"
    >
      <div class="d-flex align-center ga-2 mb-2 text-medium-emphasis">
        <v-icon :icon="metric.icon" size="18" color="primary" />
        <span class="text-caption">{{ metric.label }}</span>
      </div>
      <div class="text-h5 font-weight-bold">{{ metric.value }}</div>
    </v-col>
  </v-row>
</template>

<style scoped>
.stats-surface {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background: rgb(var(--v-theme-surface));
}
</style>

