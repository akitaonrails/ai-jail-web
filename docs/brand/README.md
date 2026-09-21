# Logo files

| File | What it is |
|---|---|
| `logo-hd-1760.png` | The master: 1760x1760, transparent background. Use this for the GitHub README, slides or print. |
| `logo-original-2048.png` | The generated artwork on its white ground, before the cutout. |
| `../../src/assets/img/logo.png` | What the site uses: the master at 1600px. Astro generates the sizes each screen needs. |
| `candidates/` | The three concepts that were considered (padlock, cell, shield) and the first, cool-colored padlock. |

The logo was generated with Gemini (`gemini-3-pro-image`) using the ai-memory logo as the style reference, then recolored so the two products are complements: ai-memory has a cool body and a warm chip, ai-jail a warm body and a cool chip. See `../color-study.md`. The padlock is the jail, the chip behind the bars is the agent.

The cutout is a flood fill of the white ground from a corner and from inside the shackle, eroded by a pixel and a half to drop the fringe. The favicon (`public/favicon.png`) and the share card (`src/assets/img/og.png`) are made from the master with ImageMagick.

An SVG version is not worth making: the artwork is painterly, with glows and gradients, and a vector trace would be either very large or visibly flattened.
