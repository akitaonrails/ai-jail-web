# aijail.io

The website for [ai-jail](https://github.com/akitaonrails/ai-jail), an OS sandbox for AI coding agents, published at **https://aijail.io**.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run check && npm run check:colors && npm run check:i18n
npm run check:ui   # after a build: every page, six languages, two widths, two themes in headless Chromium
```

Astro 7, Tailwind 4, six languages (en, pt-br, es, he, ja, ko), no image pipeline: the diagrams are SVG drawn in code and the logo is a woodcut. Deployed on Netlify from `main`; a small browser script sends first-time visitors to their browser language, and the build writes localized 404 fallbacks to `_redirects`.

| Read | For |
|---|---|
| `docs/design-system.md` | The printed look, components, the one motion, writing rules |
| `docs/color-study.md` | Where the palette comes from and its measured contrast |
| `docs/i18n.md` | Languages, translation workflow, diagram labels |
| `docs/images.md` | How the diagrams are drawn in code and checked |
| `docs/analytics.md` | Google Analytics: the `PUBLIC_GA_ID` build variable, consent, events |
| `docs/brand/` | The woodcut master and how the logo files are cut from it |
| `CLAUDE.md` | The rules an AI assistant must follow in this repository |

The production domain, https://aijail.io, is set in `url` in `src/data/site.ts` (canonical URLs, sitemap, share cards) and in the www redirect in `netlify.toml`.
