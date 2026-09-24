# Design system

How pages on the ai-jail site are put together. Read this before adding or changing a page.

## The idea

The logo is a padlock made of warm circuit traces, gold on the left through orange and red to magenta on the right. In its window, behind bars, sits a cyan chip: the agent. The site takes three things from it:

1. The warm spectrum is the jail. Walls, layers, rules and limits use it.
2. Cyan is the agent and what it is allowed to do. It is also the one action color: the primary button is cyan and nothing else is.
3. Vertical bars are the only ornament (`.bars`, the blocked state in `.reach`, the scene tiles).

ai-memory, the sister project, is the inverse: a cool spectrum with a warm chip. The two sites are meant to look like a pair, never like copies. See [color-study.md](color-study.md).

## Subject hues

| Subject | Hue | `data-hue` |
|---|---|---|
| Do I need it? (risk, the reader's situation) | magenta | `magenta` |
| How it works (layers, kernel features) | orange | `orange` |
| The agents, comparisons, install, anything the agent may do | cyan | `cyan` |
| What you turn on (configuration, opt-ins) | gold | `gold` |
| Security, limits, anything blocked | red | `red` |

Put `data-hue="gold"` on an element and its children can use `var(--hue)` (text-safe), `var(--hue-soft)` (fill) and `var(--hue-vivid)` (bars, dots, glows; never text). Never write a color value in a page or component: only tokens from `src/styles/global.css`.

Three states recur across the site and always look the same (`Reach` component): inside the jail (cyan ring), out of reach (red bars), off until you ask (gold ring).

## Type

Red Hat Display for headings (weight 750), Red Hat Text for body, Red Hat Mono for code only. Sizes are Tailwind utilities backed by tokens: `text-4xl` (page h1), `text-3xl` (section h2), `text-2xl`, `text-xl` (h3), `text-lg` (lede), `text-base`, `text-sm`.

- Sentence case everywhere. No all-caps labels.
- A headline is one color. Do not color or italicize one word of it.
- Body lines stay under about 70 characters (`.lede`, `.prose-site`, or `max-w-[40em]`).

## Layout

- `.wrap` is the 76rem column, `.wrap-narrow` is 52rem for reading. `.band` is the vertical rhythm.
- Left aligned. Nothing is centered except the CTA band.
- Prefer open layouts (bars on top, whitespace) over boxes. `.cell` is for things you click.
- Mobile first. Every grid collapses to one column. Tables scroll sideways inside `.table-wrap`. The page must never scroll sideways at 360px.
- CSS uses logical properties (`margin-inline-start`, `ms-4`, `text-start`) so Hebrew mirrors. Terminals, diagrams and file paths get `dir="ltr"`.

## Components (`src/components`)

| Component | Use |
|---|---|
| `Base` (layout) | Every page. Props: `title`, `description` (140 to 160 characters), `schema`. |
| `PageHero` | Top of every detail page. Props: `hue`, `kicker` (`t('kicker.<page>')`), `title`, `lede`. Slot: one or two buttons. |
| `Section` | A band with an h2. Props: `title`, `lede`, `hue`, `id`, `tint`, `narrow`, `fill` (scroll-lit lede, one per page), `ink` (always-dark band). |
| `Figure` | A generated diagram. Props: `name` (file in `src/assets/img/gen/`), `alt` (say what the diagram says), `caption`. |
| `FeatureGrid` | Two to six short points. Props: `items[{title,text,hue,href,link}]`, `cols`. |
| `Reach` | What the agent can touch. Props: `items[{text,state}]`, `state` (`inside`, `blocked`, `optin`), `title`. |
| `Steps` | A numbered procedure with terminals. Props: `steps[{title,text,code,codeTitle}]`. |
| `CodeBlock` | A terminal with a copy button. Props: `code`, `title`. Lines starting with `#` dim. |
| `Tabs` | Props: `id`, `labels[]`. Panels are slots named `"0"`, `"1"`... |
| `Facts` | A strip of verified numbers that count up. Props: `items[{n,label,count}]`. Numbers come from `src/data/facts.json`. |
| `Callout` | Limits and caveats. Props: `title`, `hue`. |
| `Faq` | Accordion fed by the same list as `faqPage()`. Props: `items`, `title`, `hue`. |
| `NextPages` | Two or three onward links. Props: `title` (`t('next.title')`), `items[{title,text,hue,href}]`. |
| `CtaBand` | The closing call to action. |
| `Lockdown` | The homepage scroll scene. Do not reuse. |

Classes in `global.css`: `btn btn-primary`, `btn btn-ghost`, `cell`, `lede`, `kicker`, `badge`, `bars`, `reach`, `ticks`, `table-wrap` + `table-site`, `prose-site`, `spectrum-rule`, `link`, `on-ink`. A page's own `<style>` is for what only that page has.

A detail page is: `PageHero`, three to six `Section`s with at least two `Figure`s, an optional `Faq`, `NextPages`, `CtaBand`.

## Motion

Declared in markup, run by `src/scripts/motion.ts`, scrubbed to the scroll position so the page responds to the reader.

| Attribute | Effect |
|---|---|
| `data-exit` | The section recedes as the next one scrolls over it. Hero sections. |
| `data-scene="5"` | A tall section with a sticky stage that gets `data-step`. One per page at most. |
| `data-fill` | Words light up as the paragraph crosses the viewport. One per page (`Section fill`). |
| `data-zoom` | Media grows into place. `Figure` does this by default. |
| `data-parallax="0.1"` | The element drifts against the scroll. |
| `data-reveal` / `data-reveal="children"` | Settles in once. Grids and h1. |
| `data-focus-list` | Children get `data-state="ahead|active|past"` as they cross the reading line. One per page, for a real sequence. |
| `data-count="343"` | Counts up once. |

Everything is off under `prefers-reduced-motion`, and the content is complete without JavaScript.

## Writing

The reader has never heard of ai-jail and may not know what a sandbox is. Tell them what it does for them, then how.

- Short. A section is a heading, one or two sentences, and something to look at. If a paragraph passes three sentences, it wants to be a list, a table or a diagram. Prefer a `Figure` to a paragraph.
- Plain verbs, second person, active voice. Explain a term the first time it appears ("Landlock, a Linux kernel feature that...").
- Facts come from the ai-jail repository (README, `docs/SECURITY.md`). Facts about other products come from `docs/research/builtin-sandboxes.md`, `docs/research/codex-antigravity.md` and `docs/research/nono-zerobox.md`, which has sources. Do not invent numbers, features or quotes. Link to the vendor's documentation when describing their product and say "at the time of writing".
- Be fair to other tools and honest about limits. The README's own line sets the tone: a useful layer, not a replacement for a disposable VM.
- No em dashes or en dashes. No "not X, but Y". No three-item lists for rhythm. No closing one-liners that restate the section. No "seamless", "robust", "powerful", "unlock", "effortless", "key", "crucial", "landscape", "peace of mind". No arrows or emoji in text.
- Say a thing fully in one place and link to it from the others. Canonical homes: risk scenarios on Do I need it; binaries, checksums and release notes on Download; the layers and macOS differences on How it works; other tools on Compare; commands to install and the first run on Install; every flag, config key, masking and lockdown on Configure; threat model, weakening opt-ins, audits, release signing and reporting on Security. A short limit the reader must see before acting may repeat.
- Do not claim: protection from kernel exploits, that it replaces a VM, third-party audits (the published audits are the project's own), that the host allowlist inspects content or blocks UDP and DNS on macOS (it is TCP and CONNECT only; see the Security page), Windows support.

## Languages

Every visible string lives in `src/i18n/locales/`, never in an `.astro` file. Structure (hues, hrefs, ids, commands, flags) stays in code; words go in the catalog; `withText()` joins them. See [i18n.md](i18n.md).

## Images

Diagrams are generated, then checked by a person. See [images.md](images.md).
