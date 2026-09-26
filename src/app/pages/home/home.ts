import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { NamesService } from '../../core/services/names.service';
import { StudiedService } from '../../core/services/studied.service';
import { matchesQuery } from '../../core/utils/search';
import { Ornament } from '../../shared/ornament';
import { StarBadge } from '../../shared/star-badge';

@Component({
  selector: 'app-home',
  imports: [RouterLink, StarBadge, Ornament],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly language = inject(LanguageService);
  protected readonly namesService = inject(NamesService);
  protected readonly studied = inject(StudiedService);
  protected readonly t = this.language.t;

  protected readonly query = signal('');
  protected readonly filtered = computed(() => {
    const query = this.query();
    return this.namesService.names().filter((n) => matchesQuery(n, query));
  });
  protected readonly progress = computed(() => {
    const total = this.namesService.names().length;
    return total ? (this.studied.count() / total) * 100 : 0;
  });

  /** Rotations for the layered eight-pointed stars that form the hero rosette. */
  protected readonly rosette = [0, 15, 30];
}
