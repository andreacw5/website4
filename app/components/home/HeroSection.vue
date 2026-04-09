<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, tm } = useI18n();
const localePath = useLocalePath();

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
</script>

<template>
  <section class="hero-section position-relative d-flex align-center" aria-labelledby="home-hero-title">
    <div class="hero-bg-box" aria-hidden="true"></div>

    <v-row align="center" class="position-relative section-row">
      <!-- Left column: text content -->
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
            <v-btn
              href="/CV_2024.pdf"
              download
              color="primary"
              variant="tonal"
              size="large"
              rounded="pill"
              prepend-icon="mdi-download"
            >
              {{ t('home.hero.downloadCv') }}
            </v-btn>
          </div>
        </v-responsive>
      </v-col>

      <!-- Right column: photo card -->
      <v-col cols="12" md="5" class="d-flex justify-md-end">
        <div class="hero-side-card">
          <div class="hero-photo-wrapper">
            <v-img
              src="https://file-harbor.com/api/v1/files/59eede5fb0b097a63e0eb276add71e83"
              :alt="t('home.about.portraitLabel')"
              cover
              class="hero-photo"
            />
            <v-chip
              color="primary"
              variant="tonal"
              size="small"
              class="experience-chip"
            >
              {{ yearsOfExperience }}+ {{ t('home.about.stats.experience') }}
            </v-chip>
          </div>
        </div>
      </v-col>
    </v-row>

    <a href="#about" class="scroll-indicator" :aria-label="t('home.hero.scrollLabel')">
      <v-icon size="30">mdi-chevron-double-down</v-icon>
    </a>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: calc(100dvh - 80px);
  padding: 2rem 1.25rem 2.5rem;
  isolation: isolate;
}

/* Rounded decorative box */
.hero-bg-box {
  position: absolute;
  inset: 0.5rem;
  border-radius: 2.25rem;
  border: 1px solid var(--home-brand-soft);
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.hero-bg-box::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/HT_Pattern_1.svg');
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.1;
}

.hero-bg-box::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 25% 45%, rgba(0, 168, 107, 0.07) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 75% 60%, rgba(0, 168, 107, 0.04) 0%, transparent 65%);
}

.section-row {
  z-index: 1;
}

.brand-mono {
  font-family: 'JetBrains Mono', 'SFMono-Regular', ui-monospace, monospace;
  letter-spacing: 0.12em;
}

.hero-intro {
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

/* Photo card */
.hero-side-card {
  width: min(100%, 400px);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
  border: 1px solid var(--home-brand-soft);
}

.hero-photo-wrapper {
  position: relative;
  width: 100%;
}

.hero-photo {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  max-height: 520px;
}

.experience-chip {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

/* Scroll indicator */
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
  z-index: 1;
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

@media (max-width: 959px) {
  .hero-section {
    min-height: auto;
    padding: 0.5rem 0.5rem 2rem;
  }

  .hero-bg-box {
    inset: 0.25rem;
    border-radius: 1.5rem;
  }


  .scroll-indicator {
    display: none;
  }

  .hero-side-card {
    width: 100%;
    max-width: 360px;
    margin-inline: auto;
  }

  .hero-photo {
    max-height: 380px;
  }
}
</style>

