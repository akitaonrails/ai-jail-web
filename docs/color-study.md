# Color study

The palette is a restrained prison atmosphere: soot and wet stone around bone-colored text, with cold teal for admitted access, rust red for withheld access and muted mustard for explicit opt-ins.

Every token is derived in OKLCH by `scripts/build-palette.mjs` and written into the generated block in `src/styles/global.css`:

```bash
node scripts/build-palette.mjs --write
npm run check:colors
```

No page or component introduces its own color value.

## Ground

Dark mode is the primary visual reference: a blue-black ground, slightly raised slate surfaces, bone text and fog-muted copy. Light mode keeps the same hierarchy on a cold parchment ground so system preferences remain supported.

The `--ink` family is theme-independent and powers cinematic heroes, terminals and the closing call to action. Overlays use `color-mix()` with these tokens so text contrast remains predictable over photography.

## Signals

| Signal | Meaning |
|---|---|
| Teal | The agent, admitted project access and the primary action |
| Rust red | Withheld resources, danger and hard limits |
| Mustard | Off by default; available only after an explicit operator action |
| Rose | Risk and the reader's situation |
| Clay | Operating-system layers and mechanics |
| Indigo | Comparison material |
| Sage | Spare distinction when another panel needs separation |

Each subject has an ink tier for readable text, a soft tier for restrained surfaces and a stable vivid tier for diagram state. The three access states also differ by pattern or shape, so they do not rely on hue alone.

## Contrast

`npm run check:colors` evaluates every supported text/background pairing in both themes. Body text targets WCAG AAA. Accent text and controls target WCAG AA. The generated values are the source of truth; do not copy a rendered hex value back into a component.
