import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('/tmp/purse.png');
const png = PNG.sync.read(data);
const SRC_W = png.width;
const SRC_H = png.height;

// Crop strictly to main handbag bbox [87..683, 46..744] + PAD=16 (strips border bars cleanly)
const CROP_X0 = 87;
const CROP_Y0 = 46;
const CROP_X1 = 683;
const CROP_Y1 = 744;
const CROP_W = CROP_X1 - CROP_X0 + 1; // 597
const CROP_H = CROP_Y1 - CROP_Y0 + 1; // 699
const PAD = 16;
const OUT_W = CROP_W + PAD * 2; // 629
const OUT_H = CROP_H + PAD * 2; // 731

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

// Keep only clean stroke components (size >= 200)
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

// 2. Dilate stroke by 1px for bold clean edge
const DILATE_R = 1;
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

// Save purse_outline.png (transparent background, #0f0f14 bold outline)
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
fs.writeFileSync('src/assets/images/purse_outline.png', PNG.sync.write(outlinePng));
console.log(`Saved src/assets/images/purse_outline.png (${OUT_W}x${OUT_H})`);

// 3. Flood fill the 6 chambers in cropped+padded coordinates (skipping Chamber 2 empty arch gap)
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

const cHandle = getChamber(375, 70);
const cRingLeft = getChamber(193, 275);
const cRingRight = getChamber(530, 275);
const cFlap = getChamber(141, 335);
const cBody = getChamber(128, 408);
const cLock = getChamber(350, 540);

console.log('Chambers:', {
  handle: { len: cHandle.pixels.length, w: cHandle.w, h: cHandle.h },
  ringLeft: { len: cRingLeft.pixels.length, w: cRingLeft.w, h: cRingLeft.h },
  ringRight: { len: cRingRight.pixels.length, w: cRingRight.w, h: cRingRight.h },
  flap: { len: cFlap.pixels.length, w: cFlap.w, h: cFlap.h },
  body: { len: cBody.pixels.length, w: cBody.w, h: cBody.h },
  lock: { len: cLock.pixels.length, w: cLock.w, h: cLock.h },
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
const placedHandlePath = traceContour(cHandle.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedRingLeftPath = traceContour(cRingLeft.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedRingRightPath = traceContour(cRingRight.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedFlapPath = traceContour(cFlap.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedBodyPath = traceContour(cBody.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedLockPath = traceContour(cLock.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);

console.log('Tracing cutting piece paths...');
const cutHandlePath = traceContour(cHandle.pixels, 0, cHandle.bbox[0], cHandle.bbox[1], cHandle.w, cHandle.h);
const cutRingLeftPath = traceContour(cRingLeft.pixels, 0, cRingLeft.bbox[0], cRingLeft.bbox[1], cRingLeft.w, cRingLeft.h);
const cutRingRightPath = traceContour(cRingRight.pixels, 0, cRingRight.bbox[0], cRingRight.bbox[1], cRingRight.w, cRingRight.h);
const cutFlapPath = traceContour(cFlap.pixels, 0, cFlap.bbox[0], cFlap.bbox[1], cFlap.w, cFlap.h);
const cutBodyPath = traceContour(cBody.pixels, 0, cBody.bbox[0], cBody.bbox[1], cBody.w, cBody.h);
const cutLockPath = traceContour(cLock.pixels, 0, cLock.bbox[0], cLock.bbox[1], cLock.w, cLock.h);

const code = `// ============================================================================
// PURSE (पर्स) GEOMETRY CONSTANTS - Coordinate space (0 0 ${OUT_W} ${OUT_H})
// Generated from public/assets/aistudio/download__23__4d55ddc4.jfif
// ============================================================================

export const PURSE_HANDLE_VIEWBOX = '0 0 ${cHandle.w} ${cHandle.h}';
export const PURSE_HANDLE_PATH = '${cutHandlePath}';

export const PURSE_RING_LEFT_VIEWBOX = '0 0 ${cRingLeft.w} ${cRingLeft.h}';
export const PURSE_RING_LEFT_PATH = '${cutRingLeftPath}';

export const PURSE_RING_RIGHT_VIEWBOX = '0 0 ${cRingRight.w} ${cRingRight.h}';
export const PURSE_RING_RIGHT_PATH = '${cutRingRightPath}';

export const PURSE_FLAP_VIEWBOX = '0 0 ${cFlap.w} ${cFlap.h}';
export const PURSE_FLAP_PATH = '${cutFlapPath}';

export const PURSE_BODY_VIEWBOX = '0 0 ${cBody.w} ${cBody.h}';
export const PURSE_BODY_PATH = '${cutBodyPath}';

export const PURSE_LOCK_VIEWBOX = '0 0 ${cLock.w} ${cLock.h}';
export const PURSE_LOCK_PATH = '${cutLockPath}';

// Placed paths (with 4px stroke dilation for 100% full under-stroke coverage with 0 gaps)
export const PURSE_PLACED_HANDLE_PATH = '${placedHandlePath}';
export const PURSE_PLACED_RING_LEFT_PATH = '${placedRingLeftPath}';
export const PURSE_PLACED_RING_RIGHT_PATH = '${placedRingRightPath}';
export const PURSE_PLACED_FLAP_PATH = '${placedFlapPath}';
export const PURSE_PLACED_BODY_PATH = '${placedBodyPath}';
export const PURSE_PLACED_LOCK_PATH = '${placedLockPath}';
`;

fs.writeFileSync('src/components/purse_constants.ts', code);
console.log('Saved src/components/purse_constants.ts');
