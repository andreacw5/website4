<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';

const { t } = useI18n();
const localePath = useLocalePath();
const theme = useTheme();

const isDark = computed(() => theme.global.current.value.dark);

const sectionRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const mouseX = ref(50);
const mouseY = ref(50);

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
    { threshold: 0.15 },
  );
  observer.observe(sectionRef.value as unknown as Element);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

function handleMouseMove(e: MouseEvent) {
  const el = cardRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 100;
  mouseY.value = ((e.clientY - rect.top) / rect.height) * 100;
}

function handleMouseLeave() {
  mouseX.value = 50;
  mouseY.value = 50;
}
</script>

<template>
  <section
    id="cta"
    ref="sectionRef"
    class="section-block cta-section"
    aria-labelledby="cta-title"
  >
    <div
      ref="cardRef"
      class="cta-card cta-animate"
      :class="{ 'cta-enter': isVisible }"
      :style="{
        '--mouse-x': `${mouseX}%`,
        '--mouse-y': `${mouseY}%`,
        '--parallax-x': `${(mouseX - 50) * 0.3}px`,
        '--parallax-y': `${(mouseY - 50) * 0.3}px`,
      }"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <!-- Pattern overlay -->
      <div class="cta-pattern" aria-hidden="true" />

      <div class="cta-content">

        <h2 id="cta-title" class="cta-title font-weight-bold mb-4">
          {{ t('home.cta.title') }}
        </h2>

        <p class="text-body-1 cta-subtitle mb-8">
          {{ t('home.cta.subtitle') }}
        </p>

        <div class="cta-actions">
          <v-btn
            :to="localePath('/contacts')"
            color="primary"
            size="large"
            rounded="lg"
            class="cta-btn cta-btn--primary jetbrain"
            append-icon="mdi-arrow-right"
          >
            {{ t('home.cta.button') }}
          </v-btn>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────────── */
.section-block {
  padding-block: 4rem;
}

/* ── Card wrapper ─────────────────────────────────────────── */
.cta-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(0, 168, 107, 0.18) 0%,
    rgba(0, 200, 130, 0.10) 60%,
    rgb(var(--v-theme-background)) 100%
  );
  border: 1.5px solid rgba(0, 168, 107, 0.45);
  box-shadow: 0 4px 40px rgba(0, 168, 107, 0.18), 0 1.5px 0 rgba(0, 200, 130, 0.12) inset;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.cta-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease;
  z-index: 0;
}

.cta-card:hover::before {
  opacity: 1;
}

.cta-card:hover {
  box-shadow: 0 10px 56px rgba(0, 168, 107, 0.30), 0 1.5px 0 rgba(0, 200, 130, 0.18) inset;
  border-color: rgba(0, 168, 107, 0.7);
}

@media (min-width: 600px) {
  .cta-card {
    padding: 5rem 3rem;
  }
}

@media (min-width: 960px) {
  .cta-card {
    padding: 6rem 4rem;
  }
}

/* ── Pattern overlay ──────────────────────────────────────── */
.cta-pattern {
  position: absolute;
  inset: -8%;
  width: 116%;
  height: 116%;
  background-image: url('/assets/images/ui/ht-pattern-1.svg');
  background-size: cover;
  background-position: center;
  opacity: 0.08;
  pointer-events: none;
  transform: translate(var(--parallax-x, 0px), var(--parallax-y, 0px));
  transition: transform 0.12s ease-out;
  will-change: transform;
}

/* ── Content ──────────────────────────────────────────────── */
.cta-content {
  position: relative;
  z-index: 1;
  max-width: 640px;
  margin-inline: auto;
}

.cta-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.cta-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  line-height: 1.2;
  color: rgb(var(--v-theme-on-surface));
}

.cta-subtitle {
  margin-inline: auto;
  line-height: 1.85;
  color: rgba(var(--v-theme-on-surface), 0.72);
}

/* ── Actions ──────────────────────────────────────────────── */
.cta-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* ── Button ───────────────────────────────────────────────── */
.cta-btn {
  transition: transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1),
              box-shadow 0.22s ease !important;
}

.cta-btn--primary:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 10px 28px rgba(0, 168, 107, 0.32) !important;
}

.cta-btn--primary:active {
  transform: translateY(-1px) !important;
}

/* ── Entrance animation ───────────────────────────────────── */
@keyframes ctaFadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

.cta-animate {
  opacity: 0;
}

.cta-animate.cta-enter {
  animation: ctaFadeUp 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .cta-animate {
    opacity: 1;
    animation: none !important;
  }
  .cta-btn {
    transition: none !important;
  }
}
</style>

