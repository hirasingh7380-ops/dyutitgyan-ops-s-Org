import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('/tmp/cake.png');
const png = PNG.sync.read(data);
const W = png.width, H = png.height;
console.log(`Cake image dimension: ${W} x ${H}`);

// Identify dark stroke pixels
const stroke = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    const r = png.data[idx], g = png.data[idx + 1], b = png.data[idx + 2];
    if (r < 140 && g < 140 && b < 140) stroke[y * W + x] = 1;
  }
}

// Connected stroke components
const sVisited = new Uint8Array(W * H);
const sComps = [];
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const start = y * W + x;
    if (!stroke[start] || sVisited[start]) continue;
    const q = [start];
    sVisited[start] = 1;
    let head = 0;
    let minX = x, maxX = x, minY = y, maxY = y;
    const pixels = [];
    while (head < q.length) {
      const cur = q[head++];
      pixels.push(cur);
      const cx = cur % W, cy = Math.floor(cur / W);
      if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
          const nidx = ny * W + nx;
          if (stroke[nidx] && !sVisited[nidx]) {
            sVisited[nidx] = 1;
            q.push(nidx);
          }
        }
      }
    }
    sComps.push({ size: q.length, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1, pixels });
  }
}

sComps.sort((a, b) => b.size - a.size);
console.log(`Total stroke components: ${sComps.length}. Top 10:`);
sComps.slice(0, 10).forEach((c, i) => {
  console.log(`Comp ${i + 1}: size=${c.size}, bbox=[${c.bbox.join(',')}], w=${c.w}, h=${c.h}`);
});

// Keep only major stroke components (size >= 200) to avoid noise specks
const cleanStroke = new Uint8Array(W * H);
for (const c of sComps) {
  if (c.size >= 200) {
    for (const p of c.pixels) cleanStroke[p] = 1;
  }
}

// Find enclosed chambers
const cVisited = new Uint8Array(W * H);
const enclosed = [];
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const start = y * W + x;
    if (cleanStroke[start] || cVisited[start]) continue;
    const q = [start];
    cVisited[start] = 1;
    let head = 0;
    let minX = x, maxX = x, minY = y, maxY = y;
    let touchesBorder = false;
    while (head < q.length) {
      const cur = q[head++];
      const cx = cur % W, cy = Math.floor(cur / W);
      if (cx === 0 || cx === W - 1 || cy === 0 || cy === H - 1) touchesBorder = true;
      if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
      for (const n of [cur - 1, cur + 1, cur - W, cur + W]) {
        if (n < 0 || n >= W * H) continue;
        const nx = n % W, ny = Math.floor(n / W);
        if (Math.abs(nx - cx) + Math.abs(ny - cy) !== 1) continue;
        if (cVisited[n] || cleanStroke[n]) continue;
        cVisited[n] = 1;
        q.push(n);
      }
    }
    if (!touchesBorder && q.length > 50) {
      enclosed.push({ size: q.length, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1, seed: [x, y] });
    }
  }
}

enclosed.sort((a, b) => a.bbox[1] - b.bbox[1]);
console.log(`Found ${enclosed.length} enclosed chambers:`);
enclosed.forEach((c, i) => {
  console.log(`Chamber ${i + 1}: size=${c.size}, bbox=[${c.bbox.join(',')}], w=${c.w}, h=${c.h}, seed=[${c.seed.join(',')}]`);
});
