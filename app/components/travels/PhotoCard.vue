<script setup lang="ts">
import type { TravelPhoto } from '~~/types/travels';

const props = defineProps<{
  photo: TravelPhoto;
}>();

const emit = defineEmits<{
  open: [photo: TravelPhoto];
}>();

const aspectRatioMap: Record<TravelPhoto['aspect'], number> = {
  tall: 3 / 4,
  wide: 4 / 3,
  square: 1,
};

const aspectRatio = computed(() => {
  return aspectRatioMap[props.photo.aspect] ?? aspectRatioMap.wide;
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

        <v-overlay
          contained
          :model-value="Boolean(isHovering)"
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
  transition: border-color 0.3s ease;
}

.photo-img {
  transition: transform 0.3s ease;
}

.photo-card:hover .photo-img,
.photo-card:focus-visible .photo-img {
  transform: scale(1.03);
}

.photo-card:hover,
.photo-card:focus-visible {
  border-color: rgba(var(--v-theme-primary), 0.3);
}


.photo-overlay {
  align-items: flex-end;
}

.overlay-content {
  width: 100%;
  color: rgb(var(--v-theme-on-primary));
  margin-bottom: 8px;
  text-align: left;
}
</style>

