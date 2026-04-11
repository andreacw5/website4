<script setup lang="ts">
defineProps<{
  title: string;
  short?: string;
  cover?: string;
  createdAt?: string;
  hasGallery?: boolean;
}>();

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
};
</script>

<template>
  <v-card
    class="travel-card h-100 d-flex flex-column"
    rounded="xl"
    elevation="0"
  >
    <!-- Cover image -->
    <div class="travel-img-wrapper">
      <v-img
        v-if="cover"
        :src="cover"
        :alt="title"
        cover
        class="travel-img"
        lazy-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center h-100">
            <v-progress-circular indeterminate color="primary" size="28" />
          </div>
        </template>

        <!-- Gallery badge -->
        <v-chip
          v-if="hasGallery"
          size="x-small"
          color="primary"
          class="gallery-badge ma-2"
          prepend-icon="mdi-image-multiple-outline"
        >
          Gallery
        </v-chip>
      </v-img>
      <div v-else class="travel-img-placeholder d-flex align-center justify-center">
        <v-icon size="48" color="primary" opacity="0.3">mdi-image-outline</v-icon>
      </div>
    </div>

    <!-- Body -->
    <v-card-item class="py-3 px-4 flex-grow-1">
      <div class="d-flex flex-column ga-1 h-100">
        <!-- Date -->
        <span v-if="createdAt" class="travel-date text-caption text-medium-emphasis">
          <v-icon size="12" class="me-1">mdi-calendar-outline</v-icon>
          {{ formatDate(createdAt) }}
        </span>

        <!-- Title -->
        <div class="text-body-1 font-weight-semibold travel-title mt-1">{{ title }}</div>

        <!-- Short description -->
        <p v-if="short" class="text-body-2 text-medium-emphasis travel-short mt-1 mb-0">
          {{ short }}
        </p>
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.travel-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.07);
  overflow: hidden;
  cursor: default;
  transition: box-shadow 0.22s ease, border-color 0.22s ease;
}

.travel-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/HT_Pattern_1.svg');
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.32s ease;
  pointer-events: none;
  border-radius: inherit;
}

.travel-card:hover::after {
  opacity: 0.05;
}

.travel-card:hover {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--v-theme-primary), 0.15);
}

/* Wrapper immagine */
.travel-img-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: rgba(var(--v-theme-surface-variant), 1);
}

.travel-img {
  aspect-ratio: 4 / 3;
  width: 100%;
  display: block;
  transition: transform 0.4s ease;
}

.travel-card:hover .travel-img {
  transform: scale(1.04);
}

.travel-img-placeholder {
  aspect-ratio: 4 / 3;
  width: 100%;
  background: rgba(var(--v-theme-surface-variant), 1);
}

/* Gallery badge posizionato in basso a sinistra dell'immagine */
.gallery-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
}

/* Testo */
.travel-title {
  line-height: 1.4;
}

.travel-short {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.travel-date {
  display: flex;
  align-items: center;
}
</style>

