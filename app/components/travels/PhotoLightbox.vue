<script setup lang="ts">
import type { TravelPhoto } from '~~/types/travels';

const props = withDefaults(defineProps<{
  photos: TravelPhoto[];
  modelValue: TravelPhoto | null;
}>(), {
  photos: () => [],
  modelValue: null,
});

const emit = defineEmits<{
  'update:modelValue': [photo: TravelPhoto | null];
}>();

const isOpen = computed({
  get: () => !!props.modelValue,
  set: (value: boolean) => {
    if (!value) {
      emit('update:modelValue', null);
    }
  },
});

const currentIndex = computed(() => {
  if (!props.modelValue) return -1;
  return props.photos.findIndex((photo) => photo.id === props.modelValue?.id);
});

const currentPhoto = computed(() => {
  if (currentIndex.value < 0) return null;
  return props.photos[currentIndex.value] ?? null;
});

const hasNavigation = computed(() => props.photos.length > 1);

const goTo = (direction: -1 | 1) => {
  if (!props.photos.length || currentIndex.value < 0) return;
  const nextIndex = (currentIndex.value + direction + props.photos.length) % props.photos.length;
  emit('update:modelValue', props.photos[nextIndex] ?? null);
};

const close = () => {
  emit('update:modelValue', null);
};

if (import.meta.client) {
  useEventListener(window, 'keydown', (event: KeyboardEvent) => {
    if (!isOpen.value) return;

    if (event.key === 'ArrowLeft') {
      goTo(-1);
      return;
    }

    if (event.key === 'ArrowRight') {
      goTo(1);
      return;
    }

    if (event.key === 'Escape') {
      close();
    }
  });
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="900" scrollable>
    <v-card v-if="currentPhoto" rounded="xl" elevation="0" class="lightbox-card">
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        class="lightbox-close"
        @click="close"
      />

      <div class="lightbox-media">
        <v-btn
          v-if="hasNavigation"
          icon="mdi-chevron-left"
          class="lightbox-nav lightbox-nav--left"
          @click="goTo(-1)"
        />

        <v-img
          :src="currentPhoto.src"
          :alt="currentPhoto.alt"
          max-height="70vh"
          cover
          class="lightbox-image"
        />

        <v-btn
          v-if="hasNavigation"
          icon="mdi-chevron-right"
          class="lightbox-nav lightbox-nav--right"
          @click="goTo(1)"
        />
      </div>

      <v-card-text class="pt-4">
        <div class="d-flex flex-wrap justify-space-between ga-2">
          <div class="text-body-1 font-weight-bold">{{ currentPhoto.location }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ currentPhoto.country }} · {{ currentPhoto.year }}</div>
        </div>

        <div v-if="currentPhoto.body" class="mt-3 text-body-2 text-medium-emphasis">
          <ContentRenderer :value="currentPhoto" />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.lightbox-card {
  position: relative;
  overflow: hidden;
}

.lightbox-close {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 3;
}

.lightbox-media {
  position: relative;
}

.lightbox-image :deep(img) {
  border-radius: 16px;
}

.lightbox-nav {
  position: absolute;
  top: calc(50% - 18px);
  z-index: 2;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
}

.lightbox-nav--left {
  left: 12px;
}

.lightbox-nav--right {
  right: 12px;
}
</style>

