<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'only-logged-in'
});

import { ref } from 'vue'
import { NSplit } from 'naive-ui'
import BlockProgrammingEditor from '~/components/BlockProgrammingEditor.vue'
import GameLabyrinth from '~/components/GameLabyrinth.vue'

// Define the initial available blocks in the palette
const initialBlocks = [
  { type: 'moveForward', label: 'Gå Fremad', count: 8 },
  { type: 'turnRight', label: 'Drej til Højre', count: 4 }, 
  { type: 'turnLeft', label: 'Drej til Venstre', count: 4 }, 
  { type: 'while', label: 'While (Gentag)', count: 4 }
];

// Define the level data including the labyrinth grid
const levelData = ref({
  levelId: 12,
  labyrinth: [
    [0,0,0,0,3],
    [1,1,1,1,1],
    [0,0,2,0,0],
    [1,1,1,1,0],
    [0,0,2,0,0],
    [1,1,1,1,1],
    [0,0,2,0,0],
    [1,1,1,1,1],
    [4,0,0,0,0],
  ]
});

const editorRef = ref(null)
// This will store the instructions (the flattened block sequence)
const instructions = ref([])

/**
 * Update the instructions when the editor emits a change.
 */
function updateInstructions(newSequence: any) {
  console.log("[Level] sequenceChanged event:", newSequence)
  instructions.value = newSequence
  console.log("[Level] instructions updated to:", instructions.value)
}
</script>

<template>
  <n-split 
    direction="horizontal" 
    style="height: 100vh" 
    :max="0.75" 
    :min="0.25"
  >
    <template #1>
      <div style="height: 100%; overflow: auto;">
        <BlockProgrammingEditor 
          ref="editorRef" 
          :initialBlocks="initialBlocks" 
          @sequenceChanged="updateInstructions" 
        />
      </div>
    </template>
    <template #2>
      <div style="height: 100%; overflow: auto;">
        <GameLabyrinth 
          :levelData="levelData" 
          :instructions="instructions" 
        />
      </div>
    </template>
  </n-split>
</template>
