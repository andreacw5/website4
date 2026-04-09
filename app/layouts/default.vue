<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SiteHeader from "~/components/layout/SiteHeader.vue";
const { t } = useI18n();

const socialLinks = computed(() => [
  { icon: 'mdi-github', href: 'https://github.com/andreatombolato', label: t('footer.socials.github') },
  { icon: 'mdi-linkedin', href: 'https://www.linkedin.com', label: t('footer.socials.linkedin') },
  { icon: 'mdi-web', href: 'https://heyatom.dev', label: t('footer.socials.website') },
]);

const currentYear = new Date().getFullYear();
</script>

<template>
  <v-app>
    <a class="skip-link" href="#main-content">{{ t('site.skipToContent') }}</a>

    <SiteHeader />

    <v-main id="main-content">
      <slot />
    </v-main>

    <v-footer class="border-t" color="transparent">
      <v-container max-width="1280" class="py-8 px-4 px-md-6">
        <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center ga-6">
          <div>
            <div class="text-body-1 font-weight-medium">
              © {{ currentYear }} {{ t('footer.copyright') }}
            </div>
            <div class="text-body-2 text-medium-emphasis mt-2">
              {{ t('footer.note') }}
            </div>
          </div>

          <div class="d-flex align-center ga-2">
            <v-btn
              v-for="link in socialLinks"
              :key="link.href"
              :href="link.href"
              :aria-label="link.label"
              target="_blank"
              rel="noreferrer"
              icon
              variant="text"
              color="primary"
            >
              <v-icon>{{ link.icon }}</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped>
.skip-link,
.border-t {
  --layout-brand: #00a86b;
  --layout-brand-soft: rgba(0, 168, 107, 0.08);
  --layout-on-brand: #ffffff;
}

:global(.v-theme--dark) .skip-link,
:global(.v-theme--dark) .border-t {
  --layout-brand-soft: rgba(0, 168, 107, 0.16);
}

.skip-link {
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


.border-t {
  border-top: 1px solid var(--layout-brand-soft);
}
</style>

