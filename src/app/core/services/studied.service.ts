import { computed, effect, Injectable, signal } from '@angular/core';
import { readStorage, writeStorage } from './storage';

// v2 stores slugs: ids are positions in the list and change whenever the list is reordered.
const KEY = 'asmaa.studied.v2';

/** Tracks which names the learner has marked as studied (kept in this browser only). */
@Injectable({ providedIn: 'root' })
export class StudiedService {
  private readonly slugs = signal<ReadonlySet<string>>(load());

  readonly count = computed(() => this.slugs().size);

  constructor() {
    effect(() => writeStorage(KEY, JSON.stringify([...this.slugs()])));
  }

  has(slug: string): boolean {
    return this.slugs().has(slug);
  }

  toggle(slug: string): void {
    this.slugs.update((current) => {
      const next = new Set(current);
      if (!next.delete(slug)) next.add(slug);
      return next;
    });
  }
}

function load(): ReadonlySet<string> {
  try {
    const parsed: unknown = JSON.parse(readStorage(KEY) ?? '[]');
    return new Set(Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : []);
  } catch {
    return new Set();
  }
}
