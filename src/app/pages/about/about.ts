import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { Ornament } from '../../shared/ornament';

@Component({
  selector: 'app-about',
  imports: [Ornament],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly language = inject(LanguageService);
}
