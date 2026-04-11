<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, tm, rt } = useI18n();
const localePath = useLocalePath();

const careerStartYear = 2016;
const yearsOfExperience = new Date().getFullYear() - careerStartYear;

const typedLines = computed<string[]>(() => {
  const raw = (tm as (key: string) => unknown)('home.hero.typed');
  const arr: unknown[] = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object'
      ? Object.values(raw as Record<string, unknown>)
      : [];
  return arr.map(item => rt(item as Parameters<typeof rt>[0])).filter(s => s.length > 0);
});

const { text: typedText } = useTypewriter(typedLines, {
  typingSpeed: 64,
  deletingSpeed: 30,
  pauseMs: 1700,
  initialDelayMs: 400,
});

const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref<'info' | 'success' | 'error'>('info');

const downloadCv = async () => {
  snackbarText.value = t('home.hero.cvDownloadStarted');
  snackbarColor.value = 'info';
  snackbar.value = true;

  try {
    const response = await fetch('/CV_2024.pdf');
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CV_2024.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    snackbarText.value = t('home.hero.cvDownloadDone');
    snackbarColor.value = 'success';
    snackbar.value = true;
  } catch {
    snackbarText.value = t('home.hero.cvDownloadError');
    snackbarColor.value = 'error';
    snackbar.value = true;
  }
};
</script>

<template>
  <section class="hero-section position-relative d-flex align-center" aria-labelledby="home-hero-title">

    <v-row align="center" class="position-relative section-row">
      <!-- Left column: text content -->
      <v-col cols="12" md="5" order="2" order-md="1">
        <v-responsive max-width="600">
          <p class="text-overline text-primary font-weight-bold mb-2 brand-mono">{{ t('home.hero.greeting') }}</p>
          <h1 id="home-hero-title" class="text-h3 font-weight-bold mb-4">{{ t('home.hero.name') }}</h1>
          <p class="text-h5 text-primary font-weight-medium mb-5 brand-mono">{{ t('home.hero.role') }}</p>
          <p class="text-body-1 text-medium-emphasis hero-intro mb-6">
            {{ t('home.hero.intro') }}
          </p>

          <div class="typewriter-line mb-8" aria-live="polite">
            <span class="brand-mono">{{ typedText }}</span>
            <span class="typewriter-cursor brand-mono" aria-hidden="true">|</span>
          </div>

          <div class="hero-actions d-flex flex-wrap ga-3">
            <v-btn
              @click="downloadCv"
              color="primary"
              size="large"
              rounded="pill"
              prepend-icon="mdi-download"
            >
              {{ t('home.hero.downloadCv') }}
            </v-btn>
            <v-btn
              :to="localePath('/projects')"
              color="primary"
              size="large"
              variant="tonal"
              rounded="pill"
              elevation="0"
              append-icon="mdi-arrow-right"
            >
              {{ t('home.hero.portfolioCta') }}
            </v-btn>
          </div>
        </v-responsive>
      </v-col>

      <!-- Right column: photo card -->
      <v-col cols="12" md="7" order="1" order-md="2" class="d-flex justify-md-end">
        <div class="hero-side-card">
          <div class="hero-photo-wrapper">
            <v-img
              src="https://fileharbor.heyatom.dev/v2/images/fba07e88-1415-4463-8ad5-0b5eace18a54"
              :alt="t('home.about.portraitLabel')"
              cover
              class="hero-photo"
            />
          </div>
        </div>
      </v-col>
    </v-row>

    <a href="#about" class="scroll-indicator" :aria-label="t('home.hero.scrollLabel')">
      <span class="scroll-ring" aria-hidden="true" />
      <v-icon size="22" class="scroll-arrow">mdi-arrow-down</v-icon>
    </a>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="bottom end"
      rounded="pill"
    >
      {{ snackbarText }}
    </v-snackbar>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: calc(100dvh - 80px);
  padding: 2rem 1.25rem 2.5rem;
  isolation: isolate;
}

