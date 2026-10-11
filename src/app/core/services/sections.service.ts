import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { database, firebaseEnabled } from '../firebase/firebase';
import { ADDED_SECTIONS, AddedSection, SectionText } from '../models/divine-name';

/** A tab as saved, with when (ISO time; null if unknown), for the admins' backup. */
export interface SavedTab extends SectionText {
  updatedAt: string | null;
}

/** A chapter's added tabs, as loaded from the database. */
export type AddedTabs =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; tabs: Partial<Record<AddedSection, SectionText>> };

/** The longest text a tab may hold, per language (the database rules hold to the same). */
export const MAX_SECTION_LENGTH = 40_000;

/** Names an unsaved edit: "chapter/tab". */
export function draftKey(chapter: string, tab: AddedSection): string {
  return `${chapter}/${tab}`;
}

/**
 * The tabs the admins write (all but «معنى الاسم»), kept in Firestore: one document per chapter,
 * sections/{chapter slug}, with a field per tab holding { ar, en, updatedAt }. Anyone may read
 * them; only admins may write (firestore.rules).
 */
@Injectable({ providedIn: 'root' })
export class SectionsService {
  private readonly loaded = new Map<string, WritableSignal<AddedTabs>>();

  /** Unsaved edits, by draftKey: kept while the admin moves between tabs or pages, until saved or dropped. */
  readonly drafts = signal<Readonly<Record<string, SectionText>>>({});

  constructor() {
    // Ask before leaving the site with unsaved edits.
    addEventListener('beforeunload', (event) => {
      if (Object.keys(this.drafts()).length) event.preventDefault();
    });
  }

  /** A chapter's added tabs, fetched the first time they are asked for. */
  of(slug: string): Signal<AddedTabs> {
    let state = this.loaded.get(slug);
    if (!state) {
      state = signal<AddedTabs>(firebaseEnabled ? { status: 'loading' } : { status: 'ready', tabs: {} });
      this.loaded.set(slug, state);
      if (firebaseEnabled) void this.load(slug, state);
    }
    return state;
  }

  /** Tries again after a failed load. */
  retry(slug: string): void {
    const state = this.loaded.get(slug);
    if (state?.().status !== 'error') return;
    state.set({ status: 'loading' });
    void this.load(slug, state);
  }

  private async load(slug: string, state: WritableSignal<AddedTabs>): Promise<void> {
    try {
      const [db, { doc, getDoc }] = await Promise.all([database(), import('firebase/firestore/lite')]);
      const snapshot = await getDoc(doc(db, 'sections', slug));
      state.set({ status: 'ready', tabs: readTabs(snapshot.data()) });
    } catch {
      state.set({ status: 'error' });
    }
  }

  /** Saves one tab. Empty Arabic removes it, so the tab shows as coming soon again. */
  async save(slug: string, tab: AddedSection, text: SectionText): Promise<void> {
    const ar = text.ar.trim();
    const en = ar ? text.en.trim() : '';
    const [db, { doc, setDoc, deleteField, serverTimestamp }] = await Promise.all([
      database(),
      import('firebase/firestore/lite'),
    ]);
    await setDoc(
      doc(db, 'sections', slug),
      { [tab]: ar ? { ar, en, updatedAt: serverTimestamp() } : deleteField() },
      { merge: true },
    );
    const state = this.loaded.get(slug);
    const current = state?.();
    if (state && current?.status === 'ready') {
      const tabs = { ...current.tabs };
      if (ar) tabs[tab] = { ar, en };
      else delete tabs[tab];
      state.set({ status: 'ready', tabs });
    }
  }

  /** Every chapter's added tabs, straight from the database (one read per chapter), for a backup. */
  async exportAll(): Promise<Record<string, Partial<Record<AddedSection, SavedTab>>>> {
    const [db, { collection, getDocs }] = await Promise.all([database(), import('firebase/firestore/lite')]);
    const snapshot = await getDocs(collection(db, 'sections'));
    const all: Record<string, Partial<Record<AddedSection, SavedTab>>> = {};
    for (const document of snapshot.docs) {
      const data = document.data();
      const tabs: Partial<Record<AddedSection, SavedTab>> = {};
      for (const [key, text] of Object.entries(readTabs(data)) as [AddedSection, SectionText][]) {
        const when = (data[key] as { updatedAt?: { toDate?: () => Date } }).updatedAt?.toDate?.();
        tabs[key] = { ...text, updatedAt: when ? when.toISOString() : null };
      }
      if (Object.keys(tabs).length) all[document.id] = tabs;
    }
    return all;
  }

  /** Keeps (or, with null, drops) an unsaved edit. */
  setDraft(key: string, text: SectionText | null): void {
    this.drafts.update((drafts) => {
      const next = { ...drafts };
      if (text) next[key] = text;
      else delete next[key];
      return next;
    });
  }
}

/** The tabs in a chapter's document; anything else in it is ignored. */
function readTabs(data: Record<string, unknown> | undefined): Partial<Record<AddedSection, SectionText>> {
  const tabs: Partial<Record<AddedSection, SectionText>> = {};
  for (const key of ADDED_SECTIONS) {
    const value = data?.[key] as { ar?: unknown; en?: unknown } | undefined;
    if (typeof value?.ar === 'string' && value.ar.trim()) {
      tabs[key] = { ar: value.ar, en: typeof value.en === 'string' ? value.en : '' };
    }
  }
  return tabs;
}
