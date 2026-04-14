import { defineStore } from 'pinia';

export interface Skill {
  key: string;
  label: string;
  svgIcon: string | null;   // path relative to /public (e.g. /assets/icons/languages/lineicons--nodejs.svg)
  mdiIcon: string | null;   // fallback MDI icon when no SVG is available
  website: string;
}

export const useSkillsStore = defineStore('skills', {
  state: (): { items: Skill[] } => ({
    items: [
      {
        key: 'nodejs',
        label: 'Node.js',
        svgIcon: '/assets/icons/languages/lineicons--nodejs.svg',
        mdiIcon: null,
        website: 'https://nodejs.org',
      },
      {
        key: 'grails',
        label: 'Grails',
        svgIcon: '/assets/icons/languages/devicon-plain--grails.svg',
        mdiIcon: null,
        website: 'https://grails.org',
      },
      {
        key: 'nestjs',
        label: 'Nest.js',
        svgIcon: '/assets/icons/languages/bxl--nest-js.svg',
        mdiIcon: null,
        website: 'https://nestjs.com',
      },
      {
        key: 'vuejs',
        label: 'Vue.js',
        svgIcon: '/assets/icons/languages/lineicons--vuejs.svg',
        mdiIcon: null,
        website: 'https://vuejs.org',
      },
      {
        key: 'nuxtjs',
        label: 'Nuxt.js',
        svgIcon: '/assets/icons/languages/lineicons--nuxt.svg',
        mdiIcon: null,
        website: 'https://nuxt.com',
      },
      {
        key: 'java',
        label: 'Java',
        svgIcon: '/assets/icons/languages/lineicons--java.svg',
        mdiIcon: null,
        website: 'https://www.java.com',
      },
      {
        key: 'typescript',
        label: 'TypeScript',
        svgIcon: '/assets/icons/languages/lineicons--typescript.svg',
        mdiIcon: null,
        website: 'https://www.typescriptlang.org',
      },
      {
        key: 'docker',
        label: 'Docker',
        svgIcon: '/assets/icons/languages/lineicons--docker.svg',
        mdiIcon: null,
        website: 'https://www.docker.com',
      },
      {
        key: 'git',
        label: 'Git',
        svgIcon: '/assets/icons/languages/lineicons--git.svg',
        mdiIcon: null,
        website: 'https://git-scm.com',
      }
    ],
  }),
});

