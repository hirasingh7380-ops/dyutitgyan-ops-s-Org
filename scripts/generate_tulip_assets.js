import fs from 'fs';
import { PNG } from 'pngjs';

function loadAndClean(file, crop) {
  const data = fs.readFileSync(file);
  const png = PNG.sync.read(data);
  const SRC_W = png.width, SRC_H = png.height;
  const { x0, y0, x1, y1, pad, minCompSize = 150 } = crop;
  const CROP_W = x1 - x0 + 1;
  const CROP_H = y1 - y0 + 1;
  const OUT_W = CROP_W + pad * 2;
  const OUT_H = CROP_H + pad * 2;

  const rawStroke = new Uint8Array(OUT_W * OUT_H);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const idx = (SRC_W * y + x) << 2;
      const r = png.data[idx], g = png.data[idx + 1], b = png.data[idx + 2];
      if (r < 140 && g < 140 && b < 140) {
        const ox = (x - x0) + pad;
        const oy = (y - y0) + pad;
        rawStroke[OUT_W * oy + ox] = 1;
      }
    }
  }

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
      if (q.length >= minCompSize) {
        for (const p of q) strokeGrid[p] = 1;
      }
    }
  }

  return { SRC_W, SRC_H, OUT_W, OUT_H, x0, y0, pad, strokeGrid };
}

function saveOutlinePng(info, outPath, dilateR = 1) {
  const { OUT_W, OUT_H, strokeGrid } = info;
  const dilated = new Uint8Array(OUT_W * OUT_H);
  for (let y = 0; y < OUT_H; y++) {
    for (let x = 0; x < OUT_W; x++) {
      if (strokeGrid[OUT_W * y + x]) {
        for (let dy = -dilateR; dy <= dilateR; dy++) {
          for (let dx = -dilateR; dx <= dilateR; dx++) {
            if (dx * dx + dy * dy <= dilateR * dilateR + 0.5) {
              const nx = x + dx, ny = y + dy;
              if (nx >= 0 && nx < OUT_W && ny >= 0 && ny < OUT_H) {
                dilated[OUT_W * ny + nx] = 1;
              }
            }
          }
        }
      }
    }
  }
  const outPng = new PNG({ width: OUT_W, height: OUT_H });
  for (let y = 0; y < OUT_H; y++) {
    for (let x = 0; x < OUT_W; x++) {
      const idx = (OUT_W * y + x) << 2;
      if (dilated[OUT_W * y + x]) {
        outPng.data[idx] = 15;
        outPng.data[idx + 1] = 15;
        outPng.data[idx + 2] = 20;
        outPng.data[idx + 3] = 255;
      } else {
        outPng.data[idx] = 0;
        outPng.data[idx + 1] = 0;
        outPng.data[idx + 2] = 0;
        outPng.data[idx + 3] = 0;
      }
    }
  }
  fs.writeFileSync(outPath, PNG.sync.write(outPng));
  console.log(`Saved ${outPath} (${OUT_W}x${OUT_H})`);
}

function getChamber(info, srcSeedX, srcSeedY) {
  const { OUT_W, OUT_H, x0, y0, pad, strokeGrid } = info;
  const sx = (srcSeedX - x0) + pad;
  const sy = (srcSeedY - y0) + pad;
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

// Close interior vein slits (open dark strokes inside a chamber) without expanding the outer boundary
function closeInteriorSlits(info, chamber, r = 5) {
  const { OUT_W, OUT_H } = info;
  const [bMinX, bMinY, bMaxX, bMaxY] = chamber.bbox;
  const xStart = Math.max(0, bMinX - r - 2);
  const yStart = Math.max(0, bMinY - r - 2);
  const xEnd = Math.min(OUT_W - 1, bMaxX + r + 2);
  const yEnd = Math.min(OUT_H - 1, bMaxY + r + 2);
  const lw = xEnd - xStart + 1;
  const lh = yEnd - yStart + 1;

  const orig = new Uint8Array(lw * lh);
  for (const p of chamber.pixels) {
    orig[(p.y - yStart) * lw + (p.x - xStart)] = 1;
  }

  const dil = new Uint8Array(lw * lh);
  for (let y = 0; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      if (!orig[y * lw + x]) continue;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy > r * r) continue;
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < lw && ny >= 0 && ny < lh) {
            dil[ny * lw + nx] = 1;
          }
        }
      }
    }
  }

  const closed = new Uint8Array(lw * lh);
  for (let y = 0; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      if (!dil[y * lw + x]) continue;
      let ok = true;
      for (let dy = -r; dy <= r && ok; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy > r * r) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= lw || ny < 0 || ny >= lh || !dil[ny * lw + nx]) {
            ok = false;
            break;
          }
        }
      }
      if (ok) closed[y * lw + x] = 1;
    }
  }

  const pixels = [];
  let minX = OUT_W, maxX = -1, minY = OUT_H, maxY = -1;
  for (let y = 0; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      if (closed[y * lw + x] || orig[y * lw + x]) {
        const gx = x + xStart, gy = y + yStart;
        pixels.push({ x: gx, y: gy });
        if (gx < minX) minX = gx; if (gx > maxX) maxX = gx;
        if (gy < minY) minY = gy; if (gy > maxY) maxY = gy;
      }
    }
  }
  return { pixels, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1 };
}

