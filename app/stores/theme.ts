import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
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
          // Controlla la preferenza del sistema
          this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
      }
    },
  },

  getters: {
    currentTheme: (state) => state.isDark ? 'dark' : 'light',
  },
});

