# الأسماء الحسنى · The Beautiful Names

**Learn Tawheed through the Beautiful Names of Allah, in Arabic and English.**

An app for Muslims and new reverts built on the book *تفسير أسماء الله الحسنى* by Shaykh
Abdur-Rahman as-Sa‘di, compiled by ‘Ubayd ibn ‘Ali al-‘Ubayd (Islamic University of Madinah,
1421 AH). It covers all 102 names in the book's order.

🔗 **Live site:** `https://<your-username>.github.io/asmaa-alhusna/`

## Features

- **All 102 names** in the book's order, as the editor arranged them
- **For each name:** as-Sa‘di's explanation quoted in full from the book (with a complete
  English translation), a practical lesson on worshipping Allah by that name, the evidence the
  book itself gives from the Qur'an or Sunnah (none where the book or its editor gives none),
  and the printed pages in the book
- **Arabic ⇄ English:** switch languages at any time. The layout flips between right-to-left and
  left-to-right.
- **Listen:** each name page can read the name, explanation and lesson aloud with the device's
  built-in voice (free, works offline; Qur'an verses are skipped, not recited by a computer voice)
- **Colour themes:** black, white, blue, dark blue or pink, all with gold accents (saved in your
  browser)
- **Name of the day:** a different name shown on the home page each day
- **Search:** finds names in Arabic or English, with or without tashkeel or hamza
- **Track your progress:** mark names as studied (saved in your browser)
- **About page:** the book, its author, and the basics of Tawheed

## Running locally

Requires Node 22.22+ or 24.15+.

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build in dist/asmaa-alhusna/browser
```

## Deploying

Every push to `main` builds the app and publishes it to GitHub Pages
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). Before the first deploy, set the
repo's **Settings → Pages → Source** to **GitHub Actions**.

## Editing the content

There is no backend. All the content is in
[`public/data/names.json`](public/data/names.json). To add a name, fix a summary or reorder the
list, edit that file. No code changes are needed.

Each entry follows `DivineName` in
[`src/app/core/models/divine-name.ts`](src/app/core/models/divine-name.ts):

```jsonc
{
  "id": 2,                       // position in the book's order; also the display number
  "slug": "allah",               // URL: /name/allah
  "name": "اللَّهُ",
  "transliteration": "Allah",
  "meaning": "The God, the One truly worshipped",
  "bookPage": 164,               // printed pages holding the explanation…
  "bookPageEnd": 167,            // …from bookPage to bookPageEnd
  "summary":  { "ar": "…", "en": "…" },   // ar: the book's text verbatim ("\n" between paragraphs); en: full translation
  "lesson":   { "ar": "…", "en": "…" },   // how to worship Allah by this name
  "evidence": { "type": "quran", "text": "…", "ref": { "ar": "البقرة: ٢٥٥", "en": "Al-Baqarah 2:255" } },  // or null; as in the book (Shamela),
                                 // with "bookNote" where the book's reference was corrected
  "note": null                   // or { ar, en }: the editor's footnote on the heading, verbatim
}
```

## Project structure

```
src/app/
  core/
    models/divine-name.ts      data types
    services/names.service.ts  loads names.json, name of the day, prev/next
    services/language.service  Arabic ⇄ English, sets <html dir/lang>
    services/studied.service   "studied" progress, kept in localStorage
    services/speech.service    read-aloud with the browser's speech synthesis
    services/theme.service     colour theme, sets <html data-theme> (palettes in styles.scss)
    i18n/ui-text.ts            interface labels in both languages
    utils/search.ts            search that ignores tashkeel and hamza forms
  shared/                      star badge and ornament divider
  pages/home                   hero, name of the day, search and grid
  pages/name-detail            one name: explanation, lesson, evidence
  pages/about                  the book, the author, Tawheed basics
```

Built with Angular 22.

## Content note

Each explanation is the book's text for that name, taken verbatim from the digital edition on
[al-Maktaba al-Shamela](https://shamela.ws/book/10090). Only the editor's footnote numbers are
left out, and Qur'an quotations are shown in ﴿ ﴾. Names that the book explains under another
name show that name's text. Small typing errors in the digital edition were kept as they are. The Arabic explanation and lesson are shown with full tashkeel,
added for easier reading and correct read-aloud; the tashkeel is not from the book (every text
was checked to have exactly the book's letters), and the page says so.
The English is a complete translation. A qualified student of knowledge should still check the
text and every verse and reference against the printed book; the page numbers make this quick.
If you find a mistake, please open an issue.
