export type Lang = 'ar' | 'en';

export type Localized = Record<Lang, string>;

/**
 * One name of Allah. Several names often share a chapter (e.g. «الخالق، الخلّاق»); `chapter` is
 * that chapter's slug.
 */
export interface DivineName {
  /** Position in the list of names, starting at 1. */
  id: number;
  slug: string;
  /** Vowelled, for display in Amiri Quran. */
  name: string;
  transliteration: string;
  meaning: string;
  chapter: string;
}

/** The book's parts, in order. */
export type BookPart = 'foundations' | 'names';

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

/**
 * The tabs of a name's page, in order. «معنى الاسم» holds the chapter's own explanation; the
 * others are written by the site's admins (see SectionsService).
 */
export const NAME_SECTIONS = ['meaning', 'uses', 'duas', 'story', 'life', 'faith'] as const;
export type NameSection = (typeof NAME_SECTIONS)[number];

/** The tabs the admins write: all but «معنى الاسم». */
export type AddedSection = Exclude<NameSection, 'meaning'>;
export const ADDED_SECTIONS: readonly AddedSection[] = ['uses', 'duas', 'story', 'life', 'faith'];

/**
 * An added tab's text as the admin typed it: paragraphs separated by blank lines, a heading on a
 * line starting with ##. English is optional (empty when there is none).
 */
export interface SectionText {
  ar: string;
  en: string;
}

/** The text of one section: blocks, with their footnotes. */
export interface SectionContent {
  blocks: Block[];
  footnotes: Footnote[];
}

/** One chapter of the book. */
export interface Chapter {
  slug: string;
  part: BookPart;
  /** The chapter's number in its source (not shown). */
  number?: number;
  title: Localized;
  /** Slugs of the names this chapter explains (empty for the chapters on the names in general). */
  names: string[];
  /** Printed pages. */
  pageFrom: number;
  pageTo: number;
  /** The chapter's own text: on a name's page, the «معنى الاسم» tab. */
  blocks: Block[];
  footnotes: Footnote[];
}
