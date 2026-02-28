// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
  ],
  build: {
    transpile: ['chart.js', 'vue-chartjs'],
  },
  colorMode: false,
  runtimeConfig: {
    public: {
      apiBase: '',
      appUrl: '',
      authCookieName: '',
      appName: '',
      appEnv: '',
    },
  },
})
