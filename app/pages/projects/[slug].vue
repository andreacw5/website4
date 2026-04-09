<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import ProjectCard from "~/components/projects/ProjectCard.vue";

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

// Recupera il progetto dal path della route — il path Nuxt Content include la cartella
const { data: project } = await useAsyncData(
  `project-${route.params.slug}`,
  () => queryCollection('projects').path(`/projects/${route.params.slug}`).first(),
);

// 404 se non trovato
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Progetto non trovato' });
}

// SEO dinamico
useSeoMeta({
  title: project.value.title,
  description: project.value.description ?? t('projects.seo.description'),
  ogTitle: `${project.value.title} · Andrea Tombolato`,
  ogDescription: project.value.description ?? t('projects.seo.description'),
  ogImage: project.value.preview,
  ogType: 'article',
  twitterCard: 'summary_large_image',
});

// Galleria collassabile
const galleryOpen = ref(false);

// Progetti simili (stesso main stack, esclude il corrente, max 3)
const { data: similarProjects } = await useAsyncData(
  `similar-${route.params.slug}`,
  async () => {
    const mainName = project.value?.technical?.main?.name;
    if (!mainName) return [];
    const all = await queryCollection('projects').all();
    return all
      .filter(p => p.path !== `/projects/${route.params.slug}` && p.technical?.main?.name === mainName)
      .slice(0, 3);
  },
);

// Lightbox galleria
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const images = computed(() => project.value?.images ?? []);

const openLightbox = (index: number) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};

const prevImage = () => {
  lightboxIndex.value = (lightboxIndex.value - 1 + images.value.length) % images.value.length;
};

const nextImage = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % images.value.length;
};

