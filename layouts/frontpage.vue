<script lang="ts" setup>
import { computed } from 'vue';
import { NButton, NDropdown, NIcon, NLayoutHeader, NLayoutContent, NAvatar } from 'naive-ui';
import { MenuOutline } from '@vicons/ionicons5';
import { useNavigation } from '~/composables/useNavigation';
import { useUserStore } from '~/stores/user';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';

const { handleNavigate } = useNavigation();
const userStore = useUserStore();

// Check if a user is logged in
const isLoggedIn = computed(() => !!userStore.user);

// Generate profile avatar URL using Dicebear
const profileAvatarUrl = computed(() => {
  if (!userStore.user || !userStore.user.username) return '';
  const svg = createAvatar(botttsNeutral, { seed: userStore.user.username }).toString();
  const base64Svg = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64Svg}`;
});

// Navbar options for in-page navigation on the frontpage.
const navbarOptions = [
  { label: 'Om os', key: 'about' },
  { label: 'Kurser', key: 'courses' },
  { label: 'Kontakt', key: 'contact' }
];

// Profile options for the dropdown when logged in.
const profileOptions = [
  { label: 'Dashboard', key: 'dashboard' },
  { label: 'Profil', key: 'profile' },
  { label: 'Log ud', key: 'logout' }
];

/**
 * Handle profile dropdown selection.
 */
const handleProfileSelect = (option: string) => {
  if (option === 'logout') {
    userStore.clearUser();
    handleNavigate('');
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
        <!-- Clicking "BlockLearn" navigates to the homepage -->
        <h1 class="text-xl font-bold cursor-pointer text-primary" @click="handleProfileSelect('index')">
          BlockLearn
        </h1>
        <div class="flex items-center space-x-4">
          <!-- Desktop Navbar Options -->
          <div class="hidden md:flex items-center space-x-4">
            <n-button
              v-for="option in navbarOptions"
              :key="option.key"
              text
              @click="handleNavigate(option.key)"
            >
              {{ option.label }}
            </n-button>
            <template v-if="!isLoggedIn">
              <n-button
                type="primary"
                ghost
                @click="handleNavigate('auth', { tab: 'signin' })"
              >
                Log ind
              </n-button>
              <n-button
                type="info"
                ghost
                @click="handleNavigate('auth', { tab: 'signup' })"
              >
                Opret konto
              </n-button>
            </template>
            <template v-else>
              <n-dropdown trigger="click" :options="profileOptions" @select="handleProfileSelect">
                <n-avatar size="medium" :src="profileAvatarUrl" class="cursor-pointer" />
              </n-dropdown>
            </template>
          </div>
          <!-- Mobile Hamburger Menu -->
          <div class="md:hidden">
            <n-dropdown trigger="click" :options="navbarOptions" @select="handleNavigate">
              <n-button text>
                <n-icon>
                  <menu-outline />
                </n-icon>
              </n-button>
            </n-dropdown>
          </div>
        </div>
      </div>
    </n-layout-header>
    <n-layout-content>
      <slot />
    </n-layout-content>
  </div>
</template>
