import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { normalizeArabic } from '../core/utils/search';

type Piece =
  | { kind: 'text'; text: string }
  | { kind: 'mark'; text: string }
  | { kind: 'verse'; text: string; ref: string }
  | { kind: 'quote'; text: string }
  | { kind: 'note'; n: number };

// A verse with its reference, «a quotation», or a footnote marker [n]. English verses use ﴾…﴿.
const TOKENS = /(﴿[^﴾]*﴾|﴾[^﴿]*﴿)(\s*\[[^\]\d][^\]]*\])?|(«[^»]*»|“[^”]*”)|\[(\d+)\]/g;

/**
 * One block of the book's text: Qur'an verses in the Mushaf font, long quotations set apart,
 * footnote markers as buttons, and the given names highlighted.
 */
@Component({
  selector: 'app-rich-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (p of pieces(); track $index) {@switch (p.kind) {@case ('verse') {<span class="verse">{{ p.text }}</span>@if (p.ref) {<span class="ref">{{ p.ref }}</span>}} @case ('quote') {<q class="quote">{{ p.text }}</q>} @case ('note') {<button type="button" class="fn" [attr.aria-label]="noteLabel() + ' ' + p.n" (click)="note.emit(p.n)">{{ digits(p.n) }}</button>} @case ('mark') {<mark>{{ p.text }}</mark>} @default {{{ p.text }}}}}`,
  styles: `
    .verse {
      color: var(--verse);
      font-family: var(--font-quran);
      font-size: 1.06em;
      line-height: 2.2;
    }
    // English verse translations keep the colour but use the body font.
    :host-context(html[lang='en']) .verse {
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }
    .ref {
      margin-inline-start: 0.35em;
      color: var(--text-muted);
      font-size: 0.78em;
      white-space: nowrap;
    }
    .quote {
      color: var(--hadith);
      quotes: none;
    }
    .fn {
      display: inline-grid;
      place-items: center;
      min-inline-size: 1.35em;
      block-size: 1.35em;
      margin-inline: 0.1em;
      padding: 0 0.25em;
      vertical-align: super;
      border: 1px solid var(--line-strong);
      border-radius: 999px;
      background: rgb(var(--accent-rgb) / 8%);
      color: var(--gold);
      font: inherit;
      font-size: 0.62em;
      line-height: 1;
      cursor: pointer;
      touch-action: manipulation;
      transition: background-color 0.2s;

      &:hover {
        background: rgb(var(--accent-rgb) / 18%);
      }
    }
    mark {
      background: rgb(var(--accent-rgb) / 14%);
      color: inherit;
      border-radius: 4px;
      padding-inline: 0.1em;
    }
  `,
})
export class RichText {
  readonly text = input.required<string>();
  /** Names to highlight, matched ignoring tashkeel and hamza forms. */
  readonly highlight = input<readonly string[]>([]);
  /** Shown in the footnote buttons' labels. */
  readonly noteLabel = input('');
  /** Arabic-Indic digits on the footnote buttons. */
  readonly arabicDigits = input(true);
  readonly note = output<number>();

  protected readonly pieces = computed<Piece[]>(() => {
    const text = this.text();
    const pieces: Piece[] = [];
    let at = 0;
    for (const m of text.matchAll(TOKENS)) {
      if (m.index > at) pieces.push(...this.marked(text.slice(at, m.index)));
      if (m[1]) pieces.push({ kind: 'verse', text: m[1], ref: (m[2] ?? '').trim() });
      else if (m[3]) {
        // Long quotations (hadiths, the words of the scholars) are set apart; short ones, such as
        // book titles, stay plain.
        if (m[3].split(/\s+/).length >= 6) pieces.push({ kind: 'quote', text: m[3] });
        else pieces.push(...this.marked(m[3]));
      } else pieces.push({ kind: 'note', n: +m[4] });
      at = m.index + m[0].length;
    }
    if (at < text.length) pieces.push(...this.marked(text.slice(at)));
    return pieces;
  });

  protected digits(n: number): string {
    return this.arabicDigits() ? String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]) : String(n);
  }

  /** Splits `text` around whole-word occurrences of the highlighted names. */
  private marked(text: string): Piece[] {
    const names = this.highlight()
      .map((n) => normalizeArabic(n).replace(/^ال/, ''))
      .filter((n) => n.length > 1);
    if (!names.length) return [{ kind: 'text', text }];
    // Letters of `text` without tashkeel, each remembering where it starts in `text`.
    const letters: string[] = [];
    const starts: number[] = [];
    for (let i = 0; i < text.length; i++) {
      const letter = normalizeArabic(text[i]);
      if (letter) {
        letters.push(letter);
        starts.push(i);
      }
    }
    const bare = letters.join('');
    const isLetter = (c: string | undefined) => !!c && /[ء-ي]/.test(c);
    const ranges: [number, number][] = [];
    for (const name of names) {
      for (let k = bare.indexOf(name); k !== -1; k = bare.indexOf(name, k + 1)) {
        const end = k + name.length;
        let s = k;
        if (bare.slice(s - 2, s) === 'ال') s -= 2;
        while (s > 0 && /[وفبلك]/.test(bare[s - 1]) && !isLetter(bare[s - 2])) s--;
        // Whole words only, and only with the article: «الرحيم», not «رحيم» inside a sentence.
        if (isLetter(bare[s - 1]) || isLetter(bare[end]) || bare.slice(k - 2, k) !== 'ال') continue;
        ranges.push([starts[s], end < starts.length ? starts[end] : text.length]);
      }
    }
    ranges.sort((a, b) => a[0] - b[0]);
    const pieces: Piece[] = [];
    let done = 0;
    for (const [begin, end] of ranges) {
      if (begin < done) continue;
      if (begin > done) pieces.push({ kind: 'text', text: text.slice(done, begin) });
      pieces.push({ kind: 'mark', text: text.slice(begin, end) });
      done = end;
    }
    if (done < text.length) pieces.push({ kind: 'text', text: text.slice(done) });
    return pieces;
  }
}
