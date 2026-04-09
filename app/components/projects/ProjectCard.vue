<script setup lang="ts">
const localePath = useLocalePath();

// Props del componente — corrispondono al frontmatter dei .md in /content/projects/
defineProps<{
  title: string;
  preview?: string;
  slug: string; // path del documento per la navigazione al dettaglio
  client?: {
    name?: string;
  };
}>();
</script>

<template>
  <v-card
    class="project-card h-100 d-flex flex-column"
    rounded="xl"
    elevation="0"
    :to="localePath(slug)"
  >
    <!-- Thumbnail -->
    <div class="project-img-wrapper">
      <v-img
        v-if="preview"
        :src="preview"
        :alt="title"
        cover
        class="project-img"
        lazy-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center h-100">
            <v-progress-circular indeterminate color="primary" size="28" />
          </div>
        </template>
      </v-img>
      <div v-else class="project-img-placeholder d-flex align-center justify-center">
        <v-icon size="48" color="primary" opacity="0.3">mdi-image-outline</v-icon>
      </div>
    </div>

    <!-- Corpo della card: titolo + company a sx, freccia a dx -->
    <v-card-item class="py-3 px-4">
      <div class="d-flex align-center justify-space-between ga-3">
        <div class="card-info overflow-hidden">
          <div class="text-body-2 font-weight-semibold project-title">{{ title }}</div>
          <div v-if="client?.name" class="text-caption text-medium-emphasis mt-1 project-company">
            {{ client.name }}
          </div>
        </div>
        <v-icon color="primary" size="20" class="flex-shrink-0 arrow-icon">mdi-arrow-right</v-icon>
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.project-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.07);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  overflow: hidden;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.14);
  border-color: rgba(var(--v-theme-primary), 0.22);
}

.project-card:hover .arrow-icon {
  transform: translateX(3px);
}

/* Wrapper immagine con aspect ratio fisso */
.project-img-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: rgba(var(--v-theme-surface-variant), 1);
}

.project-img {
  aspect-ratio: 16 / 9;
  width: 100%;
  display: block;
  transition: transform 0.35s ease;
}

.project-card:hover .project-img {
  transform: scale(1.04);
}

.project-img-placeholder {
  aspect-ratio: 16 / 9;
  width: 100%;
  background: rgba(var(--v-theme-surface-variant), 1);
}

/* Titolo a una riga con ellissi */
.project-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.project-company {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow-icon {
  transition: transform 0.22s ease;
}
</style>

