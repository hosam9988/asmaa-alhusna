export type Theme = 'black' | 'white' | 'blue' | 'navy' | 'pink';

export interface ThemeOption {
  id: Theme;
  /** Page background, used for the swatch and the browser's `theme-color`. */
  background: string;
}

/** Order shown in the picker. Must match the `[data-theme]` blocks in styles.scss. */
export const THEMES: readonly ThemeOption[] = [
  { id: 'black', background: '#0a0907' },
  { id: 'white', background: '#faf7f0' },
  { id: 'blue', background: '#15396d' },
  { id: 'navy', background: '#070e1f' },
  { id: 'pink', background: '#fcecf2' },
];
