<script setup lang="ts">
import { ref, reactive, computed, onMounted, toRaw } from 'vue'
import { NButton, useMessage, useDialog } from 'naive-ui'
import { useRouter } from 'vue-router'

const props = defineProps({
  levelData: { type: Object, required: true },
  instructions: { type: Array, default: () => [] }
})

const labyrinth = props.levelData.labyrinth
const rows = labyrinth.length
const cols = labyrinth[0].length
const tileSize = 40
const canvasWidth = cols * tileSize
const canvasHeight = rows * tileSize

// Player state
const player = reactive({
  x: 0,
  y: 0,
  coins: 0,
  direction: 0 // 0: højre, 90: ned, 180: venstre, 270: op
})

// Find start cell (value 3) and save starting position for resets
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (labyrinth[r][c] === 3) {
      player.x = c
      player.y = r
    }
  }
}
const initialStart = { x: player.x, y: player.y }

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

const message = useMessage()
const dialog = useDialog()
const router = useRouter()

// Flag to indicate if game is running
const isRunning = ref(false)

const drawLabyrinth = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * tileSize
      const y = r * tileSize
      const cell = labyrinth[r][c]
      if (cell === 1) {
        ctx.fillStyle = '#333'
        ctx.fillRect(x, y, tileSize, tileSize)
      } else if (cell === 2) {
        ctx.fillStyle = 'gold'
        ctx.beginPath()
        ctx.arc(x + tileSize/2, y + tileSize/2, tileSize/4, 0, 2 * Math.PI)
        ctx.fill()
      } else if (cell === 4) {
        ctx.fillStyle = 'lightgreen'
        ctx.fillRect(x, y, tileSize, tileSize)
      } else {
        ctx.fillStyle = '#fff'
        ctx.fillRect(x, y, tileSize, tileSize)
      }
      ctx.strokeStyle = '#ccc'
      ctx.strokeRect(x, y, tileSize, tileSize)
    }
  }
}

const drawPlayer = () => {
  if (!ctx) return
  const centerX = player.x * tileSize + tileSize/2
  const centerY = player.y * tileSize + tileSize/2
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(player.direction * Math.PI/180)
  ctx.fillStyle = 'red'
  ctx.beginPath()
  ctx.moveTo(-tileSize/4, tileSize/4)
  ctx.lineTo(tileSize/2, 0)
  ctx.lineTo(-tileSize/4, -tileSize/4)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

const drawGame = () => {
  drawLabyrinth()
  drawPlayer()
}

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

function isWalkable(x: number, y: number): boolean {
  if (x < 0 || x >= cols || y < 0 || y >= rows) return false
  const cell = labyrinth[y][x]
  return cell === 0 || cell === 2 || cell === 3 || cell === 4
}

const resetGame = () => {
  player.x = initialStart.x
  player.y = initialStart.y
  player.coins = 0
  player.direction = 0
  // Optionally reset labyrinth coins if necessary
  console.log("[Game] Game reset")
  isRunning.value = false
}

// Alternative flattenOperations (without using converter.ts externally)
function flattenOperations(blocks: any[]): any[] {
  let ops: any[] = []
  blocks.forEach((block) => {
    if (block.type === 'moveForward' || block.type === 'turnRight' || block.type === 'turnLeft') {
      ops.push({ type: block.type })
    } else if (block.type === 'while') {
      const repeatCount = block.value1 && parseInt(block.value1, 10) > 0 ? parseInt(block.value1, 10) : 1
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
    if (labyrinth[newY][newX] === 2) {
      player.coins++
      labyrinth[newY][newX] = 0
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

const executeOperations = (ops: any[]) => {
  console.log("[Game] executeOperations called with ops:", ops)
  let index = 0
  const interval = setInterval(() => {
    if (index >= ops.length) {
      clearInterval(interval)
      return
    }
    const success = executeOperation(ops[index])
    console.log("[Game] Executed op:", ops[index], "Success:", success)
    if (!success) {
      clearInterval(interval)
      return
    }
    if (labyrinth[player.y][player.x] === 4) {
      clearInterval(interval)
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
      isRunning.value = false
      return
    }
    index++
  }, 500)
}

const startExecution = () => {
  // If game is already running, then reset it.
  if (isRunning.value) {
    resetGame()
    return
  }
  // Otherwise, reset game and then run instructions.
  resetGame()
  isRunning.value = true
  const raw = toRaw(props.instructions)
  console.log("[Game] Received instructions:", raw)
  const ops = flattenOperations(raw)
  console.log("[Game] Flattened operations:", ops)
  executeOperations(ops)
}

const currentButtonText = computed(() => isRunning.value ? "Nulstil" : "Kør Instruktioner")

const directionName = computed(() => {
  switch(player.direction % 360){
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
    <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" class="border rounded"></canvas>
    <div class="mt-4 flex flex-col items-center">
      <p class="text-lg font-bold">Coins: {{ player.coins }}</p>
      <p class="text-lg font-bold">Retning: {{ directionName }}</p>
      <n-button @click="startExecution" type="primary" class="mt-2">
        {{ currentButtonText }}
      </n-button>
    </div>
  </div>
</template>
