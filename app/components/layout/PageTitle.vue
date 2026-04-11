<script setup lang="ts">
interface Props {
  eyebrow: string;
  title: string;
  description: string;
  /** Optional mdi icon shown before the eyebrow text */
  icon?: string;
  /** Value used for the h1 id and aria-labelledby on the section */
  titleId?: string;
  /** Vuetify margin-bottom utility suffix (e.g. 10 → mb-10). Default: 10 */
  mb?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  mb: 10,
});

const resolvedId = computed(
  () => props.titleId ?? `page-title-${Math.random().toString(36).slice(2, 7)}`,
);
</script>

<template>
  <section
    class="page-title-hero"
    :class="`mb-${mb}`"
    :aria-labelledby="resolvedId"
  >
    <p
      class="text-overline text-primary font-weight-bold brand-mono eyebrow"
      :class="icon ? 'd-flex align-center ga-2 mb-3' : 'mb-2'"
    >
      <v-icon v-if="icon" size="16" color="primary">{{ icon }}</v-icon>
      {{ eyebrow }}
    </p>

    <h1 :id="resolvedId" class="text-h3 font-weight-bold mb-4">
      {{ title }}
    </h1>

    <p class="text-body-1 text-medium-emphasis page-title-desc">
      {{ description }}
    </p>
  </section>
</template>

<style scoped>
.brand-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.1em;
}

.page-title-desc {
  line-height: 1.8;
  font-size: 1.05rem;
}
</style>

