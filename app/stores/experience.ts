import { defineStore } from 'pinia';

export type ExperienceType = 'work' | 'community' | 'volunteer';

export interface ExperienceItem {
  key: string;
  from: string;  // 'YYYY-MM'
  to: string;    // 'YYYY-MM' or '' for present
  type: ExperienceType;
  website: string;
}

const iconMap: Record<string, string> = {
  pcsm: 'mdi-shield-outline',
};

const svgIconMap: Record<string, string> = {
  medas: '/assets/logos/company/medas.svg',
  elementBoard: '/assets/logos/company/element.svg',
  elementDev: '/assets/logos/company/element.svg',
};

export const useExperienceStore = defineStore('experience', {
  state: () => ({
    items: [
      { key: 'medas',          from: '2016-06', to: '',        type: 'work' , website: 'https://medas-solutions.it/'     },
      { key: 'elementBoard',   from: '2020-11', to: '',        type: 'work', website: 'https://element-gaming.eu/' },
      { key: 'elementDev',     from: '2019-02', to: '2020-11', type: 'work', website: 'https://element-gaming.eu/'     }
    ] as ExperienceItem[],
  }),

  getters: {
    getIcon: () => (key: string): string => iconMap[key] ?? 'mdi-briefcase-outline',
    getSvgIcon: () => (key: string): string | null => svgIconMap[key] ?? null,
  },
});
