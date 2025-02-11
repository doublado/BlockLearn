<script setup lang="ts">
  import { NCard } from 'naive-ui'
  const route = useRoute()
</script>

<template>
  <div>
    <h1>Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.path }}</p>
    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank">Learn more about Nuxt Routing</a>
    <n-card title="Naive UI Card">
      <p>Naive UI is a Vue 3 Component Library</p>
    </n-card>
  </div>
</template>
