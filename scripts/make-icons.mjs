// Generates the PWA icons (PNG) with no dependencies. Run: node scripts/make-icons.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const BG = [74, 92, 232]; // accent blue
const X_COLOR = [255, 255, 255];
const O_COLOR = [255, 209, 102];

// Tiny PNG encoder (RGBA, 8-bit)
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePng(size, rgba) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header.set([8, 6, 0, 0, 0], 8); // 8-bit, RGBA
  const rows = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    rows[y * (size * 4 + 1)] = 0; // no filter
    rgba.copy(rows, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Color of the icon at (px, py) in 0..1 coordinates, or null for background. */
function sample(px, py) {
  // Board occupies the central 60%, so the icon also survives maskable cropping.
  const m = 0.2;
  const board = 0.6;
  const cell = board / 3;
  const t = 0.014; // half line thickness
  const x = px - m;
  const y = py - m;
  if (x < 0 || y < 0 || x > board || y > board) return null;

  // Grid lines
  for (const k of [1, 2]) {
    if (Math.abs(x - k * cell) < t || Math.abs(y - k * cell) < t) return X_COLOR;
  }

  const col = Math.min(2, Math.floor(x / cell));
  const row = Math.min(2, Math.floor(y / cell));
  const lx = (x - col * cell) / cell - 0.5; // -0.5..0.5 inside the cell
  const ly = (y - row * cell) / cell - 0.5;
  const mark = { '0,0': 'X', '1,1': 'O', '2,2': 'X', '0,2': 'O' }[`${col},${row}`];
  const w = 0.08; // mark half thickness (cell units)

  if (mark === 'X' && Math.abs(lx) < 0.3 && Math.abs(ly) < 0.3) {
    if (Math.abs(lx - ly) < w || Math.abs(lx + ly) < w) return X_COLOR;
  }
  if (mark === 'O') {
    const r = Math.hypot(lx, ly);
    if (r > 0.3 - w && r < 0.3 + w) return O_COLOR;
  }
  return null;
}

function render(size) {
  const buf = Buffer.alloc(size * size * 4);
  const ss = 2; // 2x2 supersampling for smoother edges
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const c = sample((x + (sx + 0.5) / ss) / size, (y + (sy + 0.5) / ss) / size) ?? BG;
          r += c[0]; g += c[1]; b += c[2];
        }
      }
      const n = ss * ss;
      buf.set([Math.round(r / n), Math.round(g / n), Math.round(b / n), 255], (y * size + x) * 4);
    }
  }
  return encodePng(size, buf);
}

mkdirSync('public', { recursive: true });
for (const [name, size] of [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  writeFileSync(`public/${name}`, render(size));
  console.log('wrote public/' + name);
}

writeFileSync(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#4a5ce8"/><path d="M38 20v60M62 20v60M20 38h60M20 62h60" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M24 24l10 10M34 24L24 34" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="50" r="7" fill="none" stroke="#ffd166" stroke-width="5"/></svg>\n`,
);
console.log('wrote public/favicon.svg');
