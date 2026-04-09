<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '~/stores/theme';


const { t, tm } = useI18n();
const localePath = useLocalePath();
const themeStore = useThemeStore();

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (value && typeof value === 'object') {
    return Object.values(value).filter((item): item is string => typeof item === 'string');
  }

  return [];
};

const careerStartYear = 2016;
const yearsOfExperience = new Date().getFullYear() - careerStartYear;

const typedLines = computed(() => toStringArray(tm('home.hero.typed')));




const { text: typedText } = useTypewriter(typedLines, {
  typingSpeed: 64,
  deletingSpeed: 30,
  pauseMs: 1700,
  initialDelayMs: 400,
});

const heroPatternStyle = computed(() => {
  const stroke = themeStore.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,168,107,0.14)';
  const fill = themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,168,107,0.025)';
  const svg = `
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="12" width="136" height="136" rx="24" stroke="${stroke}" />
      <path d="M24 104C44 92 60 56 80 56C100 56 116 104 136 104" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="56" cy="56" r="8" fill="${fill}" stroke="${stroke}" />
      <circle cx="112" cy="112" r="10" fill="${fill}" stroke="${stroke}" />
    </svg>
  `;

  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
  };
});

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
      <section class="hero-section position-relative d-flex align-center" aria-labelledby="home-hero-title">
        <div class="hero-pattern" :style="heroPatternStyle" aria-hidden="true" />

        <v-row align="center" class="position-relative section-row">
          <v-col cols="12" md="7">
            <v-responsive max-width="720">
              <p class="text-overline text-primary font-weight-bold mb-3 brand-mono">{{ t('app.brand') }}</p>
              <h1 id="home-hero-title" class="text-h2 font-weight-bold mb-4">Andrea Tombolato</h1>
              <p class="text-h5 text-primary font-weight-medium mb-5">{{ t('home.hero.role') }}</p>
              <p class="text-body-1 text-medium-emphasis hero-intro mb-6">
                {{ t('home.hero.intro') }}
              </p>

              <div class="typewriter-line mb-8" aria-live="polite">
                <span>{{ typedText }}</span>
                <span class="typewriter-cursor" aria-hidden="true">|</span>
              </div>

              <div class="d-flex flex-wrap ga-3">
                <v-btn :to="localePath('/portfolio')" color="primary" size="large" rounded="pill" elevation="0">
                  {{ t('home.hero.portfolioCta') }}
                </v-btn>
                <v-btn :to="localePath('/contatti')" color="primary" variant="outlined" size="large" rounded="pill">
                  {{ t('home.hero.contactsCta') }}
                </v-btn>
              </div>
            </v-responsive>
          </v-col>

          <v-col cols="12" md="5" class="d-flex justify-md-end">
            <v-card class="hero-side-card pa-6 pa-md-8" rounded="xl" variant="text">
              <div class="d-flex flex-column ga-4">
                <v-chip color="primary" variant="tonal" size="small" class="align-self-start">
                  {{ yearsOfExperience }}+ {{ t('home.about.stats.experience') }}
                </v-chip>

                <div>
                  <div class="text-h6 font-weight-semibold mb-2">Node.js · Grails · Nest.js · Vue · Nuxt · Java</div>
                  <p class="text-body-2 text-medium-emphasis">
                    {{ t('home.skills.description') }}
                  </p>
                </div>

                <v-divider />

                <div class="hero-facts d-grid ga-3">
                  <v-sheet rounded="xl" class="fact-card pa-4" color="surface">
                    <div class="text-caption text-medium-emphasis mb-1">{{ t('home.heroFacts.medasLabel') }}</div>
                    <div class="text-body-1 font-weight-medium">{{ t('home.heroFacts.medasValue') }}</div>
                  </v-sheet>
                  <v-sheet rounded="xl" class="fact-card pa-4" color="surface">
                    <div class="text-caption text-medium-emphasis mb-1">{{ t('home.heroFacts.communityLabel') }}</div>
                    <div class="text-body-1 font-weight-medium">{{ t('home.heroFacts.communityValue') }}</div>
                  </v-sheet>
                  <v-sheet rounded="xl" class="fact-card pa-4" color="surface">
                    <div class="text-caption text-medium-emphasis mb-1">{{ t('home.heroFacts.civilProtectionLabel') }}</div>
                    <div class="text-body-1 font-weight-medium">{{ t('home.heroFacts.civilProtectionValue') }}</div>
                  </v-sheet>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <a href="#about" class="scroll-indicator" :aria-label="t('home.hero.scrollLabel')">
          <v-icon size="30">mdi-chevron-double-down</v-icon>
        </a>
      </section>

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

.section-row {
  z-index: 1;
}

.hero-section {
  min-height: calc(100dvh - 80px);
  padding-block: 4rem 5.5rem;
}

.hero-pattern {
  position: absolute;
  inset: 8% -3% auto auto;
  width: min(38vw, 420px);
  aspect-ratio: 1;
  opacity: 0.8;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  pointer-events: none;
}

.brand-mono {
  font-family: 'JetBrains Mono', 'SFMono-Regular', ui-monospace, monospace;
  letter-spacing: 0.12em;
}

.hero-intro,
.about-copy {
  max-width: 68ch;
}

.typewriter-line {
  min-height: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--home-text-strong);
}

.typewriter-cursor {
  display: inline-block;
  margin-left: 0.15rem;
  color: var(--home-brand);
  animation: blink 1s steps(1) infinite;
}

.hero-side-card,
.about-portrait-card,
.fact-card,
.about-stat {
  background:
    linear-gradient(180deg, var(--home-card-top), var(--home-card-bottom));
  border: 1px solid var(--home-brand-soft);
}

.hero-side-card {
  width: min(100%, 460px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
}

.hero-facts {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.portrait-initials {
  font-size: 2.75rem;
  font-weight: 700;
  color: var(--home-brand);
}

.section-block {
  padding-block: 4rem;
}



.scroll-indicator {
  position: absolute;
  left: 50%;
  bottom: 1rem;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--home-text-soft);
  animation: pulseDown 1.8s ease-in-out infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }

  50.01%,
  100% {
    opacity: 0;
  }
}

@keyframes pulseDown {
  0%,
  100% {
    opacity: 0.35;
    transform: translateX(-50%) translateY(0);
  }

  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(6px);
  }
}

@media (min-width: 960px) {
  .hero-facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 959px) {
  .hero-section {
    min-height: auto;
    padding-top: 3rem;
  }

  .hero-pattern {
    inset: 0 auto auto 50%;
    width: 72vw;
    transform: translateX(-50%);
    opacity: 0.55;
  }

  .scroll-indicator {
    display: none;
  }
}
</style>
