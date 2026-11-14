import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('/tmp/hen.png');
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

// 2. Keep only Hen stroke components (ignore bottom watermark 'vetungnetnho')
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

const strokeGrid = new Uint8Array(W * H);
for (const c of sComps) {
  if (c.bbox[3] < Math.floor(H * 0.88) && c.size >= 30) {
    for (const p of c.pixels) strokeGrid[p] = 1;
  }
}

// Crop bounds for large, crisp presentation
const CROP_X = 44;
const CROP_Y = 188;
const CROP_W = 640;
const CROP_H = 752;

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

// Save cropped hen_outline.png (transparent background, #0f0f14 stroke)
const outlinePng = new PNG({ width: CROP_W, height: CROP_H });
for (let y = 0; y < CROP_H; y++) {
  for (let x = 0; x < CROP_W; x++) {
    const sx = x + CROP_X;
    const sy = y + CROP_Y;
    const dstIdx = (CROP_W * y + x) << 2;
    if (dilatedStroke[W * sy + sx]) {
      outlinePng.data[dstIdx] = 15;
      outlinePng.data[dstIdx + 1] = 15;
      outlinePng.data[dstIdx + 2] = 20;
      outlinePng.data[dstIdx + 3] = 255;
    } else {
      outlinePng.data[dstIdx] = 0;
      outlinePng.data[dstIdx + 1] = 0;
      outlinePng.data[dstIdx + 2] = 0;
      outlinePng.data[dstIdx + 3] = 0;
    }
  }
}
fs.writeFileSync('src/assets/images/hen_outline.png', PNG.sync.write(outlinePng));
console.log(`Saved src/assets/images/hen_outline.png (${CROP_W}x${CROP_H})`);

// 4. Flood fill chambers using strokeGrid as boundary (coordinates translated into CROP_W x CROP_H)
function getChamber(seedX, seedY) {
  const v = new Uint8Array(W * H);
  const q = [W * seedY + seedX];
  v[W * seedY + seedX] = 1;
  const pixels = [];
  let minX = CROP_W, maxX = -1, minY = CROP_H, maxY = -1;
  let head = 0;
  while (head < q.length) {
    const cur = q[head++];
    const cx = cur % W, cy = Math.floor(cur / W);
    const tx = cx - CROP_X, ty = cy - CROP_Y;
    pixels.push({ x: tx, y: ty });
    if (tx < minX) minX = tx; if (tx > maxX) maxX = tx;
    if (ty < minY) minY = ty; if (ty > maxY) maxY = ty;
    for (const n of [cur - 1, cur + 1, cur - W, cur + W]) {
      if (n < 0 || n >= W * H) continue;
      const nx = n % W, ny = Math.floor(n / W);
      if (Math.abs(nx - cx) + Math.abs(ny - cy) !== 1) continue;
      if (v[n] || strokeGrid[n]) continue;
      v[n] = 1;
      q.push(n);
    }
  }
  return { pixels, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1 };
}

// Seeds discovered from analyze_hen.js:
const cComb = getChamber(546, 226);
const cHead = getChamber(532, 286);
const cBeak = getChamber(613, 341);
const cWattle = getChamber(597, 381);
const cBodyMain = getChamber(137, 318);
const cRightThigh = getChamber(442, 771);
const cLeftFoot = getChamber(331, 811);
const cRightFoot = getChamber(416, 802);

// Merge cRightThigh into cBody so the right thigh puff colors seamlessly with the body
const cBody = {
  pixels: [...cBodyMain.pixels, ...cRightThigh.pixels],
  bbox: [
    Math.min(cBodyMain.bbox[0], cRightThigh.bbox[0]),
    Math.min(cBodyMain.bbox[1], cRightThigh.bbox[1]),
    Math.max(cBodyMain.bbox[2], cRightThigh.bbox[2]),
    Math.max(cBodyMain.bbox[3], cRightThigh.bbox[3]),
  ],
  get w() { return this.bbox[2] - this.bbox[0] + 1; },
  get h() { return this.bbox[3] - this.bbox[1] + 1; },
};

console.log('Chambers in cropped space:', {
  comb: { len: cComb.pixels.length, w: cComb.w, h: cComb.h },
  head: { len: cHead.pixels.length, w: cHead.w, h: cHead.h },
  beak: { len: cBeak.pixels.length, w: cBeak.w, h: cBeak.h },
  wattle: { len: cWattle.pixels.length, w: cWattle.w, h: cWattle.h },
  body: { len: cBody.pixels.length, w: cBody.w, h: cBody.h },
  leftFoot: { len: cLeftFoot.pixels.length, w: cLeftFoot.w, h: cLeftFoot.h },
  rightFoot: { len: cRightFoot.pixels.length, w: cRightFoot.w, h: cRightFoot.h },
});

