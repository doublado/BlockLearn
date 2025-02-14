<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

export interface Block {
  type: string
  label: string
  count: number
}

const props = defineProps<{ paletteBlocks: Block[] }>()
const emit = defineEmits<{ (e: 'addBlock', block: Block): void }>()

const addBlock = (block: Block) => {
  if (block.count > 0) {
    emit('addBlock', block)
  }
}
</script>

<template>
  <div class="p-4 border-r">
    <h3 class="text-xl font-bold mb-2 text-center">Tilgængelige Blokke</h3>
    <ul>
      <li
        v-for="block in paletteBlocks"
        :key="block.type"
        class="flex items-center justify-between mb-2 border p-2 rounded bg-gray-100"
      >
        <span>{{ block.label }} ({{ block.count }})</span>
        <button
          class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          @click="addBlock(block)"
          :disabled="block.count === 0"
        >
          Tilføj
        </button>
      </li>
    </ul>
  </div>
</template>
