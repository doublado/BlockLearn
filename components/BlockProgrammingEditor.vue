<script setup lang="ts">
import { ref, computed, defineExpose } from 'vue'
import BlockPalette, { Block as PaletteBlock } from '~/components/BlockPalette.vue'
import BlockContainer, { Block } from '~/components/BlockContainer.vue'

interface PaletteBlockExt extends PaletteBlock {}

const props = defineProps<{ initialBlocks: PaletteBlockExt[] }>()

const availableBlocks = ref<PaletteBlockExt[]>(props.initialBlocks.map(block => ({ ...block })))
const programSequence = ref<Block[]>([])

const handleAddBlock = (block: PaletteBlockExt) => {
  console.log("Tilføjer blok:", block);
  const found = availableBlocks.value.find(b => b.type === block.type);
  if (found && found.count > 0) {
    found.count--;
    const newBlock: Block = {
      ...block,
      id: block.type + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
    };
    if (newBlock.type === 'while') {
      newBlock.innerBlocks = [];
      newBlock.value1 = ''; // gentag antal
    }
    programSequence.value.push(newBlock);
    console.log("Programsekvens:", programSequence.value);
  }
}

const handleItemAdded = (item: Block) => {
  console.log("Item added via drag:", item);
  const found = availableBlocks.value.find(b => b.type === item.type);
  if (found && found.count > 0) {
    found.count--;
  }
}

const handleRemoveBlock = (removedBlock: Block) => {
  console.log("Fjernet blok:", removedBlock);
  const found = availableBlocks.value.find(b => b.type === removedBlock.type);
  if (found) {
    found.count++;
  }
}

const programJson = computed(() => JSON.stringify(programSequence.value, null, 2));

// Exponer getProgramSequence til forældre
defineExpose({
  getProgramSequence: () => programSequence.value
});
</script>

<template>
  <div class="flex flex-col">
    <div class="mb-4">
      <BlockPalette :paletteBlocks="availableBlocks" @addBlock="handleAddBlock" />
    </div>
    <div class="overflow-auto border p-2 rounded m-4 h-[66vh]">
      <h3 class="text-xl font-bold mb-2 text-center">Program Sekvens</h3>
      <BlockContainer v-model="programSequence" :group="{ name: 'palette', pull: true, put: true }"
        @itemAdded="handleItemAdded" @itemRemoved="handleRemoveBlock" />
    </div>
    <div class="border p-2 m-4 rounded bg-gray-50">
      <h4 class="text-lg font-bold mb-2">Program JSON</h4>
      <pre class="text-sm text-gray-700">{{ programJson }}</pre>
    </div>
  </div>
</template>
