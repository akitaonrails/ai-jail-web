# Diagrams and images

The site explains system behavior with deterministic HTML/CSS diagrams rendered by `src/components/Figure.astro`. Named figures use localized labels from `src/i18n/locales/<locale>/images.json`; they do not load the old generated WebP artwork.

## Add or change a technical diagram

1. Add or update its topology in `Figure.astro`.
2. Keep commands, paths, flags, product names and mechanism names in code when they do not need translation.
3. Put every human-language label in the English `images.json`, then translate it in the other five locale catalogs.
4. Give the figure concise alt text and, when useful, a visible caption in the page namespace.
5. Run `npm run i18n:stamp`, `npm run check:i18n`, `npm run check:colors`, `npm run check` and `npm run build`.
6. Inspect every locale at phone and desktop widths, including Hebrew direction and keyboard access.

## Drawing rules

- Show the actual process, path, layer, route or boundary. Do not substitute a decorative metaphor.
- Use flat shapes, hard boundaries and consistent line weights. No glow, isometric perspective, particles or decorative grids.
- Warm colors are enforcement. Cyan is the agent and what it can reach. Red bars are blocked. Gold is opt-in.
- A route must visibly connect its source and destination. A stopped route must end at the boundary.
- Keep shared-kernel diagrams honest: containers and ai-jail do not receive a separate kernel.
- Keep Linux and macOS differences explicit where their guarantees differ.
- Use real text. Technical geometry stays left to right; localized labels keep their own direction with `bdi`.
- At 320 CSS pixels, the page must not scroll sideways. A complex diagram may simplify or stack, but it must not drop facts.
- `role="img"` and a localized `aria-label` provide the concise alternative. Captions provide visible scope and caveats.

## Real screenshots

`Figure` still accepts an imported image through its `src` prop for a real screenshot or other evidence that cannot be represented as HTML. The image needs localized alt text and must be inspected at phone width in both themes.

## Legacy generated artwork

The old files in `src/assets/img/gen/`, their prompts in `scripts/prompts/`, and the generation/localization scripts remain as source history. They are not part of the rendered site. Do not create new generated illustrations for technical explanations.
