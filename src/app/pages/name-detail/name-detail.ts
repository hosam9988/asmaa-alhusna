import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { NamesService } from '../../core/services/names.service';
import { SpeechSegment, SpeechService } from '../../core/services/speech.service';
import { StudiedService } from '../../core/services/studied.service';
import { Ornament } from '../../shared/ornament';
import { ReadAloud } from '../../shared/read-aloud';
import { StarBadge } from '../../shared/star-badge';

@Component({
  selector: 'app-name-detail',
  imports: [RouterLink, StarBadge, Ornament, ReadAloud],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './name-detail.html',
  styleUrl: './name-detail.scss',
})
export class NameDetail {
  /** Bound from the `:slug` route parameter. */
  readonly slug = input.required<string>();

  protected readonly language = inject(LanguageService);
  protected readonly namesService = inject(NamesService);
  protected readonly studied = inject(StudiedService);
  protected readonly speech = inject(SpeechService);
  protected readonly t = this.language.t;

  protected readonly item = computed(() => this.namesService.bySlug(this.slug()));
  protected readonly neighbours = computed(() => this.namesService.neighbours(this.slug()));
  /** "١٦٤" or "١٦٤–١٦٧" in the reader's digits. */
  protected readonly pages = computed(() => {
    const item = this.item();
    if (!item) return '';
    const { bookPage: from, bookPageEnd: to } = item;
    const n = (page: number) => this.language.number(page);
    return to > from ? `${n(from)}–${n(to)}` : n(from);
  });

  /** What «استمع / Listen» reads: the name, the explanation paragraph by paragraph, the lesson. */
  protected readonly readAloud = computed<SpeechSegment[]>(() => {
    const item = this.item();
    if (!item) return [];
    const lang = this.language.lang();
    const t = this.t();
    return [
      { key: 'name', text: lang === 'ar' ? item.name : `${item.transliteration}. ${item.meaning}.` },
      ...this.paragraphs(item.summary[lang]).map((text, i) => ({ key: `p${i}`, text: i === 0 ? `${t.explanation}. ${text}` : text })),
      { key: 'lesson', text: `${t.lesson}. ${item.lesson[lang]}` },
    ];
  });

  protected paragraphs(text: string): string[] {
    return text.split('\n').filter((p) => p.trim());
  }

  constructor() {
    // Keep the paragraph being read in view (long explanations run over several screens).
    const host = inject(ElementRef<HTMLElement>);
    effect(() => {
      if (!this.speech.activeKey()) return;
      setTimeout(() => {
        const el = host.nativeElement.querySelector('.reading') as HTMLElement | null;
        const r = el?.getBoundingClientRect();
        if (el && r && (r.top < 80 || r.bottom > innerHeight)) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    });

    const title = inject(Title);
    effect(() => {
      const item = this.item();
      title.setTitle(item ? `${item.name} | ${item.transliteration}` : 'الأسماء الحسنى');
    });
  }
}