// Navigazione lightbox da tastiera
const onKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return;
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'Escape') lightboxOpen.value = false;
};

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <div v-if="project" class="project-detail">

    <!-- ─── Hero fullwidth ───────────────────────────────────────── -->
    <div class="hero-img-wrapper">
      <v-img
        v-if="project.preview"
        :src="project.preview"
        :alt="project.title"
        cover
        class="hero-img"
      >
        <div class="hero-overlay d-flex align-end">
          <v-container max-width="1280" class="px-4 px-md-6 pb-8">
            <h1 class="text-h3 font-weight-bold text-white hero-title">{{ project.title }}</h1>
          </v-container>
        </div>
      </v-img>

      <!-- Fallback se nessuna preview -->
      <div v-else class="hero-img-fallback d-flex align-end">
        <v-container max-width="1280" class="px-4 px-md-6 pb-8">
          <h1 class="text-h3 font-weight-bold">{{ project.title }}</h1>
          <p v-if="project.startDate" class="text-body-2 text-medium-emphasis mt-1">
            {{ project.startDate }}
          </p>
        </v-container>
      </div>
    </div>

    <!-- ─── Corpo pagina ─────────────────────────────────────────── -->
    <v-container max-width="1280" class="px-4 px-md-6 py-8 py-md-12">

      <!-- Breadcrumb / Back -->
      <v-btn
        :to="localePath('/projects')"
        variant="tonal"
        color="primary"
        prepend-icon="mdi-arrow-left"
        size="default"
        class="mb-8 font-weight-bold"
      >
        {{ t('projects.detail.back') }}
      </v-btn>

      <v-row>
        <!-- Colonna principale -->
        <v-col cols="12" lg="8">

          <!-- Panoramica / descrizione completa -->
          <section class="mb-10" aria-labelledby="detail-overview">
            <h2 id="detail-overview" class="section-eyebrow text-overline text-primary font-weight-bold mb-1">
              {{ t('projects.detail.overview') }}
            </h2>
            <p v-if="project.startDate" class="text-caption text-medium-emphasis mb-3">
              {{ t('projects.detail.startDate', { date: project.startDate }) }}
            </p>
            <div class="text-body-1 project-content">
              <ContentRenderer v-if="project.body" :value="project" />
              <p v-else class="text-medium-emphasis">{{ project.description }}</p>
            </div>
          </section>

          <!-- Features -->
          <section v-if="project.features?.length" class="mb-10" aria-labelledby="detail-features">
            <h2 id="detail-features" class="section-eyebrow text-overline text-primary font-weight-bold mb-5">
              {{ t('projects.detail.features') }}
            </h2>
            <v-row>
              <v-col
                v-for="(feature, i) in project.features"
                :key="i"
                cols="12"
                sm="6"
              >
                <v-card class="feature-card h-100" rounded="xl" elevation="0">
                  <v-card-text class="d-flex ga-4">
                    <v-avatar size="44" color="primary" variant="tonal" rounded="lg" class="flex-shrink-0">
                      <Icon :icon="feature.icon" width="22" height="22" />
                    </v-avatar>
                    <div>
                      <div class="text-body-1 font-weight-semibold mb-1">{{ feature.title }}</div>
                      <p class="text-body-2 text-medium-emphasis">{{ feature.subtitle }}</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </section>

          <!-- Galleria immagini -->
          <section v-if="images.length" class="mb-10" aria-labelledby="detail-gallery">
            <button
              class="gallery-toggle w-100"
              :aria-expanded="galleryOpen"
              aria-controls="gallery-content"
              @click="galleryOpen = !galleryOpen"
            >
              <h2 id="detail-gallery" class="section-eyebrow text-overline text-primary font-weight-bold">
                {{ t('projects.detail.gallery') }}
                <span class="text-medium-emphasis text-caption font-weight-regular ml-2">({{ images.length }})</span>
              </h2>
              <v-icon
                :icon="galleryOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                color="primary"
                size="20"
              />
            </button>

            <v-expand-transition>
              <div v-if="galleryOpen" id="gallery-content">
                <v-row class="mt-4">
                  <v-col
                    v-for="(img, i) in images"
                    :key="i"
                    cols="6"
                    md="4"
                  >
                    <v-card
                      class="gallery-card"
                      rounded="lg"
                      elevation="0"
                      @click="openLightbox(i)"
                    >
                      <v-img
                        :src="img.image"
                        :alt="img.title"
                        cover
                        class="gallery-img"
                        lazy-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                      >
                        <template #placeholder>
                          <div class="d-flex align-center justify-center h-100">
                            <v-progress-circular indeterminate color="primary" size="20" />
                          </div>
                        </template>
                      </v-img>
                      <div v-if="img.title" class="gallery-caption px-3 py-2">
                        <span class="text-caption text-medium-emphasis">{{ img.title }}</span>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
          </section>

        </v-col>

        <!-- Sidebar destra -->
        <v-col cols="12" lg="4">

          <!-- Link in evidenza -->
          <v-card
            v-if="project.github || project.website"
            class="sidebar-card mb-6"
            rounded="xl"
            elevation="0"
          >
            <v-card-text class="pa-5">
              <p class="text-overline text-primary font-weight-bold mb-3">{{ t('projects.detail.links') }}</p>
              <div class="d-flex flex-column ga-2">
                <v-btn
                  v-if="project.github"
                  :href="project.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-github"
                  block
                >
                  {{ t('projects.detail.viewGithub') }}
                </v-btn>
                <v-btn
                  v-if="project.website"
                  :href="project.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-open-in-new"
                  block
                >
                  {{ t('projects.detail.viewWebsite') }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Stack tecnico -->
          <v-card
            v-if="project.technical"
            class="sidebar-card mb-6"
            rounded="xl"
            elevation="0"
          >
            <v-card-text class="pa-5">
              <p class="text-overline text-primary font-weight-bold mb-3">{{ t('projects.detail.techStack') }}</p>

              <!-- Tech principale -->
              <div v-if="project.technical.main" class="d-flex align-center ga-3 mb-4">
                <v-avatar
                  size="40"
                  rounded="lg"
                  color="surface-variant"
                  variant="flat"
                >
                  <span
                    v-if="project.technical.main.icon?.startsWith('/')"
                    :style="{
                      display: 'inline-block',
                      width: '22px',
                      height: '22px',
                      backgroundColor: project.technical.main.color || 'white',
                      WebkitMask: `url(${project.technical.main.icon}) no-repeat center / contain`,
                      mask: `url(${project.technical.main.icon}) no-repeat center / contain`,
                    }"
                    :aria-label="project.technical.main.name"
                  />
                  <Icon v-else :icon="project.technical.main.icon" width="22" height="22" :color="project.technical.main.color" />
                </v-avatar>
                <div>
                  <div class="text-body-2 font-weight-semibold">{{ project.technical.main.name }}</div>
                  <div class="text-caption text-medium-emphasis">Main stack</div>
                </div>
              </div>

              <!-- Tutte le tech -->
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="tech in project.technical.technologies"
                  :key="tech.title"
                  color="gray"
                  variant="flat"
                  size="small"
                >
                  <template #prepend>
                    <span
                      v-if="tech.icon?.startsWith('/')"
                      class="mr-1"
                      :style="{
                        display: 'inline-block',
                        width: '13px',
                        height: '13px',
                        backgroundColor: 'white',
                        WebkitMask: `url(${tech.icon}) no-repeat center / contain`,
                        mask: `url(${tech.icon}) no-repeat center / contain`,
                        flexShrink: '0',
                      }"
                      :aria-label="tech.title"
                    />
                    <Icon v-else :icon="tech.icon" width="13" height="13" class="mr-1" color="white" />
                  </template>
                  {{ tech.title }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- Client / Committente -->
          <v-card
            v-if="project.client"
            class="sidebar-card"
            rounded="xl"
            elevation="0"
          >
            <v-card-text class="pa-5">
              <p class="text-overline text-primary font-weight-bold mb-3">{{ t('projects.detail.client') }}</p>

              <div class="d-flex align-center ga-3 mb-3">
                <v-avatar
                  v-if="project.client.logo"
                  size="44"
                  rounded="lg"
                  color="surface-variant"
                >
                  <v-img :src="project.client.logo" :alt="project.client.name" />
                </v-avatar>
                <v-avatar
                  v-else
                  size="44"
                  rounded="lg"
                  color="primary"
                  variant="tonal"
                >
                  <v-icon>mdi-domain</v-icon>
                </v-avatar>
                <div class="text-body-2 font-weight-semibold">{{ project.client.name }}</div>
              </div>

              <p v-if="project.client.bio" class="text-body-2 text-medium-emphasis mb-3">
                {{ project.client.bio }}
              </p>

              <!-- Link social cliente -->
              <div class="d-flex flex-wrap ga-1">
                <v-btn
                  v-if="project.client.website"
                  :href="project.client.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon="mdi-web"
                  variant="text"
                  size="small"
                  :aria-label="`Sito di ${project.client.name}`"
                />
                <v-btn
                  v-if="project.client.instagram"
                  :href="project.client.instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon="mdi-instagram"
                  variant="text"
                  size="small"
                  :aria-label="`Instagram di ${project.client.name}`"
                />
                <v-btn
                  v-if="project.client.linkedin"
                  :href="project.client.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon="mdi-linkedin"
                  variant="text"
                  size="small"
                  :aria-label="`LinkedIn di ${project.client.name}`"
                />
              </div>
            </v-card-text>
          </v-card>

        </v-col>
      </v-row>

      <!-- ─── Progetti simili ──────────────────────────────────── -->
      <section v-if="similarProjects?.length" class="similar-section mt-12 pt-10">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <p class="section-eyebrow text-overline text-primary font-weight-bold mb-1">
              {{ t('projects.detail.similar') }}
            </p>
            <h2 class="text-h6 font-weight-semibold">
              {{ t('projects.detail.similarSubtitle', { stack: project.technical?.main?.name }) }}
            </h2>
          </div>
          <v-btn
            :to="localePath('/projects')"
            variant="text"
            color="primary"
            append-icon="mdi-arrow-right"
            size="small"
            class="d-none d-sm-flex"
          >
            {{ t('projects.detail.allProjects') }}
          </v-btn>
        </div>

        <v-row>
          <v-col
            v-for="p in similarProjects"
            :key="p.path"
            cols="12"
            sm="6"
            md="4"
          >
            <ProjectCard
              :title="p.title"
              :preview="p.preview"
              :slug="p.path"
              :client="p.client"
            />
          </v-col>
        </v-row>
      </section>

    </v-container>

    <!-- ─── Lightbox fullscreen ──────────────────────────────────── -->
    <v-dialog
      v-model="lightboxOpen"
      fullscreen
      :scrim="false"
      transition="fade-transition"
    >
      <div class="lightbox-wrapper d-flex align-center justify-center" @click.self="lightboxOpen = false">
        <!-- Chiudi -->
        <v-btn
          icon="mdi-close"
          variant="flat"
          color="surface"
          size="small"
          class="lightbox-close"
          :aria-label="t('projects.detail.closeImage')"
          @click="lightboxOpen = false"
        />

        <!-- Prev -->
        <v-btn
          v-if="images.length > 1"
          icon="mdi-chevron-left"
          variant="flat"
          color="surface"
          size="small"
          class="lightbox-prev"
          aria-label="Immagine precedente"
          @click="prevImage"
        />

        <!-- Immagine corrente -->
        <v-img
          :src="images[lightboxIndex]?.image"
          :alt="images[lightboxIndex]?.title"
          contain
          class="lightbox-img"
          max-height="90vh"
          max-width="90vw"
        />

        <!-- Next -->
        <v-btn
          v-if="images.length > 1"
          icon="mdi-chevron-right"
          variant="flat"
          color="surface"
          size="small"
          class="lightbox-next"
          aria-label="Immagine successiva"
          @click="nextImage"
        />

        <!-- Didascalia -->
        <div v-if="images[lightboxIndex]?.title" class="lightbox-caption text-caption text-white">
          {{ images[lightboxIndex].title }}
          <span class="ml-2 opacity-50">{{ lightboxIndex + 1 }} / {{ images.length }}</span>
        </div>
      </div>
    </v-dialog>

  </div>
</template>

<style scoped>
/* ─── Hero ─────────────────────────────────────── */
.hero-img-wrapper {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  position: relative;
}

.hero-img {
  width: 100%;
  height: 300px;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.25) 100%);
}

