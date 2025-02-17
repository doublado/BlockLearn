<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BlockPalette, { Block as PaletteBlock } from '~/components/BlockPalette.vue'
import BlockContainer, { Block } from '~/components/BlockContainer.vue'

// Extend the palette block if needed
interface PaletteBlockExt extends PaletteBlock {}

// Props include the initial set of blocks for the palette
const props = defineProps<{ initialBlocks: PaletteBlockExt[] }>()
const emit = defineEmits<{ (e: 'sequenceChanged', sequence: Block[]): void }>()

// Create a reactive copy of the palette blocks
const availableBlocks = ref<PaletteBlockExt[]>(
  props.initialBlocks.map(block => ({ ...block }))
)

// This holds the current program sequence (user-created block sequence)
const programSequence = ref<Block[]>([])

/**
 * Called when a palette block is added.
 * Reduces the available count and appends a new block instance to the sequence.
 */
function handleAddBlock(block: PaletteBlockExt) {
  console.log("[Editor] Adding block:", block)
  const found = availableBlocks.value.find(b => b.type === block.type)
  if (found && found.count > 0) {
    found.count--
    const newBlock: Block = {
      ...block,
      id: `${block.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    }
    // If the block is a "while" type, initialize nested blocks and default repeat count.
    if (newBlock.type === 'while') {
      newBlock.innerBlocks = []
      newBlock.value1 = '1' // Default repeat count
    }
    programSequence.value.push(newBlock)
    console.log("[Editor] Program sequence after addition:", JSON.stringify(programSequence.value, null, 2))
  }
}

/**
 * When an item is added via drag-and-drop, reduce the available count.
 */
function handleItemAdded(item: Block) {
  console.log("[Editor] Item added via drag:", item)
  const found = availableBlocks.value.find(b => b.type === item.type)
  if (found && found.count > 0) {
    found.count--
  }
}

/**
 * When an item is removed, restore the available count.
 */
function handleRemoveBlock(removedBlock: Block) {
  console.log("[Editor] Removing block:", removedBlock)
  const found = availableBlocks.value.find(b => b.type === removedBlock.type)
  if (found) {
    found.count++
  }
}

// Create a JSON representation for display purposes
const programJson = computed(() => JSON.stringify(programSequence.value, null, 2))
console.log("[Editor] Program JSON:", programJson.value)

// Emit the sequenceChanged event every time the programSequence updates
watch(programSequence, (newVal) => {
  // Deep clone the sequence to avoid reference issues
  const rawSequence = JSON.parse(JSON.stringify(newVal))
  console.log("[Editor] sequenceChanged:", rawSequence)
  emit("sequenceChanged", rawSequence)
}, { deep: true })

// Expose a method to retrieve the current sequence (deep clone)
defineExpose({
  getProgramSequence: () => JSON.parse(JSON.stringify(programSequence.value))
})
</script>

<template>
  <div class="flex flex-col">
    <div class="mb-4">
      <BlockPalette 
        :paletteBlocks="availableBlocks" 
        @addBlock="handleAddBlock" 
      />
    </div>
    <div class="overflow-auto border p-2 rounded m-4 h-[66vh]">
      <h3 class="text-xl font-bold mb-2 text-center">Program Sekvens</h3>
      <BlockContainer 
        v-model="programSequence" 
        :group="{ name: 'palette', pull: true, put: true }"
        @itemAdded="handleItemAdded" 
        @itemRemoved="handleRemoveBlock" 
      />
    </div>
    <div class="border p-2 m-4 rounded bg-gray-50">
      <h4 class="text-lg font-bold mb-2">Program JSON</h4>
      <pre class="text-sm text-gray-700">{{ programJson }}</pre>
    </div>
  </div>
</template>
