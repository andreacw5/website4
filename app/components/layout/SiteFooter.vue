<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const socialLinks = computed(() => [
  { icon: 'mdi-github', href: 'https://github.com/andreacw5', label: t('footer.socials.github') },
  { icon: 'mdi-linkedin', href: 'https://www.linkedin.com/in/atombolato/', label: t('footer.socials.linkedin') },
  { icon: 'mdi-steam', href: 'https://steamcommunity.com/id/andreacw96', label: t('footer.socials.steam') },
  { icon: 'mdi-instagram', href: 'https://www.instagram.com/andreacw96', label: t('footer.socials.instagram') },
]);

const currentYear = new Date().getFullYear();
</script>

<template>
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
</template>

<style scoped>
.border-t {
  border-top: 1px solid rgba(0, 168, 107, 0.12);
}
</style>

