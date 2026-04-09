<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useSeoMeta({
  title: t('travels.seo.title'),
  description: t('travels.seo.description'),
  ogTitle: t('travels.seo.ogTitle'),
  ogDescription: t('travels.seo.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

const { data: travels } = await useAsyncData('travels-list', () =>
  queryCollection('travels').order('created_at', 'DESC').all(),
);

// GSAP entrance animation
const gridRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  if (!import.meta.client || !gridRef.value) return;
  const gsapMod = await import('gsap');
  const cards = Array.from(gridRef.value.querySelectorAll<HTMLElement>('[data-travel-card]'));
  if (!cards.length) return;
  gsapMod.gsap.fromTo(
    cards,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 },
  );
});
</script>

<template>
  <div class="travels-page">
    <v-container max-width="1280" class="px-4 px-md-6 py-8 py-md-12">

      <!-- ─── Hero ─────────────────────────────────────────────── -->
      <section class="travels-hero mb-10" aria-labelledby="travels-title">
        <p class="text-overline text-primary font-weight-bold mb-2 brand-mono">
          {{ t('travels.hero.eyebrow') }}
        </p>
        <h1 id="travels-title" class="text-h3 font-weight-bold mb-4">
          {{ t('travels.hero.title') }}
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          {{ t('travels.hero.description') }}
        </p>
      </section>

      <!-- ─── Grid viaggi ───────────────────────────────────────── -->
      <section ref="gridRef" aria-label="Elenco viaggi">

        <!-- Skeleton durante il fetch -->
        <v-row v-if="!travels">
          <v-col v-for="i in 6" :key="i" cols="12" sm="6" lg="4">
            <v-skeleton-loader type="card" rounded="xl" />
          </v-col>
        </v-row>

        <!-- Empty state -->
        <v-empty-state
          v-else-if="travels.length === 0"
          icon="mdi-map-marker-off-outline"
          :title="t('travels.empty.title')"
          :text="t('travels.empty.description')"
          class="empty-state"
        />

        <!-- Griglia card -->
        <v-row v-else>
          <v-col
            v-for="travel in travels"
            :key="travel.path"
            cols="12"
            sm="6"
            lg="4"
            data-travel-card
          >
            <TravelsTravelCard
              :title="travel.title"
              :short="travel.short"
              :cover="travel.cover"
              :created-at="travel.created_at"
              :has-gallery="!!travel.gallery?.length"
            />
          </v-col>
        </v-row>

      </section>
    </v-container>
  </div>
</template>

<style scoped>
.travels-page {
  min-height: calc(100dvh - 80px);
}

.brand-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.1em;
}

.empty-state {
  margin: 80px auto;
  padding: 48px 32px;
  max-width: 480px;
  border-radius: 24px;
  border: 1px dashed rgba(128, 128, 128, 0.2);
  background: rgba(128, 128, 128, 0.03);
}
</style>
