import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: true,
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      if (process.client) {
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      }
    },

    setTheme(isDark: boolean) {
      this.isDark = isDark;
      if (process.client) {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      }
    },

    initTheme() {
      if (process.client) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          this.isDark = savedTheme === 'dark';
        } else {
          // Dark-first di brand: in assenza di preferenza persistita partiamo sempre da dark.
          this.isDark = true;
        }
      }
    },
  },

  getters: {
    currentTheme: (state) => state.isDark ? 'dark' : 'light',
  },
});

