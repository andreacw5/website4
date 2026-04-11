<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

useSeo(() => ({
  title: t('volunteering.seo.title'),
  description: t('volunteering.seo.description'),
  ogTitle: t('volunteering.seo.ogTitle'),
  ogDescription: t('volunteering.seo.ogDescription'),
  pageType: 'website',
  breadcrumb: [{ name: t('nav.volunteering'), url: '/volunteering' }],
}));

const reflectionPoints = [
  'volunteering.reflection.p1',
  'volunteering.reflection.p2',
  'volunteering.reflection.p3',
  'volunteering.reflection.p4',
] as const;
</script>

<template>
  <div class="volunteering-page page-fade-in">
    <v-container max-width="1280" class="px-4 px-md-6 py-8 py-md-12">

      <!-- ═══ SEZIONE 1: HERO ════════════════════════════════════ -->
      <LayoutPageTitle
        :eyebrow="t('volunteering.hero.eyebrow')"
        :title="t('volunteering.hero.title')"
        :description="t('volunteering.hero.subtitle')"
        title-id="vol-hero-title"
        :mb="8"
      />

      <!-- ═══ SEZIONE 2: TIMELINE ════════════════════════════════ -->
      <section class="mb-20">
        <VolunteeringTimeline />
      </section>

      <!-- ═══ SEZIONE 3: PROGETTI ════════════════════════════════ -->
      <section class="mb-20">
        <VolunteeringProjects />
      </section>

      <!-- ═══ SEZIONE 4: RIFLESSIONE ════════════════════════════ -->
      <section class="vol-reflection mb-20" aria-labelledby="reflection-heading">
        <div class="reflection-inner mx-auto">
          <p class="text-overline text-primary font-weight-bold mb-3 brand-mono d-flex align-center ga-1 justify-center">
            <v-icon size="16" color="primary">mdi-lightbulb-outline</v-icon>
            {{ t('volunteering.reflection.eyebrow') }}
          </p>
          <h2 id="reflection-heading" class="text-h5 font-weight-bold mb-8 text-center">
            {{ t('volunteering.reflection.title') }}
          </h2>

          <p
            v-for="key in reflectionPoints"
            :key="key"
            class="reflection-paragraph text-medium-emphasis mb-5"
          >
            {{ t(key) }}
          </p>
        </div>
      </section>

      <!-- ═══ SEZIONE 5: OGGI + CTA ══════════════════════════════ -->
      <section class="vol-today mb-8" aria-labelledby="today-heading">
        <v-card rounded="xl" elevation="0" class="today-card pa-8 pa-md-12">
          <p class="text-overline text-primary font-weight-bold mb-3 brand-mono d-flex align-center ga-1">
            <v-icon size="16" color="primary">mdi-calendar-today</v-icon>
            {{ t('volunteering.today.eyebrow') }}
          </p>
          <h2 id="today-heading" class="text-h5 font-weight-bold mb-4">
            {{ t('volunteering.today.title') }}
          </h2>
          <p class="text-body-1 text-medium-emphasis today-text mb-8">
            {{ t('volunteering.today.text') }}
          </p>

          <div class="d-flex flex-wrap ga-3">
            <v-btn
              color="primary"
              size="large"
              :to="localePath('/contacts')"
              rounded="lg"
            >
              {{ t('volunteering.cta.primary') }}
            </v-btn>
            <v-btn
              variant="outlined"
              color="primary"
              size="large"
              href="https://procivsettimomi.it"
              target="_blank"
              rel="noopener noreferrer"
              append-icon="mdi-open-in-new"
              rounded="lg"
            >
              {{ t('volunteering.cta.secondary') }}
            </v-btn>
          </div>
        </v-card>
      </section>

    </v-container>
  </div>
</template>

<style scoped>
/* ── Card gradient vars (matching homepage) ────────────── */
.volunteering-page {
  --home-card-top:    rgba(255, 255, 255, 0.96);
  --home-card-bottom: rgba(245, 248, 247, 0.88);
  --home-brand-soft:  rgba(0, 168, 107, 0.12);
}

:global(.v-theme--dark) .volunteering-page {
  --home-card-top:    rgba(22, 27, 26, 0.96);
  --home-card-bottom: rgba(15, 20, 19, 0.88);
  --home-brand-soft:  rgba(0, 168, 107, 0.18);
}

/* ── Page fade-in on load ──────────────────────────────── */
@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.page-fade-in {
  animation: pageFadeIn 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .page-fade-in {
    animation: none;
  }
}

/* ── Brand mono ────────────────────────────────────────── */
.brand-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.08em;
}

/* ── Hero ──────────────────────────────────────────────── */
.vol-hero-subtitle {
  line-height: 1.8;
  font-size: 1.1rem;
}

/* ── Spacing helper ────────────────────────────────────── */
.mb-20 {
  margin-bottom: 5rem;
}

/* ── Reflection section ────────────────────────────────── */
.vol-reflection {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  padding-top: 4rem;
}

.reflection-paragraph {
  font-size: 1.05rem;
  line-height: 1.85;
  padding-left: 1.1rem;
  border-left: 2px solid rgba(var(--v-theme-primary), 0.4);
}

/* ── Today card ────────────────────────────────────────── */
.today-card {
  background: linear-gradient(
    180deg,
    var(--home-card-top, rgba(255, 255, 255, 0.96)),
    var(--home-card-bottom, rgba(245, 248, 247, 0.88))
  );
  border: 1px solid var(--home-brand-soft, rgba(0, 168, 107, 0.12));
  position: relative;
  overflow: hidden;
}

.today-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/HT_Pattern_1.svg');
  background-size: 140%;
  background-position: center;
  opacity: 0.04;
  pointer-events: none;
}

.today-text {
  line-height: 1.8;
}
</style>

