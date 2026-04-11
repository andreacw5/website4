<script setup lang="ts">
export type TravelPhoto = {
  id: string;
  src: string;
  alt: string;
  location: string;
  country: string;
  year: number;
  category: string;
};

const props = defineProps<{
  photo: TravelPhoto;
}>();

const emit = defineEmits<{
  open: [photo: TravelPhoto];
}>();

const categoryAspectMap: Record<string, number[]> = {
  city: [1.1, 0.75, 1],
  sea: [0.8, 1.2, 1],
  mountain: [0.72, 1.05, 0.9],
  nature: [0.85, 1.15, 0.95],
};

const aspectRatio = computed(() => {
  const pool = categoryAspectMap[props.photo.category.toLowerCase()] || [0.8, 1, 1.2];
  const seed = [...props.photo.id].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return pool[seed % pool.length];
});

const onOpen = () => {
  emit('open', props.photo);
};
</script>

<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      class="photo-card"
      rounded="xl"
      elevation="0"
      role="button"
      tabindex="0"
      @click="onOpen"
      @keydown.enter.prevent="onOpen"
      @keydown.space.prevent="onOpen"
    >
      <v-img
        :src="photo.src"
        :alt="photo.alt"
        :aspect-ratio="aspectRatio"
        cover
        class="photo-img"
        lazy-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
      >
        <v-chip
          size="small"
          color="primary"
          variant="tonal"
          class="category-chip"
        >
          {{ photo.category }}
        </v-chip>

        <v-overlay
          contained
          :model-value="isHovering"
          scrim="rgba(0, 0, 0, 0.45)"
          class="photo-overlay"
          persistent
        >
          <div class="overlay-content text-center px-4">
            <div class="text-body-2 font-weight-bold">{{ photo.location }}</div>
            <div class="text-caption">{{ photo.country }} - {{ photo.year }}</div>
          </div>
        </v-overlay>
      </v-img>
    </v-card>
  </v-hover>
</template>

<style scoped>
.photo-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  transition: box-shadow 0.22s ease, border-color 0.22s ease;
}

.photo-card:hover,
.photo-card:focus-visible {
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.16);
  border-color: rgba(var(--v-theme-primary), 0.22);
}

.photo-img {
  transition: transform 0.35s ease;
}

.photo-card:hover .photo-img,
.photo-card:focus-visible .photo-img {
  transform: scale(1.05);
}

.category-chip {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

.photo-overlay {
  align-items: flex-end;
}

.overlay-content {
  width: 100%;
  color: rgb(var(--v-theme-on-primary));
  margin-bottom: 12px;
}
</style>

