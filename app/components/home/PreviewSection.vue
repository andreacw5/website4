<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

const previewSection = ref<HTMLElement | null>(null);

const previewCards = computed(() => [
  {
    key: 'portfolio',
    icon: 'mdi-briefcase-outline',
    to: localePath('/projects'),
  },
  {
    key: 'uses',
    icon: 'mdi-laptop',
    to: localePath('/uses'),
  },
  {
    key: 'travels',
    icon: 'mdi-map-marker-path',
    to: localePath('/travels'),
  },
]);

let revertPreviewAnimation: (() => void) | undefined;

onMounted(async () => {
  if (!import.meta.client) return;

  await nextTick();

  if (!previewSection.value) return;

  const cards = Array.from(previewSection.value.querySelectorAll<HTMLElement>('[data-preview-card]'));

  if (!cards.length) return;

  const gsapModule = await import('gsap');
  const scrollTriggerModule = await import('gsap/ScrollTrigger');
  const gsap = gsapModule.gsap;
  const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

  gsap.registerPlugin(ScrollTrigger);

  const context = gsap.context(() => {
    gsap.from(cards, {
      opacity: 0,
      y: 42,
      duration: 0.85,
      ease: 'power2.out',
      stagger: 0.14,
      scrollTrigger: {
        trigger: previewSection.value as unknown as Element,
        start: 'top 78%',
        once: true,
      },
    });
  }, previewSection.value);

  revertPreviewAnimation = () => context.revert();
});

onBeforeUnmount(() => {
  revertPreviewAnimation?.();
});
</script>

<template>
  <section
    id="preview"
    ref="previewSection"
    class="section-block preview-section"
    aria-labelledby="preview-title"
  >
    <p class="text-overline text-primary font-weight-bold mb-3 jetbrain">{{ t('home.preview.eyebrow') }}</p>
    <h2 id="preview-title" class="text-h4 font-weight-bold mb-3">{{ t('home.preview.title') }}</h2>
    <p class="text-body-1 text-medium-emphasis mb-8">{{ t('home.preview.description') }}</p>

    <v-row>
      <v-col v-for="card in previewCards" :key="card.key" cols="12" md="4">
        <div class="h-100" data-preview-card>
          <v-card class="preview-card h-100" rounded="xl" elevation="0">
            <v-card-text class="pa-6 d-flex flex-column h-100">
              <v-avatar size="52" rounded="xl" color="primary" variant="tonal" class="mb-6 preview-avatar">
                <v-icon size="24" class="preview-icon">{{ card.icon }}</v-icon>
              </v-avatar>

              <div class="text-h6 font-weight-semibold mb-3">
                {{ t(`home.preview.cards.${card.key}.title`) }}
              </div>
              <p class="text-body-2 text-medium-emphasis mb-6 flex-grow-1">
                {{ t(`home.preview.cards.${card.key}.description`) }}
              </p>

              <v-card-actions class="pa-0 pt-2">
                <v-btn :to="card.to" variant="text" color="primary" class="px-0 jetbrain" size="small">
                  {{ t('home.preview.cta') }}
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<style scoped>
.section-block {
  padding-block: 4rem;
}

.preview-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    var(--home-card-top, rgba(255, 255, 255, 0.96)),
    var(--home-card-bottom, rgba(245, 248, 247, 0.88))
  );
  border: 1px solid var(--home-brand-soft, rgba(0, 168, 107, 0.12));
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
}

.preview-card::after {
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

.preview-card:hover::after {
  opacity: 0.07;
}

.preview-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0, 168, 107, 0.22);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.12);
}

.preview-avatar {
  transition: box-shadow 0.25s ease;
}

.preview-card:hover .preview-avatar {
  box-shadow: 0 0 0 6px rgba(0, 168, 107, 0.14);
}

.preview-icon {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.preview-card:hover .preview-icon {
  transform: scale(1.35);
}
</style>

