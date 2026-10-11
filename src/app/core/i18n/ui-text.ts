import { SignInProblem } from '../models/admin';
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
  markUnread: string;
  /** The home page's button that clears every read mark and where the reader stopped, and its confirmation. */
  resetAll: string;
  resetAllConfirm: string;
  resetAllYes: string;
  cancel: string;
  /** The admins' sign-in page, and the footer link to it (signed out / signed in). */
  adminLink: string;
  adminAccount: string;
  adminTitle: string;
  email: string;
  password: string;
  signIn: string;
  signingIn: string;
  signOut: string;
  forgotPassword: string;
  resetSent: (email: string) => string;
  signInProblems: Record<SignInProblem | 'noEmail', string>;
  signedInAs: (email: string) => string;
  adminHelp: string;
  browseNames: string;
  notAdmin: string;
  adminCheckFailed: string;
  notConfigured: string;
  /** The admin page's backup of everything the admins have written. */
  backupButton: string;
  backupNote: string;
  backupPreparing: string;
  backupDone: (count: string) => string;
  backupFailed: string;
  /** The editor in a name's added tabs, for admins. */
  edit: string;
  addContent: string;
  save: string;
  saving: string;
  saveFailed: string;
  editorArabic: string;
  editorEnglish: string;
  editorHelp: string;
  arabicRequired: string;
  tooLong: string;
  /** An added tab while it loads, or when it could not. */
  sectionLoading: string;
  sectionError: string;
  retry: string;
  /** On the English site, above an added tab that has no translation. */
  arabicOnlyNote: string;
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
    markUnread: 'إلغاء علامة القراءة',
    resetAll: 'إعادة ضبط',
    resetAllConfirm: 'مسح علامات القراءة عن كل الأسماء والمواضيع، والموضع الذي توقفت عنده؟',
    resetAllYes: 'نعم، امسحها',
    cancel: 'إلغاء',
    adminLink: 'دخول المشرف',
    adminAccount: 'حساب المشرف',
    adminTitle: 'دخول المشرف',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'دخول',
    signingIn: 'جارٍ الدخول…',
    signOut: 'تسجيل الخروج',
    forgotPassword: 'نسيت كلمة المرور؟',
    resetSent: (email) => `أرسلنا رابطًا لتعيين كلمة مرور جديدة إلى ${email}، إن كان مسجّلًا لدينا.`,
    signInProblems: {
      wrong: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
      tooMany: 'محاولات كثيرة؛ انتظر قليلًا ثم حاول مرة أخرى.',
      network: 'تعذّر الاتصال؛ تأكد من الإنترنت ثم حاول مرة أخرى.',
      other: 'حدث خطأ؛ حاول مرة أخرى.',
      noEmail: 'اكتب بريدك الإلكتروني أولًا، ثم اضغط «نسيت كلمة المرور؟».',
    },
    signedInAs: (email) => `أنت مسجّل الدخول مشرفًا بالبريد ${email}.`,
    adminHelp:
      'افتح صفحة أي اسم، واختر أحد أقسامه، ثم اضغط «تعديل» لإضافة محتواه أو تغييره. يظهر ما تحفظه للزوار فورًا.',
    browseNames: 'تصفّح الأسماء',
    notAdmin: 'هذا الحساب ليس من المشرفين.',
    adminCheckFailed: 'تعذّر التحقق من الحساب؛ تأكد من الإنترنت ثم أعد فتح الصفحة.',
    notConfigured: 'لم يُربط الموقع بقاعدة البيانات بعد.',
    backupButton: 'تنزيل نسخة احتياطية',
    backupNote: 'ملف واحد فيه كل ما كتبه المشرفون في أقسام الأسماء؛ نزّله واحفظه عندك بين حين وآخر.',
    backupPreparing: 'جارٍ تجهيز النسخة…',
    backupDone: (count) => `نُزّلت النسخة الاحتياطية (عدد الأقسام المكتوبة: ${count}).`,
    backupFailed: 'تعذّر تجهيز النسخة؛ تأكد من الإنترنت ثم حاول مرة أخرى.',
    edit: 'تعديل',
    addContent: 'إضافة محتوى',
    save: 'حفظ',
    saving: 'جارٍ الحفظ…',
    saveFailed: 'تعذّر الحفظ؛ تأكد من الإنترنت ثم حاول مرة أخرى.',
    editorArabic: 'النص العربي',
    editorEnglish: 'الترجمة الإنجليزية (اختيارية)',
    editorHelp:
      'افصل بين الفقرات بسطر فارغ، وابدأ السطر بعلامة # ليكون عنوانًا، وضع الآيات بين ﴿ ﴾. ولحذف محتوى القسم امسح النص ثم احفظ.',
    arabicRequired: 'اكتب النص العربي أولًا؛ لا تكفي الترجمة الإنجليزية وحدها.',
    tooLong: 'النص أطول من المسموح؛ قسّمه أو اختصره.',
    sectionLoading: 'جارٍ تحميل القسم…',
    sectionError: 'تعذّر تحميل هذا القسم.',
    retry: 'أعد المحاولة',
    arabicOnlyNote: 'لم يُترجم هذا القسم بعد.',
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
    markUnread: 'Mark as unread',
    resetAll: 'Reset',
    resetAllConfirm: 'Clear the read marks on every name and topic, and where you stopped reading?',
    resetAllYes: 'Yes, clear them',
    cancel: 'Cancel',
    adminLink: 'Admin sign-in',
    adminAccount: 'Admin account',
    adminTitle: 'Admin sign-in',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    signingIn: 'Signing in…',
    signOut: 'Sign out',
    forgotPassword: 'Forgot your password?',
    resetSent: (email) => `If ${email} is registered, a link to set a new password is on its way.`,
    signInProblems: {
      wrong: 'The email or password is incorrect.',
      tooMany: 'Too many attempts; wait a little, then try again.',
      network: 'Could not connect; check your internet connection and try again.',
      other: 'Something went wrong; please try again.',
      noEmail: 'Enter your email first, then press "Forgot your password?".',
    },
    signedInAs: (email) => `You are signed in as an admin (${email}).`,
    adminHelp:
      'Open any name’s page, choose one of its sections, then press "Edit" to add or change its content. What you save appears to visitors straight away.',
    browseNames: 'Browse the names',
    notAdmin: 'This account is not an admin.',
    adminCheckFailed: 'Could not check this account; check your internet connection, then reload the page.',
    notConfigured: 'The site is not connected to its database yet.',
    backupButton: 'Download a backup',
    backupNote: 'One file with everything the admins have written in the names’ sections; download it and keep a copy now and then.',
    backupPreparing: 'Preparing the backup…',
    backupDone: (count) => `Backup downloaded (sections written: ${count}).`,
    backupFailed: 'Could not prepare the backup; check your internet connection and try again.',
    edit: 'Edit',
    addContent: 'Add content',
    save: 'Save',
    saving: 'Saving…',
    saveFailed: 'Could not save; check your internet connection and try again.',
    editorArabic: 'Arabic text',
    editorEnglish: 'English translation (optional)',
    editorHelp:
      'Separate paragraphs with an empty line, start a line with # to make it a heading, and put verses between ﴿ ﴾. To remove this section’s content, clear the text and save.',
    arabicRequired: 'Write the Arabic text first; an English translation alone is not enough.',
    tooLong: 'The text is longer than allowed; split or shorten it.',
    sectionLoading: 'Loading this section…',
    sectionError: 'Could not load this section.',
    retry: 'Try again',
    arabicOnlyNote: 'This section has not been translated yet, so it is shown in Arabic.',
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
