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
const initialBlocks = [ //
  { type: 'moveForward', label: 'Gå Fremad', count: 6 },
  { type: 'turnRight', label: 'Drej til Højre', count: 5 },
  { type: 'turnLeft', label: 'Drej til Venstre', count: 7 },
  { type: 'while', label: 'While (Gentag)', count: 6 }
];

// Define the level data including the labyrinth grid
const levelData = ref({
  levelId: 10,
  labyrinth: [
    [0,0,1,4,0,1,1,0,0],
    [0,1,1,1,0,0,1,1,0],
    [1,1,1,1,1,0,0,1,1],
    [3,0,1,1,1,1,0,0,1],
    [1,0,0,1,1,1,1,0,0],
    [1,1,0,0,1,1,1,0,2],
    [1,1,1,0,0,1,0,0,0],
    [0,1,1,1,0,0,0,2,1],
    [0,0,1,1,1,2,0,1,1],
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
