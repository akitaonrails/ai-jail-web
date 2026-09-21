# aijail.io

The website for [ai-jail](https://github.com/akitaonrails/ai-jail), an OS sandbox for AI coding agents, published at **https://aijail.io**.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run check:colors && npm run check:i18n
```

Astro 7, Tailwind 4, GSAP for scroll motion, six languages (en, pt-br, es, he, ja, ko). Deployed on Netlify from `main`; the build writes `_redirects` so a first visit lands on the visitor's language at the edge.

| Read | For |
|---|---|
| `docs/design-system.md` | How pages are put together, components, motion, writing rules |
| `docs/color-study.md` | Where the palette comes from and its measured contrast |
| `docs/i18n.md` | Languages, translation workflow, translated diagrams |
| `docs/images.md` | How the diagrams are generated and checked |
| `docs/analytics.md` | Google Analytics: the `PUBLIC_GA_ID` build variable, consent, events |
| `docs/brand/` | The logo master and how it was made |
| `CLAUDE.md` | The rules an AI assistant must follow in this repository |

The production domain, https://aijail.io, is set in `url` in `src/data/site.ts` (canonical URLs, sitemap, share cards) and in the www redirect in `netlify.toml`.
