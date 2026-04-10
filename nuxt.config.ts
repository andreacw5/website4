// https://nuxt.com/docs/api/configuration/nuxt-config

import { readFileSync } from 'fs';
import { resolve } from 'path';

const packageJson = JSON.parse(readFileSync(resolve(__dirname, './package.json'), 'utf-8'));

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2026-04-10',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      version: packageJson.version,
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    },
  },

  app: {
    head: {
      titleTemplate: '%s - Andrea Tombolato',
      meta: [{ name: 'robots', content: 'index, follow' }],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@nuxtjs/seo',
    '@nuxtjs/robots',
  ],

  ogImage: {
    enabled: false,
  },

  i18n: {
    strategy: 'prefix_except_default',
    locales: [
      { code: 'it', iso: 'it-IT', name: 'Italiano', file: 'it.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'it',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
    },
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
  },

  robots: {
    blockNonSeoBots: true,
    blockAiBots: true,
    groups: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },

  googleFonts: {
    subsets: ['latin'],
    families: {
      Inter: [400, 700],
      'JetBrains Mono': [400, 600],
    },
    display: 'swap',
    prefetch: false,
    preconnect: true,
    preload: false,
    inject: true,
    download: true,
  },

  vuetify: {
    moduleOptions: {
      styles: { configFile: '/assets/settings.scss' },
    },
    vuetifyOptions: {
      defaults: {
        VBtn: {
          rounded: 'lg',
          elevation: 0,
          class: 'text-none font-weight-medium',
        },
        VCard: {
          rounded: 'lg',
          elevation: 0,
        },
        VTextField: {
          variant: 'outlined',
          density: 'comfortable',
          color: 'primary',
        },
        VTextarea: {
          variant: 'outlined',
          density: 'comfortable',
          color: 'primary',
        },
        VSelect: {
          variant: 'outlined',
          density: 'comfortable',
          color: 'primary',
        },
        VChip: {
          size: 'small',
        },
      },
      theme: {
        defaultTheme: 'dark',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#00a86b',
              'primary-darken-1': '#007a4d',
              'primary-lighten-1': '#33bf89',
              secondary: '#007a4d',
              accent: '#33bf89',
              error: '#D32F2F',
              info: '#0288D1',
              success: '#388E3C',
              warning: '#F57C00',
              background: '#F2F8F5',
              surface: '#FFFFFF',
              'surface-variant': '#E5F1EB',
              'on-surface': '#16211C',
              'on-surface-variant': '#2E433A',
              'on-primary': '#FFFFFF',
              'on-secondary': '#FFFFFF',
              'on-background': '#16211C',
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: '#00a86b',
              'primary-darken-1': '#007a4d',
              'primary-lighten-1': '#33bf89',
              secondary: '#007a4d',
              accent: '#33bf89',
              error: '#CF6679',
              info: '#4FC3F7',
              success: '#66BB6A',
              warning: '#FFD54F',
              background: '#0D1412',
              surface: '#121C19',
              'surface-variant': '#1D2B27',
              'surface-bright': '#243630',
              'on-surface': '#EAF5F1',
              'on-surface-variant': '#C5D8D1',
              'on-primary': '#FFFFFF',
              'on-secondary': '#FFFFFF',
              'on-background': '#EAF5F1',
            },
          },
        },
      },
    },
  },

  css: ['~/assets/main.scss'],

  nitro: {
    compressPublicAssets: true,
  },

  build: {
    transpile: ['vuetify'],
  },
});
