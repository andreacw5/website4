<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TimelineItem } from '~/types/volunteering';

const { t } = useI18n();

const rawItems: TimelineItem[] = [
  {
    year: '2015',
    icon: 'mdi-hand-heart',
    titleKey: 'volunteering.timeline.items.volunteer.title',
    descriptionKey: 'volunteering.timeline.items.volunteer.description',
    chipKey: 'volunteering.timeline.chips.operational',
    chipColor: 'primary',
  },
  {
    year: '2021',
    icon: 'mdi-account-hard-hat',
    titleKey: 'volunteering.timeline.items.squadLeader.title',
    descriptionKey: 'volunteering.timeline.items.squadLeader.description',
    chipKey: 'volunteering.timeline.chips.management',
    chipColor: 'warning',
  },
  {
    year: '2022',
    icon: 'mdi-vote',
    titleKey: 'volunteering.timeline.items.councillor.title',
    descriptionKey: 'volunteering.timeline.items.councillor.description',
    chipKey: 'volunteering.timeline.chips.management',
    chipColor: 'warning',
  },
  {
    year: '2022–2025',
    icon: 'mdi-bullhorn',
    titleKey: 'volunteering.timeline.items.communications.title',
    descriptionKey: 'volunteering.timeline.items.communications.description',
    chipKey: 'volunteering.timeline.chips.communication',
    chipColor: 'info',
  },
  {
    year: '2026',
    icon: 'mdi-city',
    titleKey: 'volunteering.timeline.items.milan.title',
    descriptionKey: 'volunteering.timeline.items.milan.description',
    chipKey: 'volunteering.timeline.chips.operational',
    chipColor: 'primary',
  },
];

// Intersection observer for stagger animation
const itemRefs = ref<any[]>([]);
const visibleItems = ref<boolean[]>(rawItems.map(() => false));
let observers: IntersectionObserver[] = [];

onMounted(() => {
  itemRefs.value.forEach((el, index) => {
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          // Stagger 150ms between each item
          setTimeout(() => {
            visibleItems.value[index] = true;
          }, index * 150);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el as unknown as Element);
    observers.push(obs);
  });
});

onBeforeUnmount(() => {
  observers.forEach((obs) => obs.disconnect());
  observers = [];
});
</script>

<template>
  <section class="vol-timeline-section" aria-labelledby="timeline-heading">
    <p class="text-overline text-primary font-weight-bold mb-3 brand-mono d-flex align-center ga-1">
      <v-icon size="16" color="primary">mdi-timeline-outline</v-icon>
      {{ t('volunteering.timeline.eyebrow') }}
    </p>
    <h2 id="timeline-heading" class="text-h5 font-weight-bold mb-8">
      {{ t('volunteering.timeline.title') }}
    </h2>

    <div class="tl-list">
      <div
        v-for="(item, index) in rawItems"
        :key="index"
        :ref="(el) => { if (el) itemRefs[index] = el }"
        class="tl-list-item tl-animate"
        :class="{ 'tl-enter': visibleItems[index] }"
      >
        <!-- connector line -->
        <div class="tl-connector">
          <div class="tl-dot">
            <v-icon :icon="item.icon" size="16" color="primary" />
          </div>
          <div v-if="index < rawItems.length - 1" class="tl-line" />
        </div>

        <!-- card -->
        <v-card rounded="xl" elevation="0" class="timeline-card flex-grow-1 mb-6">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-2">
              <span class="text-caption font-weight-bold text-primary brand-mono">{{ item.year }}</span>
              <v-chip size="x-small" :color="item.chipColor" variant="tonal" label>
                {{ t(item.chipKey) }}
              </v-chip>
            </div>
            <div class="text-body-1 font-weight-semibold mb-1">{{ t(item.titleKey) }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ t(item.descriptionKey) }}</div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </section>
</template>

<style scoped>
.brand-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.08em;
}

/* ── List layout ───────────────────────────────────────── */
.tl-list {
  display: flex;
  flex-direction: column;
}

.tl-list-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

/* dot + vertical line */
.tl-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 0.75rem;
}

.tl-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.12);
  border: 2px solid rgba(var(--v-theme-primary), 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tl-line {
  width: 2px;
  flex: 1;
  min-height: 1.5rem;
  background: rgba(var(--v-theme-primary), 0.2);
  margin-top: 6px;
  margin-bottom: 0;
}

/* ── Card ──────────────────────────────────────────────── */
.timeline-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    var(--home-card-top, rgba(255, 255, 255, 0.96)),
    var(--home-card-bottom, rgba(245, 248, 247, 0.88))
  );
  border: 1px solid var(--home-brand-soft, rgba(0, 168, 107, 0.12));
}

/* Pattern SVG in top-right corner */
.timeline-card::after {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 220px;
  height: 220px;
  background-image: url('/HT_Pattern_1.svg');
  background-size: 130%;
  background-position: center;
  opacity: 0.08;
  pointer-events: none;
}

/* ── Entrance animation ────────────────────────────────── */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-28px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tl-animate {
  opacity: 0;
}

.tl-animate.tl-enter {
  animation: slideInLeft 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .tl-animate {
    opacity: 1;
    animation: none !important;
  }
}
</style>