/* Full-bleed pattern background — fades out toward the bottom */
.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 100vw;
  height: 100%;
  transform: translateX(-50%);
  background-image: url('/HT_Pattern_1.svg');
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.09;
  z-index: -1;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 55%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 55%, transparent 100%);
}

/* Full-bleed ambient glow — fades out sooner */
.hero-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 100vw;
  height: 100%;
  transform: translateX(-50%);
  background:
    radial-gradient(ellipse 70% 55% at 25% 45%, rgba(0, 168, 107, 0.10) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 75% 55%, rgba(0, 168, 107, 0.06) 0%, transparent 65%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 40%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 40%, transparent 100%);
  z-index: -1;
  pointer-events: none;
}

.section-row {
  z-index: 1;
}

.brand-mono {
  font-family: 'JetBrains Mono', 'SFMono-Regular', ui-monospace, monospace;
  letter-spacing: 0.12em;
}

.hero-intro {
  max-width: 60ch;
}

.typewriter-line {
  min-height: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

.typewriter-cursor {
  display: inline-block;
  margin-left: 0.15rem;
  color: rgb(var(--v-theme-primary));
  animation: blink 1s steps(1) infinite;
}

/* Photo card */
.hero-side-card {
  width: min(100%, 500px);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
}

.hero-photo-wrapper {
  position: relative;
  width: 100%;
}

.hero-photo {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  max-height: 550px;
}

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(var(--v-theme-primary), 0.55);
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  animation: bounceDown 2s ease-in-out infinite;
  z-index: 1;
  transition: border-color 0.2s, background-color 0.2s;
}

.scroll-indicator:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
  border-color: rgb(var(--v-theme-primary));
}

/* Pulsing ring */
.scroll-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(var(--v-theme-primary), 0.3);
  animation: ringPulse 2s ease-out infinite;
  pointer-events: none;
}

.scroll-arrow {
  animation: arrowBounce 2s ease-in-out infinite;
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

@keyframes bounceDown {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
    opacity: 0.75;
  }
  50% {
    transform: translateX(-50%) translateY(5px);
    opacity: 1;
  }
}

@keyframes arrowBounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(3px); }
}

@keyframes ringPulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  70% {
    transform: scale(1.45);
    opacity: 0;
  }
  100% {
    transform: scale(1.45);
    opacity: 0;
  }
}

/* ── Button hover animations ─────────────────────────────── */
.hero-actions :deep(.v-btn) {
  will-change: transform, box-shadow;
  transition:
    transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.28s ease;
}

.hero-actions :deep(.v-btn:hover) {
  transform: translateY(-4px);
}

/* Filled primary button → green glow on hover */
.hero-actions :deep(.v-btn--variant-elevated:hover),
.hero-actions :deep(.v-btn--variant-flat:hover) {
  box-shadow: 0 10px 28px rgba(0, 168, 107, 0.35);
}

/* Tonal button → softer glow */
.hero-actions :deep(.v-btn--variant-tonal:hover) {
  box-shadow: 0 8px 22px rgba(0, 168, 107, 0.20);
}

/* Download icon drops on hover */
.hero-actions :deep(.v-btn:first-child:hover .v-btn__prepend) {
  animation: iconDrop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Arrow slides right on hover */
.hero-actions :deep(.v-btn:last-child:hover .v-btn__append) {
  animation: arrowRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes iconDrop {
  0%   { transform: translateY(0);   }
  45%  { transform: translateY(4px); }
  100% { transform: translateY(0);   }
}

@keyframes arrowRight {
  0%   { transform: translateX(0);   }
  45%  { transform: translateX(6px); }
  100% { transform: translateX(0);   }
}

@media (max-width: 959px) {
  .hero-section {
    min-height: auto;
    padding: 0.5rem 0.5rem 2rem;
  }

  .typewriter-line {
    min-height: unset;
    height: 3.5rem;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .scroll-indicator {
    display: none;
  }

  .hero-side-card {
    width: 100%;
    max-width: 100%;
    border-radius: 1rem;
  }

  .hero-photo {
    aspect-ratio: 16 / 7;
    max-height: none;
    object-position: center 20%;
  }
}
</style>

