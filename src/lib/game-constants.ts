
/**
 * @fileOverview Global constants for all game modules.
 */

// Word Connect Constants
export const CIRCLE_RADIUS = 105;
export const LETTER_RADIUS = 30;
export const INTERACTION_BUFFER = 30; // Buffer to prevent letter clipping

// Columns Game Constants
export const GRID_WIDTH = 6;
export const GRID_HEIGHT = 13;
export const TICK_RATE_INITIAL = 800;
export const TICK_RATE_MIN = 150;
export const TICK_RATE_DECREMENT = 5;

export const GEM_TYPES = [
  { id: 1, label: '💎', color: '#4FC3F7', shadow: '#0288D1' },
  { id: 2, label: '🍊', color: '#FFB74D', shadow: '#F57C00' },
  { id: 3, label: '🍇', color: '#BA68C8', shadow: '#7B1FA2' },
  { id: 4, label: '🌟', color: '#FFF176', shadow: '#FBC02D' },
  { id: 5, label: '🍀', color: '#81C784', shadow: '#388E3C' },
  { id: 6, label: '❤️', color: '#E57373', shadow: '#D32F2F' }
];

// Pulp Drop (Matter.js) Constants
export const ARENA_WIDTH = 320;
export const ARENA_HEIGHT = 480;
export const DROP_STAGING_HEIGHT = 60;
export const GAME_OVER_LINE_Y = 100;

export const FRUIT_TIERS = [
  { type: 'cherry', label: '🍒', radius: 12, score: 2, color: '#FF1744', tier: 1 },
  { type: 'strawberry', label: '🍓', radius: 18, score: 4, color: '#F48FB1', tier: 2 },
  { type: 'grape', label: '🍇', radius: 24, score: 8, color: '#9C27B0', tier: 3 },
  { type: 'dekopon', label: '🍊', radius: 30, score: 16, color: '#FFA000', tier: 4 },
  { type: 'orange', label: '🍊', radius: 38, score: 32, color: '#FF6D00', tier: 5 },
  { type: 'apple', label: '🍎', radius: 46, score: 64, color: '#D50000', tier: 6 },
  { type: 'pear', label: '🍐', radius: 54, score: 128, color: '#AEEA00', tier: 7 },
  { type: 'peach', label: '🍑', radius: 64, score: 256, color: '#FF8A80', tier: 8 },
  { type: 'pineapple', label: '🍍', radius: 76, score: 512, color: '#FFD600', tier: 9 },
  { type: 'melon', label: '🍈', radius: 88, score: 1024, color: '#00E676', tier: 10 },
  { type: 'watermelon', label: '🍉', radius: 100, score: 2048, color: '#1B5E20', tier: 11 }
];
