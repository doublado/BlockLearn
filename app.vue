<script setup lang="ts">
  // Import global providers from Naive UI for messaging and dialog functionalities.
  import { NMessageProvider, NDialogProvider } from 'naive-ui'
</script>

<template>
  <!-- Wrap the application in providers to enable global message and dialog features -->
  <n-message-provider>
    <n-dialog-provider>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </n-dialog-provider>
  </n-message-provider>
</template>
