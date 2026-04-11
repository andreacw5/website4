<script setup lang="ts">
import type { VolunteeringProject } from '~/types/volunteering';

const props = defineProps<{
  project: VolunteeringProject;
}>();

const tagColorMap: Record<string, string> = {
  'Web development': 'primary',
  'Comunicazione': 'info',
  'Automazione': 'warning',
  'Communication': 'info',
  'Automation': 'warning',
};

const tagColor = computed(() => tagColorMap[props.project.tag] ?? 'primary');

const hasLink = computed(() => !!props.project.link);
const hasFacebook = computed(() => !!props.project.facebook);
const hasInstagram = computed(() => !!props.project.instagram);
const hasGithub = computed(() => !!props.project.github);
</script>

<template>
  <v-card
    class="vol-project-card h-100 d-flex flex-column"
    rounded="xl"
    elevation="0"
  >
    <!-- Tag bar -->
    <div class="card-tag-bar">
      <v-chip
        size="x-small"
        :color="tagColor"
        variant="tonal"
        label
      >
        {{ project.tag }}
      </v-chip>
    </div>

    <v-card-text class="pa-5 flex-grow-1 d-flex flex-column">
      <!-- Title -->
      <div class="text-body-1 font-weight-semibold mb-3 card-title">
        {{ project.title }}
      </div>

      <!-- Description (slot or body) -->
      <div class="text-body-2 text-medium-emphasis card-description flex-grow-1 mb-4">
        <slot />
      </div>

      <!-- Links -->
      <div class="d-flex ga-2 flex-wrap mt-auto">
        <v-btn
          v-if="hasLink"
          :href="project.link"
          target="_blank"
          rel="noopener noreferrer"
          variant="tonal"
          color="primary"
          size="small"
          append-icon="mdi-open-in-new"
        >
          Visita il sito
        </v-btn>
        <v-btn
          v-if="hasFacebook"
          :href="project.facebook"
          target="_blank"
          rel="noopener noreferrer"
          variant="tonal"
          color="primary"
          size="small"
          prepend-icon="mdi-facebook"
        >
          Facebook
        </v-btn>
        <v-btn
          v-if="hasInstagram"
          :href="project.instagram"
          target="_blank"
          rel="noopener noreferrer"
          variant="tonal"
          color="pink"
          size="small"
          prepend-icon="mdi-instagram"
        >
          Instagram
        </v-btn>
        <v-btn
          v-if="hasGithub"
          :href="project.github"
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          color="primary"
          size="small"
          prepend-icon="mdi-github"
        >
          GitHub
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.vol-project-card {
  background: linear-gradient(
    180deg,
    var(--home-card-top, rgba(255, 255, 255, 0.96)),
    var(--home-card-bottom, rgba(245, 248, 247, 0.88))
  );
  border: 1px solid var(--home-brand-soft, rgba(0, 168, 107, 0.12));
  overflow: hidden;
}


.card-tag-bar {
  padding: 0.75rem 1.25rem 0;
}

.card-title {
  line-height: 1.45;
}

.card-description {
  line-height: 1.75;
}
</style>

