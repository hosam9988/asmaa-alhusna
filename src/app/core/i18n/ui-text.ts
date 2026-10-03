import { BookPart, Lang } from '../models/divine-name';
import { Theme } from '../models/theme';

export interface UiText {
  appTitle: string;
  home: string;
  contents: string;
  about: string;
  /** Label used where the header is too narrow for `about`. */
  aboutShort: string;
  switchLang: string;
  themeLabel: string;
  themeNames: Record<Theme, string>;
  bookTitle: string;
  author: string;
  heroIntro: string;
  startReading: string;
  continueReading: string;
  continueWhere: (title: string) => string;
  searchPlaceholder: string;
  noResults: string;
  loading: string;
  loadError: string;
  nameOfTheDay: string;
  readChapter: string;
  progress: (read: number, total: number) => string;
  parts: Record<BookPart, string>;
  partIntros: Record<BookPart, string>;
  chapterLabel: (n: string) => string;
  minutes: (n: string) => string;
  pages: (range: string) => string;
  source: (range: string) => string;
  vowelNote: string;
  textSize: string;
  /** The letter on the text-size buttons: «أ−» «أ+» / "A−" "A+". */
  sizeLetter: string;
  smaller: string;
  larger: string;
  footnote: string;
  closeNote: string;
  showArabicOriginal: string;
  markRead: string;
  isRead: string;
  nextChapter: string;
  previous: string;
  next: string;
  backToContents: string;
  notFound: string;
  listen: string;
  pause: string;
  resume: string;
  stop: string;
  noVoice: string;
  versesSkipped: string;
  footerNote: string;
}

