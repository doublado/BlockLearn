<script setup lang="ts">
import { ref, reactive, computed, onMounted, toRaw } from 'vue'
import { NButton, useMessage, useDialog } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'

// Define props for the labyrinth level data and instructions (block sequence)
const props = defineProps({
  levelData: { type: Object, required: true },
  instructions: { type: Array, default: () => [] }
})

// Create a reactive copy of the labyrinth for game operations
const labyrinth = ref(JSON.parse(JSON.stringify(props.levelData.labyrinth)))
// Save the initial labyrinth for resets
const initialLabyrinth = JSON.parse(JSON.stringify(labyrinth.value))

// Define canvas dimensions based on labyrinth grid size
const rows = computed(() => labyrinth.value.length)
const cols = computed(() => labyrinth.value[0].length)
const tileSize = 40
const canvasWidth = computed(() => cols.value * tileSize)
const canvasHeight = computed(() => rows.value * tileSize)

// Initialize player state and record the starting position
const player = reactive({
  x: 0,
  y: 0,
  coins: 0,
  direction: 0 // 0: right, 90: down, 180: left, 270: up
})

// Find the starting cell (represented by value 3)
for (let r = 0; r < labyrinth.value.length; r++) {
  for (let c = 0; c < labyrinth.value[r].length; c++) {
    if (labyrinth.value[r][c] === 3) {
      player.x = c
      player.y = r
    }
  }
}
const initialStart = { x: player.x, y: player.y }

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

/**
 * Draw the labyrinth grid.
 */
const drawLabyrinth = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  for (let r = 0; r < rows.value; r++) {
    for (let c = 0; c < cols.value; c++) {
      const x = c * tileSize
      const y = r * tileSize
      const cell = labyrinth.value[r][c]
      switch (cell) {
        case 1: // Wall
          ctx.fillStyle = '#333'
          ctx.fillRect(x, y, tileSize, tileSize)
          break
        case 2: // Coin
          ctx.fillStyle = 'gold'
          ctx.beginPath()
          ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize / 4, 0, 2 * Math.PI)
          ctx.fill()
          break
        case 4: // Exit or goal
          ctx.fillStyle = 'lightgreen'
          ctx.fillRect(x, y, tileSize, tileSize)
          break
        default:
          ctx.fillStyle = '#fff'
          ctx.fillRect(x, y, tileSize, tileSize)
      }
      // Draw grid lines
      ctx.strokeStyle = '#ccc'
      ctx.strokeRect(x, y, tileSize, tileSize)
    }
  }
}

/**
 * Draw the player as a red arrow indicating the direction.
 */
const drawPlayer = () => {
  if (!ctx) return
  const centerX = player.x * tileSize + tileSize / 2
  const centerY = player.y * tileSize + tileSize / 2
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate((player.direction * Math.PI) / 180)
  ctx.fillStyle = 'red'
  ctx.beginPath()
  ctx.moveTo(-tileSize / 4, tileSize / 4)
  ctx.lineTo(tileSize / 2, 0)
  ctx.lineTo(-tileSize / 4, -tileSize / 4)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

/**
 * Redraw the game canvas.
 */
const drawGame = () => {
  drawLabyrinth()
  drawPlayer()
}

/**
 * Start the game loop using requestAnimationFrame.
 */
const gameLoop = () => {
  drawGame()
  requestAnimationFrame(gameLoop)
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    requestAnimationFrame(gameLoop)
  }
})

/**
 * Check if the given cell is walkable.
 */
function isWalkable(x: number, y: number): boolean {
  if (x < 0 || x >= cols.value || y < 0 || y >= rows.value) return false
  const cell = labyrinth.value[y][x]
  return [0, 2, 3, 4].includes(cell)
}

/**
 * Reset the game state to its initial values.
 */
const resetGame = () => {
  player.x = initialStart.x
  player.y = initialStart.y
  player.coins = 0
  player.direction = 0
  labyrinth.value = JSON.parse(JSON.stringify(initialLabyrinth))
  console.log("[Game] Game reset")
}

/**
 * Recursively flatten the block instructions into a sequential list of operations.
 */
function flattenOperations(blocks: any[]): any[] {
  let ops: any[] = []
  blocks.forEach((block) => {
    if (['moveForward', 'turnRight', 'turnLeft'].includes(block.type)) {
      ops.push({ type: block.type })
    } else if (block.type === 'while') {
      const repeatCount = block.value1 && parseInt(block.value1, 10) > 0
        ? parseInt(block.value1, 10)
        : 1
      console.log("[Game] While repeatCount:", repeatCount)
      const nestedOps = flattenOperations(block.innerBlocks || [])
      for (let i = 0; i < repeatCount; i++) {
        ops.push(...nestedOps)
      }
    } else {
      console.warn("[Game] Unhandled block type:", block.type)
    }
  })
  return ops
}

