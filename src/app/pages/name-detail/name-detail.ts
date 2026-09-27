import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { NamesService } from '../../core/services/names.service';
import { StudiedService } from '../../core/services/studied.service';
import { Ornament } from '../../shared/ornament';
import { StarBadge } from '../../shared/star-badge';

@Component({
  selector: 'app-name-detail',
  imports: [RouterLink, StarBadge, Ornament],
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

  protected paragraphs(text: string): string[] {
    return text.split('\n').filter((p) => p.trim());
  }

  constructor() {
    const title = inject(Title);
    effect(() => {
      const item = this.item();
      title.setTitle(item ? `${item.name} | ${item.transliteration}` : 'الأسماء الحسنى');
    });
  }
}
