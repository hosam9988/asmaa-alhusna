import { Block } from '../models/divine-name';

/**
 * Turns an added tab's text, as the admin typed it, into blocks for the reader: paragraphs are
 * separated by blank lines, and a paragraph starting with # is a heading. A block holds one
 * language's text, so it is the same under both keys.
 */
export function textToBlocks(text: string): Block[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part): Block => {
      const heading = part.startsWith('#');
      const line = (heading ? part.replace(/^#+\s*/, '') : part).replace(/\s*\n\s*/g, ' ');
      return { type: heading ? 'h' : 'p', text: { ar: line, en: line } };
    });
}
