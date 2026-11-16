import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('/tmp/bus.png');
const png = PNG.sync.read(data);
const SRC_W = png.width;
const SRC_H = png.height;

// Tightly crop to bus bounding box [11..707, 108..466] + PAD=16
const CROP_X0 = 11;
const CROP_Y0 = 108;
const CROP_X1 = 707;
const CROP_Y1 = 466;
const CROP_W = CROP_X1 - CROP_X0 + 1; // 697
const CROP_H = CROP_Y1 - CROP_Y0 + 1; // 359
const PAD = 16;
const OUT_W = CROP_W + PAD * 2; // 729
const OUT_H = CROP_H + PAD * 2; // 391

console.log(`Source: ${SRC_W}x${SRC_H} -> Cropped+Padded: ${OUT_W}x${OUT_H}`);

// 1. Identify all dark stroke pixels in padded space (threshold < 130 ignores gray smudges)
const strokeGrid = new Uint8Array(OUT_W * OUT_H);
for (let y = CROP_Y0; y <= CROP_Y1; y++) {
  for (let x = CROP_X0; x <= CROP_X1; x++) {
    const idx = (SRC_W * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    if (r < 130 && g < 130 && b < 130) {
      const ox = (x - CROP_X0) + PAD;
      const oy = (y - CROP_Y0) + PAD;
      strokeGrid[OUT_W * oy + ox] = 1;
    }
  }
}

// 2. Dilate stroke by 2px for crisp bold outline
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

// Save bus_outline.png (transparent background, #0f0f14 bold outline)
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
fs.writeFileSync('src/assets/images/bus_outline.png', PNG.sync.write(outlinePng));
console.log(`Saved src/assets/images/bus_outline.png (${OUT_W}x${OUT_H})`);

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

const cBody = getChamber(200, 115);
const cWin1 = getChamber(117, 152);
const cWin2 = getChamber(240, 152);
const cWin3 = getChamber(392, 152);
const cWin4 = getChamber(484, 153);
const cWheel1 = getChamber(127, 376);
const cWheel2 = getChamber(584, 377);

console.log('Chambers:', {
  body: { len: cBody.pixels.length, w: cBody.w, h: cBody.h },
  win1: { len: cWin1.pixels.length, w: cWin1.w, h: cWin1.h },
  win2: { len: cWin2.pixels.length, w: cWin2.w, h: cWin2.h },
  win3: { len: cWin3.pixels.length, w: cWin3.w, h: cWin3.h },
  win4: { len: cWin4.pixels.length, w: cWin4.w, h: cWin4.h },
  wheel1: { len: cWheel1.pixels.length, w: cWheel1.w, h: cWheel1.h },
  wheel2: { len: cWheel2.pixels.length, w: cWheel2.w, h: cWheel2.h },
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
const placedWin1Path = traceContour(cWin1.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedWin2Path = traceContour(cWin2.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedWin3Path = traceContour(cWin3.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedWin4Path = traceContour(cWin4.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedWheel1Path = traceContour(cWheel1.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedWheel2Path = traceContour(cWheel2.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);

console.log('Tracing cutting piece paths...');
const cutBodyPath = traceContour(cBody.pixels, 0, cBody.bbox[0], cBody.bbox[1], cBody.w, cBody.h);
const cutWin1Path = traceContour(cWin1.pixels, 0, cWin1.bbox[0], cWin1.bbox[1], cWin1.w, cWin1.h);
const cutWin2Path = traceContour(cWin2.pixels, 0, cWin2.bbox[0], cWin2.bbox[1], cWin2.w, cWin2.h);
const cutWin3Path = traceContour(cWin3.pixels, 0, cWin3.bbox[0], cWin3.bbox[1], cWin3.w, cWin3.h);
const cutWin4Path = traceContour(cWin4.pixels, 0, cWin4.bbox[0], cWin4.bbox[1], cWin4.w, cWin4.h);
const cutWheel1Path = traceContour(cWheel1.pixels, 0, cWheel1.bbox[0], cWheel1.bbox[1], cWheel1.w, cWheel1.h);
const cutWheel2Path = traceContour(cWheel2.pixels, 0, cWheel2.bbox[0], cWheel2.bbox[1], cWheel2.w, cWheel2.h);

const code = `// ============================================================================
// BUS (बस) GEOMETRY CONSTANTS - Coordinate space (0 0 ${OUT_W} ${OUT_H})
// Generated from public/assets/aistudio/download__26__92570187.jfif
// ============================================================================

export const BUS_BODY_VIEWBOX = '0 0 ${cBody.w} ${cBody.h}';
export const BUS_BODY_PATH = '${cutBodyPath}';

export const BUS_WIN1_VIEWBOX = '0 0 ${cWin1.w} ${cWin1.h}';
export const BUS_WIN1_PATH = '${cutWin1Path}';

export const BUS_WIN2_VIEWBOX = '0 0 ${cWin2.w} ${cWin2.h}';
export const BUS_WIN2_PATH = '${cutWin2Path}';

export const BUS_WIN3_VIEWBOX = '0 0 ${cWin3.w} ${cWin3.h}';
export const BUS_WIN3_PATH = '${cutWin3Path}';

export const BUS_WIN4_VIEWBOX = '0 0 ${cWin4.w} ${cWin4.h}';
export const BUS_WIN4_PATH = '${cutWin4Path}';

export const BUS_WHEEL1_VIEWBOX = '0 0 ${cWheel1.w} ${cWheel1.h}';
export const BUS_WHEEL1_PATH = '${cutWheel1Path}';

export const BUS_WHEEL2_VIEWBOX = '0 0 ${cWheel2.w} ${cWheel2.h}';
export const BUS_WHEEL2_PATH = '${cutWheel2Path}';

// Placed paths (with 4px stroke dilation for 100% full under-stroke coverage with 0 gaps)
export const BUS_PLACED_BODY_PATH = '${placedBodyPath}';
export const BUS_PLACED_WIN1_PATH = '${placedWin1Path}';
export const BUS_PLACED_WIN2_PATH = '${placedWin2Path}';
export const BUS_PLACED_WIN3_PATH = '${placedWin3Path}';
export const BUS_PLACED_WIN4_PATH = '${placedWin4Path}';
export const BUS_PLACED_WHEEL1_PATH = '${placedWheel1Path}';
export const BUS_PLACED_WHEEL2_PATH = '${placedWheel2Path}';
`;

fs.writeFileSync('src/components/bus_constants.ts', code);
console.log('Saved src/components/bus_constants.ts');
