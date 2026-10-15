# Design system

How pages on the ai-jail site are put together. Read this before changing a page.

## The idea

The site feels like a stormbound prison translated into a credible developer-security product: wet black stone, iron apertures, cold mist, controlled gates and large areas of darkness. The architecture is original and must not reproduce recognizable locations, symbols or props from an existing fantasy franchise.

The page is cinematic before it is technical. Every viewport makes one clear argument and offers one obvious next step. Technical depth remains available, but it arrives progressively instead of competing with the introduction.

Three visual states carry meaning everywhere:

1. Teal means admitted: the agent, project access and the primary action.
2. Rust red hatching means withheld or dangerous.
3. Mustard means off until the operator asks.

## Hierarchy and pacing

- One dominant headline or idea per viewport.
- Use large serif headings, narrow supporting copy and generous vertical space.
- The usual progression is premise, guarantees, enforcement, details, install.
- Imagery establishes atmosphere. Diagrams explain behavior. Neither is decoration.
- Avoid dashboard density, card walls and navigation that exposes every choice at once.
- The global header stays minimal; the drawer carries the full information architecture.

## Color

All colors are generated tokens in `src/styles/global.css`. Decisions live in `scripts/build-palette.mjs`; change the script, run it with `--write`, then run `npm run check:colors`.

The base palette is soot, wet slate, bone and fog. Subject colors remain restrained signals through `data-hue`. Teal is admitted, rust red is blocked and mustard is opt-in. See [color-study.md](color-study.md).

## Type

- Lora is the display face for monumental headings.
- The system sans stack carries body copy.
- Courier Prime carries commands, labels, navigation and operator language.
- Hebrew, Japanese and Korean use their existing native font files.
- Headings use sentence case, tight tracking and balanced wrapping.
- Body lines stay under about 70 characters.

## Layout

- `.wrap` is the 76rem presentation column; `.wrap-narrow` is the reading column.
- `.band` supplies generous section rhythm.
- `PageHero` and the homepage hero use the shared cellblock image under a strong ink overlay.
- `Section` opens with one short signal line, a heading and optional lede.
- Dense reference content belongs later in the journey and remains horizontally scrollable on narrow screens.
- Every horizontal scroller must be keyboard-focusable.
- CSS uses logical properties so Hebrew mirrors. Terminals, diagrams and paths remain `dir="ltr"`.

## Components

| Component | Use |
|---|---|
| `Base` | Metadata, schema, canonical/hreflang, navigation and footer. |
| `PageHero` | Cinematic top of every detail page. |
| `Section` | A chapter with one clear visual entry point. |
| `Lockdown` | Homepage procession: one boundary change per viewport, then a summary map. |
| `Diagram` | Responsive code-built SVG with localized labels. |
| `FeatureGrid` | A small set of peer ideas after the main explanation. |
| `Reach` | Inside, blocked and opt-in resource lists. |
| `Steps` | A numbered procedure with terminal examples. |
| `CodeBlock` | Keyboard-scrollable terminal with copy action. |
| `Tabs` | Accessible alternatives such as install methods. |
| `Facts` | Verified numbers from `src/data/facts.json`. |
| `Callout` | A limit or caveat. |
| `Faq` | Accordion backed by FAQ structured data. |
| `NextPages` | A small set of onward routes. |
| `CtaBand` | The final install action over the offshore fortress image. |

## Images and diagrams

Atmospheric hero art lives in `public/images/` as optimized WebP. Keep copy dominant by using low contrast and strong overlays. Do not add text to atmospheric images.

Diagrams remain SVG drawn in code and take labels from the locale catalogs. Do not replace explanatory diagrams with generated raster art. See [images.md](images.md).

## Motion

No scroll choreography or decorative animation. Hover feedback is short and physical. Respect `prefers-reduced-motion`. The full experience must work without JavaScript apart from controls such as tabs, menus and copy actions.

## Writing

The reader has never heard of ai-jail. Tell them what it does for them, then how.

- Keep sections short and prefer a diagram to another paragraph.
- Use plain verbs, second person and active voice.
- Preserve the honest limit: ai-jail is an accident guard for a trusted agent and is not a boundary against hostile code.
- Facts come from the ai-jail repository and the reviewed research files.
- Canonical topics still live on their existing pages; link instead of repeating.
- No visible copy belongs in `.astro` files. All six locale catalogs change together.

## Verification

Before pushing: `npm run check:colors && npm run check:i18n && npm run build && npm run check:ui`. Also review the homepage, a dense reference page and Hebrew at desktop and 360px, then run a WCAG A/AA browser audit on representative routes.
