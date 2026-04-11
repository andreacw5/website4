<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useSkillsStore } from '~/stores/skills';

const { t } = useI18n();
const skillsStore = useSkillsStore();
</script>

<template>
  <section id="skills" class="section-block" aria-labelledby="skills-title">
    <p class="text-overline text-primary font-weight-bold mb-3 jetbrain">{{ t('home.skills.eyebrow') }}</p>
    <h2 id="skills-title" class="text-h4 font-weight-bold mb-3">{{ t('home.skills.title') }}</h2>
    <p class="text-body-1 text-medium-emphasis mb-8">{{ t('home.skills.description') }}</p>

    <v-row dense>
      <v-col
        v-for="(skill, index) in skillsStore.items"
        :key="skill.key"
        cols="6"
        sm="4"
        md="3"
        lg="2"
        class="skill-col-enter"
        :style="{ animationDelay: `${index * 0.07}s` }"
      >
        <a
          :href="skill.website"
          target="_blank"
          rel="noopener noreferrer"
          class="skill-link"
          :aria-label="skill.label"
        >
          <v-card class="skill-card pa-5 d-flex flex-column align-center ga-2 h-100" rounded="xl" elevation="0">
            <v-avatar size="72" color="primary" variant="tonal" rounded="xl" class="skill-avatar">
              <span
                v-if="skill.svgIcon"
                class="skill-icon"
                :style="{
                  maskImage: `url(${skill.svgIcon})`,
                  WebkitMaskImage: `url(${skill.svgIcon})`,
                }"
                :aria-hidden="true"
              />
              <v-icon v-else size="36" class="skill-mdi-icon">{{ skill.mdiIcon }}</v-icon>
            </v-avatar>
            <span class="text-caption text-medium-emphasis text-center skill-label jetbrain">{{ skill.label }}</span>
          </v-card>
        </a>
      </v-col>
    </v-row>
  </section>
</template>

<style scoped>
/* ─── Layout ─────────────────────────────────────────────── */
.section-block {
  padding-block: 4.5rem;
}

/* ─── Entrance animation ──────────────────────────────────── */
@keyframes skillFadeUp {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.skill-col-enter {
  opacity: 0;
  animation: skillFadeUp 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

/* ─── Link / Card ─────────────────────────────────────────── */
.skill-link {
  text-decoration: none;
  display: block;
  height: 100%;
}

.skill-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, var(--home-card-top, rgba(255,255,255,0.96)), var(--home-card-bottom, rgba(245,248,247,0.88)));
  border: 1px solid var(--home-brand-soft, rgba(0,168,107,0.12));
  transition: transform 0.25s cubic-bezier(0.22, 0.61, 0.36, 1),
              box-shadow 0.25s ease,
              border-color 0.25s ease;
}

.skill-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/HT_Pattern_1.svg');
  background-size: 180%;
  background-position: center;
  opacity: 0;
  transition: opacity 0.32s ease;
  pointer-events: none;
  border-radius: inherit;
}

.skill-link:hover .skill-card::after {
  opacity: 0.07;
}

.skill-link:hover .skill-card {
  transform: translateY(-6px);
  border-color: rgba(0, 168, 107, 0.32);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.12);
}

/* ─── Avatar glow on hover ────────────────────────────────── */
.skill-avatar {
  transition: box-shadow 0.25s ease;
}

.skill-link:hover .skill-avatar {
  box-shadow: 0 0 0 6px rgba(0, 168, 107, 0.14);
}

/* ─── SVG / MDI icon scale on hover ──────────────────────── */
.skill-icon,
.skill-mdi-icon {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.skill-link:hover .skill-icon,
.skill-link:hover .skill-mdi-icon {
  transform: scale(1.35);
}

/* CSS mask to paint the SVG with currentColor (= primary color from v-avatar) */
.skill-icon {
  display: block;
  width: 38px;
  height: 38px;
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

/* ─── Label ───────────────────────────────────────────────── */
.skill-label {
  color: var(--home-text-soft, rgba(21,33,27,0.6));
  line-height: 1.3;
  letter-spacing: 0.01em;
}
</style>
