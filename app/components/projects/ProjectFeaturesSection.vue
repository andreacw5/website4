<script setup lang="ts">
import { Icon } from '@iconify/vue';

type LocaleString = string | { it?: string; en?: string } | null | undefined;

type Feature = {
  title: LocaleString;
  subtitle: LocaleString;
  icon: string;
};

const props = defineProps<{
  features?: Feature[];
  title: string;
  loc: (field: LocaleString) => string;
}>();
</script>

<template>
  <section v-if="props.features?.length" class="mb-10" aria-labelledby="detail-features">
    <h2 id="detail-features" class="section-eyebrow text-overline text-primary font-weight-bold mb-5">
      {{ props.title }}
    </h2>
    <v-row>
      <v-col
        v-for="(feature, i) in props.features"
        :key="i"
        cols="12"
        sm="6"
      >
        <v-card class="feature-card h-100" rounded="xl" elevation="0">
          <v-card-text class="pa-6 d-flex ga-4 align-start h-100">
            <v-avatar size="44" rounded="lg" color="primary" variant="tonal" class="feature-avatar flex-shrink-0">
              <Icon :icon="feature.icon" width="22" height="22" class="feature-icon" />
            </v-avatar>

            <div class="feature-content">
              <div class="text-body-1 font-weight-semibold mb-1">{{ props.loc(feature.title) }}</div>
              <p class="text-medium-emphasis text-caption mb-0">{{ props.loc(feature.subtitle) }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<style scoped>
.section-eyebrow {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.1em;
}

.feature-card {
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

.feature-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/HT_Pattern_1.svg');
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.32s ease;
  pointer-events: none;
  border-radius: inherit;
}

.feature-card:hover::after {
  opacity: 0.07;
}

.feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0, 168, 107, 0.22);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.12);
}

.feature-content {
  min-width: 0;
}

.feature-avatar {
  transition: box-shadow 0.25s ease;
}

.feature-card:hover .feature-avatar {
  box-shadow: 0 0 0 6px rgba(0, 168, 107, 0.14);
}

.feature-icon {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.feature-card:hover .feature-icon {
  transform: scale(1.35);
}
</style>