function traceContour(pixels, dilateR = 0, offsetX = 0, offsetY = 0, targetW, targetH) {
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
      if (cur.x2 === loop[0].x && cur.y2 === loop[0].y) break;
      const candidates = edgeMap.get(`${cur.x2},${cur.y2}`) || [];
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
      const prev = res[res.length - 1], cur = pts[i], next = pts[i + 1];
      const dx1 = cur.x - prev.x, dy1 = cur.y - prev.y;
      const dx2 = next.x - cur.x, dy2 = next.y - cur.y;
      if (dx1 * dy2 === dy1 * dx2 && Math.sign(dx1) === Math.sign(dx2) && Math.sign(dy1) === Math.sign(dy2)) continue;
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

function buildConstants(title, srcName, prefix, outConstPath, info, parts) {
  const PLACED_DILATE = 5;
  let lines = [
    `// ============================================================================`,
    `// ${title} GEOMETRY CONSTANTS - Coordinate space (0 0 ${info.OUT_W} ${info.OUT_H})`,
    `// Generated from public/assets/aistudio/${srcName}`,
    `// ============================================================================`,
    '',
  ];
  for (const p of parts) {
    const cutPath = traceContour(p.chamber.pixels, 0, p.chamber.bbox[0], p.chamber.bbox[1], p.chamber.w, p.chamber.h);
    lines.push(`export const ${prefix}_${p.key}_VIEWBOX = '0 0 ${p.chamber.w} ${p.chamber.h}';`);
    lines.push(`export const ${prefix}_${p.key}_PATH = '${cutPath}';`);
    lines.push('');
  }
  lines.push('// Placed paths (with 5px stroke dilation for 100% full under-stroke coverage with 0 gaps)');
  for (const p of parts) {
    const placedPath = traceContour(p.chamber.pixels, PLACED_DILATE, 0, 0, info.OUT_W, info.OUT_H);
    lines.push(`export const ${prefix}_PLACED_${p.key}_PATH = '${placedPath}';`);
  }
  lines.push('');
  fs.writeFileSync(outConstPath, lines.join('\n'));
  console.log(`Saved ${outConstPath}`);
}

const tulipInfo = loadAndClean('/tmp/tulip.png', { x0: 85, y0: 133, x1: 600, y1: 1088, pad: 16, minCompSize: 150 });
saveOutlinePng(tulipInfo, 'src/assets/images/tulip_outline.png', 1);

const tulipParts = [
  { key: 'PETAL_TOP', chamber: getChamber(tulipInfo, 344, 203) },
  { key: 'PETAL_LEFT_INNER', chamber: getChamber(tulipInfo, 223, 250) },
  { key: 'PETAL_RIGHT_INNER', chamber: getChamber(tulipInfo, 441, 280) },
  { key: 'PETAL_LEFT', chamber: getChamber(tulipInfo, 173, 374) },
  { key: 'PETAL_CENTER', chamber: closeInteriorSlits(tulipInfo, getChamber(tulipInfo, 308, 398), 5) },
  { key: 'PETAL_RIGHT', chamber: getChamber(tulipInfo, 505, 377) },
  { key: 'STEM', chamber: getChamber(tulipInfo, 340, 823) },
  { key: 'LEAF_LEFT', chamber: closeInteriorSlits(tulipInfo, getChamber(tulipInfo, 150, 774), 6) },
  { key: 'LEAF_RIGHT', chamber: closeInteriorSlits(tulipInfo, getChamber(tulipInfo, 534, 786), 6) },
];

console.log('Tulip parts:', tulipParts.map(p => `${p.key}:${p.chamber.w}x${p.chamber.h}`));
buildConstants(
  'TULIP (ट्यूलिप फूल)',
  '794674296795607881_4d711042.jfif',
  'TULIP',
  'src/components/tulip_constants.ts',
  tulipInfo,
  tulipParts
);
