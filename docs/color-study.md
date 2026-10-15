# Color study

The site is printed: ink on paper, with six flat spot colors. Every token is built in OKLCH, a color space where equal numeric steps look like equal steps, so the six plates sit side by side at the same visual weight and the light and dark themes are mirrors of one decision instead of two designs.

Nothing on the site uses a color that is not a token. The tokens are generated, not typed:

```bash
node scripts/build-palette.mjs --write   # decisions in, tokens out, into src/styles/global.css
npm run check:colors                     # WCAG contrast for every pairing the site uses, and no color values outside the tokens
```

## 1. Paper and ink

| Token | Light (paper) | Dark (night print) |
|---|---|---|
| `--bg`, `--surface` | unbleached paper, `oklch(0.945 0.025 80)` | warm black ink, `oklch(0.17 0.008 60)` |
| `--tint` | the darker paper of a second sheet | a raised ink |
| `--text`, `--line` | the ink | the paper |
| `--muted` | a thinner ink | a greyed paper |

Paper is tinted warm (hue 80) and ink is a warm black (hue 60), the way printed black is never neutral. The paper also carries a faint dot screen (`body` background in `global.css`), the grain of a cheap print. At night the sheet and the ink swap; the plates dim; the terminals and the closing band stay on ink in both themes (`.on-ink`).

## 2. The six plates and the red

| Plate | Hue | Chroma | Subject |
|---|---|---|---|
| rose | 25 | 0.065 | Do I need it? |
| clay | 50 | 0.080 | How it works |
| mustard | 85 | 0.090 | What you turn on (opt-in) |
| sage | 140 | 0.045 | spare |
| teal | 190 | 0.045 | the agent, what it may reach, the one action |
| indigo | 275 | 0.050 | Compare |
| red | 25 | 0.140 | blocked, limits, the stamp |

The plates are pastel: lightness 0.86, low chroma, like inks mixed with a lot of white. Six hues spread around the wheel at 35 to 85 degree steps, so each reads as a different color in a thumbnail, and none is loud. The red is darker (0.56) and more saturated, because it is a stamp and a hatch, not a plate: it has to be read as a warning at a glance and in greyscale, where it is the only dark accent.

**Three tiers per hue.**

| Tier | Token | Light | Dark | Use |
|---|---|---|---|---|
| Ink | `--teal` | the hue darkened until it reads 4.5:1 on its own plate and on paper | the plate lightened until it reads 4.5:1 on ink | text, links, rules, the bars |
| Plate | `--teal-soft` | the pastel plate | the plate dimmed to lightness 0.3 | fills: cells, callouts, nav state |
| Printed | `--v-teal` | the pastel plate, in both themes | | the misregistered plates behind the logo, the diagrams' fills, the shadow under the primary button; never for text |

`build-palette.mjs` finds the ink tier by stepping lightness until the contrast target is met (`fitText`), so a plate can be changed without redoing the text colors by hand.

**One plate per subject.** Risk is rose, the layers are clay, opt-ins are mustard, comparisons are indigo, limits are red, and the agent is teal. The mapping is in `src/data/site.ts` and applied with `data-hue`.

**Three states, three fixed looks.** Inside the jail is the teal plate. Out of reach is red hatching. Off until you ask is the mustard plate. They differ in pattern as well as hue (flat, hatched, flat with a different lightness), so they survive color blindness and greyscale.

**One action.** The primary button is ink on paper with the teal plate as its offset shadow. Nothing else on a page is as dark and as large, so the eye finds it without a color shout.

## 3. Why these and not the logo's colors

The previous palette sampled a neon logo and spread its five hues over a dark ground. Readers recognized the look as generated. The redesign (`docs/research/design-study.md`) kept the subject-per-hue rule and the three states, and changed the material: paper instead of a dark ground, pastel plates instead of vivid neon, no gradient. The woodcut logo is pure ink and takes its color from the plates behind it, so the logo no longer dictates the palette; the palette dresses the logo.

## 4. Measured contrast

WCAG 2.x ratios, computed from the tokens by `scripts/check-contrast.mjs`. Targets: 7:1 for body text (AAA), 4.5:1 for accents and muted text (AA), each ink tier on its own plate included. Regenerate this table with `node scripts/check-contrast.mjs --md`.

