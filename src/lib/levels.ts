import { WordLevel } from './levels/types';
import enLevels from './levels/en.json';
import ruLevels from './levels/ru.json';

export type { WordLevel };

/**
 * @fileOverview Unified export for all game levels, now loaded from JSON.
 */

export const LEVELS: WordLevel[] = [
  ...(enLevels as WordLevel[]),
  ...(ruLevels as WordLevel[])
];
