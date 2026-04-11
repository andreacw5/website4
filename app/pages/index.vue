<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useSeo(() => ({
  title: t('home.seo.title'),
  description: t('home.seo.description'),
  ogTitle: t('home.seo.ogTitle'),
  ogDescription: t('home.seo.ogDescription'),
  pageType: 'website',
}));
</script>

<template>
  <div class="home-page">
    <v-container max-width="1280" class="px-4 px-md-6">

      <HomeHeroSection />

      <HomeAboutSection />

      <HomeExperienceSection />

      <HomeSkillsSection />

      <HomeVolunteeringTeaser />

      <HomePreviewSection />

      <HomeCtaSection />
    </v-container>
  </div>
</template>

<style scoped>
.home-page {
  position: relative;
  --home-card-top: rgba(240, 240, 240, 0.9);
  --home-card-bottom: rgba(245, 248, 247, 0.88);
  --home-text-strong: #15211b;
  --home-text-soft: rgba(21, 33, 27, 0.72);
  --home-brand: #00a86b;
  --home-brand-soft: rgba(0, 168, 107, 0.12);
}

:global(.v-theme--dark) .home-page {
  --home-card-top: rgba(44, 44, 44, 0.9);
  --home-card-bottom: rgba(15, 20, 19, 0.88);
  --home-text-strong: #edf5f2;
  --home-text-soft: rgba(237, 245, 242, 0.72);
  --home-brand-soft: rgba(0, 168, 107, 0.18);
}
</style>
