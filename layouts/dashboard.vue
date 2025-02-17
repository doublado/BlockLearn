<script lang="ts" setup>
import { computed } from 'vue';
import { NButton, NDropdown, NLayoutHeader, NLayoutContent, NAvatar } from 'naive-ui';
import { useNavigation } from '~/composables/useNavigation';
import { useUserStore } from '~/stores/user';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';

const { handleNavigate } = useNavigation();
const userStore = useUserStore();

// Determine if a user is logged in
const isLoggedIn = computed(() => !!userStore.user);

// Generate a profile avatar URL using Dicebear if a user is logged in
const profileAvatarUrl = computed(() => {
  if (!userStore.user || !userStore.user.username) return '';
  const svg = createAvatar(botttsNeutral, { seed: userStore.user.username }).toString();
  const base64Svg = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64Svg}`;
});

// Dropdown options for the profile menu in the dashboard layout.
const profileOptions = [
  { label: 'Hjem', key: 'index' },
  { label: 'Profil', key: 'profile' },
  { label: 'Log ud', key: 'logout' }
];

/**
 * Handle selection from the profile dropdown.
 * Logs out the user or navigates to the selected page.
 */
const handleProfileSelect = (option: string) => {
  if (option === 'logout') {
    userStore.clearUser();
    handleNavigate(''); // Navigate to the homepage
  } else if (option === 'index') {
    handleNavigate('');
  } else {
    handleNavigate(option);
  }
};
</script>

<template>
  <div>
    <n-layout-header bordered class="px-4 py-3 bg-white shadow-md sticky top-0 z-50">
      <div class="flex items-center justify-between">
        <!-- Brand: Clicking "BlockLearn" navigates to the dashboard -->
        <h1
          class="text-xl font-bold cursor-pointer text-primary"
          @click="handleProfileSelect('dashboard')"
        >
          BlockLearn
        </h1>
        <div class="flex items-center space-x-4">
          <!-- Profile Dropdown with options to navigate or log out -->
          <n-dropdown trigger="click" :options="profileOptions" @select="handleProfileSelect">
            <n-avatar size="medium" :src="profileAvatarUrl" class="cursor-pointer" />
          </n-dropdown>
        </div>
      </div>
    </n-layout-header>
    <n-layout-content class="p-4">
      <slot />
    </n-layout-content>
  </div>
</template>
