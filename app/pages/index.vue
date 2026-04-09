<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const careerStartYear = 2016;
const yearsOfExperience = new Date().getFullYear() - careerStartYear;

useSeoMeta({
  title: t('home.seo.title'),
  description: t('home.seo.description'),
  ogTitle: t('home.seo.ogTitle'),
  ogDescription: t('home.seo.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <div class="home-page">
    <v-container max-width="1280" class="px-4 px-md-6">

      <HomeHeroSection />

      <section id="about" class="section-block" aria-labelledby="about-title">
        <v-row align="center" class="ga-6 ga-md-0">
          <v-col cols="12" md="6">
            <p class="text-overline text-primary font-weight-bold mb-3">{{ t('home.about.eyebrow') }}</p>
            <h2 id="about-title" class="text-h4 font-weight-bold mb-5">{{ t('home.about.title') }}</h2>

            <div class="d-flex flex-column ga-4 text-body-1 text-medium-emphasis about-copy">
              <p>{{ t('home.about.paragraphs.one') }}</p>
              <p>{{ t('home.about.paragraphs.two') }}</p>
              <p>{{ t('home.about.paragraphs.three') }}</p>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-card rounded="xl" class="about-portrait-card pa-5 pa-md-7" elevation="0">
              <div class="d-flex flex-column flex-md-row align-center ga-6">
                <v-avatar size="148" rounded="xl" color="primary" variant="tonal" :aria-label="t('home.about.portraitLabel')">
                  <span class="portrait-initials">AT</span>
                </v-avatar>

                <div class="flex-1-1 w-100">
                  <div class="text-subtitle-1 font-weight-semibold mb-4">Andrea Tombolato</div>

                  <div class="d-flex flex-column ga-3">
                    <v-sheet rounded="xl" class="about-stat pa-4" color="surface">
                      <div class="text-caption text-medium-emphasis">{{ t('home.about.stats.experience') }}</div>
                      <div class="text-body-1 font-weight-medium">{{ t('home.about.highlights.experience', { years: yearsOfExperience }) }}</div>
                    </v-sheet>
                    <v-sheet rounded="xl" class="about-stat pa-4" color="surface">
                      <div class="text-caption text-medium-emphasis">{{ t('home.about.stats.focus') }}</div>
                      <div class="text-body-1 font-weight-medium">{{ t('home.about.highlights.focus') }}</div>
                    </v-sheet>
                    <v-sheet rounded="xl" class="about-stat pa-4" color="surface">
                      <div class="text-caption text-medium-emphasis">{{ t('home.about.stats.community') }}</div>
                      <div class="text-body-1 font-weight-medium">{{ t('home.about.highlights.community') }}</div>
                    </v-sheet>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <HomeExperienceSection />

      <HomeSkillsSection />

      <HomePreviewSection />
    </v-container>
  </div>
</template>

<style scoped>
.home-page {
  position: relative;
  --home-card-top: rgba(255, 255, 255, 0.96);
  --home-card-bottom: rgba(245, 248, 247, 0.88);
  --home-text-strong: #15211b;
  --home-text-soft: rgba(21, 33, 27, 0.72);
  --home-brand: #00a86b;
  --home-brand-soft: rgba(0, 168, 107, 0.12);
}

:global(.v-theme--dark) .home-page {
  --home-card-top: rgba(22, 27, 26, 0.96);
  --home-card-bottom: rgba(15, 20, 19, 0.88);
  --home-text-strong: #edf5f2;
  --home-text-soft: rgba(237, 245, 242, 0.72);
  --home-brand-soft: rgba(0, 168, 107, 0.18);
}

.about-copy {
  max-width: 68ch;
}

.about-portrait-card,
.about-stat {
  background: linear-gradient(180deg, var(--home-card-top), var(--home-card-bottom));
  border: 1px solid var(--home-brand-soft);
}

.portrait-initials {
  font-size: 2.75rem;
  font-weight: 700;
  color: var(--home-brand);
}

.section-block {
  padding-block: 4rem;
}
</style>
