import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { DivineName } from '../models/divine-name';

/** Reads the names "database" — a static JSON file served from `public/data`. */
@Injectable({ providedIn: 'root' })
export class NamesService {
  private readonly resource = httpResource<DivineName[]>(() => 'data/names.json', {
    defaultValue: [],
  });

  // value() throws while the resource is in an error state, so guard with hasValue().
  readonly names = computed(() =>
    this.resource.hasValue() ? [...this.resource.value()].sort((a, b) => a.id - b.id) : [],
  );
  readonly isLoading = this.resource.isLoading;
  readonly error = this.resource.error;

  /** Changes on each calendar day, so every visitor sees the same name that day. */
  readonly nameOfTheDay = computed(() => {
    const names = this.names();
    if (!names.length) return undefined;
    const day = Math.floor(Date.now() / 86_400_000);
    return names[day % names.length];
  });

  bySlug(slug: string): DivineName | undefined {
    return this.names().find((n) => n.slug === slug);
  }

  neighbours(slug: string): { prev?: DivineName; next?: DivineName } {
    const names = this.names();
    const i = names.findIndex((n) => n.slug === slug);
    if (i === -1) return {};
    return { prev: names[i - 1], next: names[i + 1] };
  }
}
