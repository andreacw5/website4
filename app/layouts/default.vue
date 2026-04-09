<script setup lang="ts">
import { useTheme } from 'vuetify';
import { useThemeStore } from '~/stores/theme';

const route = useRoute();
const { locale, locales, setLocale, t } = useI18n();
const theme = useTheme();
const themeStore = useThemeStore();

const drawer = ref(false);
const userMenu = ref(false);
const langMenu = ref(false);
const logoutDialog = ref(false);
const dialog = ref(false);

// Inizializza il tema al caricamento
onMounted(() => {
  themeStore.initTheme();
  theme.global.name.value = themeStore.currentTheme;
});

// Osserva i cambiamenti del tema
watch(() => themeStore.isDark, (isDark) => {
  theme.global.name.value = isDark ? 'dark' : 'light';
});

const toggleTheme = () => themeStore.toggleTheme();

const handleLogout = () => {
  userMenu.value = false;
  logoutDialog.value = true;
};

const confirmLogout = () => { logoutDialog.value = false; };
const cancelLogout  = () => { logoutDialog.value = false; };

const isCurrentPage = (path: string) => route.path === path;

const openAddEventDialog = () => {
  userMenu.value = false;
  dialog.value = true;
};

const changeLanguage = (lang: string) => {
  setLocale(lang as 'en' | 'it');
  langMenu.value = false;
};

const getFlagPath = (lang: string) => {
  const flags: Record<string, string> = { en: '/flags/gb.svg', it: '/flags/it.svg' };
  return flags[lang] ?? '';
};

const getLanguageName = (lang: string) => {
  const names: Record<string, string> = { en: 'English', it: 'Italiano' };
  return names[lang] ?? lang.toUpperCase();
};

const navItems = computed(() => [
  { title: t('nav.home'),     icon: 'mdi-view-dashboard-outline', to: '/'         },
  { title: t('nav.events'),   icon: 'mdi-calendar-clock-outline', to: '/events'   },
  { title: t('nav.settings'), icon: 'mdi-cog-outline',            to: '/settings' },
]);

const isMonitoringPage = computed(() => route.path === '/events');
</script>

