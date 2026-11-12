import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('/tmp/flower.png');
const png = PNG.sync.read(data);
const W = png.width;
const H = png.height;

console.log(`Image size: ${W} x ${H}`);

// 1. Extract black stroke
// Stroke pixels have r < 110 && g < 110 && b < 110
const strokeGrid = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (W * y + x) << 2;
    if (png.data[idx] < 110 && png.data[idx+1] < 110 && png.data[idx+2] < 110) {
      strokeGrid[W * y + x] = 1;
    }
  }
}

// 2. Dilate stroke by 2px for bold thickness
const DILATE_R = 2;
const dilatedStroke = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (strokeGrid[W * y + x]) {
      for (let dy = -DILATE_R; dy <= DILATE_R; dy++) {
        for (let dx = -DILATE_R; dx <= DILATE_R; dx++) {
          if (dx*dx + dy*dy <= DILATE_R*DILATE_R + 0.5) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
              dilatedStroke[W * ny + nx] = 1;
            }
          }
        }
      }
    }
  }
}

// Save flower_outline.png (transparent background, #0f0f14 stroke)
const outlinePng = new PNG({ width: W, height: H });
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (W * y + x) << 2;
    if (dilatedStroke[W * y + x]) {
      outlinePng.data[idx] = 15;     // R
      outlinePng.data[idx + 1] = 15; // G
      outlinePng.data[idx + 2] = 20; // B
      outlinePng.data[idx + 3] = 255; // Alpha
    } else {
      outlinePng.data[idx] = 0;
      outlinePng.data[idx + 1] = 0;
      outlinePng.data[idx + 2] = 0;
      outlinePng.data[idx + 3] = 0;
    }
  }
}
fs.writeFileSync('src/assets/images/flower_outline.png', PNG.sync.write(outlinePng));
console.log('Saved src/assets/images/flower_outline.png');

// 3. Flood fill 7 chambers using strokeGrid as boundary
function getChamber(seedX, seedY) {
  const v = new Uint8Array(W * H);
  const q = [W * seedY + seedX];
  v[W * seedY + seedX] = 1;
  const pixels = [];
  let minX = seedX, maxX = seedX, minY = seedY, maxY = seedY;
  let head = 0;
  while (head < q.length) {
    const cur = q[head++];
    const cx = cur % W, cy = Math.floor(cur / W);
    pixels.push({ x: cx, y: cy });
    if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
    if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
    for (const n of [cur - 1, cur + 1, cur - W, cur + W]) {
      if (v[n]) continue;
      const nx = n % W, ny = Math.floor(n / W);
      if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
      if (strokeGrid[n]) continue;
      v[n] = 1;
      q.push(n);
    }
  }
  return { pixels, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1 };
}

const cCenter = getChamber(368, 375);
const cTop = getChamber(368, 155);
const cTopRight = getChamber(559, 265);
const cBottomRight = getChamber(559, 485);
const cBottom = getChamber(368, 595);
const cBottomLeft = getChamber(177, 485);
const cTopLeft = getChamber(177, 265);

