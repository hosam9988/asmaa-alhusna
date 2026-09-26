import { DivineName } from '../models/divine-name';

/** Strips tashkeel and unifies letter variants so "الرحمن" matches "الرَّحْمَٰنُ". */
export function normalizeArabic(text: string): string {
  return text
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي');
}

/** Lowercases and drops apostrophes/hyphens so "ar rahman" matches "Ar-Rahman". */
function normalizeLatin(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function matchesQuery(name: DivineName, query: string): boolean {
  const q = query.trim();
  if (!q) return true;

  const arabicQuery = normalizeArabic(q);
  const arabicName = normalizeArabic(name.name);
  // Allow searching without the definite article: "رحمن" → "الرحمن".
  if (arabicName.includes(arabicQuery) || arabicName.replace(/^ال/, '').startsWith(arabicQuery)) {
    return true;
  }

  const latinQuery = normalizeLatin(q);
  if (!latinQuery) return false;
  return (
    normalizeLatin(name.transliteration).includes(latinQuery) ||
    normalizeLatin(name.meaning).includes(latinQuery) ||
    String(name.id) === latinQuery
  );
}
