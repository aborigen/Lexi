/**
 * @fileOverview Defines the core interface for a game level.
 */

export interface WordLevel {
  letters: string[];
  validWords: string[];
  lang: 'en' | 'ru';
  hints: Record<string, string>;
}
