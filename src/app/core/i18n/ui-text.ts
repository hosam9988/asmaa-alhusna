import { Lang } from '../models/divine-name';
import { Theme } from '../models/theme';

export interface UiText {
  appTitle: string;
  home: string;
  about: string;
  /** Label used where the header is too narrow for `about`. */
  aboutShort: string;
  switchLang: string;
  themeLabel: string;
  themeNames: Record<Theme, string>;
  bookTitle: string;
  author: string;
  heroIntro: string;
  searchPlaceholder: string;
  noResults: string;
  loading: string;
  loadError: string;
  nameOfTheDay: string;
  readMore: string;
  studiedProgress: (studied: number, total: number) => string;
  orderNote: (total: number) => string;
  bookSource: (page: string) => string;
  meaning: string;
  explanation: string;
  lesson: string;
  evidence: string;
  showArabicOriginal: string;
  editorNote: string;
  markStudied: string;
  studied: string;
  previous: string;
  next: string;
  backToAll: string;
  notFound: string;
  footerNote: string;
}

export const UI_TEXT: Record<Lang, UiText> = {
  ar: {
    appTitle: 'الأسماء الحسنى',
    home: 'الرئيسية',
    about: 'عن الكتاب',
    aboutShort: 'عن الكتاب',
    switchLang: 'English',
    themeLabel: 'لون الموقع',
    themeNames: { black: 'أسود', white: 'أبيض', blue: 'أزرق', navy: 'كحلي', pink: 'وردي' },
    bookTitle: 'تفسير أسماء الله الحسنى',
    author: 'للعلامة عبد الرحمن بن ناصر السعدي رحمه الله',
    heroIntro:
      'شرح أسماء الله الحسنى بنصّ كلام الشيخ السعدي، يُعرّفك بربك، ويغرس في قلبك توحيده ومحبته وتعظيمه.',
    searchPlaceholder: 'ابحث عن اسم أو معنى…',
    noResults: 'لا توجد نتائج مطابقة.',
    loading: 'جارٍ التحميل…',
    loadError: 'تعذّر تحميل البيانات. حاول مرة أخرى.',
    nameOfTheDay: 'اسم اليوم',
    readMore: 'اقرأ الشرح',
    studiedProgress: (s, t) => `درست ${toArabicDigits(s)} من ${toArabicDigits(t)} اسمًا`,
    orderNote: (t) => `${toArabicDigits(t)} اسمًا، مرتبة على حروف الهجاء كما في الكتاب.`,
    bookSource: (page) => `المصدر: تفسير أسماء الله الحسنى للسعدي، ص ${page}`,
    meaning: 'المعنى',
    explanation: 'شرح الاسم',
    lesson: 'أثر الإيمان بهذا الاسم',
    evidence: 'الدليل',
    showArabicOriginal: 'النص العربي',
    editorNote: 'حاشية المحقق',
    markStudied: 'علّمه كمدروس',
    studied: 'تمت دراسته',
    previous: 'السابق',
    next: 'التالي',
    backToAll: 'جميع الأسماء',
    notFound: 'لم يُعثر على هذا الاسم.',
    footerNote: 'الشروح منقولة بنصّها من كتاب تفسير أسماء الله الحسنى للشيخ السعدي رحمه الله.',
  },
  en: {
    appTitle: 'The Beautiful Names',
    home: 'Home',
    about: 'About the book',
    aboutShort: 'About',
    switchLang: 'العربية',
    themeLabel: 'Site colour',
    themeNames: { black: 'Black', white: 'White', blue: 'Blue', navy: 'Dark blue', pink: 'Pink' },
    bookTitle: 'Explanation of the Beautiful Names of Allah',
    author: 'by Shaykh Abdur-Rahman ibn Nasir as-Sa‘di',
    heroIntro:
      'The Beautiful Names of Allah explained in the words of Shaykh as-Sa‘di, to help you know your Lord and build Tawheed, love and reverence for Him in your heart.',
    searchPlaceholder: 'Search a name or meaning…',
    noResults: 'No matching names.',
    loading: 'Loading…',
    loadError: 'Could not load the names. Please try again.',
    nameOfTheDay: 'Name of the day',
    readMore: 'Read the explanation',
    studiedProgress: (s, t) => `You have studied ${s} of ${t} names`,
    orderNote: (t) => `${t} names, in the book's order (alphabetical in Arabic).`,
    bookSource: (pages) =>
      `Source: as-Sa‘di, Tafsir Asma' Allah al-Husna, ${pages.includes('–') ? 'pp.' : 'p.'} ${pages}`,
    meaning: 'Meaning',
    explanation: 'Explanation',
    lesson: 'Living by this name',
    evidence: 'Evidence',
    showArabicOriginal: 'Read the original Arabic text',
    editorNote: 'Editor’s footnote',
    markStudied: 'Mark as studied',
    studied: 'Studied',
    previous: 'Previous',
    next: 'Next',
    backToAll: 'All names',
    notFound: 'This name could not be found.',
    footerNote:
      'Explanations are quoted in full from Shaykh as-Sa‘di’s book; the English is a translation.',
  },
};

export function toArabicDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
}
