// Reads the color tokens straight out of src/styles/global.css and reports
// WCAG 2.x contrast for every pairing the site actually uses.
// Run: npm run check:colors   (exits 1 if any pairing misses its target)
import { readFileSync, readdirSync } from 'node:fs';
import { parse, wcagContrast, formatHex } from 'culori';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

function block(selector) {
  const out = {};
  const re = new RegExp(`${selector}\\s*\\{([^}]*)\\}`, 'g');
  for (const m of css.matchAll(re)) {
    for (const d of m[1].matchAll(/--([\w-]+):\s*(oklch\([^)]*\))/g)) out[d[1]] = d[2];
  }
  return out;
}

const root = block(':root');
const themes = { light: root, dark: { ...root, ...block("\\[data-theme='dark'\\]") } };
const hues = ['gold', 'orange', 'red', 'magenta', 'cyan'];

let failed = 0;
const md = process.argv.includes('--md');
for (const [name, t] of Object.entries(themes)) {
  const rows = [
    ['text', 'bg', 7], ['text', 'surface', 7], ['text', 'tint', 7],
    ['muted', 'bg', 4.5], ['muted', 'surface', 4.5], ['muted', 'tint', 4.5],
    ...hues.flatMap((h) => [[h, 'bg', 4.5], [h, 'surface', 4.5], [h, 'tint', 4.5], [h, `${h}-soft`, 4.5]]),
    ['on-action', 'action', 7], ['on-action', 'action-hi', 7], ['on-ink', 'ink', 7], ['on-ink', 'ink-raised', 7], ['on-ink-muted', 'ink-raised', 4.5],
    ['line', 'bg', 1.2],
  ];
  console.log(md ? `\n### ${name}\n\n| Foreground | Background | Ratio | Target | |\n|---|---|---|---|---|` : `\n== ${name} ==`);
  for (const [fg, bg, target] of rows) {
    const ratio = wcagContrast(parse(t[fg]), parse(t[bg]));
    const ok = ratio >= target;
    if (!ok) failed++;
    const line = md
      ? `| \`${fg}\` ${formatHex(parse(t[fg]))} | \`${bg}\` ${formatHex(parse(t[bg]))} | ${ratio.toFixed(2)} | ${target} | ${ok ? 'pass' : '**FAIL**'} |`
      : `${ok ? 'ok  ' : 'FAIL'} ${ratio.toFixed(2).padStart(5)} (>=${target})  ${fg} on ${bg}`;
    console.log(line);
  }
}

// Every color must be a token: no color values in pages or components.
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]));
const src = new URL('../src', import.meta.url).pathname;
for (const file of [...walk(`${src}/pages`), ...walk(`${src}/components`), ...walk(`${src}/layouts`)]) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (/\b(oklch|oklab|rgba?|hsla?)\(|(?<![&\w"'(/])#[0-9a-fA-F]{3,8}\b/.test(line) && !/theme-color|href=/.test(line)) {
      console.log(`FAIL color value outside the tokens: ${file.replace(src, 'src')}:${i + 1}`);
      failed++;
    }
  });
}
process.exit(failed ? 1 : 0);
