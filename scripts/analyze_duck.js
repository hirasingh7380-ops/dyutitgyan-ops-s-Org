import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('public/assets/aistudio/32_Free_Toddler_Coloring_Pages___Print_and_Color-removebg-preview_09847147.png');
const png = PNG.sync.read(data);
const W = png.width, H = png.height;
console.log(`Duck image dimension: ${W} x ${H}`);

// Identify stroke (alpha > 60)
const stroke = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    if (png.data[idx + 3] > 60) stroke[y * W + x] = 1;
  }
}

// Find connected non-stroke components
const visited = new Uint8Array(W * H);
const components = [];

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const startIdx = y * W + x;
    if (stroke[startIdx] || visited[startIdx]) continue;

    const q = [startIdx];
    visited[startIdx] = 1;
    let head = 0;
    let minX = x, maxX = x, minY = y, maxY = y;
    let touchesBorder = false;

    while (head < q.length) {
      const curr = q[head++];
      const cx = curr % W, cy = Math.floor(curr / W);
      if (cx === 0 || cx === W - 1 || cy === 0 || cy === H - 1) touchesBorder = true;
      if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;

      const neighbors = [curr - 1, curr + 1, curr - W, curr + W];
      for (const n of neighbors) {
        if (n < 0 || n >= W * H) continue;
        const nx = n % W, ny = Math.floor(n / W);
        if (Math.abs(nx - cx) + Math.abs(ny - cy) !== 1) continue;
        if (visited[n] || stroke[n]) continue;
        visited[n] = 1;
        q.push(n);
      }
    }

    components.push({
      touchesBorder,
      size: q.length,
      bbox: [minX, minY, maxX, maxY],
      w: maxX - minX + 1,
      h: maxY - minY + 1,
      center: [Math.floor((minX + maxX) / 2), Math.floor((minY + maxY) / 2)]
    });
  }
}

console.log('Enclosed chambers:');
const enclosed = components.filter(c => !c.touchesBorder).sort((a, b) => b.size - a.size);
enclosed.forEach((c, i) => {
  console.log(`Chamber ${i + 1}: size=${c.size}, bbox=[${c.bbox.join(',')}], w=${c.w}, h=${c.h}, center=[${c.center.join(',')}]`);
});
