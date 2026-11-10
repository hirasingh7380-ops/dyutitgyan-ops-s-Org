import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('public/assets/aistudio/z67_a60b946b.PNG');
const png = PNG.sync.read(data);
const width = png.width;
const height = png.height;

const OUTLINE_WIDTH = 536;
const OUTLINE_HEIGHT = 600;

// 1. Isolate Umbrella Stroke
const darkPixels = [];
for (let y = 80; y < 515; y++) {
  for (let x = 15; x < 420; x++) {
    const idx = (width * y + x) << 2;
    if (png.data[idx] < 75 && png.data[idx+1] < 75 && png.data[idx+2] < 75) {
      darkPixels.push({ x, y });
    }
  }
}
const strokeGrid = new Uint8Array(width * height);
for (const p of darkPixels) strokeGrid[width * p.y + p.x] = 1;

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
        if (strokeGrid[nIdx] && !visited[nIdx]) {
          visited[nIdx] = 1;
          q.push(nIdx);
        }
      }
    }
  }
  if (comp.length > mainComp.length) mainComp = comp;
}

const strokeMask = new Uint8Array(width * height);
for (const p of mainComp) strokeMask[width * p.y + p.x] = 1;

// 2. Flood fill 4 Chambers in outline
function getChamber(seedX, seedY) {
  const v = new Uint8Array(width * height);
  const q = [width * seedY + seedX];
  v[width * seedY + seedX] = 1;
  const pixels = [];
  let head = 0;
  while (head < q.length) {
    const cur = q[head++];
    const cx = cur % width, cy = Math.floor(cur / width);
    pixels.push({ x: cx, y: cy });
    for (const n of [cur - 1, cur + 1, cur - width, cur + width]) {
      if (v[n]) continue;
      const nx = n % width, ny = Math.floor(n / width);
      if (nx < 15 || nx >= 420 || ny < 80 || ny >= 515) continue;
      if (strokeMask[n]) continue;
      v[n] = 1;
      q.push(n);
    }
  }
  return pixels;
}

const cLeft = getChamber(80, 240);
const cMid = getChamber(195, 220);
const cRight = getChamber(295, 240);
const cHandle = getChamber(229, 380);

// 3. Flood fill 4 White Cutting Shapes on right
function getWhiteComp(seedX, seedY) {
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
      const idx = (width * ny + nx) << 2;
      if (png.data[idx] <= 230 || png.data[idx+1] <= 230 || png.data[idx+2] <= 230) continue;
      v[n] = 1;
      q.push(n);
    }
  }
  return { pixels, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1 };
}

const cutCanopyLeft = getWhiteComp(550, 150);
const cutCanopyRight = getWhiteComp(750, 150);
const cutCanopyMid = getWhiteComp(950, 150);
const cutHandle = getWhiteComp(716, 400);

// 4. Contour Tracer
function traceContour(pixels, dilateR = 0, offsetX = 0, offsetY = 0, W = OUTLINE_WIDTH, H = OUTLINE_HEIGHT) {
  const mask = new Uint8Array(W * H);
  for (const p of pixels) {
    if (p.x >= 0 && p.x < W && p.y >= 0 && p.y < H) {
      mask[W * p.y + p.x] = 1;
    }
  }
  
  let targetMask = mask;
  if (dilateR > 0) {
    targetMask = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (mask[W * y + x]) {
          for (let dy = -dilateR; dy <= dilateR; dy++) {
            for (let dx = -dilateR; dx <= dilateR; dx++) {
              if (dx*dx + dy*dy <= dilateR*dilateR + 0.5) {
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
                  targetMask[W * ny + nx] = 1;
                }
              }
            }
          }
        }
      }
    }
  }

  let startX = -1, startY = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (targetMask[W * y + x]) {
        startX = x;
        startY = y;
        break;
      }
    }
    if (startX !== -1) break;
  }
  if (startX === -1) return '';

  const dx = [1, 1, 0, -1, -1, -1, 0, 1];
  const dy = [0, 1, 1, 1, 0, -1, -1, -1];
  const contour = [];
  let currX = startX, currY = startY;
  let dir = 0;
  let steps = 0;
  const maxSteps = 20000;

  do {
    contour.push({ x: currX - offsetX, y: currY - offsetY });
    let found = false;
    const startDir = (dir + 5) % 8;
    for (let i = 0; i < 8; i++) {
      const nextDir = (startDir + i) % 8;
      const nx = currX + dx[nextDir], ny = currY + dy[nextDir];
      if (nx >= 0 && nx < W && ny >= 0 && ny < H && targetMask[W * ny + nx]) {
        currX = nx;
        currY = ny;
        dir = nextDir;
        found = true;
        break;
      }
    }
    if (!found) break;
    steps++;
  } while ((currX !== startX || currY !== startY) && steps < maxSteps);

  const simplified = [];
  for (let i = 0; i < contour.length; i += 2) {
    simplified.push(contour[i]);
  }
  if (simplified.length < 3) return '';

  let d = `M ${simplified[0].x} ${simplified[0].y}`;
  for (let i = 1; i < simplified.length; i++) {
    d += ` L ${simplified[i].x} ${simplified[i].y}`;
  }
  d += ' Z';
  return d;
}

