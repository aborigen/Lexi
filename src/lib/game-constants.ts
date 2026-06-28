
export const GRID_WIDTH = 6;
export const GRID_HEIGHT = 13;
export const TICK_RATE_INITIAL = 800;
export const TICK_RATE_MIN = 150;
export const TICK_RATE_DECREMENT = 10;

export interface GemType {
  id: number;
  label: string;
  color: string;
  shadow: string;
  score: number;
}

export const GEM_TYPES: GemType[] = [
  { id: 1, label: '💎', color: '#60A5FA', shadow: 'rgba(96, 165, 250, 0.5)', score: 10 },
  { id: 2, label: '🔴', color: '#F87171', shadow: 'rgba(248, 113, 113, 0.5)', score: 10 },
  { id: 3, label: '💚', color: '#4ADE80', shadow: 'rgba(74, 222, 128, 0.5)', score: 10 },
  { id: 4, label: '🟡', color: '#FACC15', shadow: 'rgba(250, 204, 21, 0.5)', score: 10 },
  { id: 5, label: '🟣', color: '#C084FC', shadow: 'rgba(192, 132, 252, 0.5)', score: 10 },
  { id: 6, label: '⚪', color: '#E2E8F0', shadow: 'rgba(226, 232, 240, 0.5)', score: 10 },
];
