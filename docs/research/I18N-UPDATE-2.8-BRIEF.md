# Brief: update one language for ai-jail 2.8.0

English changed for ai-jail 2.8 (a bare `ai-jail claude` reaches the agent's own API host by default through the filtered proxy, on Linux and macOS; an explicit `--allow-host` list replaces that default; `--github` forwards the active github.com token as `GH_TOKEN`, keyring included; Kiro CLI and Prime agent recognized; env values off the launcher's argv). Bring `src/i18n/locales/<locale>/` back to 100% with no STALE entries, in the voice of the existing translation.

1. Read `docs/research/I18N-TRANSLATE-BRIEF.md`, `docs/i18n/glossary-<locale>.md` and `docs/research/UPDATE-2.8-BRIEF.md`.
2. Run `node scripts/check-i18n.mjs <locale>`. It lists every STALE and missing key. Arrays changed: `install.first.comments` (3), `install.agents.notes` gained `kiro` and `prime`, `configure.recipes.comments` (keys `once`/`then` removed, `nothing`/`more` added), `configure.turnDown.items` reordered, `security.checked.fixes.items` (two new at the start), `home.defaults.inside` (one more item). Rebuild arrays item for item from English.
3. Translate only what the check lists. Terms: keep "API host" as in the glossary (he: Latin "host"); `GH_TOKEN`, `gh`, keyring = (pt-br) keyring do sistema, (es) llavero del sistema, (he) keyring של המערכת, (ja) システムのキーリング, (ko) 시스템 키링.
4. No images changed.
5. Re-read your new strings once as a reader (no dashes as connectors, no "not X but Y", short headlines).
6. `node scripts/check-i18n.mjs --stamp <locale>` then `node scripts/check-i18n.mjs <locale>`: no errors, nothing falling back.
Touch only `src/i18n/locales/<locale>/` and `docs/i18n/glossary-<locale>.md`. Do not run `astro build`. Report under 80 words.
