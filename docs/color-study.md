# Color study

Every color on the site comes from the logo, and every token is built in OKLCH, a color space where equal numeric steps look like equal steps. That lets five hues sit side by side at the same visual weight, and makes the light and dark themes mirrors of each other instead of two designs.

Nothing on the site uses a color that is not a token. The tokens are generated, not typed:

```bash
npm run colors:sample              # where the logo's colors sit in OKLCH
node scripts/build-palette.mjs --write   # decisions in, tokens out, into src/styles/global.css
npm run check:colors               # WCAG contrast for every pairing the site uses
```

## 1. The pair

ai-jail and ai-memory are meant to be used together, so their palettes are built as complements.

| | ai-memory | ai-jail |
|---|---|---|
| Body of the logo | cool arc, hue 155 to 355 (green, teal, azure, violet, rose) | warm arc, hue 352 to 88 (magenta, red, orange, gold) |
| The chip | warm amber, hue 75 | cool cyan, hue 215 |
| Action color | amber | cyan |
| Neutrals tinted with | indigo, hue 282 | maroon, hue 355 |

Each product carries the other's color at its center. Together the two spectra cover the whole wheel and never overlap, so a screenshot of either site is identifiable at a glance, and the two logos side by side read as one family.

## 2. What the logo contains

`npm run colors:sample` measures the artwork. Share is weighted by chroma, so it says how much of the color the eye sees comes from each hue.

| Where in the logo | Sampled | OKLCH hue | Share |
|---|---|---|---|
| Shackle and left edge | `#f9df7d`, `#f2c769`, `#d09b4e` | 70 to 99 (gold) | 13% |
| Left half of the body | `#b57b3f`, `#b36e3c`, `#cc7750` | 40 to 69 (orange) | 25% |
| Right half of the body | `#c0553b`, `#9e3a37` | 20 to 39 (red) | 29% |
| Lower right corner | `#972f3f`, `#98294e`, `#98295f` | 350 to 19 (crimson, magenta) | 26% |
| The chip | `#87e4e4`, `#63bfd4`, `#4989bd` | 190 to 259 (cyan to blue) | 7% |
| Outline and window | `#321523` | 351, chroma 0.05 | |

Measured left to right, the mean body hue falls steadily: 54, 57, 46, 33, 23, 10. The gradient runs gold to magenta in hue order across about 100 degrees. The chip sits 160 to 190 degrees away from the body, which is as close to complementary as a color can be. It covers 7% of the artwork and is the first thing the eye finds. The site keeps that ratio.

## 3. Decisions

**Four warm hues and one cool one: 88, 55, 27, 352, 215.** Warm hues are harder to tell apart than cool ones at the same spacing, so the steps are about 30 degrees and there are four of them, where ai-memory has five at 50. At text lightness the four read as olive gold, brown orange, brick red and wine, distinct enough to mark five subjects in a nav.

**One lightness per role.** In a given theme all text-safe hues share a lightness: 0.47 on light, 0.83 on dark. No subject looks heavier than its neighbours, which hex picking cannot guarantee: a pure yellow and a pure red at the same HSL lightness differ enormously in perceived brightness. `build-palette.mjs` finds, for every hue, the highest chroma that still fits sRGB at that lightness and caps it, so gold is not dull and magenta is not loud.

**Three tiers per hue.**

| Tier | Token | Use | Text-safe |
|---|---|---|---|
| Ink | `--red` | text, links, icons | yes, 4.5:1 or better on every ground |
| Soft | `--red-soft` | fills behind that hue's content | ground only |
| Vivid | `--v-red` | bars, dots, glows, the gradient | never for text |

Vivid is the same in both themes because it is the logo's own color. Ink and soft flip with the theme.

**Cyan means the agent, and action.** In the logo cyan is the thing inside the jail. On the site it marks what the agent may reach (the "inside" state), the pages about agents, and the one primary button: `--action` `oklch(0.84 0.12 215)` with `--on-action` text, identical in both themes. Because it is the complement of everything around it, a single cyan button is the loudest thing on a page without being large. Nothing decorative is cyan.

