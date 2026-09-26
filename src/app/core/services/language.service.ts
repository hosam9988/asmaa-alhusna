import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toArabicDigits, UI_TEXT } from '../i18n/ui-text';
import { Lang } from '../models/divine-name';
import { readStorage, writeStorage } from './storage';

const KEY = 'asmaa.lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);

  readonly lang = signal<Lang>(initialLang());
  readonly isArabic = computed(() => this.lang() === 'ar');
  readonly t = computed(() => UI_TEXT[this.lang()]);

  constructor() {
    effect(() => {
      const lang = this.lang();
      const html = this.document.documentElement;
      html.lang = lang;
      html.dir = lang === 'ar' ? 'rtl' : 'ltr';
      writeStorage(KEY, lang);
    });
  }

  toggle(): void {
    this.lang.update((l) => (l === 'ar' ? 'en' : 'ar'));
  }

  number(value: number): string {
    return this.isArabic() ? toArabicDigits(value) : String(value);
  }
}

function initialLang(): Lang {
  const saved = readStorage(KEY);
  if (saved === 'ar' || saved === 'en') return saved;
  return navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';
}