<template>
  <v-app>
    <!-- ── Mobile Navigation Drawer ─────────────────────────────── -->
    <v-navigation-drawer v-model="drawer" temporary width="260">
      <v-list-item
        prepend-icon="mdi-apps"
        :title="t('app.name')"
        nav
        class="py-4"
      >
        <template #append>
          <v-btn variant="text" icon="mdi-close" size="small" @click="drawer = false" />
        </template>
      </v-list-item>

      <v-divider />

      <v-list density="compact" nav class="pa-2 mt-1">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          :active="isCurrentPage(item.to)"
          active-color="primary"
          rounded="lg"
          class="mb-1"
          @click="drawer = false"
        />
      </v-list>

      <template #append>
        <v-divider />
        <v-list density="compact" nav class="pa-2">
          <v-list-item prepend-icon="mdi-account-circle-outline" :title="t('user.profile')"  to="/profile"  rounded="lg" />
          <v-list-item prepend-icon="mdi-cog-outline"            :title="t('user.settings')" to="/settings" rounded="lg" />
          <v-list-item
            prepend-icon="mdi-logout"
            :title="t('user.logout')"
            class="text-error mt-1"
            rounded="lg"
            @click="handleLogout"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- ── App Bar ───────────────────────────────────────────────── -->
    <v-app-bar
      :color="themeStore.isDark ? 'surface' : 'primary'"
      :elevation="themeStore.isDark ? 2 : 1"
      height="64"
    >
      <!-- Mobile hamburger -->
      <v-app-bar-nav-icon
        class="d-flex d-md-none"
        :color="themeStore.isDark ? 'on-surface' : 'white'"
        @click="drawer = !drawer"
      />

      <!-- Logo -->
      <v-toolbar-title class="d-flex align-center ga-2 flex-grow-0 mr-6">
        <v-avatar :color="themeStore.isDark ? 'primary' : 'white'" rounded="lg" size="36">
          <v-icon :color="themeStore.isDark ? 'white' : 'primary'" size="20">mdi-apps</v-icon>
        </v-avatar>
        <span
          class="text-h6 font-weight-bold d-none d-sm-block"
          :class="themeStore.isDark ? 'text-on-surface' : 'text-white'"
        >
          {{ t('app.name') }}
        </span>
      </v-toolbar-title>

      <!-- Desktop Navigation -->
      <div class="d-none d-md-flex align-center">
        <v-btn
          v-for="item in navItems"
          :key="item.to"
          :class="['nav-item', { 'nav-item--active': isCurrentPage(item.to) }]"
          :to="item.to"
          :prepend-icon="item.icon"
          :color="themeStore.isDark ? 'on-surface' : 'white'"
          variant="text"
          class="text-none px-4"
          height="64"
          rounded="0"
        >
          {{ item.title }}
        </v-btn>
      </div>

      <v-spacer />

      <!-- Theme toggle -->
      <v-btn
        :icon="themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        :color="themeStore.isDark ? 'secondary' : 'white'"
        variant="text"
        class="mr-1"
        @click="toggleTheme"
      >
        <v-tooltip activator="parent" location="bottom">
          {{ themeStore.isDark ? t('theme.light') : t('theme.dark') }}
        </v-tooltip>
      </v-btn>

      <!-- Language switcher -->
      <v-menu v-model="langMenu" location="bottom end" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            :color="themeStore.isDark ? 'on-surface' : 'white'"
            size="small"
            class="mr-1 text-none"
          >
            <v-avatar size="18" class="mr-1">
              <v-img :src="getFlagPath(locale)" />
            </v-avatar>
            <span class="text-caption font-weight-medium d-none d-sm-inline">{{ locale.toUpperCase() }}</span>
            <v-icon size="14" class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list density="compact" min-width="170" rounded="xl" elevation="4" class="pa-1">
          <v-list-item
            v-for="lang in locales"
            :key="lang.code"
            :active="locale === lang.code"
            active-color="primary"
            rounded="lg"
            class="mb-1"
            @click="changeLanguage(lang.code)"
          >
            <template #prepend>
              <v-avatar size="20" class="mr-2">
                <v-img :src="getFlagPath(lang.code)" />
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-2">{{ getLanguageName(lang.code) }}</v-list-item-title>
            <template #append>
              <v-icon v-if="locale === lang.code" size="14" color="primary">mdi-check</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- User menu -->
      <v-menu v-model="userMenu" location="bottom end">
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            variant="text"
            :color="themeStore.isDark ? 'on-surface' : 'white'"
          >
            <v-avatar :color="themeStore.isDark ? 'primary' : 'white'" size="36">
              <v-icon :color="themeStore.isDark ? 'on-primary' : 'primary'" size="20">mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-card min-width="230" rounded="xl" elevation="4">
          <v-card-item class="pb-0 pt-4 px-4">
            <template #prepend>
              <v-avatar color="primary" size="44" rounded="lg">
                <v-icon color="on-primary" size="22">mdi-account</v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-body-1 font-weight-bold">John Doe</v-card-title>
            <v-card-subtitle>{{ t('user.administrator') }}</v-card-subtitle>
          </v-card-item>

          <v-list density="compact" nav class="pa-2 mt-1">
            <v-list-item
              v-if="isMonitoringPage"
              prepend-icon="mdi-plus"
              :title="t('dialog.addEvent')"
              class="text-primary mb-1"
              rounded="lg"
              @click="openAddEventDialog"
            />
            <v-divider v-if="isMonitoringPage" class="mb-1" />

            <v-list-item prepend-icon="mdi-account-circle-outline" :title="t('user.profile')"  to="/profile"  rounded="lg" class="mb-1" />
            <v-list-item prepend-icon="mdi-cog-outline"            :title="t('user.settings')" to="/settings" rounded="lg" />
          </v-list>

          <v-divider class="mx-2" />

          <v-list density="compact" nav class="pa-2">
            <v-list-item
              prepend-icon="mdi-logout"
              :title="t('user.logout')"
              class="text-error"
              rounded="lg"
              @click="handleLogout"
            />
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- ── Main Content ──────────────────────────────────────────── -->
    <v-main>
      <slot />
    </v-main>

    <!-- Dialog per aggiungere evento -->
    <v-dialog v-model="dialog" max-width="600">
      <slot name="event-dialog" :dialog="dialog" />
    </v-dialog>

    <!-- Dialog di conferma logout -->
    <v-dialog v-model="logoutDialog" max-width="420">
      <v-card rounded="xl">
        <v-card-item class="pt-6 px-6">
          <template #prepend>
            <v-avatar color="warning" variant="tonal" size="48" rounded="lg">
              <v-icon>mdi-logout</v-icon>
            </v-avatar>
          </template>
          <v-card-title class="text-h6">{{ t('dialog.confirmLogout') }}</v-card-title>
        </v-card-item>

        <v-card-text class="text-body-2 text-medium-emphasis pb-2 px-6">
          {{ t('dialog.logoutMessage') }}
          <p class="text-caption mt-2">{{ t('dialog.logoutNote') }}</p>
        </v-card-text>

        <v-card-actions class="pa-4 pt-2">
          <v-spacer />
          <v-btn variant="text" @click="cancelLogout">{{ t('dialog.cancel') }}</v-btn>
          <v-btn color="primary" variant="elevated" rounded="lg" @click="confirmLogout">
            {{ t('dialog.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style scoped>
.nav-item {
  position: relative;
  transition: background-color 0.2s ease;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: currentColor;
  border-radius: 3px 3px 0 0;
  transform: scaleX(0);
  transition: transform 0.25s ease;
}

.nav-item--active::after {
  transform: scaleX(1);
}

.nav-item--active {
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.15) !important;
}

.v-theme--dark .nav-item--active {
  background-color: rgba(var(--v-theme-on-surface), 0.12) !important;
}

.nav-item:not(.nav-item--active):hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

.v-theme--dark .nav-item:not(.nav-item--active):hover {
  background-color: rgba(var(--v-theme-on-surface), 0.08) !important;
}
</style>

