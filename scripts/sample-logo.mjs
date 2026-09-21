// Samples the logo and reports where its colors sit in OKLCH. The palette in src/styles/global.css is derived
// from this output; see docs/color-study.md.   Run: npm run colors:sample
import sharp from 'sharp';
import { oklch, formatHex } from 'culori';

const { data, info } = await sharp(new URL('../src/assets/img/logo.png', import.meta.url).pathname)
  .resize(400).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

// Hue histogram of the saturated pixels, in 10 degree bins, weighted by chroma.
const bins = new Array(36).fill(0).map(() => ({ w: 0, l: 0, c: 0, n: 0 }));
const columns = new Array(8).fill(0).map(() => ({ x: 0, y: 0, n: 0 }));
let dark = { l: 0, c: 0, hx: 0, hy: 0, n: 0 };
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] < 250) continue;
  const c = oklch({ mode: 'rgb', r: data[i] / 255, g: data[i + 1] / 255, b: data[i + 2] / 255 });
  if (c.l < 0.3 && c.c > 0.02) { dark.l += c.l; dark.c += c.c; dark.hx += Math.cos(c.h * Math.PI / 180); dark.hy += Math.sin(c.h * Math.PI / 180); dark.n++; }
  if (c.c < 0.07 || c.l < 0.35) continue;
  const b = bins[Math.floor(c.h / 10) % 36];
  b.w += c.c; b.l += c.l; b.c += c.c; b.n++;
  // Mean hue per vertical slice, warm body only (the chip is cool), to see which way the spectrum runs.
  if (c.h < 120 || c.h > 330) {
    const col = columns[Math.min(7, Math.floor(((i / 4) % info.width) / info.width * 8))];
    col.x += Math.cos(c.h * Math.PI / 180); col.y += Math.sin(c.h * Math.PI / 180); col.n++;
  }
}
const total = bins.reduce((s, b) => s + b.w, 0);
console.log('hue    share  mean L  mean C  swatch');
bins.forEach((b, i) => {
  if (b.w / total < 0.004) return;
  const l = b.l / b.n, c = b.c / b.n;
  console.log(`${String(i * 10).padStart(3)}-${String(i * 10 + 9).padEnd(3)} ${(b.w / total * 100).toFixed(1).padStart(5)}%  ${l.toFixed(2)}    ${c.toFixed(3)}   ${formatHex({ mode: 'oklch', l, c, h: i * 10 + 5 })}`);
});
console.log('\nmean body hue per vertical slice, left to right:');
console.log(columns.map((c) => Math.round((Math.atan2(c.y, c.x) * 180 / Math.PI + 360) % 360)).join('  '));
const dh = (Math.atan2(dark.hy, dark.hx) * 180 / Math.PI + 360) % 360;
console.log(`\noutline and window (dark pixels): L ${(dark.l / dark.n).toFixed(2)}  C ${(dark.c / dark.n).toFixed(3)}  h ${dh.toFixed(0)}  ${formatHex({ mode: 'oklch', l: dark.l / dark.n, c: dark.c / dark.n, h: dh })}`);
