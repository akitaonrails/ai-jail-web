import { fileURLToPath } from 'node:url';
import { preview } from 'astro';
import { parse, wcagContrast } from 'culori';
import { chromium } from 'playwright';

const themes = ['light', 'dark'];
const widths = [360, 1280];
const failures = [];
let checked = 0;
let server;
let browser;

const assert = (label, condition) => {
  checked++;
  if (!condition) failures.push({ label });
};

const check = (label, foreground, background, target) => {
  const fg = parse(foreground);
  const bg = parse(background);
  checked++;
  if (!fg || !bg || (fg.alpha ?? 1) !== 1 || (bg.alpha ?? 1) !== 1) {
    failures.push({ label, foreground, background, error: 'Expected opaque colors' });
    return;
  }
  const ratio = wcagContrast(fg, bg);
  if (!Number.isFinite(ratio) || ratio < target) failures.push({ label, foreground, background, ratio, target });
};

const renderedColors = async (page, selector, property) => page.locator(selector).evaluateAll((elements, cssProperty) => elements
  .filter((element) => element.getClientRects().length > 0)
  .flatMap((element) => {
    const value = getComputedStyle(element).getPropertyValue(cssProperty).trim();
    const ownBackground = getComputedStyle(element).backgroundColor;
    const surface = element.closest('.panel')?.querySelector('.panel-body') ?? element.parentElement;
    const surfaceBackground = surface ? getComputedStyle(surface).backgroundColor : 'rgba(0, 0, 0, 0)';
    const backgrounds = new Set([surfaceBackground]);
    if (ownBackground !== 'rgba(0, 0, 0, 0)') backgrounds.add(ownBackground);
    return [...backgrounds].map((background) => ({ value, background }));
  }), property);

const pseudoColors = async (page, selector, pseudo, properties, backgroundSelector) => page.locator(selector).evaluateAll((elements, options) => elements
  .filter((element) => element.getClientRects().length > 0)
  .flatMap((element) => {
    const style = getComputedStyle(element, options.pseudo);
    let backgroundElement = options.backgroundSelector === 'self'
      ? element
      : options.backgroundSelector === 'parent'
        ? element.parentElement
        : element.closest(options.backgroundSelector);
    while (backgroundElement && getComputedStyle(backgroundElement).backgroundColor === 'rgba(0, 0, 0, 0)') {
      backgroundElement = backgroundElement.parentElement;
    }
    const background = backgroundElement ? getComputedStyle(backgroundElement).backgroundColor : 'rgba(0, 0, 0, 0)';
    return options.properties
      .map((property) => ({ property, value: style.getPropertyValue(property).trim(), width: parseFloat(style.getPropertyValue(property.replace('-color', '-width'))), background }))
      .filter(({ value, width }) => value && value !== 'rgba(0, 0, 0, 0)' && width > 0);
  }), { pseudo, properties, backgroundSelector });

