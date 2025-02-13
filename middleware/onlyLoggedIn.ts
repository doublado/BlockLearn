import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  
  if (!userStore.user) {
    // User is not logged in; redirect to the auth page (login/signup)
    return navigateTo('/auth?tab=signin')
  }
})