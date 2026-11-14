import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('/tmp/caterpillar.png');
const png = PNG.sync.read(data);
const W = png.width;
const H = png.height;

console.log(`Source image size: ${W} x ${H}`);

// 1. Identify all dark pixels
const rawStroke = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (W * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    if (r < 140 && g < 140 && b < 140) {
      rawStroke[W * y + x] = 1;
    }
  }
}

// 2. Group connected stroke components and remove top-left `<` icon and bottom-right magnifier icon
const sVisited = new Uint8Array(W * H);
const sComps = [];
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const start = y * W + x;
    if (!rawStroke[start] || sVisited[start]) continue;
    const q = [start];
    sVisited[start] = 1;
    let head = 0;
    let minX = x, maxX = x, minY = y, maxY = y;
    while (head < q.length) {
      const cur = q[head++];
      const cx = cur % W, cy = Math.floor(cur / W);
      if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
          const nidx = ny * W + nx;
          if (rawStroke[nidx] && !sVisited[nidx]) {
            sVisited[nidx] = 1;
            q.push(nidx);
          }
        }
      }
    }
    sComps.push({ size: q.length, bbox: [minX, minY, maxX, maxY], pixels: q });
  }
}

sComps.sort((a, b) => b.size - a.size);

// Full caterpillar stroke (body + eyes + nose + smile), excluding UI corner icons
const strokeGrid = new Uint8Array(W * H);
// Outer body boundary only (largest component) for solid placed head fill
const outerStrokeGrid = new Uint8Array(W * H);

for (const c of sComps) {
  const inTopLeftIcon = c.bbox[2] < 80 && c.bbox[3] < 80;
  const inBottomRightIcon = c.bbox[0] > W - 90 && c.bbox[1] > H - 90;
  if (!inTopLeftIcon && !inBottomRightIcon && c.size >= 30) {
    for (const p of c.pixels) strokeGrid[p] = 1;
  }
}
for (const p of sComps[0].pixels) outerStrokeGrid[p] = 1;

