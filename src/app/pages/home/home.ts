import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookPart, Chapter, DivineName } from '../../core/models/divine-name';
import { BookService } from '../../core/services/book.service';
import { LanguageService } from '../../core/services/language.service';
import { ReadingService } from '../../core/services/reading.service';
import { normalizeArabic } from '../../core/utils/search';
import { Ornament } from '../../shared/ornament';
import { StarBadge } from '../../shared/star-badge';

interface Entry {
  chapter: Chapter;
  /** The names the chapter explains together, each with its own number. */
  names: DivineName[];
  /** The names in Latin letters, «Al-Khaliq · Al-Khallaq». */
  translit: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, StarBadge, Ornament],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly language = inject(LanguageService);
  protected readonly book = inject(BookService);
  protected readonly reading = inject(ReadingService);
  protected readonly t = this.language.t;

  protected readonly query = signal('');

  /** The book's parts, each with its chapters (filtered by the search). */
  protected readonly parts = computed(() => {
    const q = this.query().trim();
    const parts: { part: BookPart; entries: Entry[] }[] = [];
    for (const chapter of this.book.chapters()) {
      const names = this.book.namesOf(chapter);
      // Searching keeps the chapters whose title, or one of whose names, matches.
      if (q && !this.textMatches(chapter.title, q) && !names.some((n) => this.nameMatches(n, q))) continue;
      const entry = { chapter, names, translit: names.map((n) => n.transliteration).join(' · ') };
      const last = parts.at(-1);
      if (last?.part === chapter.part) last.entries.push(entry);
      else parts.push({ part: chapter.part, entries: [entry] });
    }
    return parts;
  });

  /**
   * How far the reader has come: names and introductory topics, and the share of the whole. A name
   * counts once any chapter explaining it is read (الخالق is explained in two).
   */
  protected readonly readProgress = computed(() => {
    const chapters = this.book.chapters();
    const names = this.book.names();
    const read = chapters.filter((c) => this.reading.isRead(c.slug));
    const readNames = new Set(read.flatMap((c) => c.names));
    return {
      namesRead: names.filter((n) => readNames.has(n.slug)).length,
      names: names.length,
      topicsRead: read.filter((c) => c.part === 'foundations').length,
      topics: chapters.filter((c) => c.part === 'foundations').length,
      percent: chapters.length ? (read.length / chapters.length) * 100 : 0,
    };
  });

  /** «إعادة ضبط» asks first: true while it waits for the answer. */
  protected readonly confirmingReset = signal(false);
  private readonly resetButton = viewChild<ElementRef<HTMLButtonElement>>('resetButton');
  private readonly cancelResetButton = viewChild<ElementRef<HTMLButtonElement>>('cancelResetButton');
  private readonly injector = inject(Injector);

  protected askReset(): void {
    this.confirmingReset.set(true);
    // Focus the safe answer, so a second Enter can't clear everything by accident.
    afterNextRender(() => this.cancelResetButton()?.nativeElement.focus(), { injector: this.injector });
  }

  protected cancelReset(): void {
    if (!this.confirmingReset()) return;
    this.confirmingReset.set(false);
    afterNextRender(() => this.resetButton()?.nativeElement.focus(), { injector: this.injector });
  }

  protected resetAll(): void {
    this.reading.resetAll();
    this.confirmingReset.set(false);
  }

  /** Where to pick up: the chapter the reader was in, unless they finished it. */
  protected readonly resume = computed(() => {
    const place = this.reading.place();
    const chapter = place && this.book.chapter(place.slug);
    if (!chapter) return undefined;
    if (place.progress > 0.95) return this.book.neighbours(chapter.slug).next;
    return chapter;
  });
  protected readonly todaysChapter = computed(() => {
    const name = this.book.nameOfTheDay();
    return name ? this.book.chapter(name.chapter) : undefined;
  });

  /** Rotations for the layered eight-pointed stars that form the hero rosette. */
  protected readonly rosette = [0, 15, 30];

  private nameMatches(n: DivineName, q: string): boolean {
    const number = q.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
    return String(n.id) === number || this.textMatches({ ar: n.name, en: `${n.transliteration} ${n.meaning}` }, q);
  }

  /** Arabic matched without tashkeel, hamza forms or the article; Latin matched letters only. */
  private textMatches(text: { ar: string; en: string }, q: string): boolean {
    const ar = normalizeArabic(q).replace(/^ال/, '');
    const arabic = normalizeArabic(text.ar);
    if (ar && (arabic.includes(ar) || arabic.replace(/(^|\s)ال/g, '$1').includes(ar))) return true;
    const latin = q.toLowerCase().replace(/[^a-z]/g, '');
    return !!latin && text.en.toLowerCase().replace(/[^a-z]/g, '').includes(latin);
  }
}
