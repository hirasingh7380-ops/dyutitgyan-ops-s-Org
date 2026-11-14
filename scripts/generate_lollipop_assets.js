import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('public/assets/aistudio/download__17_-removebg-preview__1__cfaaed68.png');
const png = PNG.sync.read(data);
const W = png.width;
const H = png.height;

console.log(`Image size: ${W} x ${H}`);

// 1. Extract black stroke (alpha > 60 and dark RGB)
const strokeGrid = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (W * y + x) << 2;
    const a = png.data[idx + 3];
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    if (a > 60 && r < 110 && g < 110 && b < 110) {
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

// Save lollipop_outline.png (transparent background, pure #0f0f14 stroke)
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
      outlinePng.data[idx] = 0;
      outlinePng.data[idx + 1] = 0;
      outlinePng.data[idx + 2] = 0;
      outlinePng.data[idx + 3] = 0;
    }
  }
}
fs.writeFileSync('src/assets/images/lollipop_outline.png', PNG.sync.write(outlinePng));
console.log('Saved src/assets/images/lollipop_outline.png');

// 3. Flood fill 4 chambers using strokeGrid as boundary
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

const cTop = getChamber(224, 90);
const cBand = getChamber(224, 149);
const cBottom = getChamber(224, 206);
const cStick = getChamber(224, 363);

console.log('Chamber sizes:', {
  top: cTop.pixels.length,
  band: cBand.pixels.length,
  bottom: cBottom.pixels.length,
  stick: cStick.pixels.length
});

// 4. Contour tracing algorithm
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
const placedTopPath = traceContour(cTop.pixels, PLACED_DILATE, 0, 0, W, H);
const placedBandPath = traceContour(cBand.pixels, PLACED_DILATE, 0, 0, W, H);
const placedBottomPath = traceContour(cBottom.pixels, PLACED_DILATE, 0, 0, W, H);
const placedStickPath = traceContour(cStick.pixels, PLACED_DILATE, 0, 0, W, H);

console.log('Tracing cutting piece paths...');
const cutTopPath = traceContour(cTop.pixels, 0, cTop.bbox[0], cTop.bbox[1], cTop.w, cTop.h);
const cutBandPath = traceContour(cBand.pixels, 0, cBand.bbox[0], cBand.bbox[1], cBand.w, cBand.h);
const cutBottomPath = traceContour(cBottom.pixels, 0, cBottom.bbox[0], cBottom.bbox[1], cBottom.w, cBottom.h);
const cutStickPath = traceContour(cStick.pixels, 0, cStick.bbox[0], cStick.bbox[1], cStick.w, cStick.h);

const code = `// ============================================================================
// LOLLIPOP (लॉलीपॉप) GEOMETRY CONSTANTS - Coordinate space (0 0 ${W} ${H})
// Generated from public/assets/aistudio/download__17_-removebg-preview__1__cfaaed68.png
// ============================================================================

export const LOLLIPOP_TOP_VIEWBOX = '0 0 ${cTop.w} ${cTop.h}';
export const LOLLIPOP_TOP_PATH = '${cutTopPath}';

export const LOLLIPOP_BAND_VIEWBOX = '0 0 ${cBand.w} ${cBand.h}';
export const LOLLIPOP_BAND_PATH = '${cutBandPath}';

export const LOLLIPOP_BOTTOM_VIEWBOX = '0 0 ${cBottom.w} ${cBottom.h}';
export const LOLLIPOP_BOTTOM_PATH = '${cutBottomPath}';

export const LOLLIPOP_STICK_VIEWBOX = '0 0 ${cStick.w} ${cStick.h}';
export const LOLLIPOP_STICK_PATH = '${cutStickPath}';

// Placed paths (with 3px stroke dilation for 100% full under-stroke coverage with 0 gaps)
export const LOLLIPOP_PLACED_TOP_PATH = '${placedTopPath}';
export const LOLLIPOP_PLACED_BAND_PATH = '${placedBandPath}';
export const LOLLIPOP_PLACED_BOTTOM_PATH = '${placedBottomPath}';
export const LOLLIPOP_PLACED_STICK_PATH = '${placedStickPath}';
`;

fs.writeFileSync('src/components/lollipop_constants.ts', code);
console.log('Saved src/components/lollipop_constants.ts');
console.log('Bounding boxes:');
console.log('Top:', cTop.bbox, `w=${cTop.w}, h=${cTop.h}`);
console.log('Band:', cBand.bbox, `w=${cBand.w}, h=${cBand.h}`);
console.log('Bottom:', cBottom.bbox, `w=${cBottom.w}, h=${cBottom.h}`);
console.log('Stick:', cStick.bbox, `w=${cStick.w}, h=${cStick.h}`);
