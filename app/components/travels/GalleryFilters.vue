<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { TravelCategory } from '~~/types/travels';

const { t } = useI18n();

type GalleryFilter = 'all' | TravelCategory;

const props = defineProps<{
  modelValue: GalleryFilter;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: GalleryFilter];
}>();

const onUpdate = (value: GalleryFilter | null) => {
  emit('update:modelValue', value ?? 'all');
};

const filters = computed<Array<{ label: string; value: GalleryFilter }>>(() => [
  { label: t('travels.filters.all'), value: 'all' },
  { label: t('travels.filters.natura'), value: 'natura' },
  { label: t('travels.filters.citta'), value: 'città' },
  { label: t('travels.filters.montagna'), value: 'montagna' },
  { label: t('travels.filters.mare'), value: 'mare' },
]);
</script>

<template>
  <v-btn-toggle
    :model-value="props.modelValue"
    mandatory
    density="comfortable"
    divided
    class="filters-toggle"
    @update:model-value="onUpdate"
  >
    <v-btn
      v-for="filter in filters"
      :key="filter.value"
      :value="filter.value"
      size="small"
      rounded="pill"
      variant="text"
    >
      {{ filter.label }}
    </v-btn>
  </v-btn-toggle>
</template>

<style scoped>
.filters-toggle {
  max-width: 100%;
  overflow-x: auto;
}
</style>

