import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('/tmp/cake.png');
const png = PNG.sync.read(data);
const SRC_W = png.width;
const SRC_H = png.height;

// Crop to main cake bbox [48..688, 294..745] + PAD=16
const CROP_X0 = 48;
const CROP_Y0 = 294;
const CROP_X1 = 688;
const CROP_Y1 = 745;
const CROP_W = CROP_X1 - CROP_X0 + 1; // 641
const CROP_H = CROP_Y1 - CROP_Y0 + 1; // 452
const PAD = 16;
const OUT_W = CROP_W + PAD * 2; // 673
const OUT_H = CROP_H + PAD * 2; // 484

console.log(`Source: ${SRC_W}x${SRC_H} -> Cropped+Padded: ${OUT_W}x${OUT_H}`);

// 1. Identify dark stroke pixels in padded space
const rawStroke = new Uint8Array(OUT_W * OUT_H);
for (let y = CROP_Y0; y <= CROP_Y1; y++) {
  for (let x = CROP_X0; x <= CROP_X1; x++) {
    const idx = (SRC_W * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    if (r < 140 && g < 140 && b < 140) {
      const ox = (x - CROP_X0) + PAD;
      const oy = (y - CROP_Y0) + PAD;
      rawStroke[OUT_W * oy + ox] = 1;
    }
  }
}

// Keep only clean stroke components (size >= 200) to remove specks
const strokeGrid = new Uint8Array(OUT_W * OUT_H);
const vis = new Uint8Array(OUT_W * OUT_H);
for (let y = 0; y < OUT_H; y++) {
  for (let x = 0; x < OUT_W; x++) {
    const start = y * OUT_W + x;
    if (!rawStroke[start] || vis[start]) continue;
    const q = [start];
    vis[start] = 1;
    let head = 0;
    while (head < q.length) {
      const cur = q[head++];
      const cx = cur % OUT_W, cy = Math.floor(cur / OUT_W);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || nx >= OUT_W || ny < 0 || ny >= OUT_H) continue;
          const nidx = ny * OUT_W + nx;
          if (rawStroke[nidx] && !vis[nidx]) {
            vis[nidx] = 1;
            q.push(nidx);
          }
        }
      }
    }
    if (q.length >= 200) {
      for (const p of q) strokeGrid[p] = 1;
    }
  }
}

// 2. Dilate stroke by 2px for crisp bold coloring-book outline
const DILATE_R = 2;
const dilatedStroke = new Uint8Array(OUT_W * OUT_H);
for (let y = 0; y < OUT_H; y++) {
  for (let x = 0; x < OUT_W; x++) {
    if (strokeGrid[OUT_W * y + x]) {
      for (let dy = -DILATE_R; dy <= DILATE_R; dy++) {
        for (let dx = -DILATE_R; dx <= DILATE_R; dx++) {
          if (dx * dx + dy * dy <= DILATE_R * DILATE_R + 0.5) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < OUT_W && ny >= 0 && ny < OUT_H) {
              dilatedStroke[OUT_W * ny + nx] = 1;
            }
          }
        }
      }
    }
  }
}