// 3. Dilate stroke by 2px for bold thickness
const DILATE_R = 2;
const dilatedStroke = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (strokeGrid[W * y + x]) {
      for (let dy = -DILATE_R; dy <= DILATE_R; dy++) {
        for (let dx = -DILATE_R; dx <= DILATE_R; dx++) {
          if (dx * dx + dy * dy <= DILATE_R * DILATE_R + 0.5) {
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

// Save caterpillar_outline.png (transparent background, #0f0f14 stroke)
const outlinePng = new PNG({ width: W, height: H });
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (W * y + x) << 2;
    if (dilatedStroke[W * y + x]) {
      outlinePng.data[idx] = 15;
      outlinePng.data[idx + 1] = 15;
      outlinePng.data[idx + 2] = 20;
      outlinePng.data[idx + 3] = 255;
    } else {
      outlinePng.data[idx] = 0;
      outlinePng.data[idx + 1] = 0;
      outlinePng.data[idx + 2] = 0;
      outlinePng.data[idx + 3] = 0;
    }
  }
}
fs.writeFileSync('src/assets/images/caterpillar_outline.png', PNG.sync.write(outlinePng));
console.log(`Saved src/assets/images/caterpillar_outline.png (${W}x${H})`);

// 4. Flood fill chambers using specified boundary grid
function getChamber(seedX, seedY, boundaryGrid) {
  const v = new Uint8Array(W * H);
  const q = [W * seedY + seedX];
  v[W * seedY + seedX] = 1;
  const pixels = [];
  let minX = W, maxX = -1, minY = H, maxY = -1;
  let head = 0;
  while (head < q.length) {
    const cur = q[head++];
    const cx = cur % W, cy = Math.floor(cur / W);
    pixels.push({ x: cx, y: cy });
    if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
    if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
    for (const n of [cur - 1, cur + 1, cur - W, cur + W]) {
      if (n < 0 || n >= W * H) continue;
      const nx = n % W, ny = Math.floor(n / W);
      if (Math.abs(nx - cx) + Math.abs(ny - cy) !== 1) continue;
      if (v[n] || boundaryGrid[n]) continue;
      v[n] = 1;
      q.push(n);
    }
  }
  return { pixels, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1 };
}

const cSeg1 = getChamber(118, 460, strokeGrid);
const cSeg2 = getChamber(281, 460, strokeGrid);
const cSeg3 = getChamber(424, 460, strokeGrid);
const cSeg4 = getChamber(580, 480, strokeGrid);
const cHeadCut = getChamber(559, 180, strokeGrid);     // Includes eyes, nose, smile cutouts for cutting piece
const cHeadPlaced = getChamber(559, 180, outerStrokeGrid); // Solid head fill under outline

console.log('Chambers:', {
  seg1: { len: cSeg1.pixels.length, w: cSeg1.w, h: cSeg1.h },
  seg2: { len: cSeg2.pixels.length, w: cSeg2.w, h: cSeg2.h },
  seg3: { len: cSeg3.pixels.length, w: cSeg3.w, h: cSeg3.h },
  seg4: { len: cSeg4.pixels.length, w: cSeg4.w, h: cSeg4.h },
  headCut: { len: cHeadCut.pixels.length, w: cHeadCut.w, h: cHeadCut.h },
  headPlaced: { len: cHeadPlaced.pixels.length, w: cHeadPlaced.w, h: cHeadPlaced.h },
});

// 5. Contour tracing algorithm
function traceContour(pixels, dilateR = 0, offsetX = 0, offsetY = 0, targetW = W, targetH = H) {
  const mask = new Uint8Array(targetW * targetH);
  for (const p of pixels) {
    if (dilateR === 0) {
      const tx = p.x - offsetX, ty = p.y - offsetY;
      if (tx >= 0 && tx < targetW && ty >= 0 && ty < targetH) {
        mask[targetW * ty + tx] = 1;
      }
    } else {
      for (let dy = -dilateR; dy <= dilateR; dy++) {
        for (let dx = -dilateR; dx <= dilateR; dx++) {
          if (dx * dx + dy * dy <= dilateR * dilateR + 0.5) {
            const tx = p.x + dx - offsetX;
            const ty = p.y + dy - offsetY;
            if (tx >= 0 && tx < targetW && ty >= 0 && ty < targetH) {
              mask[targetW * ty + tx] = 1;
            }
          }
        }
      }
    }
  }

  const edges = [];
  for (let y = 0; y < targetH; y++) {
    for (let x = 0; x < targetW; x++) {
      if (mask[targetW * y + x]) {
        if (y === 0 || !mask[targetW * (y - 1) + x]) edges.push({ x1: x, y1: y, x2: x + 1, y2: y });
        if (x === targetW - 1 || !mask[targetW * y + (x + 1)]) edges.push({ x1: x + 1, y1: y, x2: x + 1, y2: y + 1 });
        if (y === targetH - 1 || !mask[targetW * (y + 1) + x]) edges.push({ x1: x + 1, y1: y + 1, x2: x, y2: y + 1 });
        if (x === 0 || !mask[targetW * y + (x - 1)]) edges.push({ x1: x, y1: y + 1, x2: x, y2: y });
      }
    }
  }

  const edgeMap = new Map();
  for (const e of edges) {
    const k = `${e.x1},${e.y1}`;
    if (!edgeMap.has(k)) edgeMap.set(k, []);
    edgeMap.get(k).push(e);
  }

  const loops = [];
  const used = new Set();

  for (const e of edges) {
    const ek = `${e.x1},${e.y1}->${e.x2},${e.y2}`;
    if (used.has(ek)) continue;

    const loop = [{ x: e.x1, y: e.y1 }];
    let cur = e;
    used.add(ek);

    while (cur) {
      loop.push({ x: cur.x2, y: cur.y2 });
      if (cur.x2 === loop[0].x && cur.y2 === loop[0].y) {
        break;
      }
      const nextKey = `${cur.x2},${cur.y2}`;
      const candidates = edgeMap.get(nextKey) || [];
      let found = null;
      for (const cand of candidates) {
        const ck = `${cand.x1},${cand.y1}->${cand.x2},${cand.y2}`;
        if (!used.has(ck)) {
          found = cand;
          used.add(ck);
          break;
        }
      }
      cur = found;
    }
    if (loop.length > 3) loops.push(loop);
  }

  function simplifyCollinear(pts) {
    if (pts.length <= 2) return pts;
    const res = [pts[0]];
    for (let i = 1; i < pts.length - 1; i++) {
      const prev = res[res.length - 1];
      const cur = pts[i];
      const next = pts[i + 1];
      const dx1 = cur.x - prev.x, dy1 = cur.y - prev.y;
      const dx2 = next.x - cur.x, dy2 = next.y - cur.y;
      if (dx1 * dy2 === dy1 * dx2 && Math.sign(dx1) === Math.sign(dx2) && Math.sign(dy1) === Math.sign(dy2)) {
        continue;
      }
      res.push(cur);
    }
    res.push(pts[pts.length - 1]);
    return res;
  }

  return loops.map(loop => {
    const s = simplifyCollinear(loop);
    return s.map((pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `L ${pt.x} ${pt.y}`)).join(' ') + ' Z';
  }).join(' ');
}

const PLACED_DILATE = 3;
console.log('Tracing placed paths with 3px dilation...');
const placedSeg1Path = traceContour(cSeg1.pixels, PLACED_DILATE, 0, 0, W, H);
const placedSeg2Path = traceContour(cSeg2.pixels, PLACED_DILATE, 0, 0, W, H);
const placedSeg3Path = traceContour(cSeg3.pixels, PLACED_DILATE, 0, 0, W, H);
const placedSeg4Path = traceContour(cSeg4.pixels, PLACED_DILATE, 0, 0, W, H);
const placedHeadPath = traceContour(cHeadPlaced.pixels, PLACED_DILATE, 0, 0, W, H);

console.log('Tracing cutting piece paths...');
const cutSeg1Path = traceContour(cSeg1.pixels, 0, cSeg1.bbox[0], cSeg1.bbox[1], cSeg1.w, cSeg1.h);
const cutSeg2Path = traceContour(cSeg2.pixels, 0, cSeg2.bbox[0], cSeg2.bbox[1], cSeg2.w, cSeg2.h);
const cutSeg3Path = traceContour(cSeg3.pixels, 0, cSeg3.bbox[0], cSeg3.bbox[1], cSeg3.w, cSeg3.h);
const cutSeg4Path = traceContour(cSeg4.pixels, 0, cSeg4.bbox[0], cSeg4.bbox[1], cSeg4.w, cSeg4.h);
const cutHeadPath = traceContour(cHeadCut.pixels, 0, cHeadCut.bbox[0], cHeadCut.bbox[1], cHeadCut.w, cHeadCut.h);

const code = `// ============================================================================
// CATERPILLAR (इल्ली / कैटरपिलर) GEOMETRY CONSTANTS - Coordinate space (0 0 ${W} ${H})
// Generated from public/assets/aistudio/download__21__043dfdca.jfif
// ============================================================================

export const CATERPILLAR_SEG1_VIEWBOX = '0 0 ${cSeg1.w} ${cSeg1.h}';
export const CATERPILLAR_SEG1_PATH = '${cutSeg1Path}';

export const CATERPILLAR_SEG2_VIEWBOX = '0 0 ${cSeg2.w} ${cSeg2.h}';
export const CATERPILLAR_SEG2_PATH = '${cutSeg2Path}';

export const CATERPILLAR_SEG3_VIEWBOX = '0 0 ${cSeg3.w} ${cSeg3.h}';
export const CATERPILLAR_SEG3_PATH = '${cutSeg3Path}';

export const CATERPILLAR_SEG4_VIEWBOX = '0 0 ${cSeg4.w} ${cSeg4.h}';
export const CATERPILLAR_SEG4_PATH = '${cutSeg4Path}';

export const CATERPILLAR_HEAD_VIEWBOX = '0 0 ${cHeadCut.w} ${cHeadCut.h}';
export const CATERPILLAR_HEAD_PATH = '${cutHeadPath}';

// Placed paths (with 3px stroke dilation for 100% full under-stroke coverage with 0 gaps)
export const CATERPILLAR_PLACED_SEG1_PATH = '${placedSeg1Path}';
export const CATERPILLAR_PLACED_SEG2_PATH = '${placedSeg2Path}';
export const CATERPILLAR_PLACED_SEG3_PATH = '${placedSeg3Path}';
export const CATERPILLAR_PLACED_SEG4_PATH = '${placedSeg4Path}';
export const CATERPILLAR_PLACED_HEAD_PATH = '${placedHeadPath}';
`;

fs.writeFileSync('src/components/caterpillar_constants.ts', code);
console.log('Saved src/components/caterpillar_constants.ts');
