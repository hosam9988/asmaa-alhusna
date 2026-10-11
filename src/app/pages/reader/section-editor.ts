import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { AddedSection } from '../../core/models/divine-name';
import { LanguageService } from '../../core/services/language.service';
import { draftKey, MAX_SECTION_LENGTH, SectionsService } from '../../core/services/sections.service';

/** What can stop the editor saving. */
type EditorProblem = 'arabicRequired' | 'tooLong' | 'saveFailed';

/**
 * An admin's editor for one added tab: the Arabic text, an optional English translation, Save and
 * Cancel. It edits the tab's draft (SectionsService.drafts), so nothing typed is lost when the admin
 * looks at another tab or page in the meantime.
 */
@Component({
  selector: 'app-section-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-editor.html',
  styleUrl: './section-editor.scss',
})
export class SectionEditor {
  readonly chapter = input.required<string>();
  readonly tab = input.required<AddedSection>();

  private readonly sections = inject(SectionsService);
  protected readonly t = inject(LanguageService).t;
  protected readonly maxLength = MAX_SECTION_LENGTH;

  private readonly key = computed(() => draftKey(this.chapter(), this.tab()));
  protected readonly draft = computed(() => this.sections.drafts()[this.key()] ?? { ar: '', en: '' });
  protected readonly saving = signal(false);
  protected readonly problem = signal<EditorProblem | null>(null);

  constructor() {
    // A message belongs to the tab it was shown on.
    effect(() => {
      this.key();
      untracked(() => this.problem.set(null));
    });
  }

  protected edit(field: 'ar' | 'en', value: string): void {
    this.sections.setDraft(this.key(), { ...this.draft(), [field]: value });
  }

  protected cancel(): void {
    this.sections.setDraft(this.key(), null);
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    if (this.saving()) return;
    const chapter = this.chapter();
    const tab = this.tab();
    const key = this.key();
    const draft = this.draft();
    if (!draft.ar.trim() && draft.en.trim()) {
      this.problem.set('arabicRequired');
      return;
    }
    if (draft.ar.length > MAX_SECTION_LENGTH || draft.en.length > MAX_SECTION_LENGTH) {
      this.problem.set('tooLong');
      return;
    }
    this.saving.set(true);
    this.problem.set(null);
    try {
      await this.sections.save(chapter, tab, draft);
      this.sections.setDraft(key, null);
    } catch {
      this.problem.set('saveFailed');
    } finally {
      this.saving.set(false);
    }
  }
}
