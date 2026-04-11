<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';
import { useThemeStore } from '~/stores/theme';

const route = useRoute();
const localePath = useLocalePath();
const { locale, locales, setLocale, t } = useI18n();
const theme = useTheme();
const themeStore = useThemeStore();

const drawer = ref(false);
const langMenu = ref(false);

onMounted(() => {
  themeStore.initTheme();
  theme.change(themeStore.currentTheme);
});

watch(
    () => themeStore.currentTheme,
    (val) => { theme.change(val); },
    { immediate: true },
);

const navItems = computed(() => [
  { title: t('nav.home'), to: localePath('/') },
  { title: t('nav.portfolio'), to: localePath('/projects') },
  { title: t('nav.travels'), to: localePath('/travels') },
  { title: t('nav.utilities'), to: localePath('/utilities') },
]);

const normalizePath = (path: string) => (path === '/' ? '/' : path.replace(/\/+$/, ''));

const isActive = (path: string) => {
  const cur = normalizePath(route.path);
  const target = normalizePath(path);
  const home = normalizePath(localePath('/'));
  if (target === home) return cur === target;
  return cur === target || cur.startsWith(`${target}/`);
};

const changeLanguage = async (lang: string) => {
  await setLocale(lang as 'en' | 'it');
  langMenu.value = false;
};

const getFlagPath = (lang: string) =>
    ({ en: '/flags/gb.svg', it: '/flags/it.svg' })[lang] ?? '';

const getLangName = (lang: string) =>
    ({ en: 'English', it: 'Italiano' })[lang] ?? lang.toUpperCase();

const toggleTheme = () => themeStore.toggleTheme();
</script>

