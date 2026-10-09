import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Footnote, NAME_SECTIONS, NameSection, SectionContent } from '../../core/models/divine-name';
import { BookService, wordCount } from '../../core/services/book.service';
import { LanguageService } from '../../core/services/language.service';
import { ReadingService } from '../../core/services/reading.service';
import { SpeechSegment, SpeechService } from '../../core/services/speech.service';
import { Ornament } from '../../shared/ornament';
import { ReadAloud } from '../../shared/read-aloud';
import { RichText } from '../../shared/rich-text';
import { StarBadge } from '../../shared/star-badge';

/** Words read per minute, for the reading-time estimate. */
const WORDS_PER_MINUTE = 130;

/** A chapter of the book, laid out for comfortable reading. Reached as /read/:chapter or /name/:name. */
@Component({
  selector: 'app-reader',
  imports: [RouterLink, Ornament, ReadAloud, RichText, StarBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reader.html',
  styleUrl: './reader.scss',
  host: {
    '(window:scroll)': 'onScroll()',
    '(document:keydown.escape)': 'openNote.set(null)',
  },
})
export class Reader {
  /** Bound from /read/:chapter. */
  readonly chapterSlug = input<string>('', { alias: 'chapter' });
  /** Bound from /name/:name: show that name's chapter, with the name highlighted. */
  readonly nameSlug = input<string>('', { alias: 'name' });

  protected readonly language = inject(LanguageService);
  protected readonly book = inject(BookService);
  protected readonly reading = inject(ReadingService);
  protected readonly speech = inject(SpeechService);
  protected readonly t = this.language.t;
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly resume = toSignal(inject(ActivatedRoute).queryParamMap);

  private readonly article = viewChild<ElementRef<HTMLElement>>('article');
  private readonly heading = viewChild<ElementRef<HTMLElement>>('heading');
  private readonly readingBar = viewChild<ElementRef<HTMLElement>>('readingBar');
  private readonly tabList = viewChild<ElementRef<HTMLElement>>('tabs');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  protected readonly focusName = computed(() => (this.nameSlug() ? this.book.name(this.nameSlug()) : undefined));
  protected readonly chapter = computed(() =>
    this.book.chapter(this.chapterSlug() || this.focusName()?.chapter || ''),
  );
  protected readonly names = computed(() => {
    const c = this.chapter();
    return c ? this.book.namesOf(c) : [];
  });
  protected readonly neighbours = computed(() => this.book.neighbours(this.chapter()?.slug ?? ''));
  protected readonly nextNames = computed(() => {
    const next = this.neighbours().next;
    return next ? this.book.namesOf(next) : [];
  });

  /** A name's page is split into tabs; the chapters on the names in general are not. */
  protected readonly sections = NAME_SECTIONS;
  protected readonly hasTabs = computed(() => this.names().length > 0);
  protected readonly tab = signal<NameSection>('meaning');
  /** The text shown: the chapter's own, or the open tab's (null when that tab has nothing yet). */
  protected readonly content = computed<SectionContent | null>(() => {
    const c = this.chapter();
    const tab = this.tab();
    if (!c) return null;
    if (!this.hasTabs() || tab === 'meaning') return c;
    return c.sections?.[tab] ?? null;
  });
  /** Only the chapter's own text counts toward reading progress and "read". */
  private readonly onMainText = computed(() => !this.hasTabs() || this.tab() === 'meaning');

  protected readonly minutes = computed(() => {
    const text = this.content();
    return text ? this.language.number(Math.max(1, Math.round(wordCount(text) / WORDS_PER_MINUTE))) : '';
  });
  /**
   * On a name's own page (/name/…), that name is highlighted in the text. Not «الله»: it is on
   * nearly every line.
   */
  protected readonly highlight = computed(() => {
    const focus = this.focusName();
    return this.language.lang() === 'ar' && focus && focus.slug !== 'allah' ? [focus.name] : [];
  });

  /** 0–1: how far down the chapter the reader is. */
  protected readonly progress = signal(0);
  /** False once the heading with the names has scrolled away; the bar then shows them instead. */
  protected readonly headingInView = signal(true);
  protected readonly openNote = signal<Footnote | null>(null);

  /** What «استمع / Listen» reads: the title, then every block of the text shown. */
  protected readonly readAloud = computed<SpeechSegment[]>(() => {
    const c = this.chapter();
    const text = this.content();
    if (!c || !text) return [];
    const lang = this.language.lang();
    return [
      { key: 'title', text: c.title[lang] },
      ...text.blocks.map((b, i) => ({ key: `b${i}`, text: b.text[lang].replace(/\[\d+\]/g, '') })),
    ];
  });

  constructor() {
    // Every chapter opens on «معنى الاسم».
    effect(() => {
      this.chapter();
      untracked(() => this.tab.set('meaning'));
    });

    // Keep the paragraph being read in view.
    effect(() => {
      if (!this.speech.activeKey()) return;
      setTimeout(() => {
        const el = this.host.nativeElement.querySelector('.reading') as HTMLElement | null;
        const r = el?.getBoundingClientRect();
        if (el && r && (r.top < 90 || r.bottom > innerHeight)) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    });

    // A new chapter: start at the top, or where the reader stopped when they asked to resume.
    afterRenderEffect(() => {
      const c = this.chapter();
      const article = this.article();
      if (!c || !article) return;
      untracked(() => {
        this.openNote.set(null);
        const place = this.reading.place();
        const wantsResume = this.resume()?.get('resume') === '1' && place?.slug === c.slug;
        if (wantsResume && place) {
          const el = article.nativeElement;
          const top = el.offsetTop + place.progress * Math.max(0, el.offsetHeight - innerHeight);
          scrollTo({ top, behavior: 'instant' });
        }
        this.onScroll();
      });
    });

    const title = inject(Title);
    effect(() => {
      const c = this.chapter();
      title.setTitle(c ? `${c.title[this.language.lang()]} | ${this.t().appTitle}` : this.t().appTitle);
    });
  }

  protected onScroll(): void {
    const el = this.article()?.nativeElement;
    const c = this.chapter();
    if (!el || !c) return;
    const scrollable = Math.max(1, el.offsetHeight - innerHeight);
    const progress = Math.min(1, Math.max(0, (scrollY - el.offsetTop) / scrollable));
    this.progress.set(progress);
    this.headingInView.set(this.isHeadingInView());
    if (!this.onMainText()) return;
    const rounded = Math.round(progress * 100) / 100;
    const place = this.reading.place();
    if (place?.slug !== c.slug || place.progress !== rounded) this.reading.place.set({ slug: c.slug, progress: rounded });
    // Reaching the end counts as having read the chapter.
    if (progress > 0.97 && !this.reading.isRead(c.slug)) this.reading.setRead(c.slug, true);
  }

  /** Whether most of the heading still shows below the site header (where the bar sticks). */
  private isHeadingInView(): boolean {
    const heading = this.heading()?.nativeElement;
    const bar = this.readingBar()?.nativeElement;
    if (!heading || !bar) return true;
    const r = heading.getBoundingClientRect();
    return r.bottom - r.height / 3 > parseFloat(getComputedStyle(bar).top);
  }

  protected showNote(n: number): void {
    this.openNote.set(this.content()?.footnotes.find((f) => f.n === n) ?? null);
  }

  /**
   * Opens a tab, sliding it fully into view on phones (where the tabs scroll sideways). If the
   * reader is already down in the text, go back to where the new text starts.
   */
  protected selectTab(tab: NameSection): void {
    this.tab.set(tab);
    this.openNote.set(null);
    setTimeout(() => {
      const bar = this.tabList()?.nativeElement;
      const panel = this.panel()?.nativeElement;
      if (!bar || !panel) return;
      bar.querySelector(`#tab-${tab}`)?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      const gap = panel.getBoundingClientRect().top - bar.getBoundingClientRect().bottom;
      if (gap < 0) scrollBy({ top: gap - 16, behavior: 'smooth' });
    });
  }

  /** Arrow keys move between tabs, following the reading direction; Home and End jump to the ends. */
  protected onTabKey(event: KeyboardEvent, index: number): void {
    const forward = this.language.isArabic() ? 'ArrowLeft' : 'ArrowRight';
    const back = this.language.isArabic() ? 'ArrowRight' : 'ArrowLeft';
    const last = this.sections.length - 1;
    const next =
      event.key === forward ? (index + 1) % (last + 1)
      : event.key === back ? (index + last) % (last + 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : -1;
    if (next < 0) return;
    event.preventDefault();
    this.selectTab(this.sections[next]);
    (this.host.nativeElement.querySelector(`#tab-${this.sections[next]}`) as HTMLElement | null)?.focus();
  }
}
