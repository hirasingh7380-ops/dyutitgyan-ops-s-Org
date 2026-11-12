import fs from 'fs';
import { PNG } from 'pngjs';

const W = 734, H = 750;
const cx = 368, cy = 375;

// Let's test petal bounding boxes and positions
const petalData = [
  { name: 'Top', deg: -90, seed: [368, 155], bbox: [241, 18, 494, 280], w: 254, h: 263 },
  { name: 'TopRight', deg: -30, seed: [559, 265], bbox: [427, 112, 716, 368], w: 290, h: 257 },
  { name: 'BottomRight', deg: 30, seed: [559, 485], bbox: [427, 381, 716, 637], w: 290, h: 257 },
  { name: 'Bottom', deg: 90, seed: [368, 595], bbox: [241, 469, 494, 731], w: 254, h: 263 },
  { name: 'BottomLeft', deg: 150, seed: [177, 485], bbox: [19, 381, 308, 637], w: 290, h: 257 },
  { name: 'TopLeft', deg: 210, seed: [177, 265], bbox: [19, 112, 308, 368], w: 290, h: 257 },
];

console.log('Center disk: bbox=[274, 281, 462, 468], w=189, h=188');
console.log('Center disk in %:', {
  left: (274 / W * 100).toFixed(1) + '%',
  top: (281 / H * 100).toFixed(1) + '%',
  width: (189 / W * 100).toFixed(1) + '%',
  height: (188 / H * 100).toFixed(1) + '%'
});

for (const p of petalData) {
  console.log(`${p.name} in %:`, {
    left: (p.bbox[0] / W * 100).toFixed(1) + '%',
    top: (p.bbox[1] / H * 100).toFixed(1) + '%',
    width: (p.w / W * 100).toFixed(1) + '%',
    height: (p.h / H * 100).toFixed(1) + '%'
  });
}
