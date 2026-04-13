<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const config = useRuntimeConfig();

useSeo(() => ({
  title: t('contacts.seo.title'),
  description: t('contacts.seo.description'),
  ogTitle: t('contacts.seo.ogTitle'),
  ogDescription: t('contacts.seo.ogDescription'),
  pageType: 'website',
  breadcrumb: [{ name: t('nav.contacts'), url: '/contacts' }],
}));

// ── Form state ─────────────────────────────────────────────
const form = ref<any>(null);
const loading = ref(false);
const name = ref('');
const email = ref('');
const message = ref('');

// ── Success dialog ─────────────────────────────────────────
const successDialog = ref(false);

// ── Error snackbar ─────────────────────────────────────────
const snackbar = ref(false);
const snackbarMessage = ref('');

// ── Validation rules ───────────────────────────────────────
const rules = {
  required: (v: string) => !!v?.trim() || t('contacts.form.required'),
  email: (v: string) => /.+@.+\..+/.test(v) || t('contacts.form.emailInvalid'),
  minMessage: (v: string) => (v && v.length >= 10) || t('contacts.form.minMessage'),
};

// ── Social links (from footer) ─────────────────────────────
const socialLinks = computed(() => [
  {
    icon: 'mdi-github',
    href: 'https://github.com/andreacw5',
    label: t('footer.socials.github'),
    name: 'GitHub',
  },
  {
    icon: 'mdi-linkedin',
    href: 'https://www.linkedin.com/in/atombolato/',
    label: t('footer.socials.linkedin'),
    name: 'LinkedIn',
  },
  {
    icon: 'mdi-steam',
    href: 'https://steamcommunity.com/id/andreacw96',
    label: t('footer.socials.steam'),
    name: 'Steam',
  },
  {
    icon: 'mdi-instagram',
    href: 'https://www.instagram.com/andreacw96',
    label: t('footer.socials.instagram'),
    name: 'Instagram',
  },
]);

// ── Form ready (all fields populated) ─────────────────────
const isFormReady = computed(
  () => !!name.value.trim() && !!email.value.trim() && message.value.trim().length >= 10,
);

// ── Freelance availability ─────────────────────────────────
const isFreelanceAvailable = computed(
  () => String(config.public.freelanceAvailable) === 'true',
);

