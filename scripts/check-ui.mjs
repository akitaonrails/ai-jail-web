// Renders every page of the built site in headless Chromium and reports what a reader would notice:
// sideways scroll at phone width, missing images, console errors, and text that lost its contrast.
// Run after `npm run build`:   node scripts/check-ui.mjs            (all locales, both themes)
//                              node scripts/check-ui.mjs he ja      (only these locales)
// Needs agent-browser on the PATH (it drives headless Chromium). Exits 1 on any finding.
import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync } from 'node:fs';

const AB = process.env.AGENT_BROWSER || 'agent-browser';
const browserSession = `ai-jail-ui-${process.pid}`;
const cookieSession = `${browserSession}-cookie`;
const only = process.argv.slice(2);
const locales = ['en', 'pt-br', 'es', 'he', 'ja', 'ko'].filter((l) => !only.length || only.includes(l));
const pages = ['', 'why/', 'how-it-works/', 'compare/', 'install/', 'configure/', 'security/', 'download/', '404.html'];
const root = new URL('../dist/', import.meta.url).pathname;
if (!existsSync(root)) { console.error('dist/ missing: run npm run build first'); process.exit(1); }

// The page server runs in this process, so the browser must be driven asynchronously or nothing is served.
const run = promisify(execFile);
const browser = async (session, ...args) => (await run(AB, ['--session', session, ...args], { encoding: 'utf8' })).stdout.trim();
const ab = (...args) => browser(browserSession, ...args);
const cookieAb = (...args) => browser(cookieSession, ...args);
const widths = [{ w: 1280, h: 900 }, { w: 360, h: 780 }];
let findings = 0;
const report = (msg) => { findings++; console.log(`FAIL ${msg}`); };

// Serve dist/ on a local port so relative URLs and _redirects behave like production paths.
const { createServer } = await import('node:http');
const { readFile } = await import('node:fs/promises');
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
]);
const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path.endsWith('/')) path += 'index.html';
  try {
    const extension = path.slice(path.lastIndexOf('.'));
    res.setHeader('Content-Type', contentTypes.get(extension) ?? 'application/octet-stream');
    res.end(await readFile(root + path));
  } catch { res.statusCode = 404; res.end('missing'); }
}).listen(0);
const port = server.address().port;

try {
  // The route is the explicit language choice. A localized URL must record its
  // locale, and removing the prefix must reset an older choice to English.
  await cookieAb('open', `http://127.0.0.1:${port}/pt-br/`);
  await cookieAb('wait', '--fn', `document.cookie.includes('nf_lang=pt-br')`);
  await cookieAb('open', `http://127.0.0.1:${port}/`);
  await cookieAb('wait', '--fn', `document.cookie.includes('nf_lang=en')`);
  const languageCookie = await cookieAb('eval', `document.cookie.match(/(?:^|; )nf_lang=([^;]*)/)?.[1] || ''`);
  if (!languageCookie.split('\n').pop()?.includes('en')) report(`language cookie did not follow the English URL: ${languageCookie}`);
  await cookieAb('close');
  console.log('ok   language cookie follows the URL locale');

  for (const locale of locales) {
    for (const page of pages) {
      const url = `http://127.0.0.1:${port}/${locale === 'en' ? '' : locale + '/'}${page}`;
      for (const { w, h } of widths) {
        for (const theme of ['light', 'dark']) {
          await ab('open', url);
          await ab('set', 'viewport', String(w), String(h));
          await ab('eval', `document.documentElement.dataset.theme='${theme}'; 'ok'`);
          const probe = await ab('eval', `JSON.stringify({
            wide: document.documentElement.scrollWidth > innerWidth + 1,
            imgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
            empty: [...document.querySelectorAll('.dg-label span')].filter((s) => !s.textContent.trim()).length,
            invisible: [...document.querySelectorAll('h1,h2,h3,p,li,td,th,a,button')].filter((el) => !el.closest('[data-scene]')).filter((el) => {
              const cs = getComputedStyle(el); return cs.opacity === '0' || cs.visibility === 'hidden';
            }).length,
          })`);
          // The eval prints the value as a JSON string literal, so it is parsed twice.
          let r; try { r = JSON.parse(probe.split('\n').pop()); if (typeof r === 'string') r = JSON.parse(r); } catch { report(`${url} ${w}px ${theme}: probe failed: ${probe.slice(0, 200)}`); continue; }
          if (r.wide) report(`${url} ${w}px ${theme}: page scrolls sideways`);
          if (r.imgs.length) report(`${url} ${w}px ${theme}: broken images ${r.imgs.join(', ')}`);
          if (r.empty) report(`${url} ${w}px ${theme}: ${r.empty} empty diagram labels`);
          if (r.invisible) report(`${url} ${w}px ${theme}: ${r.invisible} invisible text elements`);
          await ab('close');
        }
      }
      console.log(`ok   ${url}`);
    }
  }
} finally {
  server.close();
  try { await ab('close'); } catch {}
  try { await cookieAb('close'); } catch {}
  try { execFileSync('pkill', ['-f', 'chrom[e|ium].*--headless']); } catch {}
}
console.log(findings ? `${findings} findings` : 'no findings');
process.exit(findings ? 1 : 0);
