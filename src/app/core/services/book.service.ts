import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { Chapter, DivineName } from '../models/divine-name';

/** Reads the book — static JSON files served from `public/data`. */
@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly chaptersResource = httpResource<Chapter[]>(() => 'data/book.json', { defaultValue: [] });
  private readonly namesResource = httpResource<DivineName[]>(() => 'data/names.json', { defaultValue: [] });

  // value() throws while a resource is in an error state, so guard with hasValue().
  readonly chapters = computed(() => (this.chaptersResource.hasValue() ? this.chaptersResource.value() : []));
  readonly names = computed(() => (this.namesResource.hasValue() ? this.namesResource.value() : []));
  readonly isLoading = computed(() => this.chaptersResource.isLoading() || this.namesResource.isLoading());
  readonly error = computed(() => this.chaptersResource.error() ?? this.namesResource.error());

  /** Changes on each calendar day, so every visitor sees the same name that day. */
  readonly nameOfTheDay = computed(() => {
    const names = this.names();
    if (!names.length) return undefined;
    return names[Math.floor(Date.now() / 86_400_000) % names.length];
  });

  chapter(slug: string): Chapter | undefined {
    return this.chapters().find((c) => c.slug === slug);
  }

  name(slug: string): DivineName | undefined {
    return this.names().find((n) => n.slug === slug);
  }

  /** The names a chapter explains, in the book's order. */
  namesOf(chapter: Chapter): DivineName[] {
    return chapter.names.map((slug) => this.name(slug)).filter((n): n is DivineName => !!n);
  }

  neighbours(slug: string): { prev?: Chapter; next?: Chapter } {
    const chapters = this.chapters();
    const i = chapters.findIndex((c) => c.slug === slug);
    if (i === -1) return {};
    return { prev: chapters[i - 1], next: chapters[i + 1] };
  }
}

/** Words in a chapter (Arabic), for the reading-time estimate. */
export function wordCount(chapter: Chapter): number {
  return chapter.blocks.reduce((sum, b) => sum + b.text.ar.split(/\s+/).length, 0);
}
