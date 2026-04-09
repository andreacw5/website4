<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: t('pages.portfolio.title'),
  description: t('pages.portfolio.description'),
});
</script>

<template>
  <v-container max-width="960" class="py-16 px-4 px-md-6">
    <v-card rounded="xl" elevation="0" class="placeholder-card pa-6 pa-md-8">
      <v-chip color="primary" variant="tonal" class="mb-4">{{ t('pages.comingSoon') }}</v-chip>
      <h1 class="text-h3 font-weight-bold mb-4">{{ t('pages.portfolio.title') }}</h1>
      <p class="text-body-1 text-medium-emphasis mb-8">{{ t('pages.portfolio.description') }}</p>
      <v-btn :to="localePath('/')" color="primary" rounded="pill">{{ t('pages.backHome') }}</v-btn>
    </v-card>
  </v-container>
</template>

<style scoped>
.placeholder-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 248, 247, 0.88));
  border: 1px solid rgba(0, 168, 107, 0.08);
}

:global(.v-theme--dark) .placeholder-card {
  background: linear-gradient(180deg, rgba(22, 27, 26, 0.96), rgba(15, 20, 19, 0.88));
  border-color: rgba(0, 168, 107, 0.16);
}
</style>

