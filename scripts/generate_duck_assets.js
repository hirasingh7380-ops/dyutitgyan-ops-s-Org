import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('public/assets/aistudio/32_Free_Toddler_Coloring_Pages___Print_and_Color-removebg-preview_09847147.png');
const png = PNG.sync.read(data);
const W = png.width;
const H = png.height;

console.log(`Image size: ${W} x ${H}`);

// 1. Extract black stroke
// Stroke pixels: alpha > 60 and RGB are dark
const strokeGrid = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (W * y + x) << 2;
    const a = png.data[idx + 3];
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    if (a > 60 && r < 100 && g < 100 && b < 100) {
      strokeGrid[W * y + x] = 1;
    }
  }
}

// 2. Dilate stroke by 2px for bold thickness as requested by user
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

// Also include the original eye (and catchlight white pupil)
// Let's create duck_outline.png (transparent background, #0f0f14 stroke, and preserve eye pupil)
const outlinePng = new PNG({ width: W, height: H });
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (W * y + x) << 2;
    if (dilatedStroke[W * y + x]) {
      outlinePng.data[idx] = 15;      // R
      outlinePng.data[idx + 1] = 15;  // G
      outlinePng.data[idx + 2] = 20;  // B
      outlinePng.data[idx + 3] = 255; // Alpha
    } else {
      // Check if original has eye catchlight (white pupil inside eye)
      // Around x in [120, 133], y in [86, 96]
      const origA = png.data[idx + 3];
      const origR = png.data[idx];
      if (x >= 123 && x <= 130 && y >= 88 && y <= 95 && origA > 100 && origR > 180) {
        outlinePng.data[idx] = 255;
        outlinePng.data[idx + 1] = 255;
        outlinePng.data[idx + 2] = 255;
        outlinePng.data[idx + 3] = 255;
      } else {
        outlinePng.data[idx] = 0;
        outlinePng.data[idx + 1] = 0;
        outlinePng.data[idx + 2] = 0;
        outlinePng.data[idx + 3] = 0;
      }
    }
  }
}
fs.writeFileSync('src/assets/images/duck_outline.png', PNG.sync.write(outlinePng));
console.log('Saved src/assets/images/duck_outline.png');

// 3. Flood fill the 5 chambers using strokeGrid as boundary
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

// Seeds from analyze_duck.js:
// Chamber 1 (Body): center [239, 233] -> wait, let's pick seed inside head/belly where it's definitely body
// Chamber 2 (Wing): center [269, 315]
// Chamber 3 (Left Foot): center [137, 493]
// Chamber 4 (Right Foot): center [274, 497]
// Chamber 5 (Beak): center [60, 129]

const cBeak = getChamber(60, 129);
const cWing = getChamber(269, 315);
const cLeftFoot = getChamber(137, 493);
const cRightFoot = getChamber(274, 497);
// For body, let's pick [180, 180] (neck/chest) to avoid touching wing
const cBody = getChamber(180, 180);

console.log('Chamber sizes:', {
  beak: cBeak.pixels.length,
  wing: cWing.pixels.length,
  leftFoot: cLeftFoot.pixels.length,
  rightFoot: cRightFoot.pixels.length,
  body: cBody.pixels.length
});

// 4. Contour tracing algorithm for SVG paths
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

  // Find boundaries using Marching Squares / Moore neighbor contour tracer
  // Or simple vertical/horizontal edge traversal
  const edges = [];
  for (let y = 0; y < targetH; y++) {
    for (let x = 0; x < targetW; x++) {
      if (mask[targetW * y + x]) {
        // Check 4 neighbors
        if (y === 0 || !mask[targetW * (y - 1) + x]) edges.push({ x1: x, y1: y, x2: x + 1, y2: y }); // Top
        if (x === targetW - 1 || !mask[targetW * y + (x + 1)]) edges.push({ x1: x + 1, y1: y, x2: x + 1, y2: y + 1 }); // Right
        if (y === targetH - 1 || !mask[targetW * (y + 1) + x]) edges.push({ x1: x + 1, y1: y + 1, x2: x, y2: y + 1 }); // Bottom
        if (x === 0 || !mask[targetW * y + (x - 1)]) edges.push({ x1: x, y1: y + 1, x2: x, y2: y }); // Left
      }
    }
  }

  // Chain edges into loops
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

  // Simplify loops (Douglas-Peucker or collinear merge)
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
        continue; // collinear, skip
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

