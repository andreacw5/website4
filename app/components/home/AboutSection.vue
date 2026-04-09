<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';

const { t } = useI18n();
const theme = useTheme();

const isDark = computed(() => theme.current.value.dark);

// Card gradient colours — resolved at runtime, immune to CSS specificity issues
const cardTop    = computed(() => isDark.value ? 'rgba(32, 42, 39, 1)'    : 'rgba(248, 252, 250, 1)');
const cardBottom = computed(() => isDark.value ? 'rgba(22, 30, 28, 1)'    : 'rgba(237, 247, 242, 1)');
const brandSoft  = computed(() => isDark.value ? 'rgba(0,168,107,0.20)'   : 'rgba(0,168,107,0.14)');
const brandHover = computed(() => isDark.value ? 'rgba(0,168,107,0.32)'   : 'rgba(0,168,107,0.26)');
const textStrong = computed(() => isDark.value ? '#d6ede5'                 : '#15211b');

const careerStartYear = 2016;
const yearsOfExperience = new Date().getFullYear() - careerStartYear;

const highlights = [
  {
    key: 'experience',
    icon: 'mdi-calendar-check-outline',
    label: 'home.about.stats.experience',
    value: 'home.about.highlights.experience',
  },
  {
    key: 'focus',
    icon: 'mdi-code-tags',
    label: 'home.about.stats.focus',
    value: 'home.about.highlights.focus',
  },
  {
    key: 'community',
    icon: 'mdi-account-group-outline',
    label: 'home.about.stats.community',
    value: 'home.about.highlights.community',
  },
] as const;

const sectionRef = ref<HTMLElement | null>(null);
let revertAnimation: (() => void) | undefined;

onMounted(async () => {
  if (!import.meta.client) return;
  await nextTick();
  if (!sectionRef.value) return;

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const targets = Array.from(
    sectionRef.value.querySelectorAll<HTMLElement>('[data-about-animate]'),
  );
  if (!targets.length) return;

  const ctx = gsap.context(() => {
    gsap.from(targets, {
      opacity: 0,
      y: 26,
      duration: 0.72,
      ease: 'power2.out',
      stagger: 0.09,
      scrollTrigger: {
        trigger: sectionRef.value as unknown as Element,
        start: 'top 82%',
        once: true,
      },
    });
  }, sectionRef.value);

  revertAnimation = () => ctx.revert();
});

onBeforeUnmount(() => {
  revertAnimation?.();
});
</script>

<template>
  <section
    id="about"
    ref="sectionRef"
    class="section-block about-section"
    aria-labelledby="about-title"
  >
    <!-- ── Header ───────────────────────────────────────────── -->
    <div data-about-animate>
      <p class="text-overline text-primary font-weight-bold mb-3 jetbrain">
        {{ t('home.about.eyebrow') }}
      </p>
      <h2 id="about-title" class="text-h4 font-weight-bold mb-8">
        {{ t('home.about.title') }}
      </h2>
    </div>

    <!-- ── Paragraphs ───────────────────────────────────────── -->
    <div class="about-copy mb-10">
      <p data-about-animate class="text-body-1 text-medium-emphasis about-para about-para--accent mb-5">
        {{ t('home.about.paragraphs.one') }}
      </p>
      <p data-about-animate class="text-body-1 text-medium-emphasis about-para mb-5">
        {{ t('home.about.paragraphs.two') }}
      </p>
      <p data-about-animate class="text-body-1 text-medium-emphasis about-para mb-0">
        {{ t('home.about.paragraphs.three') }}
      </p>
    </div>

    <!-- ── Divider ───────────────────────────────────────────── -->
    <v-divider data-about-animate class="about-divider mb-8" />

    <!-- ── Highlights ───────────────────────────────────────── -->
    <v-row dense>
      <v-col
        v-for="h in highlights"
        :key="h.key"
        cols="12"
        md="4"
      >
        <div data-about-animate class="about-highlight h-100">
          <v-avatar size="40" rounded="lg" color="primary" variant="tonal" class="mb-4 flex-shrink-0 about-highlight-icon">
            <v-icon size="20">{{ h.icon }}</v-icon>
          </v-avatar>

          <div class="text-caption text-medium-emphasis text-uppercase jetbrain mb-1" style="letter-spacing: 0.1em;">
            {{ t(h.label) }}
          </div>

          <p class="text-body-2 font-weight-medium about-highlight-value mb-0">
            {{ t(h.value, h.key === 'experience' ? { years: yearsOfExperience } : {}) }}
          </p>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<style scoped>
.section-block {
  padding-block: 4rem;
}

/* ── Paragraphs ─────────────────────────────────────────────── */
.about-copy {
  max-width: 72ch;
}

.about-para {
  line-height: 1.85;
}

.about-para--accent {
  padding-left: 1.1rem;
  border-left: 2px solid rgba(0, 168, 107, 1);
}

/* ── Divider ────────────────────────────────────────────────── */
.about-divider {
  border-color: v-bind(brandSoft) !important;
}

/* ── Highlights ─────────────────────────────────────────────── */
.about-highlight {
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.25rem;
  border-radius: 1rem;
  background: linear-gradient(160deg, v-bind(cardTop), v-bind(cardBottom));
  border: 1px solid v-bind(brandSoft);
  transition: border-color 0.24s ease, box-shadow 0.24s ease;
}

.about-highlight:hover {
  border-color: v-bind(brandHover);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
}

.about-highlight-icon {
  transition: box-shadow 0.25s ease;
}

.about-highlight:hover .about-highlight-icon {
  box-shadow: 0 0 0 6px rgba(0, 168, 107, 0.13);
}

.about-highlight-value {
  color: v-bind(textStrong);
  line-height: 1.55;
}
</style>
