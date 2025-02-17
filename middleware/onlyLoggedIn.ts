import { useUserStore } from '~/stores/user';

/**
 * Middleware to restrict pages to logged-in users only.
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  if (!userStore.user) {
    // If user is not logged in, redirect to the authentication page.
    return navigateTo('/auth?tab=signin');
  }
});