### light

| Foreground | Background | Ratio | Target | |
|---|---|---|---|---|
| `text` #120f0c | `bg` #f6ebdb | 16.28 | 7 | pass |
| `text` #120f0c | `surface` #f6ebdb | 16.28 | 7 | pass |
| `text` #120f0c | `tint` #ecdec6 | 14.40 | 7 | pass |
| `muted` #534b45 | `bg` #f6ebdb | 7.22 | 4.5 | pass |
| `muted` #534b45 | `surface` #f6ebdb | 7.22 | 4.5 | pass |
| `muted` #534b45 | `tint` #ecdec6 | 6.39 | 4.5 | pass |
| `rose` #8a423d | `bg` #f6ebdb | 6.11 | 4.5 | pass |
| `rose` #8a423d | `surface` #f6ebdb | 6.11 | 4.5 | pass |
| `rose` #8a423d | `tint` #ecdec6 | 5.40 | 4.5 | pass |
| `rose` #8a423d | `rose-soft` #f9c1bc | 4.58 | 4.5 | pass |
| `clay` #864821 | `bg` #f6ebdb | 6.03 | 4.5 | pass |
| `clay` #864821 | `surface` #f6ebdb | 6.03 | 4.5 | pass |
| `clay` #864821 | `tint` #ecdec6 | 5.33 | 4.5 | pass |
| `clay` #864821 | `clay-soft` #fdc2a2 | 4.54 | 4.5 | pass |
| `mustard` #725401 | `bg` #f6ebdb | 5.98 | 4.5 | pass |
| `mustard` #725401 | `surface` #f6ebdb | 5.98 | 4.5 | pass |
| `mustard` #725401 | `tint` #ecdec6 | 5.29 | 4.5 | pass |
| `mustard` #725401 | `mustard-soft` #eccd8c | 4.58 | 4.5 | pass |
| `sage` #37652d | `bg` #f6ebdb | 5.82 | 4.5 | pass |
| `sage` #37652d | `surface` #f6ebdb | 5.82 | 4.5 | pass |
| `sage` #37652d | `tint` #ecdec6 | 5.15 | 4.5 | pass |
| `sage` #37652d | `sage-soft` #c2d9bd | 4.54 | 4.5 | pass |
| `teal` #026662 | `bg` #f6ebdb | 5.82 | 4.5 | pass |
| `teal` #026662 | `surface` #f6ebdb | 5.82 | 4.5 | pass |
| `teal` #026662 | `tint` #ecdec6 | 5.15 | 4.5 | pass |
| `teal` #026662 | `teal-soft` #b0dbd7 | 4.55 | 4.5 | pass |
| `indigo` #4b5592 | `bg` #f6ebdb | 5.94 | 4.5 | pass |
| `indigo` #4b5592 | `surface` #f6ebdb | 5.94 | 4.5 | pass |
| `indigo` #4b5592 | `tint` #ecdec6 | 5.25 | 4.5 | pass |
| `indigo` #4b5592 | `indigo-soft` #c7cff3 | 4.54 | 4.5 | pass |
| `red` #a43b38 | `bg` #f6ebdb | 5.48 | 4.5 | pass |
| `red` #a43b38 | `surface` #f6ebdb | 5.48 | 4.5 | pass |
| `red` #a43b38 | `tint` #ecdec6 | 4.85 | 4.5 | pass |
| `red` #a43b38 | `red-soft` #f8d4d1 | 4.72 | 4.5 | pass |
| `on-action` #f6ebdb | `action` #120f0c | 16.28 | 7 | pass |
| `on-action` #f6ebdb | `action-hi` #28231f | 13.24 | 7 | pass |
| `on-ink` #f6ebdb | `ink` #120f0c | 16.28 | 7 | pass |
| `on-ink` #f6ebdb | `ink-raised` #1f1b17 | 14.57 | 7 | pass |
| `on-ink-muted` #b5ada0 | `ink-raised` #1f1b17 | 7.69 | 4.5 | pass |
| `line` #120f0c | `bg` #f6ebdb | 16.28 | 1.2 | pass |

