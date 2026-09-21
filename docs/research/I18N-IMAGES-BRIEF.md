# Brief: translate the diagrams for one language

After the catalogs for `<locale>` are translated and `node scripts/check-i18n.mjs <locale>` reports no errors:

1. Translate `src/i18n/locales/en/images.json` into `src/i18n/locales/<locale>/images.json`. Keys are image names, inner keys are the English labels exactly as drawn (never change a key), values are the translated labels. Keep each label as short as the English, one to three words, because it has to fit the same spot. Use the same terms as the catalogs and the glossary. A label that is a product name or a technical name that developers in that language keep in English stays identical to its key (it is then skipped).
2. Run `node scripts/localize-image.mjs --all <locale>` (GEMINI_API_KEY is in the environment; about 40 seconds per image; run it in the background or with a long timeout).
3. LOOK at every file in `src/assets/img/gen/<locale>/` with the Read tool, next to the English original. Check: every translated label matches `images.json` character by character, no label is cut off or overlapping, nothing else in the artwork changed, no English label that should have been translated is left, no invented text. For Hebrew, check the letters read right to left correctly; for Japanese and Korean check every character.
4. For an image that fails: run `node scripts/localize-image.mjs <name> <locale>` again, at most two more times. If it still fails, delete that localized file; the site then shows the English original, which is better than a wrong label. 
5. Report which images are localized, which fell back to English, and why.
