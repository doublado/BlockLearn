<script setup lang="ts">
  import { NCard, NIcon } from 'naive-ui';
  import { ConstructOutline } from '@vicons/ionicons5';

  definePageMeta({
    layout: 'frontpage'
  });
</script>

<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-58.57px)]">
    <n-card
      bordered
      class="max-w-md text-center shadow-lg p-6"
    >
      <div class="flex flex-col items-center space-y-4">
        <n-icon size="64">
          <template #default>
            <construct-outline class="h-16 w-16 text-yellow-500" />
          </template>
        </n-icon>
        <h1 class="text-xl font-bold text-gray-800">
          Vi arbejder på noget fantastisk!
        </h1>
        <p class="text-gray-600">
          Vores hjemmeside er under opbygning. Kig forbi igen snart!
        </p>
      </div>
    </n-card>
  </div>
</template>