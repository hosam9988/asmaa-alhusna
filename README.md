# الأسماء الحسنى · The Beautiful Names

**Learn Tawheed through the Beautiful Names of Allah, in Arabic and English.**

An app for Muslims and new reverts built on the book *تفسير أسماء الله الحسنى* by Shaykh
Abdur-Rahman as-Sa‘di, compiled by ‘Ubayd ibn ‘Ali al-‘Ubayd (Islamic University of Madinah,
1421 AH). It covers all 102 names in the book's order.

🔗 **Live site:** `https://<your-username>.github.io/asmaa-alhusna/`

## Features

- **All 102 names** in the book's order, as the editor arranged them
- **For each name:** a summary of as-Sa‘di's explanation, a practical lesson on worshipping Allah
  by that name, the evidence from the Qur'an or Sunnah, and the printed page number in the book
- **Arabic ⇄ English:** switch languages at any time. The layout flips between right-to-left and
  left-to-right.
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
  "bookPage": 164,               // printed page of the name's heading in the book
  "summary":  { "ar": "…", "en": "…" },   // as-Sa'di's explanation, condensed
  "lesson":   { "ar": "…", "en": "…" },   // how to worship Allah by this name
  "evidence": { "type": "quran", "text": "…", "ref": { "ar": "البقرة: ٢٥٥", "en": "Al-Baqarah 2:255" } },  // or null
  "note": null                   // or { ar, en }: editor's remark / "explained with another name"
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
    i18n/ui-text.ts            interface labels in both languages
    utils/search.ts            search that ignores tashkeel and hamza forms
  shared/                      star badge and ornament divider
  pages/home                   hero, name of the day, search and grid
  pages/name-detail            one name: explanation, lesson, evidence
  pages/about                  the book, the author, Tawheed basics
```

Built with Angular 22.

## Content note

The summaries condense as-Sa‘di's own words from the book. They are not word-for-word
quotations. A qualified student of knowledge should check them, along with every verse and
reference, against the printed book. The page numbers make this quick. If you find a mistake,
please open an issue.
