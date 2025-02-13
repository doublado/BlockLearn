import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  if (userStore.user) {
    // User is logged in; redirect them to the dashboard
    return navigateTo('/dashboard')
  }
})