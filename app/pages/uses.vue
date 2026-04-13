<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const themeStore = useThemeStore();

useSeo(() => ({
  title: t('uses.seo.title'),
  description: t('uses.seo.description'),
  ogTitle: t('uses.seo.ogTitle'),
  ogDescription: t('uses.seo.ogDescription'),
  pageType: 'website',
  breadcrumb: [{ name: t('nav.uses'), url: '/uses' }],
}));

// ── Types ──────────────────────────────────────────────────
type BadgeType = 'primary' | 'free' | 'pro';
type LocaleField = string | { it?: string; en?: string };



// ── Content query ───────────────────────────────────────────
const { data: allSections } = await useAsyncData('uses-sections', () =>
  queryCollection('uses').order('order', 'ASC').all(),
);

const leftSections = computed(() =>
  (allSections.value ?? []).filter((s) => s.column === 'left'),
);
const rightSections = computed(() =>
  (allSections.value ?? []).filter((s) => s.column === 'right'),
);

// ── Locale helpers ──────────────────────────────────────────
function resolveLocale(field: LocaleField | undefined): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[locale.value as 'it' | 'en'] ?? field.it ?? field.en ?? '';
}

// ── Badge colour helper ─────────────────────────────────────
function badgeColor(type: BadgeType) {
  if (type === 'free') return 'info';
  if (type === 'pro') return 'warning';
  return 'primary';
}
</script>

<template>
  <div class="uses-page page-fade-in" :class="{ 'uses-page--dark': themeStore.isDark }">
    <v-container max-width="1280" class="px-4 px-md-6 py-8 py-md-12">

      <!-- ═══ HERO ══════════════════════════════════════════ -->
      <LayoutPageTitle
        :eyebrow="t('uses.hero.eyebrow')"
        :title="t('uses.hero.title')"
        :description="t('uses.hero.subtitle')"
        title-id="uses-hero-title"
        :mb="2"
      />

      <!-- ── Updated pill ───────────────────────────────── -->
      <div class="uses-updated mb-10">
        <span class="uses-updated-dot" aria-hidden="true" />
        {{ t('uses.updated') }}
      </div>

      <!-- ═══ TWO-COLUMN GRID ════════════════════════════════ -->
      <v-row>

        <!-- ── Left column ─────────────────────────────────── -->
        <v-col cols="12" md="6" class="d-flex flex-column ga-5">
          <div
            v-for="section in leftSections"
            :key="section.titleKey"
            class="uses-section-card"
          >
            <!-- Section header -->
            <div class="section-header d-flex align-center ga-3 mb-1 pb-4">
              <div class="section-icon-wrap">
                <v-icon size="16" color="primary">{{ section.icon }}</v-icon>
              </div>
              <span class="section-title-text">{{ t(section.titleKey) }}</span>
            </div>

            <!-- Item list -->
            <div class="uses-items">
              <div
                v-for="item in section.items"
                :key="item.name"
                class="uses-item d-flex align-start ga-3"
              >
                <div class="item-emoji-wrap" aria-hidden="true">
                  <v-icon v-if="item.icon" size="18" color="primary">{{ item.icon }}</v-icon>
                  <template v-else>{{ item.emoji }}</template>
                </div>
                <div class="item-body flex-grow-1 min-width-0">
                  <div class="item-name d-flex align-center ga-2 flex-wrap mb-1">
                    <span>{{ item.name }}</span>
                    <v-chip
                      v-if="item.badge"
                      :color="badgeColor(item.badge.type as BadgeType)"
                      size="x-small"
                      variant="tonal"
                      label
                      class="item-badge"
                    >
                      {{ resolveLocale(item.badge.text) }}
                    </v-chip>
                  </div>
                  <p class="item-desc">{{ resolveLocale(item.desc) }}</p>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <!-- ── Right column ────────────────────────────────── -->
        <v-col cols="12" md="6" class="d-flex flex-column ga-5">
          <div
            v-for="section in rightSections"
            :key="section.titleKey"
            class="uses-section-card"
          >
            <!-- Section header -->
            <div class="section-header d-flex align-center ga-3 mb-1 pb-4">
              <div class="section-icon-wrap">
                <v-icon size="16" color="primary">{{ section.icon }}</v-icon>
              </div>
              <span class="section-title-text">{{ t(section.titleKey) }}</span>
            </div>

            <!-- Item list -->
            <div class="uses-items">
              <div
                v-for="item in section.items"
                :key="item.name"
                class="uses-item d-flex align-start ga-3"
              >
                <div class="item-emoji-wrap" aria-hidden="true">
                  <v-icon v-if="item.icon" size="18" color="primary">{{ item.icon }}</v-icon>
                  <template v-else>{{ item.emoji }}</template>
                </div>
                <div class="item-body flex-grow-1 min-width-0">
                  <div class="item-name d-flex align-center ga-2 flex-wrap mb-1">
                    <span>{{ item.name }}</span>
                    <v-chip
                      v-if="item.badge"
                      :color="badgeColor(item.badge.type as BadgeType)"
                      size="x-small"
                      variant="tonal"
                      label
                      class="item-badge"
                    >
                      {{ resolveLocale(item.badge.text) }}
                    </v-chip>
                  </div>
                  <p class="item-desc">{{ resolveLocale(item.desc) }}</p>
                </div>
              </div>
            </div>
          </div>
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
/* ── CSS custom props ───────────────────────────────────── */
.uses-page {
  --uses-card-bg-top:    rgba(240, 240, 240, 0.9);
  --uses-card-bg-bottom: rgba(245, 248, 247, 0.88);
  --uses-brand-soft:     rgba(0, 168, 107, 0.12);
  --uses-border:         rgba(0, 0, 0, 0.07);
  --uses-icon-bg:        rgba(0, 168, 107, 0.10);
  --uses-text-secondary: rgba(21, 33, 27, 0.65);
  --uses-emoji-bg:       rgba(0, 0, 0, 0.04);
}