export const UI_TEXT: Record<Lang, UiText> = {
  ar: {
    appTitle: 'فقه الأسماء الحسنى',
    home: 'الرئيسية',
    contents: 'الفهرس',
    about: 'عن الكتاب',
    aboutShort: 'الكتاب',
    switchLang: 'English',
    themeLabel: 'لون الصفحات',
    themeNames: { paper: 'ورقي', black: 'أسود', white: 'أبيض', blue: 'أزرق', navy: 'كحلي', pink: 'وردي' },
    bookTitle: 'فقه الأسماء الحسنى',
    author: 'للشيخ عبد الرزاق بن عبد المحسن البدر',
    heroIntro:
      'كتابٌ يأخذ بيدك اسمًا اسمًا، لتعرف ربك بأسمائه الحسنى، وتعبده بها، وتدعوه بها؛ فصولٌ قصيرة تُقرأ في دقائق.',
    startReading: 'ابدأ القراءة',
    continueReading: 'تابع القراءة',
    continueWhere: (title) => `توقفت عند: ${title}`,
    searchPlaceholder: 'ابحث عن اسم أو فصل…',
    noResults: 'لا توجد نتائج مطابقة.',
    loading: 'جارٍ التحميل…',
    loadError: 'تعذّر تحميل الكتاب. حاول مرة أخرى.',
    nameOfTheDay: 'اسم اليوم',
    readChapter: 'اقرأ الفصل',
    progress: (r, t) => `قرأت ${toArabicDigits(r)} من ${toArabicDigits(t)} فصلًا`,
    parts: {
      front: 'بين يدي الكتاب',
      foundations: 'في فقه الأسماء الحسنى',
      names: 'شرح الأسماء الحسنى',
    },
    partIntros: {
      front: 'تقريظ الكتاب ومقدمة المؤلف.',
      foundations: 'فصول في منزلة العلم بأسماء الله وقواعده.',
      names: 'الأسماء الحسنى اسمًا اسمًا، وما تدل عليه، وأثرها في قلب العبد.',
    },
    chapterLabel: (n) => `الفصل ${n}`,
    minutes: (n) => `${n} دقائق`,
    // Pages are those of the 2nd edition (1430 AH); the 1st edition (1429 AH) is paged differently.
    pages: (range) => `ص ${range} (ط٢)`,
    source: (range) =>
      `المصدر: فقه الأسماء الحسنى، للشيخ عبد الرزاق البدر، الطبعة الثانية ١٤٣٠هـ، ص ${range}. وأرقام الصفحات في الطبعة الأولى (١٤٢٩هـ) تختلف عنها.`,
    vowelNote: 'التشكيل الكامل مضاف للتيسير، وما سواه من نص الكتاب.',
    textSize: 'حجم الخط',
    sizeLetter: 'أ',
    smaller: 'تصغير الخط',
    larger: 'تكبير الخط',
    footnote: 'حاشية',
    closeNote: 'إغلاق',
    showArabicOriginal: 'النص العربي',
    markRead: 'أتممت قراءة الفصل',
    isRead: 'قرأتَ هذا الفصل',
    nextChapter: 'الفصل التالي',
    previous: 'السابق',
    next: 'التالي',
    backToContents: 'الفهرس',
    notFound: 'لم يُعثر على هذه الصفحة.',
    listen: 'استمع',
    pause: 'إيقاف مؤقت',
    resume: 'متابعة',
    stop: 'إيقاف',
    noVoice: 'لا يتوفر صوت عربي على هذا الجهاز. يمكنك إضافته من إعدادات اللغة والكلام في جهازك.',
    versesSkipped: 'قراءة آلية؛ تُتخطّى الآيات القرآنية.',
    footerNote: 'النص منقول من كتاب «فقه الأسماء الحسنى» للشيخ عبد الرزاق البدر، من نسخته على موقعه الرسمي.',
  },
  en: {
    appTitle: 'Understanding the Beautiful Names',
    home: 'Home',
    contents: 'Contents',
    about: 'About the book',
    aboutShort: 'About',
    switchLang: 'العربية',
    themeLabel: 'Page colour',
    themeNames: { paper: 'Paper', black: 'Black', white: 'White', blue: 'Blue', navy: 'Dark blue', pink: 'Pink' },
    bookTitle: 'Fiqh al-Asma’ al-Husna',
    author: 'by Shaykh ‘Abd ar-Razzaq ibn ‘Abd al-Muhsin al-Badr',
    heroIntro:
      'A book that takes you by the hand, one name at a time, so you come to know your Lord by His Beautiful Names, worship Him by them and call on Him by them — in short chapters you can read in minutes.',
    startReading: 'Start reading',
    continueReading: 'Continue reading',
    continueWhere: (title) => `You stopped at: ${title}`,
    searchPlaceholder: 'Search for a name or chapter…',
    noResults: 'Nothing matches.',
    loading: 'Loading…',
    loadError: 'Could not load the book. Please try again.',
    nameOfTheDay: 'Name of the day',
    readChapter: 'Read the chapter',
    progress: (r, t) => `You have read ${r} of ${t} chapters`,
    parts: {
      front: 'Before the book',
      foundations: 'Understanding the Beautiful Names',
      names: 'The Beautiful Names explained',
    },
    partIntros: {
      front: 'The book’s endorsement and the author’s introduction.',
      foundations: 'Chapters on the worth of knowing Allah’s names, and the principles behind them.',
      names: 'The Beautiful Names one by one: what each means, and what it does to the heart.',
    },
    chapterLabel: (n) => `Chapter ${n}`,
    minutes: (n) => `${n} min`,
    pages: (range) => `${range.includes('–') ? 'pp.' : 'p.'} ${range} (2nd ed.)`,
    source: (range) =>
      `Source: al-Badr, Fiqh al-Asma’ al-Husna, 2nd edition (1430 AH), ${range.includes('–') ? 'pp.' : 'p.'} ${range}. The 1st edition (1429 AH) has different page numbers.`,
    vowelNote: 'Full vowel marks were added to the Arabic for easier reading; the rest is the book’s text.',
    textSize: 'Text size',
    sizeLetter: 'A',
    smaller: 'Smaller text',
    larger: 'Larger text',
    footnote: 'Footnote',
    closeNote: 'Close',
    showArabicOriginal: 'Read the original Arabic',
    markRead: 'I have read this chapter',
    isRead: 'You have read this chapter',
    nextChapter: 'Next chapter',
    previous: 'Previous',
    next: 'Next',
    backToContents: 'Contents',
    notFound: 'This page could not be found.',
    listen: 'Listen',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    noVoice: 'No English voice is available on this device. You can add one in your device’s language and speech settings.',
    versesSkipped: 'Computer voice; Qur’an verses are skipped.',
    footerNote:
      'The text is from Shaykh ‘Abd ar-Razzaq al-Badr’s «Fiqh al-Asma’ al-Husna», from the copy on his official website; the English is a translation.',
  },
};

export function toArabicDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
}
