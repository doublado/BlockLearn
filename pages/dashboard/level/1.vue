<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'only-logged-in'
});

import { ref } from 'vue'
import { NSplit } from 'naive-ui'
import BlockProgrammingEditor from '~/components/BlockProgrammingEditor.vue'

const initialBlocks = [
  { type: 'moveForward', label: 'Gå Fremad', count: 5 },
  { type: 'turnRight', label: 'Drej til Højre', count: 3 },
  { type: 'turnLeft', label: 'Drej til Venstre', count: 3 },
  { type: 'while', label: 'While (Gentag)', count: 1 }
]

const gamePlaceholder = ref("Dette er spilområdet. Her vil robotten blive styret af blokprogrammering.")
</script>

<template>
  <n-split direction="horizontal" style="height: calc(100vh - 100px);">
    <template #1>
      <div style="height: 100%; overflow: auto;">
        <BlockProgrammingEditor :initialBlocks="initialBlocks" />
      </div>
    </template>
    <template #2>
      <div style="height: 100%;" class="flex items-center justify-center">
        <div class="text-2xl font-bold text-center">
          {{ gamePlaceholder }}
        </div>
      </div>
    </template>
  </n-split>
</template>
