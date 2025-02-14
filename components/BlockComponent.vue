<script setup lang="ts">
import { defineProps, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { NCard, NButton } from 'naive-ui'
import BlockContainer from './BlockContainer.vue'

export interface Block {
  id: string;
  type: string;
  label: string;
  innerBlocks?: Block[];
}

const props = defineProps<{ block: Block }>()

// Lokal ref til innerBlocks for while-blokke
const innerBlocks = ref<Block[]>([])

onMounted(() => {
  if (props.block.type === 'while') {
    if (!props.block.innerBlocks) {
      props.block.innerBlocks = []
    }
    innerBlocks.value = [...props.block.innerBlocks]
  }
})

onBeforeUnmount(() => {
  if (props.block.type === 'while') {
    props.block.innerBlocks = [...innerBlocks.value]
  }
})

// Watch for ændringer
watch(innerBlocks, (newVal) => {
  if (props.block.type === 'while') {
    props.block.innerBlocks = [...newVal]
  }
}, { deep: true })

// Udvælg styling baseret på blok-type
const cardClasses = () => {
  switch (props.block.type) {
    case 'moveForward':
      return 'bg-green-100 border-green-300'
    case 'turnRight':
      return 'bg-blue-100 border-blue-300'
    case 'turnLeft':
      return 'bg-purple-100 border-purple-300'
    case 'while':
      return 'bg-yellow-100 border-yellow-300'
    default:
      return 'bg-gray-100 border-gray-300'
  }
}
</script>

<template>
  <n-card :class="['p-4 mb-4 shadow-lg rounded-lg cursor-move', cardClasses()]" size="small" @click.stop>
    <div class="text-center font-bold text-lg">
      {{ block.label }}
    </div>
    <div v-if="block.type === 'while'" class="mt-2">
      <!-- Nested BlockContainer med drag-group -->
      <BlockContainer v-model="innerBlocks" :group="{ name: 'blocks', pull: 'clone', put: true }" />
    </div>
  </n-card>
</template>
