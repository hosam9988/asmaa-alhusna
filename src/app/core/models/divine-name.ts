export type Lang = 'ar' | 'en';

export type Localized = Record<Lang, string>;

export interface Evidence {
  type: 'quran' | 'hadith';
  text: string;
  ref: Localized;
}

/** One entry of `public/data/names.json`, in the order of the book. */
export interface DivineName {
  /** Position in the book's (alphabetical) order, starting at 1. */
  id: number;
  slug: string;
  name: string;
  transliteration: string;
  meaning: string;
  /** Printed page in «تفسير أسماء الله الحسنى» (ed. al-‘Ubayd, 1421 AH) where the name's heading is. */
  bookPage: number;
  summary: Localized;
  lesson: Localized;
  /** Null when the book gives no evidence for the name. */
  evidence: Evidence | null;
  /** Editor's remark, or where the name is explained together with another one. */
  note: Localized | null;
}
