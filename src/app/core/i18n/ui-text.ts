import { BookPart, Lang, NameSection } from '../models/divine-name';
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
  /** The name of the day's link. */
  readName: string;
  /** «قرأت ١٢ من ١٠٧ أسماء، و٣ من ١٧ موضوعًا». */
  progress: (namesRead: number, names: number, topicsRead: number, topics: number) => string;
  parts: Record<BookPart, string>;
  /** The line under the names section's heading. */
  namesIntro: string;
  /** «١٧ موضوعًا» / "17 topics", beside the collapsed introduction. */
  topicCount: (n: string) => string;
  /** On the introduction's toggle, closed and open. */
  showTopics: string;
  hideTopics: string;
  /** In the footer of every page. */
  waqfNote: string;
  /** The tabs of a name's page. */
  sections: Record<NameSection, string>;
  sectionsLabel: string;
  /** Shown in a tab that has no content yet. */
  sectionEmpty: string;
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
  /** Over the card leading on, by what comes next: a name or a topic. */
  nextUp: Record<BookPart, string>;
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
      'تعرّف على ربك بأسمائه الحسنى اسمًا اسمًا: معناه، وما يدل عليه، وأثره في قلبك وعبادتك ودعائك؛ في شروحٍ قصيرة تُقرأ في دقائق.',
    startReading: 'ابدأ القراءة',
    continueReading: 'تابع القراءة',
    continueWhere: (title) => `توقفت عند: ${title}`,
    searchPlaceholder: 'ابحث عن اسم أو موضوع…',
    noResults: 'لا توجد نتائج مطابقة.',
    loading: 'جارٍ التحميل…',
    loadError: 'تعذّر تحميل المحتوى. حاول مرة أخرى.',
    nameOfTheDay: 'اسم اليوم',
    readName: 'اقرأ عن الاسم',
    progress: (nr, n, tr, t) =>
      `قرأت ${toArabicDigits(nr)} من ${toArabicDigits(n)} أسماء، و${toArabicDigits(tr)} من ${toArabicDigits(t)} موضوعًا`,
    parts: {
      foundations: 'مقدمة',
      names: 'شرح الأسماء الحسنى',
    },
    namesIntro: 'الأسماء الحسنى اسمًا اسمًا، وما تدل عليه، وأثرها في قلب العبد.',
    topicCount: (n) => `${n} موضوعًا`,
    showTopics: 'عرض المواضيع',
    hideTopics: 'إخفاء المواضيع',
    waqfNote: 'هذا المشروع وقفٌ لله تعالى، وهو غير ربحي.',
    sections: {
      meaning: 'معنى الاسم',
      uses: 'استخداماته',
      duas: 'أدعية متعلقة به',
      story: 'قصة حول الاسم',
      life: 'الربط بين الاسم وواقع الحياة',
      faith: 'الأثر الإيماني بالاسم',
    },
    sectionsLabel: 'أقسام الاسم',
    sectionEmpty: 'لم يُضَف محتوى هذا القسم بعد، وسيُضاف قريبًا بإذن الله.',
    minutes: (n) => `${n} دقائق`,
    textSize: 'حجم الخط',
    sizeLetter: 'أ',
    smaller: 'تصغير الخط',
    larger: 'تكبير الخط',
    footnote: 'حاشية',
    closeNote: 'إغلاق',
    showArabicOriginal: 'النص العربي',
    markRead: 'أتممت القراءة',
    isRead: 'تمّت القراءة',
    nextUp: { foundations: 'الموضوع التالي', names: 'الاسم التالي' },
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
      'Come to know your Lord through His Beautiful Names, one at a time: what each means, what it points to, and what it does to your heart, worship and supplication — in short explanations you can read in minutes.',
    startReading: 'Start reading',
    continueReading: 'Continue reading',
    continueWhere: (title) => `You stopped at: ${title}`,
    searchPlaceholder: 'Search for a name or topic…',
    noResults: 'Nothing matches.',
    loading: 'Loading…',
    loadError: 'Could not load the content. Please try again.',
    nameOfTheDay: 'Name of the day',
    readName: 'Read about this name',
    progress: (nr, n, tr, t) => `You have read ${nr} of ${n} names and ${tr} of ${t} topics`,
    parts: {
      foundations: 'Introduction',
      names: 'The Beautiful Names explained',
    },
    namesIntro: 'The Beautiful Names one by one: what each means, and what it does to the heart.',
    topicCount: (n) => `${n} topics`,
    showTopics: 'Show topics',
    hideTopics: 'Hide topics',
    waqfNote: 'This project is a waqf (an endowment for the sake of Allah) and is non-profit.',
    sections: {
      meaning: 'Meaning',
      uses: 'How it is used',
      duas: 'Related supplications',
      story: 'A story about the name',
      life: 'The name in daily life',
      faith: 'Its effect on faith',
    },
    sectionsLabel: 'About this name',
    sectionEmpty: 'Nothing has been added to this section yet; it is coming soon, in sha’ Allah.',
    minutes: (n) => `${n} min`,
    textSize: 'Text size',
    sizeLetter: 'A',
    smaller: 'Smaller text',
    larger: 'Larger text',
    footnote: 'Footnote',
    closeNote: 'Close',
    showArabicOriginal: 'Read the original Arabic',
    markRead: 'I have finished reading',
    isRead: 'Finished reading',
    nextUp: { foundations: 'Next topic', names: 'Next name' },
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
