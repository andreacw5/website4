<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: t('utilities.seo.title'),
  description: t('utilities.seo.description'),
  ogTitle: t('utilities.seo.ogTitle'),
  ogDescription: t('utilities.seo.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

interface UtilityCategory {
  key: string;
  route: string;
  icon: string;
  accentColor: string;
  eyebrowKey: string;
  titleKey: string;
  descriptionKey: string;
}

const categories: UtilityCategory[] = [
  {
    key: 'moddingBackup',
    route: '/utilities/modding-backup',
    icon: 'mdi-controller-classic',
    accentColor: 'primary',
    eyebrowKey: 'utilities.categories.moddingBackup.eyebrow',
    titleKey: 'utilities.categories.moddingBackup.title',
    descriptionKey: 'utilities.categories.moddingBackup.description',
  },
  {
    key: 'arma3',
    route: '/utilities/arma3-altis-life',
    icon: 'mdi-pistol',
    accentColor: 'deep-orange',
    eyebrowKey: 'utilities.categories.arma3.eyebrow',
    titleKey: 'utilities.categories.arma3.title',
    descriptionKey: 'utilities.categories.arma3.description',
  },
  {
    key: 'starCitizen',
    route: '/utilities/star-citizen-hangar',
    icon: 'mdi-rocket-launch-outline',
    accentColor: 'blue',
    eyebrowKey: 'utilities.categories.starCitizen.eyebrow',
    titleKey: 'utilities.categories.starCitizen.title',
    descriptionKey: 'utilities.categories.starCitizen.description',
  },
];

// GSAP entrance animation
const gridRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  if (!import.meta.client || !gridRef.value) return;
  const { gsap } = await import('gsap');
  gsap.fromTo(
    gridRef.value.querySelectorAll<HTMLElement>('[data-cat-card]'),
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
  );
});
</script>

<template>
  <div class="utilities-page">
    <v-container max-width="1280" class="px-4 px-md-6 py-8 py-md-12">

      <!-- ─── Hero ─────────────────────────────────────────────── -->
      <section class="utilities-hero mb-10" aria-labelledby="utilities-title">
        <p class="text-overline text-primary font-weight-bold mb-2 brand-mono">
          {{ t('utilities.hero.eyebrow') }}
        </p>
        <h1 id="utilities-title" class="text-h3 font-weight-bold mb-4">
          {{ t('utilities.hero.title') }}
        </h1>
        <p class="text-body-1 text-medium-emphasis utilities-hero-desc">
          {{ t('utilities.hero.description') }}
        </p>
      </section>

      <!-- ─── Category cards ───────────────────────────────────── -->
      <section ref="gridRef" aria-label="Utility categories">
        <v-row>
          <v-col
            v-for="cat in categories"
            :key="cat.key"
            cols="12"
            sm="6"
            lg="4"
            data-cat-card
          >
            <v-card
              :to="localePath(cat.route)"
              class="category-card glass-card h-100"
              rounded="xl"
            >
              <div class="pa-6 d-flex flex-column h-100">

                <!-- Icon + eyebrow -->
                <div class="d-flex align-center ga-3 mb-4">
                  <v-avatar :color="cat.accentColor" variant="tonal" size="48" rounded="lg">
                    <v-icon size="24">{{ cat.icon }}</v-icon>
                  </v-avatar>
                  <span class="text-overline font-weight-bold brand-mono" :class="`text-${cat.accentColor}`">
                    {{ t(cat.eyebrowKey) }}
                  </span>
                </div>

                <!-- Title + description -->
                <h2 class="text-h6 font-weight-bold mb-2">{{ t(cat.titleKey) }}</h2>
                <p class="text-body-2 text-medium-emphasis flex-grow-1 mb-4">
                  {{ t(cat.descriptionKey) }}
                </p>

                <!-- CTA -->
                <div class="d-flex align-center justify-end">
                  <v-icon size="20" :color="cat.accentColor" class="arrow-icon">mdi-arrow-right</v-icon>
                </div>

              </div>
            </v-card>
          </v-col>
        </v-row>
      </section>

    </v-container>
  </div>
</template>

<style scoped>
.utilities-page {
  min-height: calc(100dvh - 80px);
}

.brand-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.1em;
}

.utilities-hero-desc {
  max-width: 640px;
}

/* ── Category card ─────────────────────────────────────── */
.category-card {
  text-decoration: none;
  transition: border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
}

.category-card:hover .arrow-icon {
  transform: translateX(4px);
  transition: transform 0.22s ease;
}

.arrow-icon {
  transition: transform 0.22s ease;
}
</style>
