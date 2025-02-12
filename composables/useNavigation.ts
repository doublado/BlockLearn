import { useRouter, useRoute } from 'vue-router';

export const useNavigation = () => {
  const router = useRouter();
  const route = useRoute();

  // Define a default list for frontpage sections
  const defaultFrontpageSections = ['about', 'courses', 'contact'];

  const handleNavigate = (
    path: string,
    query: Record<string, string> = {},
    frontpageSections: string[] = defaultFrontpageSections
  ) => {
    if (frontpageSections.includes(path)) {
      if (route.path === '/') {
        const el = document.getElementById(path);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        router.push({ path: '/', query }).then(() => {
          setTimeout(() => {
            const el = document.getElementById(path);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        });
      }
    } else {
      // For other routes, perform a normal push
      const targetPath = path ? `/${path}` : '/';
      router.push({ path: targetPath, query });
    }
  };

  return { handleNavigate };
};
