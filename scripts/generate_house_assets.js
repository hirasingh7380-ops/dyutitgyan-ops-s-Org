import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('/tmp/house.png');
const png = PNG.sync.read(data);
const SRC_W = png.width;
const SRC_H = png.height;

// Crop to main house bbox [27..709, 110..867] + PAD=16
const CROP_X0 = 27;
const CROP_Y0 = 110;
const CROP_X1 = 709;
const CROP_Y1 = 867;
const CROP_W = CROP_X1 - CROP_X0 + 1; // 683
const CROP_H = CROP_Y1 - CROP_Y0 + 1; // 758
const PAD = 16;
const OUT_W = CROP_W + PAD * 2; // 715
const OUT_H = CROP_H + PAD * 2; // 790

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

// Save house_outline.png (transparent background, #0f0f14 bold outline)
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
fs.writeFileSync('src/assets/images/house_outline.png', PNG.sync.write(outlinePng));
console.log(`Saved src/assets/images/house_outline.png (${OUT_W}x${OUT_H})`);

// 3. Flood fill one or more seeds into a single chamber
function getChamberUnion(seeds) {
  const v = new Uint8Array(OUT_W * OUT_H);
  const pixels = [];
  let minX = OUT_W, maxX = -1, minY = OUT_H, maxY = -1;

  for (const [srcSeedX, srcSeedY] of seeds) {
    const sx = (srcSeedX - CROP_X0) + PAD;
    const sy = (srcSeedY - CROP_Y0) + PAD;
    const start = OUT_W * sy + sx;
    if (v[start] || strokeGrid[start]) continue;
    const q = [start];
    v[start] = 1;
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
  }
  return { pixels, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1 };
}

const cChimney = getChamberUnion([[496, 141], [505, 177]]);
const cRoof = getChamberUnion([[366, 122]]);
const cWinTop = getChamberUnion([[361, 272], [419, 272], [360, 332], [392, 332]]);
const cWall = getChamberUnion([[480, 470]]);
const cWinBot = getChamberUnion([[159, 583], [232, 583], [159, 660], [232, 660]]);
const cDoor = getChamberUnion([[480, 570]]);
const cBaseLeft = getChamberUnion([[70, 807]]);
const cBaseRight = getChamberUnion([[597, 807]]);

