import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('/tmp/caterpillar.png');
const png = PNG.sync.read(data);
const W = png.width, H = png.height;
console.log(`Caterpillar image dimension: ${W} x ${H}`);

// Identify dark stroke pixels
const stroke = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    const r = png.data[idx], g = png.data[idx + 1], b = png.data[idx + 2];
    if (r < 140 && g < 140 && b < 140) stroke[y * W + x] = 1;
  }
}

// Find connected stroke components (8-connected)
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
          if (stroke[nidx] && !sVisited[nidx]) {
            sVisited[nidx] = 1;
            q.push(nidx);
          }
        }
      }
    }
    sComps.push({ size: q.length, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1, pixels: q });
  }
}

sComps.sort((a, b) => b.size - a.size);
console.log('Top 15 stroke components:');
sComps.slice(0, 15).forEach((c, i) => {
  console.log(`Comp ${i + 1}: size=${c.size}, bbox=[${c.bbox.join(',')}], w=${c.w}, h=${c.h}`);
});

// Isolate main caterpillar body (largest component) + internal facial features (eyes, nose, smile)
// Exclude top-left `<` UI icon (x < 70, y < 70) and bottom-right magnifier UI icon (x > W - 80, y > H - 80)
const catStroke = new Uint8Array(W * H);
for (const c of sComps) {
  const inTopLeftIcon = c.bbox[2] < 80 && c.bbox[3] < 80;
  const inBottomRightIcon = c.bbox[0] > W - 90 && c.bbox[1] > H - 90;
  if (!inTopLeftIcon && !inBottomRightIcon && c.size >= 30) {
    for (const p of c.pixels) catStroke[p] = 1;
  }
}

// Find enclosed chambers
const cVisited = new Uint8Array(W * H);
const enclosed = [];
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const start = y * W + x;
    if (catStroke[start] || cVisited[start]) continue;
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
        if (cVisited[n] || catStroke[n]) continue;
        cVisited[n] = 1;
        q.push(n);
      }
    }
    if (!touchesBorder && q.length > 50) {
      enclosed.push({ size: q.length, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1, seed: [x, y] });
    }
  }
}

enclosed.sort((a, b) => a.bbox[0] - b.bbox[0]);
console.log(`Found ${enclosed.length} enclosed chambers:`);
enclosed.forEach((c, i) => {
  console.log(`Chamber ${i + 1}: size=${c.size}, bbox=[${c.bbox.join(',')}], w=${c.w}, h=${c.h}, seed=[${c.seed.join(',')}]`);
});
