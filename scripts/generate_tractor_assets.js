import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('/tmp/tractor.png');
const png = PNG.sync.read(data);
const SRC_W = png.width;
const SRC_H = png.height;

// Crop to main tractor bbox [19..533, 1..428] + PAD=16
const CROP_X0 = 19;
const CROP_Y0 = 1;
const CROP_X1 = 533;
const CROP_Y1 = 428;
const CROP_W = CROP_X1 - CROP_X0 + 1; // 515
const CROP_H = CROP_Y1 - CROP_Y0 + 1; // 428
const PAD = 16;
const OUT_W = CROP_W + PAD * 2; // 547
const OUT_H = CROP_H + PAD * 2; // 460

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

// 2. Dilate stroke by 1px (already very bold lines, keeps narrow exhaust open & sharp)
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

// Save tractor_outline.png (transparent background, #0f0f14 bold outline)
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
fs.writeFileSync('src/assets/images/tractor_outline.png', PNG.sync.write(outlinePng));
console.log(`Saved src/assets/images/tractor_outline.png (${OUT_W}x${OUT_H})`);

// 3. Flood fill the 9 chambers in cropped+padded coordinates
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

const cBody = getChamber(88, 15);
const cWinLeft = getChamber(136, 45);
const cWinRight = getChamber(192, 45);
const cExhaust = getChamber(385, 104);
const cFender = getChamber(130, 163);
const cTireRear = getChamber(128, 194);
const cHubRear = getChamber(136, 253);
const cTireFront = getChamber(432, 263);
const cHubFront = getChamber(439, 307);

