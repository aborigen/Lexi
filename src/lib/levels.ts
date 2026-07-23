import { WordLevel } from './levels/types';
import { LEVELS_EN } from './levels/en';
import { LEVELS_RU } from './levels/ru';

export type { WordLevel };

/**
 * @fileOverview Unified export for all game levels.
 */

export const LEVELS: WordLevel[] = [
  ...LEVELS_EN,
  ...LEVELS_RU
];
