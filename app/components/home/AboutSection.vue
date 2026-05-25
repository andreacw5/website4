<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';

const { t } = useI18n();
const theme = useTheme();

const isDark = computed(() => theme.current.value.dark);
const brandSoft = computed(() => isDark.value ? 'rgba(0,168,107,0.30)' : 'rgba(0,168,107,0.14)');

const careerStartYear = 2016;
const yearsOfExperience = new Date().getFullYear() - careerStartYear;

// ── Travel photos from content ────────────────────────────────
const { data: travelPhotosData } = await useAsyncData('about-travel-photos', () =>
  queryCollection('travelsPhotos').where('featured', '=', true).all(),
);

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy.slice(0, n);
}

const photos = computed(() => {
  const all = travelPhotosData.value ?? [];
  const pool = all.length >= 3 ? all : [...all, ...all, ...all];
  return pickRandom(pool, 3).map((p) => ({ src: p.src, location: p.location }));
});

// cardOrder[slot] = image index — slot 0=back, 1=mid, 2=front
const cardOrder = ref([0, 1, 2]);

const getSlot = (imgIdx: number) => cardOrder.value.indexOf(imgIdx);

const bringToFront = (imgIdx: number) => {
  const slot = getSlot(imgIdx);
  if (slot === 2) return; // already front
  const next = [...cardOrder.value];
  next.splice(slot, 1);
  next.push(imgIdx);
  cardOrder.value = next;
};

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
    <v-row align="center" class="about-main-row">

      <!-- ── Left: header + paragraphs ──────────────────────── -->
      <v-col cols="12" md="7" order="1">
        <div data-about-animate class="mb-7">
          <p class="text-overline text-primary font-weight-bold mb-3 jetbrain">
            {{ t('home.about.eyebrow') }}
          </p>
          <h2 id="about-title" class="text-h4 font-weight-bold">
            {{ t('home.about.title') }}
          </h2>
        </div>

        <p data-about-animate class="text-body-1 text-medium-emphasis about-para about-para--accent mb-5">
          {{ t('home.about.paragraphs.one') }}
        </p>
        <p data-about-animate class="text-body-1 text-medium-emphasis about-para mb-5">
          {{ t('home.about.paragraphs.two') }}
        </p>
        <p data-about-animate class="text-body-1 text-medium-emphasis about-para mb-0">
          {{ t('home.about.paragraphs.three') }}
        </p>
      </v-col>

      <!-- ── Right: photo stack ─────────────────────────────── -->
      <v-col cols="12" md="5" order="2" class="d-flex justify-center justify-md-end">
        <div data-about-animate class="photo-stack" aria-hidden="true">
          <div
            v-for="(photo, i) in photos"
            :key="i"
            class="photo-card"
            :class="`photo-card--slot-${getSlot(i)}`"
            @click="bringToFront(i)"
          >
            <v-img :src="photo.src" cover class="fill-height" />
            <div class="photo-location">
              <v-icon size="11" class="mr-1" style="opacity:.75">mdi-map-marker-outline</v-icon>{{ photo.location }}
            </div>
          </div>
        </div>
      </v-col>

    </v-row>

    <!-- ── Divider ───────────────────────────────────────────── -->
    <v-divider data-about-animate class="about-divider my-10" />

    <!-- ── Highlights ───────────────────────────────────────── -->
    <v-row dense>
      <v-col
        v-for="h in highlights"
        :key="h.key"
        cols="12"
        md="4"
      >
        <div data-about-animate class="h-100">
          <v-card class="about-card h-100" rounded="xl" elevation="0">
            <v-card-text class="pa-6 d-flex flex-column h-100">
              <v-avatar size="52" rounded="xl" color="primary" variant="tonal" class="mb-6 about-card-avatar">
                <v-icon size="24" class="about-card-icon-inner">{{ h.icon }}</v-icon>
              </v-avatar>
              <div class="text-subtitle-1 font-weight-semibold mb-3 jetbrain">
                {{ t(h.label) }}
              </div>
              <p class="text-body-2 text-caption text-medium-emphasis mb-0 flex-grow-1">
                {{ t(h.value, h.key === 'experience' ? { years: yearsOfExperience } : {}) }}
              </p>
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

.about-main-row {
  row-gap: 2.5rem;
}

/* ── Paragraphs ─────────────────────────────────────────────── */
.about-para {
  max-width: 62ch;
  line-height: 1.85;
}

.about-para--accent {
  padding-left: 1.1rem;
  border-left: 2px solid rgba(0, 168, 107, 1);
}

/* ── Photo stack ─────────────────────────────────────────────── */
.photo-stack {
  position: relative;
  width: 260px;
  height: 350px;
  flex-shrink: 0;
}

.photo-card {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.30);
  border: 3px solid rgba(255, 255, 255, 0.86);
  transition: transform 0.42s cubic-bezier(0.34, 1.4, 0.64, 1),
              z-index 0s,
              box-shadow 0.3s ease;
  will-change: transform;
  cursor: pointer;
}

/* ── Slot positions ─────────────────────────────────────────── */
.photo-card--slot-0 { transform: rotate(-11deg) translate(-26px, 10px); z-index: 1; }
.photo-card--slot-1 { transform: rotate(-1deg)  translate(2px, 0);      z-index: 2; }
.photo-card--slot-2 { transform: rotate(9deg)   translate(28px, 12px);  z-index: 3; cursor: default; }

/* ── Hover: spread back cards to reveal them ────────────────── */
.photo-stack:hover .photo-card--slot-0 {
  transform: rotate(-17deg) translate(-62px, 6px);
  box-shadow: 0 20px 56px rgba(0, 0, 0, 0.36);
}
.photo-stack:hover .photo-card--slot-1 {
  transform: rotate(-1deg) translate(2px, -6px);
}
.photo-stack:hover .photo-card--slot-2 {
  transform: rotate(15deg) translate(64px, 8px);
  box-shadow: 0 20px 56px rgba(0, 0, 0, 0.36);
}

/* ── Click feedback ─────────────────────────────────────────── */
.photo-card--slot-0:active,
.photo-card--slot-1:active {
  filter: brightness(1.08);
}

/* ── Location label ─────────────────────────────────────────── */
.photo-location {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 6px 10px 7px;
  background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 60%, transparent 100%);
  color: rgba(255,255,255,0.72);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 959px) {
  .photo-stack {
    width: 220px;
    height: 295px;
    margin-top: 1rem;
  }

  .photo-card--slot-0 { transform: rotate(-11deg) translate(-22px, 8px); }
  .photo-card--slot-2 { transform: rotate(9deg)   translate(24px, 10px); }

  .photo-stack:hover .photo-card--slot-0 { transform: rotate(-15deg) translate(-46px, 4px); }
  .photo-stack:hover .photo-card--slot-2 { transform: rotate(13deg)  translate(48px, 6px); }
}

/* ── Divider ────────────────────────────────────────────────── */
.about-divider {
  border-color: v-bind(brandSoft) !important;
}

/* ── Highlights / Cards ─────────────────────────────────────── */
.about-card {
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

.about-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/assets/images/ui/ht-pattern-1.svg');
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.32s ease;
  pointer-events: none;
  border-radius: inherit;
}

.about-card:hover::after {
  opacity: 0.07;
}

.about-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0, 168, 107, 0.22);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.12);
}

.about-card-avatar {
  transition: box-shadow 0.25s ease;
}

.about-card:hover .about-card-avatar {
  box-shadow: 0 0 0 6px rgba(0, 168, 107, 0.14);
}

.about-card-icon-inner {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.about-card:hover .about-card-icon-inner {
  transform: scale(1.35);
}
</style>
