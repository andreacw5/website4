<script setup lang="ts">
import SiteHeader from "~/components/layout/SiteHeader.vue";
import SiteFooter from "~/components/layout/SiteFooter.vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <v-app>
    <a class="skip-link" href="#main-content">{{ t('site.skipToContent') }}</a>

    <SiteHeader />

    <v-main id="main-content">
      <slot />
    </v-main>

    <SiteFooter />
  </v-app>
</template>

<style scoped>
.skip-link {
  --layout-brand: #00a86b;
  --layout-on-brand: #ffffff;

  position: absolute;
  top: 0;
  left: 1rem;
  transform: translateY(-140%);
  z-index: 2000;
  padding: 0.875rem 1rem;
  border-radius: 0 0 14px 14px;
  background: var(--layout-brand);
  color: var(--layout-on-brand);
  font-weight: 600;
  transition: transform 0.2s ease;
}

.skip-link:focus {
  transform: translateY(0);
}
</style>

