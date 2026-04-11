<script setup lang="ts">
export type TravelCountry = {
  flag: string;
  name: string;
  year: number;
};

const props = withDefaults(defineProps<{
  countries: TravelCountry[];
}>(), {
  countries: () => [],
});

const emit = defineEmits<{
  select: [country: TravelCountry];
}>();

const selectedCountry = ref<string | null>(null);

const onSelect = (country: TravelCountry) => {
  selectedCountry.value = `${country.name}-${country.year}`;
  emit('select', country);
};
</script>

<template>
  <div class="country-chips-scroll" aria-label="Paesi visitati">
    <v-chip-group v-model="selectedCountry" class="country-chip-group" selected-class="text-primary" mobile>
      <v-chip
        v-for="country in props.countries"
        :key="`${country.name}-${country.year}`"
        :value="`${country.name}-${country.year}`"
        size="large"
        rounded="pill"
        variant="tonal"
        class="country-chip"
        @click="onSelect(country)"
      >
        <span>{{ country.flag }} {{ country.name }}</span>
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

