<script setup lang="ts">
const props = defineProps<{
  name: string;
  customName?: string | null;
  manufacturer: string;
  manufacturerCode: string;
  classification: string;
  focus: string;
  description?: string;
  inGame: boolean;
  productionStatus: string;
  pledgePrice?: number | null;
  size?: string | null;
  length?: number | null;
  beam?: number | null;
  height?: number | null;
  cargo?: number | null;
  crewMin?: number | null;
  crewMax?: number | null;
  scmSpeed?: number | null;
  storeUrl?: string | null;
  image?: string | null;
  flagship?: boolean;
}>();

const classificationColor = computed(() => {
  const map: Record<string, string> = {
    Combat: 'red',
    Support: 'green',
    Transport: 'blue',
    Exploration: 'orange',
    Multi: 'purple',
    Ground: 'brown',
  };
  return map[props.classification] ?? 'grey';
});

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    'flight-ready': 'In-Game',
    'in-concept': 'Concept',
    'in-production': 'In Dev',
  };
  return map[props.productionStatus] ?? props.productionStatus;
});

const statusColor = computed(() => {
  const map: Record<string, string> = {
    'flight-ready': 'success',
    'in-concept': 'warning',
    'in-production': 'info',
  };
  return map[props.productionStatus] ?? 'grey';
});

const displayName = computed(() => props.customName || props.name);
</script>

<template>
  <v-card class="ship-card h-100 d-flex flex-column" rounded="xl" elevation="0">

    <!-- ─── Cover image ──────────────────────────────────── -->
    <div class="ship-img-wrapper">
      <v-img
        v-if="image"
        :src="image"
        :alt="name"
        cover
        class="ship-img"
        lazy-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center h-100">
            <v-progress-circular indeterminate color="blue" size="28" />
          </div>
        </template>

        <!-- Flagship badge -->
        <v-chip
          v-if="flagship"
          size="x-small"
          color="amber"
          class="ship-badge ma-2"
          prepend-icon="mdi-star"
        >
          Flagship
        </v-chip>
      </v-img>
      <div v-else class="ship-img-placeholder d-flex align-center justify-center">
        <v-icon size="48" color="blue" opacity="0.25">mdi-rocket-launch-outline</v-icon>
      </div>
    </div>

    <!-- ─── Body ──────────────────────────────────────────── -->
    <v-card-item class="pt-3 pb-1 px-4">
      <div class="d-flex align-start justify-space-between ga-2 mb-1">
        <!-- Name -->
        <div class="flex-grow-1 min-w-0">
          <div class="text-body-1 font-weight-bold ship-name">{{ displayName }}</div>
          <div v-if="customName" class="text-caption text-medium-emphasis mt-n1">{{ name }}</div>
        </div>
        <!-- Status chip -->
        <v-chip :color="statusColor" size="x-small" variant="tonal" class="flex-shrink-0 mt-1">
          {{ statusLabel }}
        </v-chip>
      </div>

      <!-- Manufacturer + Classification -->
      <div class="d-flex align-center ga-2 mb-2 flex-wrap">
        <span class="text-caption text-medium-emphasis">{{ manufacturerCode }}</span>
        <span class="text-caption text-medium-emphasis">·</span>
        <v-chip :color="classificationColor" size="x-small" variant="tonal">
          {{ classification }}
        </v-chip>
        <v-chip color="blue-grey" size="x-small" variant="outlined">
          {{ focus }}
        </v-chip>
      </div>
    </v-card-item>

    <!-- ─── Description ───────────────────────────────────── -->
    <v-card-text class="py-1 px-4 flex-grow-1">
      <p class="text-body-2 text-medium-emphasis ship-desc mb-0">{{ description }}</p>
    </v-card-text>

    <!-- ─── Stats ─────────────────────────────────────────── -->
    <div class="ship-stats px-4 py-2">
      <v-divider class="mb-2" />
      <div class="d-flex flex-wrap ga-x-4 ga-y-1">
        <div v-if="size" class="stat-item">
          <v-icon size="12" class="me-1 text-medium-emphasis">mdi-resize</v-icon>
          <span class="text-caption text-medium-emphasis">{{ size }}</span>
        </div>
        <div v-if="crewMin != null" class="stat-item">
          <v-icon size="12" class="me-1 text-medium-emphasis">mdi-account-outline</v-icon>
          <span class="text-caption text-medium-emphasis">
            {{ crewMin === crewMax ? crewMin : `${crewMin}–${crewMax}` }} crew
          </span>
        </div>
        <div v-if="cargo" class="stat-item">
          <v-icon size="12" class="me-1 text-medium-emphasis">mdi-package-variant-closed</v-icon>
          <span class="text-caption text-medium-emphasis">{{ cargo }} SCU</span>
        </div>
        <div v-if="length" class="stat-item">
          <v-icon size="12" class="me-1 text-medium-emphasis">mdi-arrow-left-right</v-icon>
          <span class="text-caption text-medium-emphasis">{{ length }} m</span>
        </div>
        <div v-if="scmSpeed" class="stat-item">
          <v-icon size="12" class="me-1 text-medium-emphasis">mdi-speedometer</v-icon>
          <span class="text-caption text-medium-emphasis">{{ scmSpeed }} m/s</span>
        </div>
      </div>
    </div>

    <!-- ─── Footer ────────────────────────────────────────── -->
    <v-card-actions class="px-4 pt-1 pb-3">
      <span v-if="pledgePrice" class="text-caption text-medium-emphasis">
        <v-icon size="12" class="me-1">mdi-tag-outline</v-icon>€{{ pledgePrice }}
      </span>
      <v-spacer />
      <v-btn
        v-if="storeUrl"
        :href="storeUrl"
        target="_blank"
        rel="noopener"
        size="x-small"
        variant="tonal"
        color="blue"
        append-icon="mdi-open-in-new"
        class="text-none"
      >
        RSI Store
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<style scoped>
.ship-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.07);
  overflow: hidden;
  transition: box-shadow 0.22s ease, border-color 0.22s ease;
}

.ship-card::after {
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

.ship-card:hover::after {
  opacity: 0.05;
}

.ship-card:hover {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
  border-color: rgba(33, 150, 243, 0.2);
}

.ship-img-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: rgba(var(--v-theme-surface-variant), 1);
}

.ship-img {
  aspect-ratio: 16 / 9;
  width: 100%;
  display: block;
  transition: transform 0.4s ease;
}

.ship-card:hover .ship-img {
  transform: scale(1.04);
}

.ship-img-placeholder {
  aspect-ratio: 16 / 9;
  width: 100%;
  background: rgba(var(--v-theme-surface-variant), 1);
}

.ship-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
}

.ship-name {
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ship-desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.stat-item {
  display: flex;
  align-items: center;
}
</style>

