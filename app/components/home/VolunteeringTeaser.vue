<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!sectionRef.value) return;
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        isVisible.value = true;
        observer?.disconnect();
      }
    },
    { threshold: 0.1 },
  );
  observer.observe(sectionRef.value as unknown as Element);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

const volunteeringSince = 2015;
const yearsOfVolunteering = new Date().getFullYear() - volunteeringSince;

const stats = [
  { value: String(yearsOfVolunteering), key: 'stat_years', icon: 'mdi-clock-outline', delay: 0 },
  { value: '3', key: 'stat_roles', icon: 'mdi-account-star-outline', delay: 100 },
  { value: '0€', key: 'stat_salary', icon: 'mdi-hand-heart-outline', delay: 200 },
];
</script>

<template>
  <section
    id="volunteering"
    ref="sectionRef"
    class="section-block volunteering-section"
    aria-labelledby="volunteering-title"
  >
    <v-row align="start" class="vol-row">

      <!-- ── Left: text content ──────────────────────────────── -->
      <v-col cols="12" md="7" order="1" class="vol-text-col">
        <!-- Eyebrow -->
        <div class="vol-animate" :class="{ 'vol-enter': isVisible }">
          <p class="text-overline text-primary font-weight-bold mb-3 jetbrain d-flex align-center ga-1">
            <v-icon size="16" color="primary" class="mr-1">mdi-shield-account</v-icon>
            {{ t('home.volunteering.eyebrow') }}
          </p>
          <h2 id="volunteering-title" class="text-h4 font-weight-bold mb-6">
            {{ t('home.volunteering.title') }}
          </h2>
        </div>

        <!-- Paragraphs -->
        <p
          class="text-body-1 text-medium-emphasis vol-para vol-para--accent mb-5 vol-animate"
          :class="{ 'vol-enter': isVisible }"
          style="animation-delay: 0.08s"
        >
          {{ t('home.volunteering.p1') }}
        </p>

        <p
          class="text-body-1 text-medium-emphasis vol-para mb-5 vol-animate"
          :class="{ 'vol-enter': isVisible }"
          style="animation-delay: 0.16s"
        >
          {{ t('home.volunteering.p2') }}
        </p>

        <p
          class="text-body-1 text-medium-emphasis vol-para mb-8 vol-animate"
          :class="{ 'vol-enter': isVisible }"
          style="animation-delay: 0.24s"
        >
          {{ t('home.volunteering.p3') }}
        </p>

        <!-- CTAs -->
        <div
          class="d-flex flex-wrap gap-3 vol-animate"
          :class="{ 'vol-enter': isVisible }"
          style="animation-delay: 0.32s"
        >
          <v-btn
            color="primary"
            rounded="lg"
            size="large"
          :to="localePath('/volunteering')"
            class="vol-btn"
          >
            {{ t('home.volunteering.cta_primary') }}
          </v-btn>

          <v-btn
            variant="outlined"
            color="primary"
            rounded="lg"
            size="large"
            href="https://procivsettimomi.it"
            target="_blank"
            rel="noopener noreferrer"
            append-icon="mdi-open-in-new"
            class="vol-btn"
          >
            {{ t('home.volunteering.cta_secondary') }}
          </v-btn>
        </div>
      </v-col>

      <!-- ── Right: stat cards ──────────────────────────────── -->
      <v-col cols="12" md="5" order="2">
        <div class="vol-stats-grid">
          <v-card
            v-for="stat in stats"
            :key="stat.key"
            variant="tonal"
            color="primary"
            rounded="xl"
            class="stat-card vol-animate"
            :class="{ 'vol-enter': isVisible }"
            :style="{ animationDelay: `${0.1 + stat.delay / 1000}s` }"
          >
            <v-card-text class="stat-card-inner">
              <v-icon size="20" color="primary" class="stat-icon">{{ stat.icon }}</v-icon>
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label text-medium-emphasis jetbrain">{{ t(`home.volunteering.${stat.key}`) }}</span>
            </v-card-text>
          </v-card>
        </div>
      </v-col>

    </v-row>
  </section>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────────── */
.section-block {
  padding-block: 4rem;
}

.vol-row {
  row-gap: 2.5rem;
}

/* ── Text ─────────────────────────────────────────────────── */
.vol-para {
  max-width: 62ch;
  line-height: 1.85;
}

@media (min-width: 1280px) {
  .vol-text-col {
    border-left: 3px solid rgba(0, 168, 107, 1);
    padding-left: 1.75rem;
  }
}

.vol-para--accent {
  padding-left: 1.1rem;
  border-left: 2px solid rgba(0, 168, 107, 1);
}

@media (min-width: 1280px) {
  .vol-para--accent {
    border-left: none;
    padding-left: 0;
  }
}

/* ── Stat grid ────────────────────────────────────────────── */
.vol-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

@media (min-width: 960px) {
  .vol-stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    max-width: 360px;
    margin-left: auto;
  }
}

/* ── Stat card ────────────────────────────────────────────── */
.stat-card {
  transition: transform 0.24s ease, box-shadow 0.24s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 168, 107, 0.18);
}

.stat-card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
  padding: 1rem 0.5rem !important;
}

@media (min-width: 960px) {
  .stat-card-inner {
    flex-direction: row;
    text-align: left;
    gap: 1rem;
    padding: 1.25rem 1.25rem !important;
  }
}

.stat-icon {
  flex-shrink: 0;
  opacity: 0.85;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1;
  color: rgba(0, 168, 107, 1);
}

@media (min-width: 960px) {
  .stat-value {
    font-size: 1.75rem;
  }
}

.stat-label {
  font-size: 0.7rem;
  line-height: 1.3;
  letter-spacing: 0.01em;
}

@media (min-width: 960px) {
  .stat-label {
    font-size: 0.8rem;
  }
}

/* ── CTA buttons ──────────────────────────────────────────── */
.vol-btn {
  transition: transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1),
              box-shadow 0.22s ease !important;
}

.vol-btn:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 24px rgba(0, 168, 107, 0.28) !important;
}

.vol-btn:active {
  transform: translateY(-1px) !important;
}

/* ── Entrance animation ───────────────────────────────────── */
@keyframes volFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.vol-animate {
  opacity: 0;
}

.vol-animate.vol-enter {
  animation: volFadeUp 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .vol-animate {
    opacity: 1;
    animation: none !important;
    transition: none !important;
  }
  .vol-btn {
    transition: none !important;
  }
}

/* ── Gap utility ──────────────────────────────────────────── */
.gap-3 {
  gap: 0.75rem;
}
</style>

