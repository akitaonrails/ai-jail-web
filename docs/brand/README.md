# Logo files

The logo is a woodcut: a padlock cut in black ink, circuit traces in its body, and in its window, behind bars, a chip. The padlock is the jail, the chip is the agent. It prints on the unbleached paper of the site and inverts to paper-on-ink at night (`.logo-ink` in `Nav.astro`).

| File | What it is |
|---|---|
| `woodcut-2048.jpg` | The cut as generated: black ink on cream paper, 2048x2048. The master for any new export. |
| `../../src/assets/img/logo.png` | What the site uses: the ink alone on a transparent ground, 1024px, made from the master with ImageMagick (see below). Astro generates the sizes each screen needs. |
| `../../public/favicon.png` | The same at 128px. |
| `../../src/assets/img/og.png` | The share card, 1200x630: the title in Alfa Slab One, the padlock on two misregistered color plates, the "NOT A VM" stamp. Rendered from a small HTML file with headless Chromium. |

The woodcut was generated with Gemini (`gemini-3-pro-image`) as a style transfer from the previous, neon logo during the 2026-10-15 redesign (`../research/design-study.md`), as a stand-in for a commissioned cut. A hand-finished xilogravura can replace the master without touching anything else: export the ink with the command below and the site follows.

```bash
magick woodcut-2048.jpg -colorspace Gray -negate -level 12%,65% -trim +repage -resize 1024x1024 \
  \( +clone -fill black -colorize 100 \) +swap -alpha off -compose CopyOpacity -composite \
  -background none -gravity center -extent 1024x1024 ../../src/assets/img/logo.png
magick ../../src/assets/img/logo.png -resize 128x128 ../../public/favicon.png
```

The ink is pure black with alpha, so the same file prints on paper and, inverted by CSS, on ink.
