<script setup lang="ts">
import { ref } from 'vue'
import BlockPalette, { Block as PaletteBlock } from '~/components/BlockPalette.vue'
import BlockContainer, { Block } from '~/components/BlockContainer.vue'

interface PaletteBlockExt extends PaletteBlock {}

const props = defineProps<{ initialBlocks: PaletteBlockExt[] }>()

// Lav en lokal kopi af initialBlocks, så de kan ændres per level
const availableBlocks = ref<PaletteBlockExt[]>(props.initialBlocks.map(block => ({ ...block })))
const programSequence = ref<Block[]>([])

const handleAddBlock = (block: PaletteBlockExt) => {
  console.log("Tilføjer blok:", block)
  const found = availableBlocks.value.find(b => b.type === block.type)
  if (found && found.count > 0) {
    found.count--
    const newBlock: Block = {
      ...block,
      id: block.type + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
    }
    if (newBlock.type === 'while') {
      newBlock.innerBlocks = []
    }
    programSequence.value.push(newBlock)
    console.log("Programsekvens:", programSequence.value)
  }
}

const handleItemAdded = (item: Block) => {
  console.log("Item added via drag:", item)
  const found = availableBlocks.value.find(b => b.type === item.type)
  if (found && found.count > 0) {
    found.count--
  }
}

const handleRemoveBlock = (removedBlock: Block) => {
  console.log("Fjernet blok:", removedBlock)
  const found = availableBlocks.value.find(b => b.type === removedBlock.type)
  if (found) {
    found.count++
  }
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Øverst: Block Palette -->
    <div class="mb-4">
      <BlockPalette :paletteBlocks="availableBlocks" @addBlock="handleAddBlock" />
    </div>
    <!-- Program Sekvens: Gør denne del scrollable -->
    <div class="overflow-auto border p-2 rounded m-4 h-[66vh]">
      <h3 class="text-xl font-bold mb-2 text-center">Program Sekvens</h3>
      <BlockContainer v-model="programSequence" @itemAdded="handleItemAdded" @itemRemoved="handleRemoveBlock" />
    </div>
  </div>
</template>