try {
  server = await preview({
    root: fileURLToPath(new URL('../', import.meta.url)),
    logLevel: 'silent',
    server: { host: '127.0.0.1', port: 0 },
  });
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const origin = `http://127.0.0.1:${server.port}`;

  await page.goto(`${origin}/`);
  const homeScripts = await page.locator('script[src]').evaluateAll((scripts) => scripts.map((script) => script.src));
  await page.goto(`${origin}/download/`);
  const detailScripts = await page.locator('script[src]').evaluateAll((scripts) => scripts.map((script) => script.src));
  assert('Homepage scene script stays off detail pages', homeScripts.some((source) => !detailScripts.includes(source)));

  const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
  const noJsPage = await noJsContext.newPage();
  for (const prefix of ['', '/he']) {
    await noJsPage.goto(`${origin}${prefix}/install/`);
    assert(`${prefix} no-JS install methods`, await noJsPage.locator('[role="tabpanel"]:visible').count() === 6);
    await noJsPage.locator('.no-js-menu summary').click();
    assert(`${prefix} no-JS navigation links`, await noJsPage.locator('.no-js-menu-panel a:visible').count() === 7);
    await noJsPage.locator(`.no-js-menu-panel a[href="${prefix}/configure/"]`).click();
    assert(`${prefix} no-JS navigation works`, new URL(noJsPage.url()).pathname === `${prefix}/configure/`);

    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(`${origin}${prefix}/install/`);
    await page.waitForFunction(() => document.querySelectorAll('[role="tabpanel"][hidden]').length === 5);
    await page.locator('[data-drawer-open]').click();
    assert(`${prefix} enhanced drawer opens`, await page.locator('#drawer').evaluate((drawer) => drawer.open));
    await page.keyboard.press('Escape');
    const tabs = page.locator('[role="tab"]');
    await tabs.nth(1).focus();
    await page.keyboard.press('ArrowRight');
    assert(`${prefix} tabs follow visual arrow direction`, await tabs.nth(prefix ? 0 : 2).getAttribute('aria-selected') === 'true');
    await page.keyboard.press('End');
    assert(`${prefix} End selects last tab`, await tabs.last().getAttribute('aria-selected') === 'true');
    await page.keyboard.press('Home');
    assert(`${prefix} Home selects first tab`, await tabs.first().getAttribute('aria-selected') === 'true');

    for (const width of [320, 360, 768]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(`${origin}${prefix}/compare/`);
      const geometry = await page.locator('.compare-wrap').evaluate((region) => {
        region.scrollLeft = getComputedStyle(region).direction === 'rtl' ? -region.scrollWidth : region.scrollWidth;
        region.scrollTop = region.scrollHeight;
        const row = region.querySelector('tbody:last-child tr:last-child');
        const heading = row.querySelector('th').getBoundingClientRect();
        const cell = row.querySelector('td:last-child').getBoundingClientRect();
        const box = region.getBoundingClientRect();
        const rtl = getComputedStyle(region).direction === 'rtl';
        return {
          clear: rtl ? cell.right <= heading.left + 1 : cell.left >= heading.right - 1,
          contained: cell.left >= box.left && cell.right <= box.right,
          sticky: getComputedStyle(region.querySelector('thead th:last-child')).position === 'sticky',
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
        };
      });
      assert(`${prefix} ${width}px comparison retains unobscured context`, geometry.clear && geometry.contained && geometry.sticky && !geometry.overflow);
    }
  }
  await noJsContext.close();

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${origin}/how-it-works/`);
  const networkPanels = await page.locator('[data-diagram="how-egress"] .panel').evaluateAll((panels) => panels.map((panel) => {
    const box = panel.getBoundingClientRect();
    return { top: box.top, left: box.left };
  }));
  assert('Four-panel network figure uses a balanced 2x2 grid', new Set(networkPanels.map(({ top }) => Math.round(top))).size === 2 && new Set(networkPanels.map(({ left }) => Math.round(left))).size === 2);
  assert('Figure captions render catalog markup', await page.locator('[data-diagram="how-egress"] + figcaption code').count() === 3 && !await page.locator('[data-diagram="how-egress"] + figcaption').innerText().then((text) => text.includes('<code>')));

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of themes) {
      await page.goto(`${origin}/why/`);
      await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
      const button = page.locator('.cta-band.on-ink .btn-ghost');
      if (await button.count() !== 1) failures.push({ label: `${theme} ${width}px dark ghost button`, error: 'missing' });
      else {
        await button.hover();
        await page.waitForTimeout(200);
        const colors = await button.evaluate((element) => {
          const style = getComputedStyle(element);
          return { foreground: style.color, background: style.backgroundColor };
        });
        check(`${theme} ${width}px dark ghost hover`, colors.foreground, colors.background, 4.5);
      }

      const routeChecks = [
        ['/why/', '.map-routes path:not([data-reachable="true"])', 'stroke', 'gold route'],
        ['/why/', '.map-routes path[data-reachable="true"]', 'stroke', 'reachable route'],
        ['/security/', '.blocked-routes path:not(.route-stop)', 'stroke', 'blocked route'],
        ['/security/', '.blocked-routes .route-stop', 'stroke', 'route stop'],
        ['/how-it-works/', '.panel-body.boundary', 'border-block-start-color', 'sandbox boundary'],
        ['/how-it-works/', '.node[data-tone="agent"]', 'border-block-start-color', 'agent node'],
        ['/how-it-works/', '.node[data-tone="allowed"]', 'border-block-start-color', 'allowed node'],
        ['/how-it-works/', '.node[data-tone="wall"]', 'border-block-start-color', 'wall node'],
        ['/how-it-works/', '.node[data-tone="option"]', 'border-block-start-color', 'option node'],
        ['/how-it-works/', '.node[data-tone="strong"]', 'border-block-start-color', 'strong node'],
        ['/security/', '.node[data-tone="blocked"]', 'border-block-start-color', 'blocked node'],
        ['/compare/', '.node[data-kind="fanout"] > .node-children', 'border-inline-end-color', 'fanout rail'],
        ['/security/', '.panel[data-shared-kernel="true"] .foundation', 'border-block-start-color', 'shared foundation'],
        ['/configure/', '.node[data-tone="neutral"][data-kind="item"]', 'border-block-start-color', 'neutral semantic node'],
        ['/how-it-works/', '.node[data-tone="neutral"][data-kind="foundation"]', 'border-block-start-color', 'neutral foundation'],
        ['/how-it-works/', '.node[data-kind="layer"][data-tone="option"]', 'border-inline-start-color', 'option layer'],
        ['/how-it-works/', '.node[data-kind="layer"][data-tone="wall"]', 'border-inline-start-color', 'wall layer'],
        ['/how-it-works/', '.node[data-kind="layer"][data-tone="strong"]', 'border-inline-start-color', 'strong layer'],
      ];
      for (const [route, selector, property, name] of routeChecks) {
        await page.goto(`${origin}${route}`);
        await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
        const rows = await renderedColors(page, selector, property);
        if (!rows.length) failures.push({ label: `${theme} ${width}px ${name}`, error: 'missing' });
        for (const row of rows) check(`${theme} ${width}px ${name}`, row.value, row.background, 3);
      }

      const pseudoChecks = [
        ['/how-it-works/', '.mode-flow > .nodes > .node[data-link-after="pass"]', '::after', 'flow connector', '.panel-body'],
        ['/compare/', '.node[data-kind="flow"] > .node-children > .node:not(:last-child)', '::after', 'nested flow connector', '.panel-body'],
        ['/compare/', '.mode-flow > .nodes > .node[data-link-after="stop"]', '::after', 'flow stop', 'self'],
        ['/compare/', '.node[data-kind="fanout"] > .node-children > .node', '::after', 'fanout branch', '.panel-body'],
        ['/compare/', '.node[data-kind="fanout"]', '::after', 'fanout trunk', '.panel-body'],
        ['/configure/', '.node[data-kind="reachable"]', '::before', 'reachable stub', 'parent'],
        ['/how-it-works/', '.egress', '::before', 'egress entry', '.diagram'],
        ['/how-it-works/', '.egress > .node:not(:last-child)', '::after', 'egress branch', '.diagram'],
        ['/security/', '.panel[data-shared-kernel="true"] .foundation', '::after', 'shared-kernel connector', '.panel-body'],
        ['/security/', '.panel[data-shared-kernel="true"] .foundation', '::after', 'shared-kernel connector on foundation', 'self'],
      ];
      for (const [route, selector, pseudo, name, backgroundSelector] of pseudoChecks) {
        await page.goto(`${origin}${route}`);
        await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
        const rows = await pseudoColors(page, selector, pseudo, [
          'border-block-start-color', 'border-block-end-color', 'border-inline-start-color', 'border-inline-end-color',
        ], backgroundSelector);
        if (!rows.length) failures.push({ label: `${theme} ${width}px ${name}`, error: 'missing' });
        for (const row of rows) check(`${theme} ${width}px ${name} ${row.property}`, row.value, row.background, 3);
      }
    }
  }
} finally {
  await browser?.close();
  await server?.stop();
}

if (failures.length) {
  console.error(JSON.stringify({ checked, failures }, null, 2));
  process.exit(1);
}
console.log(`UI checks passed: ${checked} assertions and rendered pairings`);
