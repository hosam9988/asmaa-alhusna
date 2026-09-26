import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** An eight-pointed star (Rub el Hizb) holding a short label, typically the name's number. */
@Component({
  selector: 'app-star-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <rect x="21" y="21" width="58" height="58" />
      <rect x="21" y="21" width="58" height="58" transform="rotate(45 50 50)" />
      <circle cx="50" cy="50" r="24" />
    </svg>
    <span>{{ label() }}</span>
  `,
  styles: `
    :host {
      position: relative;
      display: inline-grid;
      place-items: center;
      inline-size: var(--badge-size, 3rem);
      aspect-ratio: 1;
      flex-shrink: 0;
    }
    svg {
      position: absolute;
      inset: 0;
      overflow: visible;
    }
    rect {
      fill: var(--black);
      stroke: var(--gold);
      stroke-width: 2.5;
    }
    circle {
      fill: none;
      stroke: var(--gold-deep);
      stroke-width: 1;
    }
    span {
      position: relative;
      font-family: var(--font-display-en);
      font-weight: 600;
      font-size: calc(var(--badge-size, 3rem) * 0.3);
      color: var(--gold-light);
      line-height: 1;
    }
  `,
})
export class StarBadge {
  readonly label = input.required<string>();
}
