export type Lang = 'ar' | 'en';

export type Localized = Record<Lang, string>;

/**
 * The evidence the book gives for a name — the editor's footnote or a quotation in the Shaykh's
 * text — as in Shamela's edition (shamela.ws/book/10090).
 */
export interface Evidence {
  type: 'quran' | 'hadith';
  text: string;
  ref: Localized;
  /** Where the book's reference is wrong: what the book has. `ref` holds the correct one. */
  bookNote?: Localized;
}

/** One entry of `public/data/names.json`, in the order of the book. */
export interface DivineName {
  /** Position in the book's (alphabetical) order, starting at 1. */
  id: number;
  slug: string;
  name: string;
  transliteration: string;
  meaning: string;
  /** Printed pages in «تفسير أسماء الله الحسنى» (ed. al-‘Ubayd, 1421 AH) holding `summary.ar`. */
  bookPage: number;
  bookPageEnd: number;
  /**
   * `ar`: the book's text for this name, verbatim (footnote numbers omitted), paragraphs separated
   * by "\n". `en`: its full English translation, paragraph for paragraph.
   */
  summary: Localized;
  lesson: Localized;
  /** Null when the book gives no evidence for the name, or the editor says it has none. */
  evidence: Evidence | null;
  /**
   * The editor's footnote(s) on the name's heading, verbatim ("\n" between footnotes), with an
   * English translation. Footnotes that only cite the evidence or a source are left out.
   */
  note: Localized | null;
}