.hero-title {
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
}

.hero-img-fallback {
  min-height: 200px;
  background: rgba(var(--v-theme-surface-variant), 1);
}

/* ─── Sezioni ───────────────────────────────────── */
.section-eyebrow {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.1em;
}

/* ─── Feature cards ─────────────────────────────── */
.feature-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.07);
}

/* ─── Gallery ───────────────────────────────────── */
.gallery-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: rgba(var(--v-theme-on-surface), 0.04);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.gallery-toggle:hover {
  background: rgba(var(--v-theme-on-surface), 0.07);
}

.gallery-card {
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.07);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gallery-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}

.gallery-img {
  aspect-ratio: 16 / 10;
}

.gallery-caption {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.07);
  line-height: 1.4;
}

.gallery-overlay {
  pointer-events: none;
}

/* ─── Sidebar ───────────────────────────────────── */
.sidebar-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.07);
}

/* ─── Lightbox ──────────────────────────────────── */
.lightbox-wrapper {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.94);
  z-index: 9999;
}

.lightbox-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
}

.lightbox-prev {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.lightbox-next {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.lightbox-img {
  border-radius: 8px;
  object-fit: contain;
}

.lightbox-caption {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.6);
  padding: 6px 14px;
  border-radius: 20px;
  white-space: nowrap;
}

/* ─── Similar projects ──────────────────────────── */
.similar-section {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* ─── Content renderer (markdown) ──────────────── */
.project-content :deep(p) {
  margin-bottom: 1em;
  line-height: 1.75;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.project-content :deep(h2),
.project-content :deep(h3) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.project-content :deep(ul),
.project-content :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

.project-content :deep(li) {
  margin-bottom: 0.35em;
  line-height: 1.65;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.project-content :deep(a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

@media (max-width: 599px) {
  .hero-img {
    height: 200px;
  }
}
</style>

