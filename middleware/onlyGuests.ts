import { useUserStore } from '~/stores/user';

/**
 * Middleware to redirect logged-in users away from guest-only pages.
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  if (userStore.user) {
    // If user is logged in, redirect to the dashboard.
    return navigateTo('/dashboard');
  }
});
