<script setup lang="ts">
import { ref, reactive, computed, onMounted, toRaw } from 'vue'
import { NButton } from 'naive-ui'
import { convertBlockJsonToOperations } from '~/utils/converter'

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

const player = reactive({
  x: 0,
  y: 0,
  coins: 0,
  direction: 0 // 0: højre, 90: ned, 180: venstre, 270: op
})

// Find start (celle med 3)
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (labyrinth[r][c] === 3) {
      player.x = c
      player.y = r
    }
  }
}

const directionName = computed(() => {
  switch(player.direction % 360){
    case 0: return "Højre"
    case 90: return "Ned"
    case 180: return "Venstre"
    case 270: return "Op"
    default: return player.direction.toString()
  }
})

const canvasRef = ref<HTMLCanvasElement|null>(null)
let ctx: CanvasRenderingContext2D | null = null

const drawLabyrinth = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  for (let r = 0; r < rows; r++){
    for (let c = 0; c < cols; c++){
      const x = c * tileSize
      const y = r * tileSize
      const cell = labyrinth[r][c]
      if (cell === 1) {
        ctx.fillStyle = '#333'
        ctx.fillRect(x, y, tileSize, tileSize)
      } else if (cell === 2) {
        ctx.fillStyle = 'gold'
        ctx.beginPath()
        ctx.arc(x + tileSize/2, y + tileSize/2, tileSize/4, 0, 2*Math.PI)
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

// Brug en intern flattenOperations-funktion til at udtrække en simpel operations-array
function flattenOperations(blocks: any[]): any[] {
  let ops: any[] = [];
  blocks.forEach((block) => {
    if (block.type === 'moveForward' || block.type === 'turnRight' || block.type === 'turnLeft') {
      ops.push({ type: block.type });
    } else if (block.type === 'while') {
      const repeatCount = block.value1 && parseInt(block.value1, 10) > 0 ? parseInt(block.value1, 10) : 1;
      console.log("[Game] While repeatCount:", repeatCount);
      const nestedOps = flattenOperations(block.innerBlocks || []);
      for (let i = 0; i < repeatCount; i++) {
        ops.push(...nestedOps);
      }
    } else {
      console.warn("[Game] Unhandled block type:", block.type);
    }
  });
  return ops;
}

const startExecution = () => {
  // Brug raw instructions fra props.instructions (som nu er en reaktiv array)
  const raw = toRaw(props.instructions);
  console.log("[Game] Received instructions:", raw);
  const ops = flattenOperations(raw);
  console.log("[Game] Flattened operations:", ops);
  executeOperations(ops);
}

const executeOperation = (op: any): boolean => {
  console.log("[Game] Executing operation:", op);
  if (op.type === 'moveForward') {
    let newX = player.x;
    let newY = player.y;
    const d = player.direction % 360;
    if (d === 0) newX++;
    else if (d === 90) newY++;
    else if (d === 180) newX--;
    else if (d === 270) newY--;
    if (!isWalkable(newX, newY)) {
      alert("Kollision: Du ramte en væg!");
      return false;
    }
    player.x = newX;
    player.y = newY;
    if (labyrinth[newY][newX] === 2) {
      player.coins++;
      labyrinth[newY][newX] = 0;
    }
    return true;
  } else if (op.type === 'turnRight') {
    player.direction = (player.direction + 90) % 360;
    return true;
  } else if (op.type === 'turnLeft') {
    player.direction = (player.direction + 270) % 360;
    return true;
  }
  return true;
};

const executeOperations = (ops: any[]) => {
  console.log("[Game] executeOperations called with ops:", ops);
  let index = 0;
  const interval = setInterval(() => {
    if (index >= ops.length) {
      clearInterval(interval);
      return;
    }
    const success = executeOperation(ops[index]);
    if (!success) {
      clearInterval(interval);
      return;
    }
    if (labyrinth[player.y][player.x] === 4) {
      fetch('/api/progression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: props.levelData.levelId, coins: player.coins })
      })
      .then(res => res.json())
      .then(data => {
        console.log("[Game] Progression gemt:", data);
        alert("Labyrinten gennemført!");
      })
      .catch(err => {
        console.error("[Game] Fejl ved gemning af progression:", err);
      });
      clearInterval(interval);
      return;
    }
    index++;
  }, 500);
};
</script>

<template>
  <div class="p-4">
    <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" class="border rounded"></canvas>
    <div class="mt-4 flex flex-col items-center">
      <p class="text-lg font-bold">Coins: {{ player.coins }}</p>
      <p class="text-lg font-bold">Retning: {{ directionName }}</p>
      <n-button @click="startExecution" type="primary" class="mt-2">Kør Instruktioner</n-button>
    </div>
  </div>
</template>
