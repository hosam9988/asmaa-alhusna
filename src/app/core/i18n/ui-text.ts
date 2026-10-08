import { BookPart, Lang } from '../models/divine-name';
import { Theme } from '../models/theme';

export interface UiText {
  appTitle: string;
  home: string;
  contents: string;
  switchLang: string;
  themeLabel: string;
  themeNames: Record<Theme, string>;
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
}

export const UI_TEXT: Record<Lang, UiText> = {
  ar: {
    appTitle: 'أسماء الله الحسنى',
    home: 'الرئيسية',
    contents: 'الفهرس',
    switchLang: 'English',
    themeLabel: 'لون الصفحات',
    themeNames: { paper: 'ورقي', black: 'أسود', white: 'أبيض', blue: 'أزرق', navy: 'كحلي', pink: 'وردي' },
    heroIntro:
      'تعرّف على ربك بأسمائه الحسنى اسمًا اسمًا: معناه، وما يدل عليه، وأثره في قلبك وعبادتك ودعائك؛ في فصولٍ قصيرة تُقرأ في دقائق.',
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
      foundations: 'في فقه الأسماء الحسنى',
      names: 'شرح الأسماء الحسنى',
    },
    partIntros: {
      foundations: 'فصول في منزلة العلم بأسماء الله وقواعده.',
      names: 'الأسماء الحسنى اسمًا اسمًا، وما تدل عليه، وأثرها في قلب العبد.',
    },
    chapterLabel: (n) => `الفصل ${n}`,
    minutes: (n) => `${n} دقائق`,
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
  },
  en: {
    appTitle: 'The Beautiful Names of Allah',
    home: 'Home',
    contents: 'Contents',
    switchLang: 'العربية',
    themeLabel: 'Page colour',
    themeNames: { paper: 'Paper', black: 'Black', white: 'White', blue: 'Blue', navy: 'Dark blue', pink: 'Pink' },
    heroIntro:
      'Come to know your Lord through His Beautiful Names, one at a time: what each means, what it points to, and what it does to your heart, worship and supplication — in short chapters you can read in minutes.',
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
      foundations: 'Understanding the Beautiful Names',
      names: 'The Beautiful Names explained',
    },
    partIntros: {
      foundations: 'Chapters on the worth of knowing Allah’s names, and the principles behind them.',
      names: 'The Beautiful Names one by one: what each means, and what it does to the heart.',
    },
    chapterLabel: (n) => `Chapter ${n}`,
    minutes: (n) => `${n} min`,
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
  },
};

export function toArabicDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
}
