import { defineStore } from 'pinia'

export interface User {
  id: number
  username: string
  email: string
}

export interface Level {
  id: number
  level_number: number
  name: string
  description: string
  requirements?: any
}

export interface LevelProgress {
  level_id: number
  stars: number
  completed_at: string | null
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    levels: [] as Level[],
    levelProgress: [] as LevelProgress[],
  }),
  actions: {
    setUser(userData: User) {
      this.user = userData
    },
    clearUser() {
      this.user = null
      this.levels = []
      this.levelProgress = []
    },
    setLevels(levels: Level[]) {
      this.levels = levels
    },
    setLevelProgress(progressData: LevelProgress[]) {
      this.levelProgress = progressData
    },
    updateLevelProgress(progress: LevelProgress) {
      const index = this.levelProgress.findIndex(lp => lp.level_id === progress.level_id)
      if (index !== -1) {
        this.levelProgress[index] = progress
      } else {
        this.levelProgress.push(progress)
      }
    },
  },
  persist: true,
})
