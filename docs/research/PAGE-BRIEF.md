# Brief for building one detail page

You are building ONE page of the ai-jail hotsite (Astro 7, Tailwind 4, i18n catalogs). Other people are building the other pages at the same time, so touch ONLY the files listed under "Your files".

## Read first
1. `docs/design-system.md` (rules for layout, components, hues, motion and WRITING; follow it strictly)
2. `docs/images.md` and `scripts/prompts/_style.txt` and `scripts/prompts/home-wrap.txt` (how diagrams are made)
3. `src/pages/[...locale]/index.astro` with `src/i18n/locales/en/home.json` and `common.json` (the reference for how a page joins structure and words: `useI18n`, `raw`, `withText`, `href`, `getStaticPaths = localePaths`)
4. The components you use in `src/components/`
5. Facts: the ai-jail repository is cloned at `/tmp/claude-1026/-mnt-data-Projects-ai-jail-web/b7624f5d-3a4d-4cfc-862a-df95047c7705/scratchpad/ai-jail` (README.md, docs/SECURITY.md, docs/sandbox-alternatives.md, docs/RELEASE_SECURITY.md, releases/). Facts about Claude Code, Codex, Gemini CLI and OpenCode: `docs/research/builtin-sandboxes.md`. Verify every claim you write against these. Never invent.

## Your files
- `src/pages/[...locale]/<page>.astro`
- `src/i18n/locales/en/<namespace>.json` (every visible word, including alt texts, captions, meta title and description under `meta.title` / `meta.description`)
- `scripts/prompts/<page>-<topic>.txt` and the generated `src/assets/img/gen/<page>-<topic>.webp` (two or three per page)
- `scripts/prompts/<page>.labels.json`: for each image you made, the translatable labels and the ones that stay as they are, e.g. `{ "how-layers": { "translate": ["Your project", "Blocked"], "keep": ["seccomp", "bwrap"] } }`

Do not edit components, global.css, common.json, other pages or docs. If you need something shared that does not exist, put it in your page's own `<style>` or markup and mention it in your final report.

## Rules that are easy to get wrong
- The audience has never heard of ai-jail. Lead with what it means for them. Fewer words, more pictures: every section should have something to look at (Figure, Reach lists, table, terminal, Steps). No paragraph over three sentences.
- No visible English in the `.astro` file. Commands, flags, paths and product names are structure and stay in code or inside `<code>` in the catalog.
- Links inside catalog strings are written `<a class="link" href="/configure/#secrets">`; they get localized automatically. External links too: `<a class="link" href="https://...">`.
- Do not repeat what another page owns (see "canonical homes" in the design system). Link to it.
- Hues: use only the five `data-hue` values. Never write a color value.
- Images: generate with `node scripts/gen-image.mjs <name>` (GEMINI_API_KEY is already in the environment; about 40 seconds each). Then LOOK at the result with the Read tool and check it against the list in `docs/images.md`: every label spelled right, nothing untrue, dark maroon ground, agent is the cyan chip. Regenerate with a better prompt if it fails, at most three tries, then simplify. At most eight labels per image, one to three words each.
- Verify your page builds: `npx astro build --outDir /tmp/claude-1026/-mnt-data-Projects-ai-jail-web/b7624f5d-3a4d-4cfc-862a-df95047c7705/scratchpad/dist-<page>` and look only for errors that mention your files (other pages may be half-written by others; ignore those errors, and if one blocks the build, wait a minute and retry).
- Final report: under 150 words. Files written, images made, anything you could not verify, anything shared you wished existed.
