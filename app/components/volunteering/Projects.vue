<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import type { VolunteeringProject } from '~/types/volunteering';

const { t } = useI18n();


const { data: rawProjects } = await useAsyncData<VolunteeringProject[]>(
  'volunteering-projects',
  async () => {
    const items = await queryCollection('volunteeringProjects').order('order', 'ASC').all();
    return items.map((item) => ({
      title: item.title,
      slug: item.slug,
      tag: item.tag,
      link: item.link ?? '',
      facebook: item.facebook ?? '',
      instagram: item.instagram ?? '',
      github: item.github ?? '',
      order: item.order ?? 0,
    }));
  },
);

// Description texts per slug (from i18n)
const descriptionKeyMap: Record<string, string> = {
  'prociv-sito': 'volunteering.projects.items.website.description',
  'social-media': 'volunteering.projects.items.social.description',
  'bot-allerte': 'volunteering.projects.items.bot.description',
};

// Intersection observer for stagger fade-in animation
const cardRefs = ref<any[]>([]);
const visibleCards = ref<boolean[]>([]);
let observers: IntersectionObserver[] = [];

onMounted(() => {
  const count = rawProjects.value?.length ?? 0;
  visibleCards.value = Array(count).fill(false);

  cardRefs.value.forEach((el, index) => {
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setTimeout(() => {
            visibleCards.value[index] = true;
          }, index * 100);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el as unknown as Element);
    observers.push(obs);
  });
});

onBeforeUnmount(() => {
  observers.forEach((obs) => obs.disconnect());
  observers = [];
});
</script>

<template>
  <section class="vol-projects-section" aria-labelledby="projects-heading">
    <p class="text-overline text-primary font-weight-bold mb-3 brand-mono d-flex align-center ga-1">
      <v-icon size="16" color="primary">mdi-hammer-wrench</v-icon>
      {{ t('volunteering.projects.eyebrow') }}
    </p>
    <h2 id="projects-heading" class="text-h5 font-weight-bold mb-8">
      {{ t('volunteering.projects.title') }}
    </h2>

    <v-row>
      <v-col
        v-for="(project, index) in rawProjects"
        :key="project.slug"
        cols="12"
        sm="6"
        md="4"
      >
        <div
          :ref="(el) => { if (el) cardRefs[index] = el }"
          class="card-animate"
          :class="{ 'card-enter': visibleCards[index] }"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <VolunteeringProjectCard :project="project">
            {{ t(descriptionKeyMap[project.slug] ?? '') }}
          </VolunteeringProjectCard>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<style scoped>
.brand-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.08em;
}

@keyframes cardFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-animate {
  opacity: 0;
  height: 100%;
}

.card-animate.card-enter {
  animation: cardFadeUp 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .card-animate {
    opacity: 1;
    animation: none !important;
  }
}
</style>

