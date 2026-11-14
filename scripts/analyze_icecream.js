import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('public/assets/aistudio/Free_Ice_Cream_Coloring_Pages___Sweet___Fun_Printables_for_Kids_-removebg-preview_76a2a690.png');
const png = PNG.sync.read(data);
const W = png.width, H = png.height;
console.log(`Ice Cream image dimension: ${W} x ${H}`);

// Identify dark pixels
const stroke = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    const a = png.data[idx + 3];
    const r = png.data[idx], g = png.data[idx + 1], b = png.data[idx + 2];
    if (a > 60 && r < 140 && g < 140 && b < 140) stroke[y * W + x] = 1;
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
    sComps.push({ size: q.length, bbox: [minX, minY, maxX, maxY], w: maxX - minX + 1, h: maxY - minY + 1 });
  }
}

sComps.sort((a, b) => b.size - a.size);
console.log('Top 10 stroke components:');
sComps.slice(0, 10).forEach((c, i) => {
  console.log(`Comp ${i + 1}: size=${c.size}, bbox=[${c.bbox.join(',')}], w=${c.w}, h=${c.h}`);
});
