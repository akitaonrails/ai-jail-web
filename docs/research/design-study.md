# Design study: leaving the "AI slop" look

Written 2026-10-15 after the owner reported that readers call the site's design "AI slop". Prototypes live in `docs/research/prototypes/` (`a.html`, `b.html`, `c.html`, open them in a browser; `desktop.jpg` and `phone.jpg` are the review sheets).

## What people are recognizing

Looking at the live site with a stranger's eye, the tells are not the layout or the copy. They are the rendering language:

1. **The logo.** A neon padlock with circuit traces and a glowing chip, on a blurred gradient halo. This is the single most recognizable "generated" object on the page, and it sets the tone for everything below it.
2. **The diagrams.** Fifteen isometric neon illustrations on a dark maroon ground, with soft glows and the same cyan chip. Generated illustration has a look of its own, and readers have learned it.
3. **The chrome around them.** A gradient-blur hero, pill buttons, rounded cards in threes, bars-as-ornament, fade-and-rise reveals, a scroll-pinned scene. Each is a default, and together they read as a template.
4. **Dark-mode-first with a saturated spectrum.** The warm gradient was a deliberate choice (the complement of ai-memory), but a five-hue neon gradient on near-black is also the most common generated palette of 2025 and 2026.

What does not read as generated: the writing (short, concrete, sourced), the real commands, the honest limits. A redesign should keep all of that and change the rendering.

## Why the previous redesign attempt was rejected

On 2026-10-04 another session tried an "evidence-led" redesign: it flattened surfaces, removed motion and replaced raster diagrams with code-built figures, while keeping the palette, the logo and the card structure. The owner reverted it on sight. The attempt removed ornament without replacing the visual language, so the result was the old design minus the fun: same neon padlock, same glow palette, more grey. Removing decoration is not a direction; a direction is a different set of materials.

## Three directions, built as hero prototypes

Each keeps the brand facts (padlock, cell bars, chip as the agent, warm family for the jail, cyan reserved) and changes the material the site is made of.

### A. Terminal-native (`a.html`)

The site looks like the tool's own output. Paper-colored ground, one monospace family (IBM Plex Mono) with a quiet sans for prose, real `ai-jail --dry-run claude` as the hero, a path ledger instead of a feature grid, and diagrams drawn in box-drawing characters. Color appears only where a terminal would use it: comments grey, allowed green, blocked red, opt-in amber.

- For: the most honest match to the product; diagrams become text, so they translate for free and need no image pipeline; zero generated imagery.
- Against: "hacker terminal" is its own cliché, and it is cold. The logo has to go or become an ASCII mark.

### B. Blueprint (`b.html`)

Architectural drafting on blueprint paper: the jail as a plan view, kernel layers as wall sections with hatching, dimension lines that carry real facts, a title block with the version, and a red "NOT A VM" stamp. Barlow Condensed for drafting labels, Source Serif for prose. Diagrams are SVG drawn in code, so labels are text and localize through the catalogs, and nothing glows.

- For: a drawing language nobody else in the category uses; the "wall", "layers", "openings" metaphors the copy already uses become literal; diagrams stay precise and reproducible.
- Against: a full blueprint site needs a lot of hand-drawn SVG; keep it to one accent (the plan) per page and plain paper elsewhere, or it tips into theme-park.

### C. Cordel woodcut (`c.html`)

Brazilian xilogravura: black ink on unbleached paper, a hand-cut padlock with the chip behind bars, chunky wood-type headlines (Alfa Slab One), Courier for commands, Lora for prose, double rules and a three-column "verse" instead of cards. The woodcut padlock in `prototypes/wood.jpg` was generated from the current logo as a style transfer, as a stand-in; a real site should get a commissioned or hand-finished cut.

- For: the most original of the three and the only one tied to the author rather than to a template; it does not look like any developer tool; the printed-page grammar (rules, columns, stamps) replaces cards and glow at no cost; it also makes a good sticker and README header.
- Against: illustrations for every technical diagram would be slow by hand; pair it with code-built line diagrams in the same black-on-paper language, and reserve woodcuts for the logo and one hero per page.

## Recommendation

**C, with B's diagram engine.** The woodcut gives the brand a face that is unmistakably not generated; code-built SVG line diagrams in the same ink-on-paper language give the technical pages precision and free localization. Keep the cyan as the one accent for the agent and the primary button (it survives on cream as a deep teal), and keep the warm family only in the generated-free form of red ink stamps and rules.

Order of work if approved:

1. Redraw the logo as a woodcut (commission, or generate and hand-clean), export the favicon and share card from it.
2. New tokens from the paper and ink colors; run `check:colors`.
3. Replace `Figure` with code-built SVG diagrams (labels from `images.json`, no raster, no localization script).
4. Rebuild the home hero and one section per direction in the real stack, then screenshot in all six languages.
5. Remove the scroll-pinned scene and the fade-and-rise reveals; keep one orchestrated moment on the home page at most.

## Notes on the prototypes

They are static HTML with Google Fonts, no build step, English only. Phone widths were only checked for overflow, not polished. The terminal transcript in A is edited from a real dry run (personal paths replaced by `~/Projects/my-app`).
