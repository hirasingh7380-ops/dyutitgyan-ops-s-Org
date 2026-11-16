import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('/tmp/pinwheel.png');
const png = PNG.sync.read(data);
const W = png.width;
const H = png.height;
const PAD = 16;
const OUT_W = W + PAD * 2;
const OUT_H = H + PAD * 2;

console.log(`Source image size: ${W} x ${H} -> Padded: ${OUT_W} x ${OUT_H}`);

// 1. Identify all dark stroke pixels in padded space
const strokeGrid = new Uint8Array(OUT_W * OUT_H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (W * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    if (r < 140 && g < 140 && b < 140) {
      strokeGrid[OUT_W * (y + PAD) + (x + PAD)] = 1;
    }
  }
}

// 2. Dilate stroke by 2px for bold smooth outer edges
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

// Save pinwheel_outline.png (transparent background, #0f0f14 stroke)
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
fs.writeFileSync('src/assets/images/pinwheel_outline.png', PNG.sync.write(outlinePng));
console.log(`Saved src/assets/images/pinwheel_outline.png (${OUT_W}x${OUT_H})`);

// 3. Flood fill 6 chambers in padded space
function getChamber(seedX, seedY) {
  const sx = seedX + PAD;
  const sy = seedY + PAD;
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

const cBladeTL = getChamber(184, 41);
const cBladeTR = getChamber(548, 70);
const cCenter = getChamber(353, 289);
const cBladeBR = getChamber(489, 300);
const cBladeBL = getChamber(290, 401);
const cStick = getChamber(405, 544);

console.log('Chambers in padded space:', {
  bladeTL: { len: cBladeTL.pixels.length, w: cBladeTL.w, h: cBladeTL.h },
  bladeTR: { len: cBladeTR.pixels.length, w: cBladeTR.w, h: cBladeTR.h },
  center: { len: cCenter.pixels.length, w: cCenter.w, h: cCenter.h },
  bladeBR: { len: cBladeBR.pixels.length, w: cBladeBR.w, h: cBladeBR.h },
  bladeBL: { len: cBladeBL.pixels.length, w: cBladeBL.w, h: cBladeBL.h },
  stick: { len: cStick.pixels.length, w: cStick.w, h: cStick.h },
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

const PLACED_DILATE = 5;
console.log('Tracing placed paths with 5px dilation...');
const placedBladeTLPath = traceContour(cBladeTL.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedBladeTRPath = traceContour(cBladeTR.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedCenterPath = traceContour(cCenter.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedBladeBRPath = traceContour(cBladeBR.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedBladeBLPath = traceContour(cBladeBL.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedStickPath = traceContour(cStick.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);

console.log('Tracing cutting piece paths...');
const cutBladeTLPath = traceContour(cBladeTL.pixels, 0, cBladeTL.bbox[0], cBladeTL.bbox[1], cBladeTL.w, cBladeTL.h);
const cutBladeTRPath = traceContour(cBladeTR.pixels, 0, cBladeTR.bbox[0], cBladeTR.bbox[1], cBladeTR.w, cBladeTR.h);
const cutCenterPath = traceContour(cCenter.pixels, 0, cCenter.bbox[0], cCenter.bbox[1], cCenter.w, cCenter.h);
const cutBladeBRPath = traceContour(cBladeBR.pixels, 0, cBladeBR.bbox[0], cBladeBR.bbox[1], cBladeBR.w, cBladeBR.h);
const cutBladeBLPath = traceContour(cBladeBL.pixels, 0, cBladeBL.bbox[0], cBladeBL.bbox[1], cBladeBL.w, cBladeBL.h);
const cutStickPath = traceContour(cStick.pixels, 0, cStick.bbox[0], cStick.bbox[1], cStick.w, cStick.h);

const code = `// ============================================================================
// PINWHEEL (फिरकी) GEOMETRY CONSTANTS - Coordinate space (0 0 ${OUT_W} ${OUT_H})
// Generated from public/assets/aistudio/download__22__a51dd624.jfif
// ============================================================================

export const PINWHEEL_BLADE_TL_VIEWBOX = '0 0 ${cBladeTL.w} ${cBladeTL.h}';
export const PINWHEEL_BLADE_TL_PATH = '${cutBladeTLPath}';

export const PINWHEEL_BLADE_TR_VIEWBOX = '0 0 ${cBladeTR.w} ${cBladeTR.h}';
export const PINWHEEL_BLADE_TR_PATH = '${cutBladeTRPath}';

export const PINWHEEL_CENTER_VIEWBOX = '0 0 ${cCenter.w} ${cCenter.h}';
export const PINWHEEL_CENTER_PATH = '${cutCenterPath}';

export const PINWHEEL_BLADE_BR_VIEWBOX = '0 0 ${cBladeBR.w} ${cBladeBR.h}';
export const PINWHEEL_BLADE_BR_PATH = '${cutBladeBRPath}';

export const PINWHEEL_BLADE_BL_VIEWBOX = '0 0 ${cBladeBL.w} ${cBladeBL.h}';
export const PINWHEEL_BLADE_BL_PATH = '${cutBladeBLPath}';

export const PINWHEEL_STICK_VIEWBOX = '0 0 ${cStick.w} ${cStick.h}';
export const PINWHEEL_STICK_PATH = '${cutStickPath}';

// Placed paths (with 5px stroke dilation for 100% full under-stroke coverage with 0 gaps)
export const PINWHEEL_PLACED_BLADE_TL_PATH = '${placedBladeTLPath}';
export const PINWHEEL_PLACED_BLADE_TR_PATH = '${placedBladeTRPath}';
export const PINWHEEL_PLACED_CENTER_PATH = '${placedCenterPath}';
export const PINWHEEL_PLACED_BLADE_BR_PATH = '${placedBladeBRPath}';
export const PINWHEEL_PLACED_BLADE_BL_PATH = '${placedBladeBLPath}';
export const PINWHEEL_PLACED_STICK_PATH = '${placedStickPath}';
`;

fs.writeFileSync('src/components/pinwheel_constants.ts', code);
console.log('Saved src/components/pinwheel_constants.ts');
