export type Lang = 'ar' | 'en';

export type Localized = Record<Lang, string>;

/**
 * One name of Allah explained in «فقه الأسماء الحسنى». Several names often share a chapter
 * (e.g. «الخالق، الخلّاق»); `chapter` is that chapter's slug.
 */
export interface DivineName {
  /** Position in the book's order, starting at 1. */
  id: number;
  slug: string;
  /** Vowelled, for display in Amiri Quran. */
  name: string;
  transliteration: string;
  meaning: string;
  chapter: string;
}

/** The book's parts, in order. */
export type BookPart = 'front' | 'foundations' | 'names';

/**
 * A block of a chapter: a paragraph, a sub-heading or a line of poetry. Footnote markers are
 * written `[n]` (n = `Footnote.n`); Qur'an verses are in ﴿…﴾ followed by their reference in […].
 */
export interface Block {
  type: 'p' | 'h' | 'poem';
  text: Localized;
}

export interface Footnote {
  n: number;
  text: Localized;
}

/** One chapter of the book. */
export interface Chapter {
  slug: string;
  part: BookPart;
  /** The chapter's number as printed above its title, «(٣)»; absent before the first one. */
  number?: number;
  title: Localized;
  /** Slugs of the names this chapter explains (empty for the chapters on the names in general). */
  names: string[];
  /** Printed pages. */
  pageFrom: number;
  pageTo: number;
  blocks: Block[];
  footnotes: Footnote[];
}
