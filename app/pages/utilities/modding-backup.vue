<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: `${t('utilities.categories.moddingBackup.title')} · ${t('utilities.seo.title')}`,
  description: t('utilities.categories.moddingBackup.description'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

const moddingTab = ref<'gtaV' | 'fallout4' | 'sims4'>('gtaV');

interface ModdingSection {
  key: 'gtaV' | 'fallout4' | 'sims4';
  icon: string;
  color: string;
}

const moddingSections: ModdingSection[] = [
  { key: 'gtaV',     icon: 'mdi-city-variant-outline', color: '#e05a00' },
  { key: 'fallout4', icon: 'mdi-radioactive',           color: '#7aad2e' },
  { key: 'sims4',    icon: 'mdi-home-heart',            color: '#bf4dba' },
];

// GSAP entrance
const contentRef = ref<HTMLElement | null>(null);
onMounted(async () => {
  if (!import.meta.client || !contentRef.value) return;
  const { gsap } = await import('gsap');
  gsap.fromTo(
    contentRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
  );
});
</script>

<template>
  <div class="utility-sub-page">
    <v-container max-width="1280" class="px-4 px-md-6 py-8 py-md-12">

      <!-- ─── Back ──────────────────────────────────────────────── -->
      <v-btn
        :to="localePath('/utilities')"
        variant="text"
        color="primary"
        prepend-icon="mdi-arrow-left"
        class="text-none mb-6 back-btn"
        size="small"
      >
        {{ t('utilities.back') }}
      </v-btn>

      <!-- ─── Hero ─────────────────────────────────────────────── -->
      <section class="sub-hero mb-8" aria-labelledby="page-title">
        <div class="d-flex align-center ga-3 mb-4">
          <v-avatar color="primary" variant="tonal" size="52" rounded="lg">
            <v-icon size="26">mdi-controller-classic</v-icon>
          </v-avatar>
          <div>
            <p class="text-overline text-primary font-weight-bold mb-0 brand-mono" style="line-height:1">
              {{ t('utilities.categories.moddingBackup.eyebrow') }}
            </p>
            <h1 id="page-title" class="text-h4 font-weight-bold">
              {{ t('utilities.categories.moddingBackup.title') }}
            </h1>
          </div>
        </div>
        <p class="text-body-1 text-medium-emphasis sub-hero-desc">
          {{ t('utilities.categories.moddingBackup.description') }}
        </p>
      </section>

      <!-- ─── Sub-tabs ─────────────────────────────────────────── -->
      <div ref="contentRef">
        <v-tabs
          v-model="moddingTab"
          color="primary"
          density="comfortable"
          class="modding-tabs mb-4"
        >
          <v-tab
            v-for="section in moddingSections"
            :key="section.key"
            :value="section.key"
            class="text-none modding-tab"
          >
            <v-icon size="16" class="mr-2" :color="moddingTab === section.key ? section.color : undefined">
              {{ section.icon }}
            </v-icon>
            {{ t(`utilities.categories.moddingBackup.sections.${section.key}.title`) }}
          </v-tab>
        </v-tabs>

        <v-tabs-window v-model="moddingTab">
          <v-tabs-window-item
            v-for="section in moddingSections"
            :key="section.key"
            :value="section.key"
          >
            <v-card class="glass-card pa-6" rounded="xl">
              <!-- Section header -->
              <div class="d-flex align-center ga-3 mb-5">
                <v-avatar :color="section.color" variant="tonal" size="44" rounded="lg">
                  <v-icon size="22">{{ section.icon }}</v-icon>
                </v-avatar>
                <div>
                  <h2 class="text-h6 font-weight-semibold">
                    {{ t(`utilities.categories.moddingBackup.sections.${section.key}.title`) }}
                  </h2>
                  <p class="text-caption text-medium-emphasis mb-0">
                    {{ t(`utilities.categories.moddingBackup.sections.${section.key}.description`) }}
                  </p>
                </div>
              </div>

              <!-- WIP placeholder -->
              <v-alert
                type="info"
                variant="tonal"
                icon="mdi-clock-outline"
                rounded="lg"
                class="wip-alert"
              >
                <div class="text-body-2 font-weight-medium">{{ t('utilities.wip.label') }}</div>
                <div class="text-caption text-medium-emphasis mt-1">{{ t('utilities.wip.description') }}</div>
              </v-alert>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>

    </v-container>
  </div>
</template>

<style scoped>
.utility-sub-page {
  min-height: calc(100dvh - 80px);
}

.brand-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.1em;
}

.sub-hero-desc {
  max-width: 640px;
}

.back-btn {
  margin-left: -8px;
}

.modding-tabs {
  border-bottom: 1px solid rgba(128, 128, 128, 0.14);
}

.modding-tab {
  font-size: 13.5px !important;
  font-weight: 500 !important;
  letter-spacing: 0 !important;
}

.wip-alert {
  border: 1px dashed rgba(128, 128, 128, 0.22) !important;
}
</style>