const message = useMessage()
const dialog = useDialog()
const router = useRouter()
const userStore = useUserStore()

/**
 * Execute a single operation and return whether it was successful.
 */
const executeOperation = (op: any): boolean => {
  console.log("[Game] Executing operation:", op)
  if (op.type === 'moveForward') {
    let newX = player.x
    let newY = player.y
    const d = player.direction % 360
    if (d === 0) newX++
    else if (d === 90) newY++
    else if (d === 180) newX--
    else if (d === 270) newY--
    if (!isWalkable(newX, newY)) {
      message.warning("Kollision: Du ramte en væg!")
      resetGame()
      return false
    }
    player.x = newX
    player.y = newY
    // Pick up coin if present
    if (labyrinth.value[newY][newX] === 2) {
      player.coins++
      labyrinth.value[newY][newX] = 0
    }
    return true
  } else if (op.type === 'turnRight') {
    player.direction = (player.direction + 90) % 360
    return true
  } else if (op.type === 'turnLeft') {
    player.direction = (player.direction + 270) % 360
    return true
  }
  return true
}

/**
 * Extract the level ID from the current route.
 */
const getLevelId = (): number => {
  const parts = router.currentRoute.value.path.split('/')
  return parseInt(parts[parts.length - 1], 10)
}

/**
 * Execute a list of operations sequentially with a delay.
 */
 const executeOperations = (ops: any[]) => {
  console.log("[Game] executeOperations called with ops:", ops)
  let index = 0
  // Use a distinct variable name to store the interval identifier.
  const intervalId = setInterval(() => {
    if (index >= ops.length) {
      // Use window.clearInterval to ensure we get the global function.
      window.clearInterval(intervalId)
      return
    }
    const success = executeOperation(ops[index])
    console.log("[Game] Executed op:", ops[index], "Success:", success)
    if (!success) {
      window.clearInterval(intervalId)
      return
    }
    // Check if the player has reached the exit (cell value 4)
    if (labyrinth.value[player.y][player.x] === 4) {
      window.clearInterval(intervalId)

      if (!userStore.user || !userStore.user.id) {
        dialog.error({
          title: 'Fejl',
          content: 'Du er ikke logget ind!'
        })
      } else {
        const response = $fetch('/api/progression', {
          method: 'POST',
          body: {
            userId: userStore.user.id,
            levelId: getLevelId(),
            coins: player.coins
          }
        })

        if (!response) {
          dialog.error({
            title: 'Fejl',
            content: 'Der skete en fejl under lagring af din progression!'
          })
          return
        } else {
          if (userStore.levelProgress[getLevelId()]) {
            if (player.coins > userStore.levelProgress[getLevelId()].stars) {
              userStore.updateLevelProgress({
                level_id: getLevelId(),
                stars: player.coins,
                completed_at: new Date().toISOString()
              })
            }
          } else {
            userStore.setLevelProgress([{
              level_id: getLevelId(),
              stars: player.coins,
              completed_at: new Date().toISOString()
            }])
          }

          dialog.success({
            title: 'Labyrinten gennemført!',
            content: `Du har samlet ${player.coins} coins!`,
            positiveText: 'Fortsæt',
            closable: false,
            maskClosable: false,
            onPositiveClick: () => {
              router.push('/dashboard')
            }
          })
        }
      }
      return
    }
    index++
  }, 500)
}

/**
 * Start or reset execution based on the current running state.
 */
const isRunning = ref(false)
const startExecution = () => {
  // If already running, treat the button as a reset trigger.
  if (isRunning.value) {
    resetGame()
    isRunning.value = false
    return
  }
  // Reset and start execution from the beginning
  resetGame()
  isRunning.value = true
  const rawInstructions = toRaw(props.instructions)
  console.log("[Game] Received instructions:", rawInstructions)
  const ops = flattenOperations(rawInstructions)
  console.log("[Game] Flattened operations:", ops)
  executeOperations(ops)
}

// Display text on the action button based on whether the game is running
const currentButtonText = computed(() => isRunning.value ? "Nulstil" : "Kør Instruktioner")

// Provide a human-readable name for the current direction
const directionName = computed(() => {
  switch(player.direction % 360) {
    case 0: return "Højre"
    case 90: return "Ned"
    case 180: return "Venstre"
    case 270: return "Op"
    default: return player.direction.toString()
  }
})
</script>

<template>
  <div class="p-4">
    <canvas 
      ref="canvasRef" 
      :width="canvasWidth" 
      :height="canvasHeight" 
      class="border rounded"
    ></canvas>
    <div class="mt-4 flex flex-col items-center">
      <p class="text-lg font-bold">Coins: {{ player.coins }}</p>
      <p class="text-lg font-bold">Retning: {{ directionName }}</p>
      <n-button 
        @click="startExecution" 
        type="primary" 
        class="mt-2"
      >
        {{ currentButtonText }}
      </n-button>
    </div>
  </div>
</template>