console.log('Chambers:', {
  body: { len: cBody.pixels.length, w: cBody.w, h: cBody.h },
  winLeft: { len: cWinLeft.pixels.length, w: cWinLeft.w, h: cWinLeft.h },
  winRight: { len: cWinRight.pixels.length, w: cWinRight.w, h: cWinRight.h },
  exhaust: { len: cExhaust.pixels.length, w: cExhaust.w, h: cExhaust.h },
  fender: { len: cFender.pixels.length, w: cFender.w, h: cFender.h },
  tireRear: { len: cTireRear.pixels.length, w: cTireRear.w, h: cTireRear.h },
  hubRear: { len: cHubRear.pixels.length, w: cHubRear.w, h: cHubRear.h },
  tireFront: { len: cTireFront.pixels.length, w: cTireFront.w, h: cTireFront.h },
  hubFront: { len: cHubFront.pixels.length, w: cHubFront.w, h: cHubFront.h },
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
const placedBodyPath = traceContour(cBody.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedWinLeftPath = traceContour(cWinLeft.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedWinRightPath = traceContour(cWinRight.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedExhaustPath = traceContour(cExhaust.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedFenderPath = traceContour(cFender.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedTireRearPath = traceContour(cTireRear.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedHubRearPath = traceContour(cHubRear.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedTireFrontPath = traceContour(cTireFront.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedHubFrontPath = traceContour(cHubFront.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);

console.log('Tracing cutting piece paths...');
const cutBodyPath = traceContour(cBody.pixels, 0, cBody.bbox[0], cBody.bbox[1], cBody.w, cBody.h);
const cutWinLeftPath = traceContour(cWinLeft.pixels, 0, cWinLeft.bbox[0], cWinLeft.bbox[1], cWinLeft.w, cWinLeft.h);
const cutWinRightPath = traceContour(cWinRight.pixels, 0, cWinRight.bbox[0], cWinRight.bbox[1], cWinRight.w, cWinRight.h);
const cutExhaustPath = traceContour(cExhaust.pixels, 0, cExhaust.bbox[0], cExhaust.bbox[1], cExhaust.w, cExhaust.h);
const cutFenderPath = traceContour(cFender.pixels, 0, cFender.bbox[0], cFender.bbox[1], cFender.w, cFender.h);
const cutTireRearPath = traceContour(cTireRear.pixels, 0, cTireRear.bbox[0], cTireRear.bbox[1], cTireRear.w, cTireRear.h);
const cutHubRearPath = traceContour(cHubRear.pixels, 0, cHubRear.bbox[0], cHubRear.bbox[1], cHubRear.w, cHubRear.h);
const cutTireFrontPath = traceContour(cTireFront.pixels, 0, cTireFront.bbox[0], cTireFront.bbox[1], cTireFront.w, cTireFront.h);
const cutHubFrontPath = traceContour(cHubFront.pixels, 0, cHubFront.bbox[0], cHubFront.bbox[1], cHubFront.w, cHubFront.h);

const code = `// ============================================================================
// TRACTOR (ट्रैक्टर) GEOMETRY CONSTANTS - Coordinate space (0 0 ${OUT_W} ${OUT_H})
// Generated from public/assets/aistudio/Tractor_-_Graphics_by_Canva_c2293e43.jfif
// ============================================================================

export const TRACTOR_BODY_VIEWBOX = '0 0 ${cBody.w} ${cBody.h}';
export const TRACTOR_BODY_PATH = '${cutBodyPath}';

export const TRACTOR_WIN_LEFT_VIEWBOX = '0 0 ${cWinLeft.w} ${cWinLeft.h}';
export const TRACTOR_WIN_LEFT_PATH = '${cutWinLeftPath}';

export const TRACTOR_WIN_RIGHT_VIEWBOX = '0 0 ${cWinRight.w} ${cWinRight.h}';
export const TRACTOR_WIN_RIGHT_PATH = '${cutWinRightPath}';

export const TRACTOR_EXHAUST_VIEWBOX = '0 0 ${cExhaust.w} ${cExhaust.h}';
export const TRACTOR_EXHAUST_PATH = '${cutExhaustPath}';

export const TRACTOR_FENDER_VIEWBOX = '0 0 ${cFender.w} ${cFender.h}';
export const TRACTOR_FENDER_PATH = '${cutFenderPath}';

export const TRACTOR_TIRE_REAR_VIEWBOX = '0 0 ${cTireRear.w} ${cTireRear.h}';
export const TRACTOR_TIRE_REAR_PATH = '${cutTireRearPath}';

export const TRACTOR_HUB_REAR_VIEWBOX = '0 0 ${cHubRear.w} ${cHubRear.h}';
export const TRACTOR_HUB_REAR_PATH = '${cutHubRearPath}';

export const TRACTOR_TIRE_FRONT_VIEWBOX = '0 0 ${cTireFront.w} ${cTireFront.h}';
export const TRACTOR_TIRE_FRONT_PATH = '${cutTireFrontPath}';

export const TRACTOR_HUB_FRONT_VIEWBOX = '0 0 ${cHubFront.w} ${cHubFront.h}';
export const TRACTOR_HUB_FRONT_PATH = '${cutHubFrontPath}';

// Placed paths (with 4px stroke dilation for 100% full under-stroke coverage with 0 gaps)
export const TRACTOR_PLACED_BODY_PATH = '${placedBodyPath}';
export const TRACTOR_PLACED_WIN_LEFT_PATH = '${placedWinLeftPath}';
export const TRACTOR_PLACED_WIN_RIGHT_PATH = '${placedWinRightPath}';
export const TRACTOR_PLACED_EXHAUST_PATH = '${placedExhaustPath}';
export const TRACTOR_PLACED_FENDER_PATH = '${placedFenderPath}';
export const TRACTOR_PLACED_TIRE_REAR_PATH = '${placedTireRearPath}';
export const TRACTOR_PLACED_HUB_REAR_PATH = '${placedHubRearPath}';
export const TRACTOR_PLACED_TIRE_FRONT_PATH = '${placedTireFrontPath}';
export const TRACTOR_PLACED_HUB_FRONT_PATH = '${placedHubFrontPath}';
`;

fs.writeFileSync('src/components/tractor_constants.ts', code);
console.log('Saved src/components/tractor_constants.ts');
