import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FIREBASE_CONFIG } from '../../core/firebase/firebase.config';
import { UI_TEXT } from '../../core/i18n/ui-text';
import { SignInProblem } from '../../core/models/admin';
import { ADDED_SECTIONS, AddedSection } from '../../core/models/divine-name';
import { AdminService } from '../../core/services/admin.service';
import { BookService } from '../../core/services/book.service';
import { LanguageService } from '../../core/services/language.service';
import { SavedTab, SectionsService } from '../../core/services/sections.service';
import { downloadFile } from '../../core/utils/download';
import { Ornament } from '../../shared/ornament';

/** One name's page in the backup: its names, then each written tab with its title. */
interface BackupPage {
  chapter: string;
  names: string[];
  tabs: Partial<Record<AddedSection, SavedTab & { title: string }>>;
}

/** The admins' sign-in, at /admin. Once signed in, admins edit the added tabs on each name's page. */
@Component({
  selector: 'app-admin',
  imports: [RouterLink, Ornament],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  protected readonly admin = inject(AdminService);
  protected readonly language = inject(LanguageService);
  private readonly book = inject(BookService);
  private readonly sections = inject(SectionsService);
  protected readonly t = this.language.t;

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly busy = signal(false);
  protected readonly problem = signal<SignInProblem | 'noEmail' | null>(null);
  /** The address a password-reset link was sent to. */
  protected readonly resetSentTo = signal<string | null>(null);
  protected readonly backingUp = signal(false);
  /** How the last backup went: how many tabs it held, or 'failed'. */
  protected readonly backup = signal<{ count: number } | 'failed' | null>(null);

  constructor() {
    const title = inject(Title);
    effect(() => title.setTitle(`${this.t().adminTitle} | ${this.t().appTitle}`));
  }

  protected async signIn(event: Event): Promise<void> {
    event.preventDefault();
    if (this.busy()) return;
    this.busy.set(true);
    this.problem.set(null);
    this.resetSentTo.set(null);
    try {
      await this.admin.signIn(this.email(), this.password());
      this.password.set('');
    } catch (problem) {
      this.problem.set(problem as SignInProblem);
    } finally {
      this.busy.set(false);
    }
  }

  /** Sends a link to set a new password, to the address typed in. */
  protected async forgotPassword(): Promise<void> {
    const email = this.email().trim();
    this.resetSentTo.set(null);
    if (!email) {
      this.problem.set('noEmail');
      return;
    }
    this.busy.set(true);
    this.problem.set(null);
    try {
      await this.admin.sendPasswordReset(email);
      this.resetSentTo.set(email);
    } catch (problem) {
      this.problem.set(problem as SignInProblem);
    } finally {
      this.busy.set(false);
    }
  }

  protected async signOut(): Promise<void> {
    await this.admin.signOut();
  }

  /**
   * Downloads one file with every tab the admins have written: in the book's order, each page with
   * its names, and each tab with its title (in Arabic) and when it was saved.
   */
  protected async downloadBackup(): Promise<void> {
    if (this.backingUp()) return;
    this.backingUp.set(true);
    this.backup.set(null);
    try {
      const saved = await this.sections.exportAll();
      const titled = (tabs: Partial<Record<AddedSection, SavedTab>>): BackupPage['tabs'] =>
        Object.fromEntries(
          ADDED_SECTIONS.filter((tab) => tabs[tab]).map((tab) => [tab, { title: UI_TEXT.ar.sections[tab], ...tabs[tab]! }]),
        );
      const pages: BackupPage[] = this.book
        .chapters()
        .filter((c) => saved[c.slug])
        .map((c) => ({ chapter: c.slug, names: this.book.namesOf(c).map((n) => n.name), tabs: titled(saved[c.slug]) }));
      // Anything saved under a page the book no longer has is kept too, at the end.
      for (const [chapter, tabs] of Object.entries(saved)) {
        if (!pages.some((p) => p.chapter === chapter)) pages.push({ chapter, names: [], tabs: titled(tabs) });
      }
      const count = pages.reduce((sum, page) => sum + Object.keys(page.tabs).length, 0);
      const exportedAt = new Date();
      const file = {
        about: 'نسخة احتياطية لما كتبه المشرفون في أقسام صفحات الأسماء — موقع أسماء الله الحسنى',
        firebaseProject: FIREBASE_CONFIG?.projectId ?? null,
        exportedAt: exportedAt.toISOString(),
        tabCount: count,
        pages,
      };
      downloadFile(`asmaa-alhusna-backup-${exportedAt.toISOString().slice(0, 10)}.json`, JSON.stringify(file, null, 2));
      this.backup.set({ count });
    } catch {
      this.backup.set('failed');
    } finally {
      this.backingUp.set(false);
    }
  }
}
