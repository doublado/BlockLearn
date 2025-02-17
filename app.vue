<script setup lang="ts">
  import { NMessageProvider, NDialogProvider } from 'naive-ui';
</script>

<template>
  <n-message-provider>
  <n-dialog-provider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </n-dialog-provider>
  </n-message-provider>
</template>