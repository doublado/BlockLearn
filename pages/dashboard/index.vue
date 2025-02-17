<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '~/stores/user'
import { useNavigation } from '~/composables/useNavigation'
import { NCard } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { LockClosedOutline, Star } from '@vicons/ionicons5'

// Use the "dashboard" layout and enforce logged-in access.
definePageMeta({
  layout: 'dashboard',
  middleware: 'only-logged-in'
})

const userStore = useUserStore()
const { handleNavigate } = useNavigation()
const message = useMessage()

/**
 * Sort levels by their "level_number" property.
 */
const sortedLevels = computed(() => {
  return [...userStore.levels].sort((a, b) => a.level_number - b.level_number)
})

/**
 * Group levels into rows of five for a grid layout.
 */
const levelRows = computed(() => {
  const rows = []
  const levels = sortedLevels.value
  for (let i = 0; i < levels.length; i += 5) {
    rows.push(levels.slice(i, i + 5))
  }
  return rows
})

/**
 * Retrieve the progress information for a given level.
 * @param level - The level object.
 */
const getLevelProgress = (level: any) => {
  return userStore.levelProgress.find((lp: any) => lp.level_id === level.id)
}

/**
 * Determine if a level is unlocked.
 * Level 1 is always unlocked. For others, check advanced requirements,
 * or fallback to verifying if the previous level was completed.
 * @param level - The level object.
 */
const isLevelUnlocked = (level: any) => {
  // Level 1 is always unlocked.
  if (level.level_number === 1) return true

  // Check advanced requirements if available.
  if (level.requirements && Object.keys(level.requirements).length > 0) {
    for (const reqLevelStr in level.requirements) {
      const requiredStars = Number(level.requirements[reqLevelStr])
      const requiredLevelNumber = Number(reqLevelStr)
      const requiredLevel = userStore.levels.find((l: any) => l.level_number === requiredLevelNumber)
      if (!requiredLevel) return false
      const progress = userStore.levelProgress.find((lp: any) => lp.level_id === requiredLevel.id)
      if (!progress || !progress.completed_at || progress.stars < requiredStars) {
        return false
      }
    }
    return true
  } else {
    // Otherwise, assume the level unlocks after the previous one is completed.
    const prevLevel = userStore.levels.find((l: any) => l.level_number === level.level_number - 1)
    if (!prevLevel) return true
    const progress = userStore.levelProgress.find((lp: any) => lp.level_id === prevLevel.id)
    return progress && progress.completed_at
  }
}

/**
 * Determine the CSS classes for a level card based on progress and unlock status.
 * @param level - The level object.
 */
const getLevelCardClass = (level: any) => {
  const progress = getLevelProgress(level)
  if (progress && progress.completed_at) {
    return 'bg-indigo-500 text-white hover:shadow-2xl'
  }
  if (isLevelUnlocked(level)) {
    return 'bg-gradient-to-br from-green-400 to-blue-500 text-white hover:shadow-2xl'
  }
  return 'bg-gray-300 text-gray-800 opacity-70 cursor-not-allowed'
}

/**
 * Handle level selection:
 * Navigate to the level if unlocked; otherwise, warn the user.
 * @param level - The level object.
 */
const selectLevel = (level: any) => {
  if (isLevelUnlocked(level)) {
    handleNavigate(`dashboard/level/${level.id}`)
  } else {
    message.warning("Dette level er låst!")
  }
}
</script>

<template>
  <div class="p-4 w-full">
    <h2 class="text-2xl font-bold mb-6 text-center">Vælg Level</h2>
    <div v-for="(row, rowIndex) in levelRows" :key="rowIndex" class="grid grid-cols-5 gap-6 mb-6">
      <n-card
        v-for="level in row"
        :key="level.id"
        @click="selectLevel(level)"
        :class="getLevelCardClass(level)"
        class="h-28 flex flex-col items-center justify-center rounded-xl transition transform hover:scale-105 cursor-pointer text-center"
        size="small"
      >
        <div class="font-bold text-xl">Level {{ level.level_number }}</div>
        <div class="mt-2 text-xs text-center">
          <!-- Display requirements if level is locked -->
          <template v-if="!isLevelUnlocked(level)">
            <div class="flex flex-col items-center">
              <div class="flex items-center justify-center space-x-1">
                <LockClosedOutline class="w-5 h-5" />
                <span class="font-semibold">Lås op:</span>
              </div>
              <div v-for="(req, key) in level.requirements" :key="key" class="flex items-center justify-center space-x-1">
                <span>Level {{ key }}:</span>
                <span class="font-bold">{{ req }}</span>
                <Star class="w-4 h-4 text-yellow-300" />
              </div>
            </div>
          </template>
          <!-- Display completion status and stars if level is completed -->
          <template v-else-if="getLevelProgress(level) && getLevelProgress(level).completed_at">
            <div class="flex flex-col items-center">
              <span class="text-sm">Afsluttet</span>
              <div class="flex justify-center space-x-1">
                <template v-for="n in getLevelProgress(level).stars" :key="n">
                  <Star class="w-5 h-5 text-yellow-300" />
                </template>
              </div>
            </div>
          </template>
          <!-- Otherwise, no extra info is shown -->
        </div>
      </n-card>
    </div>
  </div>
</template>
