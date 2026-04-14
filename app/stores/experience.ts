import { defineStore } from 'pinia';

export type ExperienceType = 'work' | 'community' | 'volunteer';

export interface ExperienceItem {
  key: string;
  from: string;     // 'YYYY-MM'
  to: string;       // 'YYYY-MM' or '' for present
  type: ExperienceType;
  website: string;
  icon?: string;    // MDI icon name (fallback: 'mdi-briefcase-outline')
  svgIcon?: string; // absolute path to SVG asset
}

export const useExperienceStore = defineStore('experience', {
  state: () => ({
    items: [
      { key: 'medas',        from: '2016-06', to: '',        type: 'work', website: 'https://medas-solutions.it/',   svgIcon: '/assets/logos/company/medas.svg'    },
      { key: 'elementBoard', from: '2020-11', to: '',        type: 'work', website: 'https://element-gaming.eu/',   svgIcon: '/assets/logos/company/element.svg'  },
      { key: 'elementDev',   from: '2019-02', to: '2020-11', type: 'work', website: 'https://element-gaming.eu/',   svgIcon: '/assets/logos/company/element.svg'  },
    ] as ExperienceItem[],
  }),
});
