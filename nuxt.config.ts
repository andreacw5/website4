// https://nuxt.com/docs/api/configuration/nuxt-config

import {readFileSync} from "fs";
import {resolve} from "path";

const packageJson = JSON.parse(
    readFileSync(resolve(__dirname, './package.json'), 'utf-8')
)

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2026-04-07',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      version: packageJson.version,
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    },
  },

  app: {
    head: {
      titleTemplate: '%s - My Nuxt App',
      meta: [
        { name: 'robots', content: 'index, follow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
    }
  },

  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@nuxtjs/seo',
    '@nuxtjs/robots',
  ],

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
      escapeHtml: false
    }
  },

  robots: {
    blockNonSeoBots: true,
    blockAiBots: true,
    groups: [
      {
        userAgent: '*',
        allow: '/',
      }
    ],
  },

  googleFonts: {
    subsets: ['latin'],
    families: {
      Inter: [400, 700],
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
      // Configurazione di Vuetify
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#1976D2',
              'primary-darken-1': '#1565C0',
              'primary-lighten-1': '#42A5F5',
              secondary: '#546E7A',
              accent: '#0091EA',
              error: '#D32F2F',
              info: '#0288D1',
              success: '#388E3C',
              warning: '#F57C00',
              background: '#FAFAFA',
              surface: '#FFFFFF',
              'surface-variant': '#F5F5F5',
              'on-surface': '#212121',
              'on-surface-variant': '#424242',
              'on-primary': '#FFFFFF',
              'on-secondary': '#FFFFFF',
              'on-background': '#212121',
            }
          },
          dark: {
            dark: true,
            colors: {
              primary: '#BB86FC',
              'primary-darken-1': '#9965F4',
              'primary-lighten-1': '#D5AAFF',
              secondary: '#03DAC6',
              accent: '#FF6E40',
              error: '#CF6679',
              info: '#03DAC6',
              success: '#4CAF50',
              warning: '#FFC107',
              background: '#1A1A1A',
              surface: '#252525',
              'surface-variant': '#2F2F2F',
              'surface-bright': '#3A3A3A',
              'on-surface': '#E1E1E1',
              'on-surface-variant': '#C4C4C4',
              'on-primary': '#000000',
              'on-secondary': '#000000',
              'on-background': '#E1E1E1',
            }
          }
        }
      }
    }
  },

  css: [
    '~/assets/main.scss',
  ],

  nitro: {
    compressPublicAssets: true,
  },

  build: {
    transpile: ['vuetify'],
  },
})
