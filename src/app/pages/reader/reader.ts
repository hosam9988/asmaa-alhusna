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
import { Footnote } from '../../core/models/divine-name';
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

  /** "١٢٣–١٢٧" in the reader's digits. */
  protected readonly pages = computed(() => {
    const c = this.chapter();
    if (!c) return '';
    const n = (p: number) => this.language.number(p);
    return c.pageTo > c.pageFrom ? `${n(c.pageFrom)}–${n(c.pageTo)}` : n(c.pageFrom);
  });
  protected readonly minutes = computed(() => {
    const c = this.chapter();
    return c ? this.language.number(Math.max(1, Math.round(wordCount(c) / WORDS_PER_MINUTE))) : '';
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
  protected readonly openNote = signal<Footnote | null>(null);

  /** What «استمع / Listen» reads: the title, then every block. */
  protected readonly readAloud = computed<SpeechSegment[]>(() => {
    const c = this.chapter();
    if (!c) return [];
    const lang = this.language.lang();
    return [
      { key: 'title', text: c.title[lang] },
      ...c.blocks.map((b, i) => ({ key: `b${i}`, text: b.text[lang].replace(/\[\d+\]/g, '') })),
    ];
  });

  constructor() {
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
    const rounded = Math.round(progress * 100) / 100;
    const place = this.reading.place();
    if (place?.slug !== c.slug || place.progress !== rounded) this.reading.place.set({ slug: c.slug, progress: rounded });
    // Reaching the end counts as having read the chapter.
    if (progress > 0.97 && !this.reading.isRead(c.slug)) this.reading.setRead(c.slug, true);
  }

  protected showNote(n: number): void {
    this.openNote.set(this.chapter()?.footnotes.find((f) => f.n === n) ?? null);
  }
}
