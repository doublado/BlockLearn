<script setup lang="ts">
import { computed, defineProps } from 'vue'
import draggable from 'vuedraggable'
import BlockComponent, { Block } from './BlockComponent.vue'

const props = defineProps<{ 
  modelValue: Block[],
  group?: Record<string, unknown>
}>()

const emit = defineEmits<{ 
  (e: 'update:modelValue', value: Block[]): void;
  (e: 'itemAdded', item: Block): void;
  (e: 'itemRemoved', item: Block): void;
}>()

// Create a computed property that syncs with v-model
const localBlocks = computed({
  get: () => props.modelValue || [],
  set: (value: Block[]) => emit('update:modelValue', value)
})

// When a new item is added via drag, emit an event with the cloned item
const onAdd = (event: any) => {
  if (event.clone) {
    emit('itemAdded', event.clone)
  }
}
</script>

<template>
  <draggable
    v-model="localBlocks"
    :group="props.group || { name: 'program', pull: true, put: true }"
    item-key="id"
    :animation="200"
    class="space-y-2"
    @add="onAdd"
  >
    <template #item="{ element, index }">
      <div class="relative">
        <BlockComponent :block="element" />
        <!-- Remove button positioned at the top right -->
        <button
          @click.stop="(localBlocks.splice(index, 1), emit('itemRemoved', element))"
          class="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
        >
          Fjern
        </button>
      </div>
    </template>
  </draggable>
  <!-- Message when no blocks are available -->
  <div v-if="localBlocks.length === 0" class="text-center text-gray-500 mt-4">
    Ingen blokke tilføjet
  </div>
</template>