// ── Submit ─────────────────────────────────────────────────
const submitForm = async () => {
  const { valid } = await form.value?.validate();
  if (!valid) return;

  loading.value = true;
  try {
    const res = await fetch(config.public.basinUrl as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        message: message.value,
      }),
    });

    if (res.ok) {
      name.value = '';
      email.value = '';
      message.value = '';
      form.value?.reset();
      successDialog.value = true;
    } else {
      snackbarMessage.value = t('contacts.form.errorMessage');
      snackbar.value = true;
    }
  } catch {
    snackbarMessage.value = t('contacts.form.errorMessage');
    snackbar.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="contacts-page page-fade-in">
    <v-container max-width="1280" class="px-4 px-md-6 py-8 py-md-12">

      <!-- ═══ HERO ══════════════════════════════════════════ -->
      <LayoutPageTitle
        :eyebrow="t('contacts.hero.eyebrow')"
        :title="t('contacts.hero.title')"
        :description="t('contacts.hero.subtitle')"
        title-id="contacts-hero-title"
        :mb="8"
      />

      <!-- ═══ MAIN GRID ══════════════════════════════════════ -->
      <v-row :gutter="8" align="stretch">

        <!-- ── LEFT: Contact Form ─────────────────────────── -->
        <v-col cols="12" md="7" class="d-flex flex-column">
          <v-card rounded="xl" elevation="0" class="contact-card pa-6 pa-md-8 flex-grow-1">
            <p class="text-overline text-primary font-weight-bold mb-2 brand-mono d-flex align-center ga-1">
              <v-icon size="14" color="primary">mdi-pencil-outline</v-icon>
              {{ t('contacts.form.eyebrow') }}
            </p>
            <h2 class="text-h6 font-weight-bold mb-6">{{ t('contacts.form.title') }}</h2>

            <v-form ref="form" @submit.prevent="submitForm">
              <v-text-field
                v-model="name"
                :label="t('contacts.form.name')"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-account-outline"
                autocomplete="name"
                class="mb-1"
              />

              <v-text-field
                v-model="email"
                :label="t('contacts.form.email')"
                :rules="[rules.required, rules.email]"
                prepend-inner-icon="mdi-email-outline"
                type="email"
                autocomplete="email"
                class="mb-1"
              />

              <v-textarea
                v-model="message"
                :label="t('contacts.form.message')"
                :placeholder="t('contacts.form.messagePlaceholder')"
                :rules="[rules.required, rules.minMessage]"
                prepend-inner-icon="mdi-message-text-outline"
                rows="5"
                no-resize
                class="mb-4"
              />

              <v-tooltip
                :text="t('contacts.form.submitTooltipDisabled')"
                :disabled="isFormReady"
                location="top"
              >
                <template #activator="{ props: tooltipProps }">
                  <div v-bind="tooltipProps">
                    <v-btn
                      type="submit"
                      color="primary"
                      size="large"
                      :loading="loading"
                      :disabled="!isFormReady"
                      append-icon="mdi-send"
                      block
                      class="submit-btn"
                    >
                      {{ t('contacts.form.submit') }}
                    </v-btn>
                  </div>
                </template>
              </v-tooltip>
            </v-form>
          </v-card>
        </v-col>

        <!-- ── RIGHT: Sidebar ─────────────────────────────── -->
        <v-col cols="12" md="5">
          <div class="d-flex flex-column ga-5">

            <!-- Freelance availability banner -->
            <div>
              <p class="text-overline text-primary font-weight-bold mb-3 brand-mono d-flex align-center ga-1">
                <v-icon size="14" color="primary">mdi-briefcase-outline</v-icon>
                {{ t('contacts.availability.eyebrow') }}
              </p>
              <div
                class="availability-banner"
                :class="isFreelanceAvailable ? 'availability-banner--available' : 'availability-banner--busy'"
              >
                <!-- Status row -->
                <div class="d-flex align-center ga-2 mb-2">
                  <span
                    class="availability-dot"
                    :class="isFreelanceAvailable ? 'availability-dot--green' : 'availability-dot--amber'"
                  />
                  <span
                    class="text-overline font-weight-bold brand-mono availability-status"
                    :class="isFreelanceAvailable ? 'availability-status--available' : 'availability-status--busy'"
                  >
                    {{ isFreelanceAvailable ? t('contacts.availability.statusAvailable') : t('contacts.availability.statusBusy') }}
                  </span>
                </div>

                <!-- Title -->
                <p class="text-body-1 font-weight-bold mb-1 availability-banner__title">
                  {{ isFreelanceAvailable ? t('contacts.availability.availableTitle') : t('contacts.availability.unavailableTitle') }}
                </p>

                <!-- Subtitle -->
                <p class="text-body-2 availability-banner__subtitle mb-3">
                  {{ isFreelanceAvailable ? t('contacts.availability.availableSubtitle') : t('contacts.availability.unavailableSubtitle') }}
                </p>

                <!-- Hint -->
                <div class="d-flex align-center ga-1 availability-banner__hint">
                  <v-icon size="13">{{ isFreelanceAvailable ? 'mdi-arrow-right-thin' : 'mdi-lightbulb-on-outline' }}</v-icon>
                  <span class="text-caption">
                    {{ isFreelanceAvailable ? t('contacts.availability.availableHint') : t('contacts.availability.unavailableHint') }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Email -->
            <div>
              <p class="text-overline text-primary font-weight-bold mb-3 brand-mono d-flex align-center ga-1">
                <v-icon size="14" color="primary">mdi-email-outline</v-icon>
                {{ t('contacts.email.eyebrow') }}
              </p>
              <v-btn
                href="mailto:hey@heyatom.dev"
                variant="tonal"
                color="primary"
                size="large"
                block
                class="social-btn"
              >
                <v-icon start>mdi-email-outline</v-icon>
                hey@heyatom.dev
              </v-btn>
            </div>

            <!-- Social links -->
            <div>
              <p class="text-overline text-primary font-weight-bold mb-3 brand-mono d-flex align-center ga-1">
                <v-icon size="14" color="primary">mdi-share-variant-outline</v-icon>
                {{ t('contacts.socials.eyebrow') }}
              </p>
              <v-row dense>
                <v-col
                  v-for="link in socialLinks"
                  :key="link.href"
                  cols="6"
                >
                  <v-btn
                    :href="link.href"
                    :aria-label="link.label"
                    target="_blank"
                    rel="noreferrer noopener"
                    variant="tonal"
                    color="primary"
                    size="large"
                    block
                    class="social-btn"
                  >
                    <v-icon start>{{ link.icon }}</v-icon>
                    {{ link.name }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>

          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- ── Success dialog ─────────────────────────────────── -->
    <v-dialog v-model="successDialog" max-width="460" :persistent="false" rounded="xl">
      <v-card rounded="xl" elevation="4" class="success-dialog-card pa-8 text-center">
        <!-- animated icon -->
        <div class="success-icon-wrap mx-auto mb-5">
          <v-icon size="64" color="success">mdi-check-circle-outline</v-icon>
        </div>

        <h2 class="text-h6 font-weight-bold mb-3">
          {{ t('contacts.form.successDialog.title') }}
        </h2>
        <p class="text-body-2 text-medium-emphasis mb-7" style="line-height:1.75">
          {{ t('contacts.form.successDialog.subtitle') }}
        </p>

        <v-btn
          color="primary"
          size="large"
          rounded="lg"
          block
          @click="successDialog = false"
        >
          {{ t('contacts.form.successDialog.close') }}
        </v-btn>
      </v-card>
    </v-dialog>

    <!-- ── Error snackbar ──────────────────────────────────── -->
    <v-snackbar
      v-model="snackbar"
      color="error"
      location="bottom right"
      :timeout="5000"
      rounded="lg"
    >
      <div class="d-flex align-center ga-2">
        <v-icon>mdi-alert-circle-outline</v-icon>
        {{ snackbarMessage }}
      </div>
      <template #actions>
        <v-btn variant="text" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
/* ── CSS custom props (matching rest of the site) ──────── */
.contacts-page {
  --home-card-top:    rgba(255, 255, 255, 0.96);
  --home-card-bottom: rgba(245, 248, 247, 0.88);
  --home-brand-soft:  rgba(0, 168, 107, 0.12);
  /* Availability banner – light */
  --avail-bg-start: rgba(0, 168, 107, 0.10);
  --avail-bg-end:   rgba(0, 200, 130, 0.04);
  --avail-border:   rgba(0, 168, 107, 0.22);
  --busy-bg-start:  rgba(255, 160, 0, 0.09);
  --busy-bg-end:    rgba(255, 190, 60, 0.04);
  --busy-border:    rgba(255, 160, 0, 0.20);
}

:global(.v-theme--dark) .contacts-page {
  --home-card-top:    rgba(22, 27, 26, 0.96);
  --home-card-bottom: rgba(15, 20, 19, 0.88);
  --home-brand-soft:  rgba(0, 168, 107, 0.18);
  /* Availability banner – dark */
  --avail-bg-start: rgba(0, 168, 107, 0.16);
  --avail-bg-end:   rgba(0, 200, 130, 0.07);
  --avail-border:   rgba(0, 168, 107, 0.32);
  --busy-bg-start:  rgba(255, 160, 0, 0.14);
  --busy-bg-end:    rgba(255, 190, 60, 0.06);
  --busy-border:    rgba(255, 160, 0, 0.30);
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

/* ── Brand mono ────────────────────────────────────────── */
.brand-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.08em;
}


/* ── Contact card (form) ───────────────────────────────── */
.contact-card {
  background: linear-gradient(
    180deg,
    var(--home-card-top, rgba(255, 255, 255, 0.96)),
    var(--home-card-bottom, rgba(245, 248, 247, 0.88))
  );
  border: 1px solid var(--home-brand-soft, rgba(0, 168, 107, 0.12));
  position: relative;
  overflow: hidden;
}

/* HT_Pattern_1 tiled across the entire card */
.contact-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/HT_Pattern_1.svg');
  background-size: 110%;
  background-repeat: no-repeat;
  opacity: 0.05;
  pointer-events: none;
}

/* ── Social buttons ────────────────────────────────────── */
.social-btn {
  justify-content: flex-start !important;
  text-transform: none !important;
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.social-btn:hover  { transform: translateY(-3px); }
.social-btn:active { transform: translateY(-1px); }

/* Icon slides right on hover */
.social-btn :deep(.v-icon) {
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.social-btn:hover :deep(.v-icon) {
  transform: translateX(3px);
}

@media (prefers-reduced-motion: reduce) {
  .social-btn,
  .social-btn :deep(.v-icon) { transition: none !important; }
  .social-btn:hover,
  .social-btn:active          { transform: none; }
  .social-btn:hover :deep(.v-icon) { transform: none; }
}

/* ── Availability banner ───────────────────────────────── */
.availability-banner {
  border-radius: 16px;
  padding: 20px 22px;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.availability-banner--available {
  background: linear-gradient(135deg, var(--avail-bg-start) 0%, var(--avail-bg-end) 100%);
  border-color: var(--avail-border);
}

.availability-banner--busy {
  background: linear-gradient(135deg, var(--busy-bg-start) 0%, var(--busy-bg-end) 100%);
  border-color: var(--busy-border);
}

/* Status dot */
.availability-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.availability-dot--green {
  background: #00a86b;
  animation: pulse-green 2.4s ease-in-out infinite;
}

.availability-dot--amber {
  background: #ffa000;
}

@keyframes pulse-green {
  0%   { box-shadow: 0 0 0 0 rgba(0, 168, 107, 0.55); }
  65%  { box-shadow: 0 0 0 8px rgba(0, 168, 107, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 168, 107, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .availability-dot--green { animation: none; }
}

/* Status label colour */
.availability-status {
  font-size: 0.68rem !important;
  letter-spacing: 0.1em;
}

.availability-status--available { color: #00a86b; }
.availability-status--busy      { color: #ffa000; }

/* Body copy */
.availability-banner__title {
  line-height: 1.35;
}

.availability-banner__subtitle {
  line-height: 1.65;
  opacity: 0.78;
}

/* Hint row */
.availability-banner__hint {
  opacity: 0.72;
  font-style: italic;
}

.availability-banner--available .availability-banner__hint { color: #00a86b; opacity: 0.9; }
.availability-banner--busy      .availability-banner__hint { color: #ffa000; opacity: 0.85; }

/* ── Submit button ─────────────────────────────────────── */
.submit-btn {
  transition: opacity 0.25s ease, transform 0.15s ease !important;
  text-transform: none !important;
  letter-spacing: 0.01em;
}

/* Disabled state – intentionally visible */
.submit-btn:deep(.v-btn--disabled.v-btn--variant-elevated),
.submit-btn:deep(.v-btn--disabled) {
  opacity: 0.42 !important;
  filter: grayscale(0.25);
}

/* Hover lift when enabled */
.submit-btn:not(:disabled):hover {
  transform: translateY(-1px);
}

/* ── Success dialog ────────────────────────────────────── */
.success-dialog-card {
  background: linear-gradient(
    160deg,
    var(--home-card-top, rgba(255, 255, 255, 0.98)),
    var(--home-card-bottom, rgba(245, 248, 247, 0.92))
  );
  border: 1px solid rgba(0, 168, 107, 0.18);
}

.success-icon-wrap {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(0, 168, 107, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: successPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes successPop {
  0%   { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1);   opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .success-icon-wrap { animation: none; }
}
</style>