// Generate placed paths (dilated by 3px in 0 0 W H space so fill is 100% covered under thick stroke with zero white gaps)
const PLACED_DILATE = 3;
console.log('Tracing placed paths with 3px dilation...');
const placedBeakPath = traceContour(cBeak.pixels, PLACED_DILATE, 0, 0, W, H);
const placedWingPath = traceContour(cWing.pixels, PLACED_DILATE, 0, 0, W, H);
const placedLeftFootPath = traceContour(cLeftFoot.pixels, PLACED_DILATE, 0, 0, W, H);
const placedRightFootPath = traceContour(cRightFoot.pixels, PLACED_DILATE, 0, 0, W, H);
const placedBodyPath = traceContour(cBody.pixels, PLACED_DILATE, 0, 0, W, H);

// Generate localized cutting paths (0 dilation, in local viewBox 0 0 w h)
console.log('Tracing cutting piece paths...');
const cutBeakPath = traceContour(cBeak.pixels, 0, cBeak.bbox[0], cBeak.bbox[1], cBeak.w, cBeak.h);
const cutWingPath = traceContour(cWing.pixels, 0, cWing.bbox[0], cWing.bbox[1], cWing.w, cWing.h);
const cutLeftFootPath = traceContour(cLeftFoot.pixels, 0, cLeftFoot.bbox[0], cLeftFoot.bbox[1], cLeftFoot.w, cLeftFoot.h);
const cutRightFootPath = traceContour(cRightFoot.pixels, 0, cRightFoot.bbox[0], cRightFoot.bbox[1], cRightFoot.w, cRightFoot.h);
const cutBodyPath = traceContour(cBody.pixels, 0, cBody.bbox[0], cBody.bbox[1], cBody.w, cBody.h);

// Write src/components/duck_constants.ts
const code = `// ============================================================================
// DUCK (बतख) GEOMETRY CONSTANTS - Coordinate space (0 0 ${W} ${H})
// Generated from public/assets/aistudio/32_Free_Toddler_Coloring_Pages___Print_and_Color-removebg-preview_09847147.png
// ============================================================================

export const DUCK_BEAK_VIEWBOX = '0 0 ${cBeak.w} ${cBeak.h}';
export const DUCK_BEAK_PATH = '${cutBeakPath}';

export const DUCK_WING_VIEWBOX = '0 0 ${cWing.w} ${cWing.h}';
export const DUCK_WING_PATH = '${cutWingPath}';

export const DUCK_LEFT_FOOT_VIEWBOX = '0 0 ${cLeftFoot.w} ${cLeftFoot.h}';
export const DUCK_LEFT_FOOT_PATH = '${cutLeftFootPath}';

export const DUCK_RIGHT_FOOT_VIEWBOX = '0 0 ${cRightFoot.w} ${cRightFoot.h}';
export const DUCK_RIGHT_FOOT_PATH = '${cutRightFootPath}';

export const DUCK_BODY_VIEWBOX = '0 0 ${cBody.w} ${cBody.h}';
export const DUCK_BODY_PATH = '${cutBodyPath}';

// Placed paths (with 3px stroke dilation for 100% full under-stroke coverage with 0 gaps)
export const DUCK_PLACED_BEAK_PATH = '${placedBeakPath}';
export const DUCK_PLACED_WING_PATH = '${placedWingPath}';
export const DUCK_PLACED_LEFT_FOOT_PATH = '${placedLeftFootPath}';
export const DUCK_PLACED_RIGHT_FOOT_PATH = '${placedRightFootPath}';
export const DUCK_PLACED_BODY_PATH = '${placedBodyPath}';
`;

fs.writeFileSync('src/components/duck_constants.ts', code);
console.log('Saved src/components/duck_constants.ts');
console.log('Bounding boxes:');
console.log('Beak:', cBeak.bbox, `w=${cBeak.w}, h=${cBeak.h}`);
console.log('Wing:', cWing.bbox, `w=${cWing.w}, h=${cWing.h}`);
console.log('LeftFoot:', cLeftFoot.bbox, `w=${cLeftFoot.w}, h=${cLeftFoot.h}`);
console.log('RightFoot:', cRightFoot.bbox, `w=${cRightFoot.w}, h=${cRightFoot.h}`);
console.log('Body:', cBody.bbox, `w=${cBody.w}, h=${cBody.h}`);