**Three states, three fixed colors.** Inside the jail is a cyan ring. Out of reach is red bars. Off until you ask is a gold ring. The states also differ in shape (ring, bars, ring), so they survive color blindness and greyscale. Red and cyan are the most separable pair in the palette for every common form of color vision deficiency; gold and cyan differ strongly in both hue and lightness.

**Tinted neutrals.** Every neutral carries the outline's maroon (hue 355) at low chroma: dark ground `oklch(0.145 0.022 355)`, light ground `oklch(0.985 0.005 355)`. Pure grey next to a saturated warm spectrum looks dead and slightly green. A cool neutral would belong to ai-memory.

**One hue per subject.** Risk is magenta, the layers are orange, agents are cyan, what you turn on is gold, limits are red. The mapping is in `src/data/site.ts` and applied with `data-hue`.

**The gradient is interpolated in OKLCH.** `linear-gradient(90deg in oklch, ...)` keeps the orange midpoint saturated. The same stops in sRGB go brown between gold and red.

## 4. Light and dark

The themes are mirrors: text lightness 0.2 on ground 0.985 in light, 0.955 on 0.145 in dark. Accent ink flips from 0.47 to 0.83. Terminals, generated diagrams, the scroll scene and the CTA band stay on the dark ink ground in both themes (`.on-ink`), the way a terminal does on a real desktop. That also means every diagram is generated once.

The theme follows the operating system until the visitor picks one. The footer has a "System" option that clears the choice. An inline script sets the theme before first paint, so there is no flash.

## 5. Measured contrast

WCAG 2.x ratios, computed from the tokens by `scripts/check-contrast.mjs`. Targets: 7:1 for body text (AAA), 4.5:1 for accents and muted text (AA). Regenerate this table with `node scripts/check-contrast.mjs --md`.

### light

| Foreground | Background | Ratio | Target | |
|---|---|---|---|---|
| `text` #211017 | `bg` #fdf9fa | 17.44 | 7 | pass |
| `text` #211017 | `surface` #ffffff | 18.25 | 7 | pass |
| `text` #211017 | `tint` #f8eff2 | 16.18 | 7 | pass |
| `muted` #615056 | `bg` #fdf9fa | 7.21 | 4.5 | pass |
| `muted` #615056 | `surface` #ffffff | 7.54 | 4.5 | pass |
| `muted` #615056 | `tint` #f8eff2 | 6.69 | 4.5 | pass |
| `gold` #715700 | `bg` #fdf9fa | 6.56 | 4.5 | pass |
| `gold` #715700 | `surface` #ffffff | 6.86 | 4.5 | pass |
| `gold` #715700 | `tint` #f8eff2 | 6.09 | 4.5 | pass |
| `gold` #715700 | `gold-soft` #faefd6 | 6.02 | 4.5 | pass |
| `orange` #8b4501 | `bg` #fdf9fa | 6.80 | 4.5 | pass |
| `orange` #8b4501 | `surface` #ffffff | 7.11 | 4.5 | pass |
| `orange` #8b4501 | `tint` #f8eff2 | 6.31 | 4.5 | pass |
| `orange` #8b4501 | `orange-soft` #ffece0 | 6.21 | 4.5 | pass |
| `red` #a12623 | `bg` #fdf9fa | 7.09 | 4.5 | pass |
| `red` #a12623 | `surface` #ffffff | 7.41 | 4.5 | pass |
| `red` #a12623 | `tint` #f8eff2 | 6.57 | 4.5 | pass |
| `red` #a12623 | `red-soft` #ffebe8 | 6.46 | 4.5 | pass |
| `magenta` #982664 | `bg` #fdf9fa | 7.15 | 4.5 | pass |
| `magenta` #982664 | `surface` #ffffff | 7.48 | 4.5 | pass |
| `magenta` #982664 | `tint` #f8eff2 | 6.63 | 4.5 | pass |
| `magenta` #982664 | `magenta-soft` #ffe9f2 | 6.49 | 4.5 | pass |
| `cyan` #006678 | `bg` #fdf9fa | 6.32 | 4.5 | pass |
| `cyan` #006678 | `surface` #ffffff | 6.61 | 4.5 | pass |
| `cyan` #006678 | `tint` #f8eff2 | 5.87 | 4.5 | pass |
| `cyan` #006678 | `cyan-soft` #d7f7ff | 5.86 | 4.5 | pass |
| `on-action` #001926 | `action` #5bdefb | 11.44 | 7 | pass |
| `on-action` #001926 | `action-hi` #93efff | 13.76 | 7 | pass |
| `on-ink` #f5eef0 | `ink` #11070b | 17.37 | 7 | pass |
| `on-ink` #f5eef0 | `ink-raised` #1f0f15 | 16.11 | 7 | pass |
| `on-ink-muted` #b9a9ae | `ink-raised` #1f0f15 | 8.20 | 4.5 | pass |
| `line` #e1d5d9 | `bg` #fdf9fa | 1.36 | 1.2 | pass |

