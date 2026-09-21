# ai-jail hotsite

Marketing and explainer site for ai-jail. Astro, Tailwind 4, GSAP, six languages, deployed on Netlify. Read `docs/design-system.md`, `docs/color-study.md` and `docs/i18n.md` before changing pages.

## Colors are tokens, always

No color value appears in a page or component. Every color is a token from the generated block in `src/styles/global.css`. To change the palette, change a decision in `scripts/build-palette.mjs`, run it with `--write`, then `npm run check:colors`. The warm spectrum is the jail, cyan is the agent and the one action color, and the three states (inside, blocked, opt-in) always look the same.

## Text changes go to every language, in the same change

The site is published in en, pt-br, es, he, ja and ko. Whenever you add, reword or delete visible text:

1. Edit the English string in `src/i18n/locales/en/<namespace>.json`. No visible text lives in `.astro` files.
2. In the same change, update that key in all five other locale folders with a real translation that follows `docs/research/I18N-TRANSLATE-BRIEF.md` and `docs/i18n/glossary-<locale>.md`.
3. If the text is a label inside a diagram (`images.json`), regenerate that diagram for each language with `scripts/localize-image.mjs` and look at the results.
4. Run `npm run i18n:stamp`, then `npm run check:i18n`. It must report no errors and nothing "falling back to English".

Never silence a STALE error by stamping without translating.

## Other rules

- Writing: `docs/design-system.md`, section "Writing". The reader has never heard of ai-jail. Short text, a picture wherever one can replace a paragraph. No em dashes, no "not X but Y", no hype words.
- Facts come from the ai-jail repository (README, `docs/SECURITY.md`). Facts about other products come from `docs/research/builtin-sandboxes.md` and carry a review date (`src/data/facts.json`). Keep the honest limits.
- Each subject has one canonical page (listed in the design system). Link instead of repeating.
- Structure (hues, hrefs, ids, commands, flags) stays in code; words stay in catalogs. Use `withText()`, `href()`, `date()`, `number()`.
- CSS uses logical properties so Hebrew mirrors. Terminals, diagrams and paths get `dir="ltr"`.
- Shared patterns belong in `src/components` or `src/styles/global.css`. A page's `<style>` is for what only that page has.
- Diagrams: `docs/images.md`. Prompts are committed in `scripts/prompts/`. Look at every generated image before committing it.
- Before pushing: `npm run check:colors && npm run check:i18n && npm run build`. `main` deploys to production through Netlify.
- When a new ai-jail version is out: update `src/data/facts.json`, re-verify the flags on Configure and the comparison on Compare, and move `reviewedAt`.
