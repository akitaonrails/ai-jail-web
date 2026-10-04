# aijail.io

The website for [ai-jail](https://github.com/akitaonrails/ai-jail), an OS sandbox for AI coding agents, published at **https://aijail.io**.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run check && npm run check:colors && npm run check:i18n
```

Browser regression checks: run `npx playwright install chromium` once, then `npm run check:ui`. The check starts its own local production preview and checks rendered contrast and controls; it is not a pixel-level visual review.

Astro 7, Tailwind 4, GSAP for the homepage access scene, six languages (en, pt-br, es, he, ja, ko). Deployed on Netlify from `main`; a small browser script sends first-time visitors to their browser language, and the build writes localized 404 fallbacks to `_redirects`.

| Read | For |
|---|---|
| `docs/design-system.md` | How pages are put together, components, motion, writing rules |
| `docs/color-study.md` | Where the palette comes from and its measured contrast |
| `docs/i18n.md` | Languages, translation workflow, translated diagrams |
| `docs/images.md` | Technical diagrams, localized labels and screenshot checks |
| `reports/Authentic developer tool design.md` | Redesign rationale and acceptance criteria, with supporting sources in `research_notes/` |
| `docs/analytics.md` | Google Analytics: the `PUBLIC_GA_ID` build variable, consent, events |
| `docs/brand/` | The logo master and how it was made |
| `CLAUDE.md` | The rules an AI assistant must follow in this repository |

The production domain, https://aijail.io, is set in `url` in `src/data/site.ts` (canonical URLs, sitemap, share cards) and in the www redirect in `netlify.toml`.
