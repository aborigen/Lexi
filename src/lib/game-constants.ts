
export interface FruitDefinition {
  type: string;
  tier: number;
  radius: number;
  color: string;
  score: number;
  label: string;
}

export const FRUIT_TIERS: FruitDefinition[] = [
  { type: 'cherry', tier: 0, radius: 15, color: '#FF4D4D', score: 2, label: '🍒' },
  { type: 'strawberry', tier: 1, radius: 22, color: '#FF5C8A', score: 4, label: '🍓' },
  { type: 'grape', tier: 2, radius: 28, color: '#B57EDC', score: 6, label: '🍇' },
  { type: 'orange', tier: 3, radius: 35, color: '#FFA500', score: 10, label: '🍊' },
  { type: 'persimmon', tier: 4, radius: 42, color: '#FF7F50', score: 15, label: '🍅' },
  { type: 'apple', tier: 5, radius: 50, color: '#FF2D2D', score: 22, label: '🍎' },
  { type: 'pear', tier: 6, radius: 60, color: '#D1E231', score: 30, label: '🍐' },
  { type: 'peach', tier: 7, radius: 72, color: '#FFB07C', score: 45, label: '🍑' },
  { type: 'pineapple', tier: 8, radius: 85, color: '#FFD700', score: 65, label: '🍍' },
  { type: 'melon', tier: 9, radius: 100, color: '#90EE90', score: 95, label: '🍈' },
  { type: 'watermelon', tier: 10, radius: 120, color: '#2E8B57', score: 150, label: '🍉' },
];

export const ARENA_WIDTH = 400;
export const ARENA_HEIGHT = 650;
export const DROP_STAGING_HEIGHT = 80;
export const GAME_OVER_LINE_Y = 130;
