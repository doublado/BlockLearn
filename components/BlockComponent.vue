<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { NCard, NInput } from 'naive-ui'
import BlockContainer from './BlockContainer.vue'

// Define the Block interface for clarity
export interface Block {
  id: string;
  type: string;
  label: string;
  innerBlocks?: Block[];
  value1?: string; // Used for repeat count in "while" blocks
}

const props = defineProps<{ block: Block }>()

// Compute card styling based on block type
const cardClasses = computed(() => {
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
})
</script>

<template>
  <n-card
    :class="['p-4 mb-4 shadow-lg rounded-lg cursor-move', cardClasses]"
    size="small"
    @click.stop
  >
    <!-- Block label -->
    <div class="text-center font-bold text-lg">{{ block.label }}</div>

    <!-- For "while" blocks, include an input and a nested container -->
    <div v-if="block.type === 'while'" class="mt-2">
      <n-input 
        v-model:value="block.value1" 
        placeholder="Gentag antal (default 1)" 
        size="small" 
        class="mb-2 w-full" 
      />
      <!-- Use a separate draggable group for nested blocks -->
      <BlockContainer 
        v-model="block.innerBlocks" 
        :group="{ name: 'nested', pull: true, put: true }" 
      />
    </div>
  </n-card>
</template>