### dark

| Foreground | Background | Ratio | Target | |
|---|---|---|---|---|
| `text` #f6ebdb | `bg` #120f0c | 16.28 | 7 | pass |
| `text` #f6ebdb | `surface` #120f0c | 16.28 | 7 | pass |
| `text` #f6ebdb | `tint` #1f1b17 | 14.57 | 7 | pass |
| `muted` #b5ada0 | `bg` #120f0c | 8.59 | 4.5 | pass |
| `muted` #b5ada0 | `surface` #120f0c | 8.59 | 4.5 | pass |
| `muted` #b5ada0 | `tint` #1f1b17 | 7.69 | 4.5 | pass |
| `rose` #eca19a | `bg` #120f0c | 9.22 | 4.5 | pass |
| `rose` #eca19a | `surface` #120f0c | 9.22 | 4.5 | pass |
| `rose` #eca19a | `tint` #1f1b17 | 8.26 | 4.5 | pass |
| `rose` #eca19a | `rose-soft` #47211e | 6.73 | 4.5 | pass |
| `clay` #e7a783 | `bg` #120f0c | 9.32 | 4.5 | pass |
| `clay` #e7a783 | `surface` #120f0c | 9.32 | 4.5 | pass |
| `clay` #e7a783 | `tint` #1f1b17 | 8.34 | 4.5 | pass |
| `clay` #e7a783 | `clay-soft` #45240f | 6.76 | 4.5 | pass |
| `mustard` #d2b373 | `bg` #120f0c | 9.53 | 4.5 | pass |
| `mustard` #d2b373 | `surface` #120f0c | 9.53 | 4.5 | pass |
| `mustard` #d2b373 | `tint` #1f1b17 | 8.53 | 4.5 | pass |
| `mustard` #d2b373 | `mustard-soft` #3c2b02 | 6.82 | 4.5 | pass |
| `sage` #99c68f | `bg` #120f0c | 9.86 | 4.5 | pass |
| `sage` #99c68f | `surface` #120f0c | 9.86 | 4.5 | pass |
| `sage` #99c68f | `tint` #1f1b17 | 8.83 | 4.5 | pass |
| `sage` #99c68f | `sage-soft` #21331d | 6.92 | 4.5 | pass |
| `teal` #6ccac4 | `bg` #120f0c | 9.93 | 4.5 | pass |
| `teal` #6ccac4 | `surface` #120f0c | 9.93 | 4.5 | pass |
| `teal` #6ccac4 | `tint` #1f1b17 | 8.89 | 4.5 | pass |
| `teal` #6ccac4 | `teal-soft` #0b3533 | 6.94 | 4.5 | pass |
| `indigo` #a6b3f1 | `bg` #120f0c | 9.45 | 4.5 | pass |
| `indigo` #a6b3f1 | `surface` #120f0c | 9.45 | 4.5 | pass |
| `indigo` #a6b3f1 | `tint` #1f1b17 | 8.46 | 4.5 | pass |
| `indigo` #a6b3f1 | `indigo-soft` #262c47 | 6.78 | 4.5 | pass |
| `red` #ff958e | `bg` #120f0c | 9.08 | 4.5 | pass |
| `red` #ff958e | `surface` #120f0c | 9.08 | 4.5 | pass |
| `red` #ff958e | `tint` #1f1b17 | 8.13 | 4.5 | pass |
| `red` #ff958e | `red-soft` #47211e | 6.63 | 4.5 | pass |
| `on-action` #f6ebdb | `action` #120f0c | 16.28 | 7 | pass |
| `on-action` #f6ebdb | `action-hi` #28231f | 13.24 | 7 | pass |
| `on-ink` #f6ebdb | `ink` #120f0c | 16.28 | 7 | pass |
| `on-ink` #f6ebdb | `ink-raised` #1f1b17 | 14.57 | 7 | pass |
| `on-ink-muted` #b5ada0 | `ink-raised` #1f1b17 | 7.69 | 4.5 | pass |
| `line` #f6ebdb | `bg` #120f0c | 16.28 | 1.2 | pass |
