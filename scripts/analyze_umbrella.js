import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('public/assets/aistudio/z67_a60b946b.PNG');
const png = PNG.sync.read(data);
const width = png.width;
const height = png.height;

// Isolate Component 0 of dark outline
const darkPixels = [];
for (let y = 80; y < 515; y++) {
  for (let x = 15; x < 420; x++) {
    const idx = (width * y + x) << 2;
    if (png.data[idx] < 75 && png.data[idx+1] < 75 && png.data[idx+2] < 75) {
      darkPixels.push({ x, y });
    }
  }
}

const grid = new Uint8Array(width * height);
for (const p of darkPixels) grid[width * p.y + p.x] = 1;

const visited = new Uint8Array(width * height);
let mainComp = [];

for (const p of darkPixels) {
  const pIdx = width * p.y + p.x;
  if (visited[pIdx]) continue;
  const q = [pIdx];
  visited[pIdx] = 1;
  const comp = [];
  let head = 0;
  while (head < q.length) {
    const cur = q[head++];
    const cx = cur % width, cy = Math.floor(cur / width);
    comp.push({ x: cx, y: cy });
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = cx + dx, ny = cy + dy;
        if (nx < 15 || nx >= 420 || ny < 80 || ny >= 515) continue;
        const nIdx = width * ny + nx;
        if (grid[nIdx] && !visited[nIdx]) {
          visited[nIdx] = 1;
          q.push(nIdx);
        }
      }
    }
  }
  if (comp.length > mainComp.length) mainComp = comp;
}

console.log(`Main umbrella stroke: ${mainComp.length} pixels`);

// Now let's flood fill the 4 chambers using ONLY the main umbrella stroke as boundary!
// Stroke mask
const strokeMask = new Uint8Array(width * height);
for (const p of mainComp) strokeMask[width * p.y + p.x] = 1;

function getChamberClean(seedX, seedY) {
  const v = new Uint8Array(width * height);
  const q = [width * seedY + seedX];
  v[width * seedY + seedX] = 1;
  const pixels = [];
  let minX = seedX, maxX = seedX, minY = seedY, maxY = seedY;
  let head = 0;
  while (head < q.length) {
    const cur = q[head++];
    const cx = cur % width, cy = Math.floor(cur / width);
    pixels.push({ x: cx, y: cy });
    if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
    if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
    
    for (const n of [cur - 1, cur + 1, cur - width, cur + width]) {
      if (v[n]) continue;
      const nx = n % width, ny = Math.floor(n / width);
      if (nx < 15 || nx >= 420 || ny < 80 || ny >= 515) continue;
      if (strokeMask[n]) continue;
      v[n] = 1;
      q.push(n);
    }
  }
  return { pixels, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1 };
}

const cLeft = getChamberClean(80, 240);
const cMid = getChamberClean(195, 220);
const cRight = getChamberClean(295, 240);
const cHandle = getChamberClean(229, 380);

console.log('Chamber Left:', cLeft.pixels.length, cLeft.bbox, 'w=', cLeft.w, 'h=', cLeft.h);
console.log('Chamber Mid:', cMid.pixels.length, cMid.bbox, 'w=', cMid.w, 'h=', cMid.h);
console.log('Chamber Right:', cRight.pixels.length, cRight.bbox, 'w=', cRight.w, 'h=', cRight.h);
console.log('Chamber Handle:', cHandle.pixels.length, cHandle.bbox, 'w=', cHandle.w, 'h=', cHandle.h);
