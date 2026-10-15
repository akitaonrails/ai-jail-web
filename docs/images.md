# Diagrams

Every diagram on the site is drawn in code: an SVG in `src/components/diagrams/<name>.astro`, shown through `Diagram.astro`. The labels come from `src/i18n/locales/<locale>/images.json`, so the same drawing serves every language with its own words. There is no image generation, no image localization and no raster to regenerate when a label changes.

```astro
<Diagram name="how-layers" alt={t('layers.alt')} caption={t('layers.caption')} />
```

`name` is the file name in `src/components/diagrams/` and the key in `images.json`. The `alt` sentence says what the drawing says; it is the only thing a screen reader gets, since the SVG is one `role="img"`.

## The drawing language

Technical linework on wet stone. Strokes are thin, use the current text color and never scale. Shapes stay flat and labels are compact monospace text that wraps inside each box. Three signals carry meaning and nothing else does:

| Plate | Meaning | Part |
|---|---|---|
| cold teal | the agent, and what it may reach | `Chip`, `Box kind="agent"` or `kind="inside"` |
| muted mustard | opt-in, reachable only after a flag | `Box kind="optin"` |
| rust hatching | blocked, not there | `Box kind="blocked"`, `Arrow kind="stopped"` |

Everything else uses the base stone surface (`Box`, the default), a raised tint (`kind="tint"`), dashed outlines (`kind="ghost"`, for something present on the host and absent in the cell) or the solid ink ground (`kind="ink"`). The other subject colors (`rose`, `clay`, `sage`, `indigo`) distinguish panels and never redefine access state.

The parts, in `src/components/diagrams/parts/`:

- `Box x y w h label kind size align muted`: a labeled rectangle. The label wraps; allow about 9px per character at the default size, less with `size="small"`. `size="title"` is a panel heading in the display face.
- `Note x y w h label size muted red`: a label with no box.
- `Arrow d kind thin`: a path with an arrowhead. `dashed` is an optional path, `stopped` ends in a red cross, `both` has two heads, `line` has none.
- `Bars x y w h n gap`: the wall of the cell, a frame with thick vertical bars. Draw it first, then what sits inside it. `gap="right"` opens a gate on the right.
- `Chip x y w label`: the agent. Always this shape, always teal.

Rules for a new drawing:

1. `viewBox` between 640 and 800 wide and 300 to 420 tall. The figure scrolls sideways below 34rem instead of shrinking the words to nothing.
2. Use only the labels in `images.json` for that name: `L['Your home']`. A product name or a hostname (`ai-jail`, `api.anthropic.com`) can be typed, since it is the same in every language. Add no other words.
3. Say nothing untrue about the product. The drawing is checked like a sentence.
4. Leave room: labels are up to twice as long in Portuguese and Spanish as in English.
5. Look at it in the browser in English, Portuguese and Japanese, light and dark, at desktop and 360px, before committing.

Adding a label means adding the key to `images.json` in all six languages in the same change, like any other text.