// 4. Contour tracing algorithm
function traceContour(pixels, dilateR = 0, offsetX = 0, offsetY = 0, targetW = W, targetH = H) {
  const mask = new Uint8Array(targetW * targetH);
  for (const p of pixels) {
    if (p.x >= 0 && p.x < targetW && p.y >= 0 && p.y < targetH) {
      mask[targetW * p.y + p.x] = 1;
    }
  }

  let targetMask = mask;
  if (dilateR > 0) {
    targetMask = new Uint8Array(targetW * targetH);
    for (let y = 0; y < targetH; y++) {
      for (let x = 0; x < targetW; x++) {
        if (mask[targetW * y + x]) {
          for (let dy = -dilateR; dy <= dilateR; dy++) {
            for (let dx = -dilateR; dx <= dilateR; dx++) {
              if (dx*dx + dy*dy <= dilateR*dilateR + 0.5) {
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < targetW && ny >= 0 && ny < targetH) {
                  targetMask[targetW * ny + nx] = 1;
                }
              }
            }
          }
        }
      }
    }
  }

  let startX = -1, startY = -1;
  for (let y = 0; y < targetH; y++) {
    for (let x = 0; x < targetW; x++) {
      if (targetMask[targetW * y + x]) {
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
  const maxSteps = 25000;

  do {
    contour.push({ x: currX - offsetX, y: currY - offsetY });
    let found = false;
    const startDir = (dir + 5) % 8;
    for (let i = 0; i < 8; i++) {
      const nextDir = (startDir + i) % 8;
      const nx = currX + dx[nextDir], ny = currY + dy[nextDir];
      if (nx >= 0 && nx < targetW && ny >= 0 && ny < targetH && targetMask[targetW * ny + nx]) {
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

// 5. Generate cutting shapes localized to bbox
function traceCuttingShape(comp) {
  const [minX, minY] = comp.bbox;
  const targetW = comp.w + 6;
  const targetH = comp.h + 6;
  const localizedPixels = comp.pixels.map(p => ({ x: p.x - minX + 3, y: p.y - minY + 3 }));
  const path = traceContour(localizedPixels, 0, 3, 3, targetW, targetH);
  return {
    viewBox: `0 0 ${comp.w} ${comp.h}`,
    path
  };
}

const cutCenter = traceCuttingShape(cCenter);
const cutTop = traceCuttingShape(cTop);
const cutTopRight = traceCuttingShape(cTopRight);
const cutBottomRight = traceCuttingShape(cBottomRight);
const cutBottom = traceCuttingShape(cBottom);
const cutBottomLeft = traceCuttingShape(cBottomLeft);
const cutTopLeft = traceCuttingShape(cTopLeft);

// 6. Placed paths in 734 x 750 (dilated 3px)
const placedCenter = traceContour(cCenter.pixels, 3);
const placedTop = traceContour(cTop.pixels, 3);
const placedTopRight = traceContour(cTopRight.pixels, 3);
const placedBottomRight = traceContour(cBottomRight.pixels, 3);
const placedBottom = traceContour(cBottom.pixels, 3);
const placedBottomLeft = traceContour(cBottomLeft.pixels, 3);
const placedTopLeft = traceContour(cTopLeft.pixels, 3);

const content = `// Pixel-perfect Flower (फूल / Flower) constants for drawing stage
// 7 pieces: Center Disk (बीच का गोल केंद्र), 6 Petals (6 पंखुड़ियाँ)
// Dilated paths guarantee 100% full coverage under the thick outline stroke with zero white gaps

export const FLOWER_CENTER_VIEWBOX = "${cutCenter.viewBox}";
export const FLOWER_CENTER_PATH = "${cutCenter.path}";

export const FLOWER_PETAL_TOP_VIEWBOX = "${cutTop.viewBox}";
export const FLOWER_PETAL_TOP_PATH = "${cutTop.path}";

export const FLOWER_PETAL_TOP_RIGHT_VIEWBOX = "${cutTopRight.viewBox}";
export const FLOWER_PETAL_TOP_RIGHT_PATH = "${cutTopRight.path}";

export const FLOWER_PETAL_BOTTOM_RIGHT_VIEWBOX = "${cutBottomRight.viewBox}";
export const FLOWER_PETAL_BOTTOM_RIGHT_PATH = "${cutBottomRight.path}";

export const FLOWER_PETAL_BOTTOM_VIEWBOX = "${cutBottom.viewBox}";
export const FLOWER_PETAL_BOTTOM_PATH = "${cutBottom.path}";

export const FLOWER_PETAL_BOTTOM_LEFT_VIEWBOX = "${cutBottomLeft.viewBox}";
export const FLOWER_PETAL_BOTTOM_LEFT_PATH = "${cutBottomLeft.path}";

export const FLOWER_PETAL_TOP_LEFT_VIEWBOX = "${cutTopLeft.viewBox}";
export const FLOWER_PETAL_TOP_LEFT_PATH = "${cutTopLeft.path}";

export const FLOWER_PLACED_CENTER_PATH = "${placedCenter}";
export const FLOWER_PLACED_PETAL_TOP_PATH = "${placedTop}";
export const FLOWER_PLACED_PETAL_TOP_RIGHT_PATH = "${placedTopRight}";
export const FLOWER_PLACED_PETAL_BOTTOM_RIGHT_PATH = "${placedBottomRight}";
export const FLOWER_PLACED_PETAL_BOTTOM_PATH = "${placedBottom}";
export const FLOWER_PLACED_PETAL_BOTTOM_LEFT_PATH = "${placedBottomLeft}";
export const FLOWER_PLACED_PETAL_TOP_LEFT_PATH = "${placedTopLeft}";
`;

fs.writeFileSync('src/components/flower_constants.ts', content);
console.log('Saved src/components/flower_constants.ts');