### dark

| Foreground | Background | Ratio | Target | |
|---|---|---|---|---|
| `text` #f5eef0 | `bg` #11070b | 17.37 | 7 | pass |
| `text` #f5eef0 | `surface` #1c0e13 | 16.40 | 7 | pass |
| `text` #f5eef0 | `tint` #27161c | 15.10 | 7 | pass |
| `muted` #b9a9ae | `bg` #11070b | 8.84 | 4.5 | pass |
| `muted` #b9a9ae | `surface` #1c0e13 | 8.35 | 4.5 | pass |
| `muted` #b9a9ae | `tint` #27161c | 7.69 | 4.5 | pass |
| `gold` #eac25a | `bg` #11070b | 11.72 | 4.5 | pass |
| `gold` #eac25a | `surface` #1c0e13 | 11.06 | 4.5 | pass |
| `gold` #eac25a | `tint` #27161c | 10.19 | 4.5 | pass |
| `gold` #eac25a | `gold-soft` #322400 | 8.91 | 4.5 | pass |
| `orange` #ffb481 | `bg` #11070b | 11.45 | 4.5 | pass |
| `orange` #ffb481 | `surface` #1c0e13 | 10.81 | 4.5 | pass |
| `orange` #ffb481 | `tint` #27161c | 9.95 | 4.5 | pass |
| `orange` #ffb481 | `orange-soft` #3c1d05 | 8.82 | 4.5 | pass |
| `red` #ffb0a6 | `bg` #11070b | 11.36 | 4.5 | pass |
| `red` #ffb0a6 | `surface` #1c0e13 | 10.72 | 4.5 | pass |
| `red` #ffb0a6 | `tint` #27161c | 9.87 | 4.5 | pass |
| `red` #ffb0a6 | `red-soft` #3f1916 | 8.80 | 4.5 | pass |
| `magenta` #ffa9cf | `bg` #11070b | 11.21 | 4.5 | pass |
| `magenta` #ffa9cf | `surface` #1c0e13 | 10.59 | 4.5 | pass |
| `magenta` #ffa9cf | `tint` #27161c | 9.75 | 4.5 | pass |
| `magenta` #ffa9cf | `magenta-soft` #3c1929 | 8.72 | 4.5 | pass |
| `cyan` #45dcfc | `bg` #11070b | 12.22 | 4.5 | pass |
| `cyan` #45dcfc | `surface` #1c0e13 | 11.54 | 4.5 | pass |
| `cyan` #45dcfc | `tint` #27161c | 10.62 | 4.5 | pass |
| `cyan` #45dcfc | `cyan-soft` #002c35 | 9.15 | 4.5 | pass |
| `on-action` #001926 | `action` #5bdefb | 11.44 | 7 | pass |
| `on-action` #001926 | `action-hi` #93efff | 13.76 | 7 | pass |
| `on-ink` #f5eef0 | `ink` #11070b | 17.37 | 7 | pass |
| `on-ink` #f5eef0 | `ink-raised` #1f0f15 | 16.11 | 7 | pass |
| `on-ink-muted` #b9a9ae | `ink-raised` #1f0f15 | 8.20 | 4.5 | pass |
| `line` #442e36 | `bg` #11070b | 1.60 | 1.2 | pass |

## 6. Generated images

The art direction in `scripts/prompts/_style.txt` names the same hex values and the same rules: the warm spectrum is the jail, cyan is only ever the agent and what it may reach, blocked things are dim and barred. The logo is attached to every request as a style reference. That is why the diagrams look like they belong to the logo.