.uses-page--dark {
  --uses-card-bg-top:    rgba(34, 40, 38, 0.92);
  --uses-card-bg-bottom: rgba(15, 20, 19, 0.90);
  --uses-brand-soft:     rgba(0, 168, 107, 0.18);
  --uses-border:         rgba(255, 255, 255, 0.07);
  --uses-icon-bg:        rgba(0, 168, 107, 0.14);
  --uses-text-secondary: rgba(237, 245, 242, 0.60);
  --uses-emoji-bg:       rgba(255, 255, 255, 0.05);
}

/* ── Page fade-in ──────────────────────────────────────── */
@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.page-fade-in {
  animation: pageFadeIn 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .page-fade-in { animation: none; }
}

/* ── Updated pill ──────────────────────────────────────── */
.uses-updated {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.04em;
  color: var(--uses-text-secondary);
}

.uses-updated-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00a86b;
  display: inline-block;
  flex-shrink: 0;
}

/* ── Section card ──────────────────────────────────────── */
.uses-section-card {
  background: linear-gradient(
    180deg,
    var(--uses-card-bg-top),
    var(--uses-card-bg-bottom)
  );
  border: 1px solid var(--uses-brand-soft);
  border-radius: 16px;
  padding: 20px 22px 8px;
  position: relative;
  overflow: hidden;
}

/* ── Section header ────────────────────────────────────── */
.section-header {
  border-bottom: 1px solid var(--uses-border);
}

.section-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--uses-icon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-title-text {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

/* ── Item list ─────────────────────────────────────────── */
.uses-items {
  display: flex;
  flex-direction: column;
}

.uses-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--uses-border);
}

.uses-item:last-child {
  border-bottom: none;
  padding-bottom: 4px;
}

/* ── Item emoji ────────────────────────────────────────── */
.item-emoji-wrap {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: var(--uses-emoji-bg);
  border: 1px solid var(--uses-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  line-height: 1;
  flex-shrink: 0;
}

/* ── Item content ──────────────────────────────────────── */
.item-name {
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.4;
}

.item-badge {
  font-size: 10px !important;
  letter-spacing: 0.03em;
}

.item-desc {
  font-size: 12.5px;
  color: var(--uses-text-secondary);
  line-height: 1.6;
  margin: 0;
}
</style>

