// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxtjs-naive-ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: "first" }]
  }
})