// 5. Contour tracing algorithm
function traceContour(pixels, dilateR = 0, offsetX = 0, offsetY = 0, targetW = CROP_W, targetH = CROP_H) {
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
const placedCombPath = traceContour(cComb.pixels, PLACED_DILATE, 0, 0, CROP_W, CROP_H);
const placedHeadPath = traceContour(cHead.pixels, PLACED_DILATE, 0, 0, CROP_W, CROP_H);
const placedBeakPath = traceContour(cBeak.pixels, PLACED_DILATE, 0, 0, CROP_W, CROP_H);
const placedWattlePath = traceContour(cWattle.pixels, PLACED_DILATE, 0, 0, CROP_W, CROP_H);
const placedBodyPath = traceContour(cBody.pixels, PLACED_DILATE, 0, 0, CROP_W, CROP_H);
const placedLeftFootPath = traceContour(cLeftFoot.pixels, PLACED_DILATE, 0, 0, CROP_W, CROP_H);
const placedRightFootPath = traceContour(cRightFoot.pixels, PLACED_DILATE, 0, 0, CROP_W, CROP_H);

console.log('Tracing cutting piece paths...');
const cutCombPath = traceContour(cComb.pixels, 0, cComb.bbox[0], cComb.bbox[1], cComb.w, cComb.h);
const cutHeadPath = traceContour(cHead.pixels, 0, cHead.bbox[0], cHead.bbox[1], cHead.w, cHead.h);
const cutBeakPath = traceContour(cBeak.pixels, 0, cBeak.bbox[0], cBeak.bbox[1], cBeak.w, cBeak.h);
const cutWattlePath = traceContour(cWattle.pixels, 0, cWattle.bbox[0], cWattle.bbox[1], cWattle.w, cWattle.h);
const cutBodyPath = traceContour(cBodyMain.pixels, 0, cBodyMain.bbox[0], cBodyMain.bbox[1], cBodyMain.w, cBodyMain.h);
const cutLeftFootPath = traceContour(cLeftFoot.pixels, 0, cLeftFoot.bbox[0], cLeftFoot.bbox[1], cLeftFoot.w, cLeftFoot.h);
const cutRightFootPath = traceContour(cRightFoot.pixels, 0, cRightFoot.bbox[0], cRightFoot.bbox[1], cRightFoot.w, cRightFoot.h);

const code = `// ============================================================================
// HEN (मुर्गी) GEOMETRY CONSTANTS - Coordinate space (0 0 ${CROP_W} ${CROP_H})
// Generated from public/assets/aistudio/download__19__215567f7.jfif
// ============================================================================

export const HEN_COMB_VIEWBOX = '0 0 ${cComb.w} ${cComb.h}';
export const HEN_COMB_PATH = '${cutCombPath}';

export const HEN_HEAD_VIEWBOX = '0 0 ${cHead.w} ${cHead.h}';
export const HEN_HEAD_PATH = '${cutHeadPath}';

export const HEN_BEAK_VIEWBOX = '0 0 ${cBeak.w} ${cBeak.h}';
export const HEN_BEAK_PATH = '${cutBeakPath}';

export const HEN_WATTLE_VIEWBOX = '0 0 ${cWattle.w} ${cWattle.h}';
export const HEN_WATTLE_PATH = '${cutWattlePath}';

export const HEN_BODY_VIEWBOX = '0 0 ${cBodyMain.w} ${cBodyMain.h}';
export const HEN_BODY_PATH = '${cutBodyPath}';

export const HEN_LEFT_FOOT_VIEWBOX = '0 0 ${cLeftFoot.w} ${cLeftFoot.h}';
export const HEN_LEFT_FOOT_PATH = '${cutLeftFootPath}';

export const HEN_RIGHT_FOOT_VIEWBOX = '0 0 ${cRightFoot.w} ${cRightFoot.h}';
export const HEN_RIGHT_FOOT_PATH = '${cutRightFootPath}';

// Placed paths (with 3px stroke dilation for 100% full under-stroke coverage with 0 gaps)
export const HEN_PLACED_COMB_PATH = '${placedCombPath}';
export const HEN_PLACED_HEAD_PATH = '${placedHeadPath}';
export const HEN_PLACED_BEAK_PATH = '${placedBeakPath}';
export const HEN_PLACED_WATTLE_PATH = '${placedWattlePath}';
export const HEN_PLACED_BODY_PATH = '${placedBodyPath}';
export const HEN_PLACED_LEFT_FOOT_PATH = '${placedLeftFootPath}';
export const HEN_PLACED_RIGHT_FOOT_PATH = '${placedRightFootPath}';
`;

fs.writeFileSync('src/components/hen_constants.ts', code);
console.log('Saved src/components/hen_constants.ts');
