import { useRouter, useRoute } from 'vue-router';

/**
 * Composable to handle navigation for both frontpage sections and normal routes.
 */
export const useNavigation = () => {
  const router = useRouter();
  const route = useRoute();

  // Default frontpage sections that support in-page scrolling.
  const defaultFrontpageSections = ['about', 'courses', 'contact'];

  /**
   * Navigate to a given path.
   * If the path is one of the frontpage sections, scroll smoothly to that element.
   * Otherwise, perform a normal route push.
   *
   * @param path - The target path or frontpage section ID.
   * @param query - Optional query parameters.
   * @param frontpageSections - Optional array of sections considered as frontpage anchors.
   */
  const handleNavigate = (
    path: string,
    query: Record<string, string> = {},
    frontpageSections: string[] = defaultFrontpageSections
  ) => {
    if (frontpageSections.includes(path)) {
      // If already on the homepage, scroll to the section.
      if (route.path === '/') {
        const element = document.getElementById(path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Otherwise, navigate to the homepage and scroll after a brief delay.
        router.push({ path: '/', query }).then(() => {
          setTimeout(() => {
            const element = document.getElementById(path);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        });
      }
    } else {
      // For non-frontpage routes, perform a standard navigation.
      const targetPath = path ? `/${path}` : '/';
      router.push({ path: targetPath, query });
    }
  };

  return { handleNavigate };
};