// Save cake_outline.png (transparent background, #0f0f14 bold outline)
const outlinePng = new PNG({ width: OUT_W, height: OUT_H });
for (let y = 0; y < OUT_H; y++) {
  for (let x = 0; x < OUT_W; x++) {
    const idx = (OUT_W * y + x) << 2;
    if (dilatedStroke[OUT_W * y + x]) {
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
fs.writeFileSync('src/assets/images/cake_outline.png', PNG.sync.write(outlinePng));
console.log(`Saved src/assets/images/cake_outline.png (${OUT_W}x${OUT_H})`);

// 3. Flood fill the 7 chambers in cropped+padded coordinates
function getChamber(srcSeedX, srcSeedY) {
  const sx = (srcSeedX - CROP_X0) + PAD;
  const sy = (srcSeedY - CROP_Y0) + PAD;
  const v = new Uint8Array(OUT_W * OUT_H);
  const q = [OUT_W * sy + sx];
  v[OUT_W * sy + sx] = 1;
  const pixels = [];
  let minX = OUT_W, maxX = -1, minY = OUT_H, maxY = -1;
  let head = 0;
  while (head < q.length) {
    const cur = q[head++];
    const cx = cur % OUT_W, cy = Math.floor(cur / OUT_W);
    pixels.push({ x: cx, y: cy });
    if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
    if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
    for (const n of [cur - 1, cur + 1, cur - OUT_W, cur + OUT_W]) {
      if (n < 0 || n >= OUT_W * OUT_H) continue;
      const nx = n % OUT_W, ny = Math.floor(n / OUT_W);
      if (Math.abs(nx - cx) + Math.abs(ny - cy) !== 1) continue;
      if (v[n] || strokeGrid[n]) continue;
      v[n] = 1;
      q.push(n);
    }
  }
  return { pixels, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1 };
}

const cTop = getChamber(347, 304);
const cHeartTop = getChamber(371, 325);
const cHeartLeft = getChamber(306, 338);
const cHeartRight = getChamber(428, 372);
const cLayerTop = getChamber(612, 425);
const cLayerBot = getChamber(124, 528);
const cPlate = getChamber(112, 579);

console.log('Chambers:', {
  top: { len: cTop.pixels.length, w: cTop.w, h: cTop.h },
  heartTop: { len: cHeartTop.pixels.length, w: cHeartTop.w, h: cHeartTop.h },
  heartLeft: { len: cHeartLeft.pixels.length, w: cHeartLeft.w, h: cHeartLeft.h },
  heartRight: { len: cHeartRight.pixels.length, w: cHeartRight.w, h: cHeartRight.h },
  layerTop: { len: cLayerTop.pixels.length, w: cLayerTop.w, h: cLayerTop.h },
  layerBot: { len: cLayerBot.pixels.length, w: cLayerBot.w, h: cLayerBot.h },
  plate: { len: cPlate.pixels.length, w: cPlate.w, h: cPlate.h },
});

// 4. Contour tracing algorithm
function traceContour(pixels, dilateR = 0, offsetX = 0, offsetY = 0, targetW = OUT_W, targetH = OUT_H) {
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

const PLACED_DILATE = 4;
console.log('Tracing placed paths with 4px dilation...');
const placedTopPath = traceContour(cTop.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedHeartTopPath = traceContour(cHeartTop.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedHeartLeftPath = traceContour(cHeartLeft.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedHeartRightPath = traceContour(cHeartRight.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedLayerTopPath = traceContour(cLayerTop.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedLayerBotPath = traceContour(cLayerBot.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedPlatePath = traceContour(cPlate.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);

console.log('Tracing cutting piece paths...');
const cutTopPath = traceContour(cTop.pixels, 0, cTop.bbox[0], cTop.bbox[1], cTop.w, cTop.h);
const cutHeartTopPath = traceContour(cHeartTop.pixels, 0, cHeartTop.bbox[0], cHeartTop.bbox[1], cHeartTop.w, cHeartTop.h);
const cutHeartLeftPath = traceContour(cHeartLeft.pixels, 0, cHeartLeft.bbox[0], cHeartLeft.bbox[1], cHeartLeft.w, cHeartLeft.h);
const cutHeartRightPath = traceContour(cHeartRight.pixels, 0, cHeartRight.bbox[0], cHeartRight.bbox[1], cHeartRight.w, cHeartRight.h);
const cutLayerTopPath = traceContour(cLayerTop.pixels, 0, cLayerTop.bbox[0], cLayerTop.bbox[1], cLayerTop.w, cLayerTop.h);
const cutLayerBotPath = traceContour(cLayerBot.pixels, 0, cLayerBot.bbox[0], cLayerBot.bbox[1], cLayerBot.w, cLayerBot.h);
const cutPlatePath = traceContour(cPlate.pixels, 0, cPlate.bbox[0], cPlate.bbox[1], cPlate.w, cPlate.h);

const code = `// ============================================================================
// CAKE (केक) GEOMETRY CONSTANTS - Coordinate space (0 0 ${OUT_W} ${OUT_H})
// Generated from public/assets/aistudio/Coloring_page_10ce63ff.jfif
// ============================================================================

export const CAKE_TOP_VIEWBOX = '0 0 ${cTop.w} ${cTop.h}';
export const CAKE_TOP_PATH = '${cutTopPath}';

export const CAKE_HEART_TOP_VIEWBOX = '0 0 ${cHeartTop.w} ${cHeartTop.h}';
export const CAKE_HEART_TOP_PATH = '${cutHeartTopPath}';

export const CAKE_HEART_LEFT_VIEWBOX = '0 0 ${cHeartLeft.w} ${cHeartLeft.h}';
export const CAKE_HEART_LEFT_PATH = '${cutHeartLeftPath}';

export const CAKE_HEART_RIGHT_VIEWBOX = '0 0 ${cHeartRight.w} ${cHeartRight.h}';
export const CAKE_HEART_RIGHT_PATH = '${cutHeartRightPath}';

export const CAKE_LAYER_TOP_VIEWBOX = '0 0 ${cLayerTop.w} ${cLayerTop.h}';
export const CAKE_LAYER_TOP_PATH = '${cutLayerTopPath}';

export const CAKE_LAYER_BOT_VIEWBOX = '0 0 ${cLayerBot.w} ${cLayerBot.h}';
export const CAKE_LAYER_BOT_PATH = '${cutLayerBotPath}';

export const CAKE_PLATE_VIEWBOX = '0 0 ${cPlate.w} ${cPlate.h}';
export const CAKE_PLATE_PATH = '${cutPlatePath}';

// Placed paths (with 4px stroke dilation for 100% full under-stroke coverage with 0 gaps)
export const CAKE_PLACED_TOP_PATH = '${placedTopPath}';
export const CAKE_PLACED_HEART_TOP_PATH = '${placedHeartTopPath}';
export const CAKE_PLACED_HEART_LEFT_PATH = '${placedHeartLeftPath}';
export const CAKE_PLACED_HEART_RIGHT_PATH = '${placedHeartRightPath}';
export const CAKE_PLACED_LAYER_TOP_PATH = '${placedLayerTopPath}';
export const CAKE_PLACED_LAYER_BOT_PATH = '${placedLayerBotPath}';
export const CAKE_PLACED_PLATE_PATH = '${placedPlatePath}';
`;

fs.writeFileSync('src/components/cake_constants.ts', code);
console.log('Saved src/components/cake_constants.ts');
