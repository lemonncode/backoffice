import colors from 'vuetify/es5/util/colors'
import es from 'vuetify/es5/locale/es'
require('dotenv').config()

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - backoffice',
    title: 'backoffice',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~assets/css/main'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~plugins/api',
    '~plugins/lodash',
    '~plugins/mixins',
    { src: '~plugins/vue2-google-maps', ssr: false }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [
    // Equivalent to { path: '~/components' }
    '~/components/',
    { path: '~/components/modules/' },
    { path: '~/components/shared/' }
  ],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/dotenv',
    // '@nuxtjs/eslint-module',
    '@nuxtjs/moment',
    '@nuxtjs/vuetify'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/toast'
  ],
  auth: {
    cookie: false,
    strategies: {
      local: {
        scheme: 'refresh',
        refreshToken: {
          property: 'refreshToken',
          data: 'refreshToken'
        },
        user: {
          property: 'user'
        },
        endpoints: {
          login: {
            url: '/login',
            method: 'post'
          },
          refresh: {
            url: '/token/refresh',
            method: 'post'
          },
          user: false,
          logout: false
        }
      }
    },
    redirect: {
      home: false,
      login: '/login',
      logout: '/login'
    },
    resetOnError: true,
    plugins: ['~/plugins/auth']
  },

  axios: {
  },

  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL
    },
    googleApiKey: process.env.GOOGLE_API_KEY,
    mercureUrl: process.env.BASE_MERCURE_URL + '/.well-known/mercure'
  },

  moment: {
    defaultLocale: 'es',
    locales: ['es']
  },

  toast: {
    position: 'bottom-right',
    duration: 5000,
    iconPack: 'mdi',
    theme: 'outline'
  },

  vuetify: {
    lang: {
      locales: { es },
      current: 'es'
    },
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#7DA69C',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  router: {
    middleware: ['auth']
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {}
}
