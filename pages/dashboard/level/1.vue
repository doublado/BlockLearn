<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'only-logged-in'
});

import { ref } from 'vue'
import { NSplit, NButton } from 'naive-ui'
import BlockProgrammingEditor from '~/components/BlockProgrammingEditor.vue'
import GameLabyrinth from '~/components/GameLabyrinth.vue'

const initialBlocks = [
  { type: 'moveForward', label: 'Gå Fremad', count: 5 },
  { type: 'turnRight', label: 'Drej til Højre', count: 3 },
  { type: 'turnLeft', label: 'Drej til Venstre', count: 3 },
  { type: 'while', label: 'While (Gentag)', count: 1 }
];

const levelData = ref({
  levelId: 1,
  labyrinth: [
    [1,1,1,1,1,1,1,1,1,1],
    [1,3,0,0,2,0,0,0,4,1],
    [1,0,1,0,1,0,1,0,0,1],
    [1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,1],
    [1,0,1,0,0,0,1,0,0,1],
    [1,0,1,0,1,0,0,0,0,1],
    [1,2,0,0,1,0,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1]
  ]
});

const editorRef = ref(null);
const instructions = ref([]);

// Denne funktion bliver kaldt, når editoren emitter "sequenceChanged"
function updateInstructions(newSequence) {
  console.log("[Level] sequenceChanged event:", newSequence);
  instructions.value = newSequence;
  console.log("[Level] instructions opdateret til:", instructions.value);
}
</script>

<template>
  <n-split direction="horizontal" style="height: 100vh" :max="0.75" :min="0.25">
    <template #1>
      <div style="height: 100%; overflow: auto;">
        <BlockProgrammingEditor ref="editorRef" :initialBlocks="initialBlocks" @sequenceChanged="updateInstructions" />
      </div>
    </template>
    <template #2>
      <div style="height: 100%; overflow: auto;">
        <GameLabyrinth :levelData="levelData" :instructions="instructions" />
      </div>
    </template>
  </n-split>
</template>