// 5. Generate Cutting paths (localized to bbox w, h)
function traceCuttingShape(comp) {
  const [minX, minY, maxX, maxY] = comp.bbox;
  const W = comp.w + 6;
  const H = comp.h + 6;
  const localizedPixels = comp.pixels.map(p => ({ x: p.x - minX + 3, y: p.y - minY + 3 }));
  const path = traceContour(localizedPixels, 0, 3, 3, W, H);
  return {
    viewBox: `0 0 ${comp.w} ${comp.h}`,
    path
  };
}

const cutLeftData = traceCuttingShape(cutCanopyLeft);
const cutMidData = traceCuttingShape(cutCanopyMid);
const cutRightData = traceCuttingShape(cutCanopyRight);
const cutHandleData = traceCuttingShape(cutHandle);

// Placed paths (3px dilation for seamless fill under bold outline)
const placedLeftPath = traceContour(cLeft, 3);
const placedMidPath = traceContour(cMid, 3);
const placedRightPath = traceContour(cRight, 3);
const placedHandlePath = traceContour(cHandle, 3);

const content = `// Pixel-perfect Umbrella (छाता / Chhata) constants for drawing stage (z67_a60b946b.PNG)
// 4 pieces: Canopy Left (बायाँ भाग), Canopy Center (मध्य भाग), Canopy Right (दायाँ भाग), Handle (हैंडल / डंडी व मूठ)
// Dilated paths guarantee 100% full coverage under the thick outline stroke with zero white gaps

export const UMBRELLA_CANOPY_LEFT_VIEWBOX = "${cutLeftData.viewBox}";
export const UMBRELLA_CANOPY_LEFT_PATH = "${cutLeftData.path}";

export const UMBRELLA_CANOPY_MID_VIEWBOX = "${cutMidData.viewBox}";
export const UMBRELLA_CANOPY_MID_PATH = "${cutMidData.path}";

export const UMBRELLA_CANOPY_RIGHT_VIEWBOX = "${cutRightData.viewBox}";
export const UMBRELLA_CANOPY_RIGHT_PATH = "${cutRightData.path}";

export const UMBRELLA_HANDLE_VIEWBOX = "${cutHandleData.viewBox}";
export const UMBRELLA_HANDLE_PATH = "${cutHandleData.path}";

export const UMBRELLA_PLACED_CANOPY_LEFT_PATH = "${placedLeftPath}";
export const UMBRELLA_PLACED_CANOPY_MID_PATH = "${placedMidPath}";
export const UMBRELLA_PLACED_CANOPY_RIGHT_PATH = "${placedRightPath}";
export const UMBRELLA_PLACED_HANDLE_PATH = "${placedHandlePath}";
`;

fs.writeFileSync('src/components/umbrella_constants.ts', content);
console.log('Successfully wrote src/components/umbrella_constants.ts');