<template>
  <!-- Drawer mobile -->
  <v-navigation-drawer v-model="drawer" temporary location="start" width="272">
    <div class="pa-4 d-flex align-center justify-space-between">
      <div>
        <div class="text-subtitle-2 font-weight-semibold">{{ t('app.name') }}</div>
        <div class="text-caption brand-mono text-primary">{{ t('app.brand') }}</div>
      </div>
      <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          density="comfortable"
          :aria-label="t('site.closeMenu')"
          @click="drawer = false"
      />
    </div>

    <v-divider />

    <v-list nav density="comfortable" class="pa-2 mt-1">
      <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :active="isActive(item.to)"
          color="primary"
          rounded="lg"
          class="nav-drawer-item"
          @click="drawer = false"
      >
        <template #prepend>
          <div :class="['nav-dot', { 'nav-dot--active': isActive(item.to) }]" />
        </template>
        <v-list-item-title class="text-body-2">{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Language switcher in fondo al drawer -->
    <template #append>
      <v-divider />
      <div class="pa-3 d-flex ga-2">
        <v-btn
            v-for="lang in locales"
            :key="lang.code"
            :variant="locale === lang.code ? 'tonal' : 'outlined'"
            :color="locale === lang.code ? 'primary' : undefined"
            size="small"
            class="flex-1-1 text-none"
            @click="changeLanguage(lang.code)"
        >
          <v-avatar size="16" class="mr-1">
            <v-img :src="getFlagPath(lang.code)" :alt="getLangName(lang.code)" />
          </v-avatar>
          {{ lang.code.toUpperCase() }}
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <!-- App bar -->
  <v-app-bar
      class="site-app-bar"
      color="surface"
      height="68"
      flat
      scroll-behavior="elevate"
  >
    <v-container max-width="1280" class="d-flex align-center px-4 px-md-6 h-100">

      <!-- Hamburger solo mobile -->
      <v-btn
          class="d-md-none mr-2"
          icon="mdi-menu"
          variant="text"
          size="small"
          :aria-label="t('site.openMenu')"
          @click="drawer = !drawer"
      />

      <!-- Logo -->
      <v-btn
          :to="localePath('/')"
          variant="text"
          class="logo-btn px-0 mr-6 text-none"
          rounded="0"
          height="auto"
      >
        <div class="d-flex align-center ga-3">
          <v-avatar size="36" color="primary" variant="tonal" rounded="lg" class="logo-avatar">
            <img src="/HT_Favicon_BaseFlat_v01.svg" alt="HeyAtom logo" class="logo-avatar-img" />
          </v-avatar>
          <div class="d-flex flex-column align-start text-left">
            <span class="logo-name">{{ t('app.name') }}</span>
            <span class="logo-brand text-primary brand-mono">{{ t('app.brand') }}</span>
          </div>
        </div>
      </v-btn>

      <!-- Separatore verticale + nav desktop -->
      <div class="d-none d-md-flex align-center h-100">
        <div class="nav-divider mr-6" />
        <nav class="d-flex align-center ga-1">
          <v-btn
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              variant="text"
              rounded="lg"
              size="small"
              :class="['nav-link text-none', { 'nav-link--active': isActive(item.to) }]"
          >
            {{ item.title }}
            <span v-if="isActive(item.to)" class="nav-dot-inline" />
          </v-btn>
        </nav>
      </div>

      <v-spacer />

      <!-- Azioni destra -->
      <div class="d-flex align-center ga-1">
        <!-- Language menu -->
        <v-menu v-model="langMenu" location="bottom end" :offset="8">
          <template #activator="{ props }">
            <v-btn
                v-bind="props"
                variant="outlined"
                size="small"
                class="lang-trigger text-none px-2"
                :aria-label="t('site.changeLanguage')"
            >
              <v-avatar size="16" class="mr-1" tile style="background: transparent">
                <v-img :src="getFlagPath(locale)" :alt="getLangName(locale)" />
              </v-avatar>
              <v-icon size="14" class="ml-1">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list density="compact" rounded="lg" elevation="4" class="pa-1 lang-menu" min-width="160">
            <v-list-item
                v-for="lang in locales"
                :key="lang.code"
                :active="locale === lang.code"
                color="primary"
                @click="changeLanguage(lang.code)"
            >
              <template #prepend>
                <v-avatar size="18" class="mr-2" tile style="background: transparent">
                  <v-img :src="getFlagPath(lang.code)" :alt="getLangName(lang.code)" />
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2">{{ getLangName(lang.code) }}</v-list-item-title>
              <template #append>
                <v-icon v-if="locale === lang.code" size="14" color="primary">mdi-check</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Theme toggle -->
        <v-btn
          variant="outlined"
          rounded="lg"
          size="small"
          class="lang-trigger px-2"
          :aria-label="themeStore.isDark ? t('theme.light') : t('theme.dark')"
          @click="toggleTheme"
        >
          <v-icon size="16">{{ themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          <v-tooltip activator="parent" location="bottom">
            {{ themeStore.isDark ? t('theme.light') : t('theme.dark') }}
          </v-tooltip>
        </v-btn>
      </div>

    </v-container>
  </v-app-bar>
</template>

<style scoped>
.site-app-bar {
  border-bottom: 1px solid rgba(0, 168, 107, 0.1) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.brand-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.06em;
  font-size: 11px;
}

.logo-btn {
  min-width: auto;
}

.logo-avatar {
  flex-shrink: 0;
  transition: box-shadow 0.25s ease;
}

.logo-avatar :deep(.v-img) {
  padding: 10px !important;
}

.logo-avatar-img {
  width: 100%;
  height: 100%;
  padding: 7px;
  object-fit: contain;
  transform-origin: 70% 80%;
  transition: transform 0.2s ease;
}

.logo-btn:hover .logo-avatar-img {
  animation: wave-hand 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
}

@keyframes wave-hand {
  0%   { transform: rotate(0deg); }
  20%  { transform: rotate(8deg); }
  45%  { transform: rotate(-4deg); }
  65%  { transform: rotate(6deg); }
  85%  { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
}

.logo-btn:hover .logo-avatar {
  box-shadow: 0 0 0 5px rgba(0, 168, 107, 0.18);
}

.logo-btn.v-btn--active {
  color: rgba(var(--v-theme-on-surface), 0.9) !important;
}

.logo-btn.v-btn--active :deep(.v-btn__overlay),
.logo-btn :deep(.v-btn__overlay) {
  opacity: 0 !important;
}

.logo-name {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: rgba(var(--v-theme-on-surface), 0.9);
  line-height: 1.2;
}

.logo-brand {
  line-height: 1.2;
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: rgba(var(--v-theme-on-surface), 0.12);
}

.nav-link {
  font-size: 13.5px !important;
  font-weight: 450;
  color: rgba(var(--v-theme-on-surface), 0.6) !important;
  padding: 0 12px !important;
  position: relative;
}

.nav-link:hover {
  color: rgba(var(--v-theme-on-surface), 0.9) !important;
}

.nav-link--active {
  color: rgb(var(--v-theme-primary)) !important;
  background: rgba(var(--v-theme-primary), 0.08) !important;
  font-weight: 500;
}

.nav-dot-inline {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  margin-left: 6px;
  vertical-align: middle;
  margin-bottom: 1px;
  flex-shrink: 0;
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: transparent;
  margin-right: 4px;
  flex-shrink: 0;
}

.nav-dot--active {
  background: rgb(var(--v-theme-primary));
}

.nav-drawer-item {
  min-height: 42px;
}

.lang-trigger {
  height: 32px;
  border-color: rgba(var(--v-theme-on-surface), 0.15) !important;
}

.lang-menu {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

@media (prefers-reduced-motion: reduce) {
  .nav-link { transition: none; }
  .logo-btn:hover .logo-avatar-img { animation: none; }
}
</style>