console.log('Chambers:', {
  chimney: { len: cChimney.pixels.length, w: cChimney.w, h: cChimney.h },
  roof: { len: cRoof.pixels.length, w: cRoof.w, h: cRoof.h },
  winTop: { len: cWinTop.pixels.length, w: cWinTop.w, h: cWinTop.h },
  wall: { len: cWall.pixels.length, w: cWall.w, h: cWall.h },
  winBot: { len: cWinBot.pixels.length, w: cWinBot.w, h: cWinBot.h },
  door: { len: cDoor.pixels.length, w: cDoor.w, h: cDoor.h },
  baseLeft: { len: cBaseLeft.pixels.length, w: cBaseLeft.w, h: cBaseLeft.h },
  baseRight: { len: cBaseRight.pixels.length, w: cBaseRight.w, h: cBaseRight.h },
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
const placedChimneyPath = traceContour(cChimney.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedRoofPath = traceContour(cRoof.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedWinTopPath = traceContour(cWinTop.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedWallPath = traceContour(cWall.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedWinBotPath = traceContour(cWinBot.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedDoorPath = traceContour(cDoor.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedBaseLeftPath = traceContour(cBaseLeft.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);
const placedBaseRightPath = traceContour(cBaseRight.pixels, PLACED_DILATE, 0, 0, OUT_W, OUT_H);

console.log('Tracing cutting piece paths...');
const cutChimneyPath = traceContour(cChimney.pixels, 0, cChimney.bbox[0], cChimney.bbox[1], cChimney.w, cChimney.h);
const cutRoofPath = traceContour(cRoof.pixels, 0, cRoof.bbox[0], cRoof.bbox[1], cRoof.w, cRoof.h);
const cutWinTopPath = traceContour(cWinTop.pixels, 0, cWinTop.bbox[0], cWinTop.bbox[1], cWinTop.w, cWinTop.h);
const cutWallPath = traceContour(cWall.pixels, 0, cWall.bbox[0], cWall.bbox[1], cWall.w, cWall.h);
const cutWinBotPath = traceContour(cWinBot.pixels, 0, cWinBot.bbox[0], cWinBot.bbox[1], cWinBot.w, cWinBot.h);
const cutDoorPath = traceContour(cDoor.pixels, 0, cDoor.bbox[0], cDoor.bbox[1], cDoor.w, cDoor.h);
const cutBaseLeftPath = traceContour(cBaseLeft.pixels, 0, cBaseLeft.bbox[0], cBaseLeft.bbox[1], cBaseLeft.w, cBaseLeft.h);
const cutBaseRightPath = traceContour(cBaseRight.pixels, 0, cBaseRight.bbox[0], cBaseRight.bbox[1], cBaseRight.w, cBaseRight.h);

const code = `// ============================================================================
// HOUSE (घर) GEOMETRY CONSTANTS - Coordinate space (0 0 ${OUT_W} ${OUT_H})
// Generated from public/assets/aistudio/Kinderd_Canvas___Digital_Store_66dece07.jfif
// ============================================================================

export const HOUSE_CHIMNEY_VIEWBOX = '0 0 ${cChimney.w} ${cChimney.h}';
export const HOUSE_CHIMNEY_PATH = '${cutChimneyPath}';

export const HOUSE_ROOF_VIEWBOX = '0 0 ${cRoof.w} ${cRoof.h}';
export const HOUSE_ROOF_PATH = '${cutRoofPath}';

export const HOUSE_WIN_TOP_VIEWBOX = '0 0 ${cWinTop.w} ${cWinTop.h}';
export const HOUSE_WIN_TOP_PATH = '${cutWinTopPath}';

export const HOUSE_WALL_VIEWBOX = '0 0 ${cWall.w} ${cWall.h}';
export const HOUSE_WALL_PATH = '${cutWallPath}';

export const HOUSE_WIN_BOT_VIEWBOX = '0 0 ${cWinBot.w} ${cWinBot.h}';
export const HOUSE_WIN_BOT_PATH = '${cutWinBotPath}';

export const HOUSE_DOOR_VIEWBOX = '0 0 ${cDoor.w} ${cDoor.h}';
export const HOUSE_DOOR_PATH = '${cutDoorPath}';

export const HOUSE_BASE_LEFT_VIEWBOX = '0 0 ${cBaseLeft.w} ${cBaseLeft.h}';
export const HOUSE_BASE_LEFT_PATH = '${cutBaseLeftPath}';

export const HOUSE_BASE_RIGHT_VIEWBOX = '0 0 ${cBaseRight.w} ${cBaseRight.h}';
export const HOUSE_BASE_RIGHT_PATH = '${cutBaseRightPath}';

// Placed paths (with 4px stroke dilation for 100% full under-stroke coverage with 0 gaps)
export const HOUSE_PLACED_CHIMNEY_PATH = '${placedChimneyPath}';
export const HOUSE_PLACED_ROOF_PATH = '${placedRoofPath}';
export const HOUSE_PLACED_WIN_TOP_PATH = '${placedWinTopPath}';
export const HOUSE_PLACED_WALL_PATH = '${placedWallPath}';
export const HOUSE_PLACED_WIN_BOT_PATH = '${placedWinBotPath}';
export const HOUSE_PLACED_DOOR_PATH = '${placedDoorPath}';
export const HOUSE_PLACED_BASE_LEFT_PATH = '${placedBaseLeftPath}';
export const HOUSE_PLACED_BASE_RIGHT_PATH = '${placedBaseRightPath}';
`;

fs.writeFileSync('src/components/house_constants.ts', code);
console.log('Saved src/components/house_constants.ts');
