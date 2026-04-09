<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: `${t('utilities.categories.arma3.title')} · ${t('utilities.seo.title')}`,
  description: t('utilities.categories.arma3.description'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

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
        color="deep-orange"
        prepend-icon="mdi-arrow-left"
        class="text-none mb-6 back-btn"
        size="small"
      >
        {{ t('utilities.back') }}
      </v-btn>

      <!-- ─── Hero ─────────────────────────────────────────────── -->
      <section class="sub-hero mb-8" aria-labelledby="page-title">
        <div class="d-flex align-center ga-3 mb-4">
          <v-avatar color="deep-orange" variant="tonal" size="52" rounded="lg">
            <v-icon size="26">mdi-pistol</v-icon>
          </v-avatar>
          <div>
            <p class="text-overline text-deep-orange font-weight-bold mb-0 brand-mono" style="line-height:1">
              {{ t('utilities.categories.arma3.eyebrow') }}
            </p>
            <h1 id="page-title" class="text-h4 font-weight-bold">
              {{ t('utilities.categories.arma3.title') }}
            </h1>
          </div>
        </div>
        <p class="text-body-1 text-medium-emphasis sub-hero-desc">
          {{ t('utilities.categories.arma3.description') }}
        </p>
      </section>

      <!-- ─── Content ──────────────────────────────────────────── -->
      <div ref="contentRef">
        <v-card class="glass-card pa-6" rounded="xl">
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

.wip-alert {
  border: 1px dashed rgba(128, 128, 128, 0.22) !important;
}
</style>

