<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useExperienceStore } from '~/stores/experience';

const { t, locale } = useI18n();
const store = useExperienceStore();

/** Format 'YYYY-MM' → locale-aware short date (e.g. "giu 2016" / "Jun 2016") */
const formatDate = (iso: string): string => {
  if (!iso) return '';
  const parts = iso.split('-').map(Number);
  const year = parts[0] ?? new Date().getFullYear();
  const month = parts[1] ?? 1;
  return new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: 'short' })
    .format(new Date(year, month - 1, 1));
};

/** Calculate human-readable duration between two 'YYYY-MM' strings (to='' means now) */
const formatDuration = (from: string, to: string): string => {
  const fp = from.split('-').map(Number);
  const fy = fp[0] ?? 0;
  const fm = fp[1] ?? 1;
  const end = to
    ? { y: Number(to.split('-')[0]), m: Number(to.split('-')[1]) }
    : { y: new Date().getFullYear(), m: new Date().getMonth() + 1 };

  const total = (end.y - fy) * 12 + (end.m - fm);
  if (total <= 0) return t('home.timeline.duration.lessThanMonth');

  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];

  if (years > 0) parts.push(`${years} ${t(`home.timeline.duration.${years === 1 ? 'year' : 'years'}`)}`);
  if (months > 0) parts.push(`${months} ${t(`home.timeline.duration.${months === 1 ? 'month' : 'months'}`)}`);

  return parts.join(', ');
};

/** Chip color by type */
const typeChipColor: Record<string, string> = {
  community: 'info',
  volunteer: 'warning',
};

/** Reactive combined item list — re-evaluates on locale change */
const items = computed(() =>
  store.items.map(item => ({
    key: item.key,
    type: item.type,
    icon: store.getIcon(item.key),
    isOngoing: !item.to,
    website: item.website,
    role: t(`home.timeline.items.${item.key}.role`),
    company: t(`home.timeline.items.${item.key}.company`),
    description: t(`home.timeline.items.${item.key}.description`),
    formattedFrom: formatDate(item.from),
    formattedTo: item.to ? formatDate(item.to) : '',
    duration: formatDuration(item.from, item.to),
  })),
);

const gridRef = ref<HTMLElement | null>(null);
let revertAnimation: (() => void) | undefined;

onMounted(async () => {
  if (!import.meta.client) return;
  await nextTick();
  if (!gridRef.value) return;

  const cards = Array.from(gridRef.value.querySelectorAll<HTMLElement>('[data-exp-card]'));
  if (!cards.length) return;

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    gsap.from(cards, {
      opacity: 0,
      y: 28,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: gridRef.value as unknown as Element,
        start: 'top 82%',
        once: true,
      },
    });
  }, gridRef.value);

  revertAnimation = () => ctx.revert();
});

onBeforeUnmount(() => {
  revertAnimation?.();
});
</script>

<template>
  <section
      id="experience"
      class="section-block experience-section"
      aria-labelledby="experience-title"
  >
    <p class="text-overline text-primary font-weight-bold mb-3 jetbrain">{{ t('home.timeline.eyebrow') }}</p>
    <h2 id="experience-title" class="text-h4 font-weight-bold mb-3">{{ t('home.timeline.title') }}</h2>
    <p class="text-body-1 text-medium-emphasis mb-8">{{ t('home.timeline.description') }}</p>

    <div ref="gridRef">
        <v-row dense>
          <v-col v-for="item in items" :key="item.key" cols="12" md="6">
            <v-card data-exp-card class="experience-card h-100 pa-4 pa-md-5" rounded="xl" elevation="0">
              <div class="d-flex ga-3">
                <v-avatar
                  size="40"
                  rounded="lg"
                  color="primary"
                  variant="tonal"
                  class="flex-shrink-0"
                  style="margin-top: 3px;"
                >
                  <v-icon size="20">{{ item.icon }}</v-icon>
                </v-avatar>

                <div class="flex-1-1 overflow-hidden">
                  <!-- Role + chips -->
                  <div class="d-flex align-start justify-space-between gap-2 mb-1">
                    <div class="overflow-hidden">
                      <div class="text-body-1 font-weight-semibold">{{ item.role }}</div>
                      <a
                        :href="item.website"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="company-link text-body-2 text-medium-emphasis"
                      >
                        {{ item.company }}
                        <v-icon size="11" class="mb-1">mdi-open-in-new</v-icon>
                      </a>
                    </div>
                    <div class="d-flex flex-column align-end ga-1 flex-shrink-0">
                      <v-chip
                        v-if="item.type !== 'work'"
                        :color="typeChipColor[item.type]"
                        variant="tonal"
                        size="x-small"
                      >
                        {{ t(`home.timeline.types.${item.type}`) }}
                      </v-chip>
                    </div>
                  </div>

                  <!-- Date range + duration -->
                  <div class="d-flex align-center flex-wrap ga-1 mt-2 mb-2">
                    <span class="text-caption text-disabled">{{ item.formattedFrom }}</span>
                    <span class="text-caption text-disabled">–</span>
                    <span class="text-caption text-disabled">{{ item.formattedTo || t('home.timeline.present') }}</span>
                    <span class="text-caption text-disabled mx-1">·</span>
                    <span class="text-caption font-weight-medium text-medium-emphasis">{{ item.duration }}</span>
                  </div>

                  <!-- Description -->
                  <p class="text-body-2 text-medium-emphasis mb-0">{{ item.description }}</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
    </div>
  </section>
</template>

<style scoped>
.experience-card {
  background: linear-gradient(
    180deg,
    var(--home-card-top, rgba(255, 255, 255, 0.96)),
    var(--home-card-bottom, rgba(245, 248, 247, 0.88))
  );
  border: 1px solid var(--home-brand-soft, rgba(0, 168, 107, 0.12));
  transition: border-color 0.24s ease, box-shadow 0.24s ease;
}

.experience-card:hover {
  border-color: rgba(0, 168, 107, 0.22);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.company-link {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  position: relative;
  transition: color 0.2s ease;
}

.company-link::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: rgba(0, 168, 107, 1);
  transition: width 0.24s ease;
}

.company-link:hover {
  color: rgba(0, 168, 107, 1) !important;
}

.company-link:hover::after {
  width: 100%;
}
</style>
