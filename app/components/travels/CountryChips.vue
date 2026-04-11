<script setup lang="ts">
import type { Country } from '~~/types/travels';

const props = withDefaults(defineProps<{
  countries: Country[];
}>(), {
  countries: () => [],
});

const emit = defineEmits<{
  select: [countryName: string | null];
}>();

const selectedCountry = ref<string | null>(null);

const onSelect = (countryName: string) => {
  selectedCountry.value = selectedCountry.value === countryName ? null : countryName;
  emit('select', selectedCountry.value);
};
</script>

<template>
  <div class="country-chips-scroll" aria-label="Paesi visitati">
    <v-chip-group v-model="selectedCountry" class="country-chip-group" mobile>
      <v-chip
        v-for="country in props.countries"
        :key="country.name"
        :value="country.name"
        size="large"
        rounded="pill"
        variant="outlined"
        :class="['country-chip', { 'country-chip--active': selectedCountry === country.name }]"
        @click="onSelect(country.name)"
      >
        <span class="country-chip__label">
          <img
            :src="`/flags/${country.flag}.svg`"
            :alt="`Bandiera ${country.name}`"
            class="country-chip__flag"
            loading="lazy"
          >
          <span>{{ country.name }}</span>
        </span>
        <span class="ms-2 text-medium-emphasis text-caption mt-1">{{ country.year }}</span>
      </v-chip>
    </v-chip-group>
  </div>
</template>

<style scoped>
.country-chips-scroll {
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.country-chips-scroll::-webkit-scrollbar {
  display: none;
}

.country-chip-group {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  width: max-content;
  min-width: 100%;
}

.country-chip {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.country-chip__label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.country-chip__flag {
  width: 20px;
  height: 14px;
  object-fit: cover;
  border-radius: 2px;
}

.country-chip--active {
  border-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary));
}

@media (min-width: 600px) {
  .country-chips-scroll {
    overflow-x: visible;
  }

  .country-chip-group {
    flex-wrap: wrap;
    width: 100%;
  }
}
</style>

