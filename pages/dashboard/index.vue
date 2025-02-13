<script setup lang="ts">
  import { computed } from 'vue'
  import { useUserStore } from '~/stores/user'
  import { useNavigation } from '~/composables/useNavigation'
  import { NCard } from 'naive-ui'
  import { useMessage } from 'naive-ui'
  import { LockClosedOutline, Star } from '@vicons/ionicons5'

  definePageMeta({
    layout: 'dashboard',
    middleware: 'only-logged-in'
  });

  const userStore = useUserStore()
  const { handleNavigate } = useNavigation()
  const message = useMessage()

  // Sorter niveauerne efter level_number
  const sortedLevels = computed(() => {
    return [...userStore.levels].sort((a, b) => a.level_number - b.level_number)
  })

  // Gruppér niveauerne i rækker af 5, så de fylder hele bredden
  const levelRows = computed(() => {
    const rows = []
    const levels = sortedLevels.value
    for (let i = 0; i < levels.length; i += 5) {
      rows.push(levels.slice(i, i + 5))
    }
    return rows
  })

  // Hent brugerens fremskridt for et givet niveau
  const getLevelProgress = (level: any) => {
    return userStore.levelProgress.find((lp: any) => lp.level_id === level.id)
  }

  // Tjek om et niveau er låst op baseret på avancerede JSON-krav
  const isLevelUnlocked = (level: any) => {
    // Niveau 1 er altid oplåst
    if (level.level_number === 1) return true

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
      // Ellers antages niveauet at låses op, når det forrige er gennemført
      const prevLevel = userStore.levels.find((l: any) => l.level_number === level.level_number - 1)
      if (!prevLevel) return true
      const progress = userStore.levelProgress.find((lp: any) => lp.level_id === prevLevel.id)
      return progress && progress.completed_at
    }
  }

  // Bestem kortets styling baseret på om niveauet er gennemført/låst
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

  // Når et niveau vælges, tjek om det er oplåst inden navigation
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
          <!-- Hvis niveauet er låst, vis låsekrav -->
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
          <!-- Hvis niveauet er gennemført, vis antal stjerner -->
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
          <!-- Hvis niveauet er oplåst, men ikke spillet, vis intet ekstra -->
        </div>
      </n-card>
    </div>
  </div>
</template>
