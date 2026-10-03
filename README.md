# فقه الأسماء الحسنى · Understanding the Beautiful Names

**Read the Beautiful Names of Allah explained, chapter by chapter, in Arabic and English.**

An app for Muslims and new reverts built on the book *فقه الأسماء الحسنى* by Shaykh ‘Abd ar-Razzaq
ibn ‘Abd al-Muhsin al-Badr (2nd edition, Madinah, 1430 AH). Page numbers in the app are those of
this edition; the 1st edition (Dar al-Tawhid, Riyadh, 1429 AH) is paged differently. It covers the whole book:
- the endorsement and introduction;
- 17 chapters on knowing Allah's names and the principles behind them;
- 65 chapters explaining 107 names, one or a few at a time.

🔗 **Live site:** `https://<your-username>.github.io/asmaa-alhusna/`

## Features

- **A reader made for reading.** Each chapter opens with its number and the names it explains in
  the Mushaf font, and the text is laid out like a well-set book:
  - Qur'an verses in green Uthmani type;
  - quotations from hadith and the scholars set apart;
  - footnotes that open when tapped;
  - adjustable text size, a reading-progress line and an estimated reading time;
  - a card for the next chapter at the end of each one.
- **Picks up where you left off.** The home page offers "Continue reading" at the exact place you
  stopped. Chapters you finish are marked as read, and the table of contents shows your progress.
  All of this is saved in your browser.
- **The book's own table of contents.** It is split into its three parts. Every name chapter is a
  card, and search finds names and chapters in Arabic or English, with or without tashkeel.
- **Arabic ⇄ English:** a complete English translation, with the original Arabic one tap away.
- **Listen:** any chapter can be read aloud with the device's built-in voice. It is free and works
  offline; Qur'an verses are skipped, not recited by a computer voice.
- **Page colours:** paper (the default), black, white, blue, dark blue or pink.
- **Name of the day** on the home page, linking to its chapter.

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

There is no backend. The content is in two files, typed in
[`src/app/core/models/divine-name.ts`](src/app/core/models/divine-name.ts):

```jsonc
// public/data/book.json: the chapters, in the book's order
{
  "slug": "n22-al-khaliq",          // URL: /read/n22-al-khaliq
  "part": "names",                  // front | foundations | names
  "number": 22,                     // the chapter number printed above its title
  "title": { "ar": "الخالق، الخلّاق", "en": "…" },
  "names": ["al-khaliq", "al-khallaq"],
  "pageFrom": 108, "pageTo": 112,   // printed pages
  "blocks": [{ "type": "p", "text": { "ar": "…", "en": "…" } }],   // p | h (sub-heading) | poem
  "footnotes": [{ "n": 1, "text": { "ar": "…", "en": "…" } }]       // markers in the text are [n]
}

// public/data/names.json: every name, linking to the chapter that explains it
{ "id": 9, "slug": "al-khaliq", "name": "الْخَالِقُ", "transliteration": "Al-Khaliq",
  "meaning": "The Creator", "chapter": "n22-al-khaliq" }
```

## Project structure

```
src/app/
  core/
    models/divine-name.ts      data types
    services/book.service.ts   loads the book and the names
    services/reading.service   reading progress, last place and text size (localStorage)
    services/language.service  Arabic ⇄ English, sets <html dir/lang>
    services/speech.service    read-aloud with the browser's speech synthesis
    services/theme.service     page colour, sets <html data-theme> (palettes in styles.scss)
    i18n/ui-text.ts            interface labels in both languages
    utils/search.ts            search that ignores tashkeel and hamza forms
  shared/rich-text.ts          one block of the book: verses, quotations, footnote buttons
  shared/                      star badge, ornament, read-aloud, theme picker
  pages/home                   cover, name of the day, table of contents
  pages/reader                 a chapter (/read/:chapter, or /name/:name to open a name's chapter)
  pages/about                  the book and the categories of Tawheed
```

Built with Angular 22.

## Content note

The text was transcribed page by page from the book's official PDF on the Shaykh's website
([al-badr.net](https://www.al-badr.net/ebook/57)), and every page was cross-checked against a
separate OCR. Every Qur'an verse was taken from the Mushaf text (via al-Maktaba al-Shamela)
instead of being retyped. The book's text is kept as printed, including its own typing errors and
a few verse references that look wrong. The honorific symbols are written out as words, and
footnotes are numbered within each chapter.

The full tashkeel on the Arabic was added for easier reading and correct read-aloud. It is not from
the book, but every paragraph was checked to keep exactly the book's letters and its own vowel
marks, with every verse untouched. The English is a complete translation.

The book is © the author (حقوق الطبع محفوظة). Please make sure you have permission before
publishing it. A qualified student of knowledge should still check the text against the printed
book; the page numbers make this quick.
