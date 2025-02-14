export interface GameOperation {
  type: string; // fx "moveForward", "turnRight", "turnLeft"
  value?: number; // fx gentagelsesantal for while
}

export function convertBlockJsonToOperations(blocks: any[]): GameOperation[] {
  const ops: GameOperation[] = [];
  blocks.forEach((block) => {
    switch (block.type) {
      case 'moveForward':
        ops.push({ type: 'moveForward' });
        break;
      case 'turnRight':
        ops.push({ type: 'turnRight' });
        break;
      case 'turnLeft':
        ops.push({ type: 'turnLeft' });
        break;
      case 'while': {
        const repeatCount = block.value1 && parseInt(block.value1, 10) > 0
          ? parseInt(block.value1, 10)
          : 1;
        const nestedOps = convertBlockJsonToOperations(block.innerBlocks || []);
        for (let i = 0; i < repeatCount; i++) {
          ops.push(...nestedOps);
        }
        break;
      }
      default:
        console.warn(`Unhandled block type: ${block.type}`);
    }
  });
  return ops;
}
