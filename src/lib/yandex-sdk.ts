
'use client';

/**
 * @fileOverview Mock/Local implementation of the Yandex Games SDK.
 * This file handles persistence via localStorage now that the SDK is removed.
 * See docs/YANDEX_SDK_RESTORE.md for the full SDK implementation.
 */

export interface PlayerStats {
  totalWordsFound: number;
  levelsCleared: number;
  hintsUsed: number;
  lastPlayed: number;
  totalSessions: number;
  longestWord: number;
}

const STATS_KEY = 'lexi_player_stats';
const HIGH_SCORE_KEY = 'lexi_high_score';

export async function initYandexSDK(): Promise<any> {
  console.log('Lexi.AI: Operating in standalone mode (No SDK).');
  return null;
}

export function getYandexSDK(): any {
  return null;
}

export function getPlayerInstance(): any {
  return null;
}

export function signalGameReady() {
  // No-op in standalone
}

export function getEnvironmentLanguage(): string {
  if (typeof navigator !== 'undefined') {
    const rawLang = navigator.language || (navigator as any).userLanguage;
    if (rawLang.toLowerCase().startsWith('ru')) return 'ru';
  }
  return 'en';
}

export async function updatePlayerStats(newStats: Partial<PlayerStats>) {
  try {
    const stats = await fetchPlayerStats() || {
      totalWordsFound: 0,
      levelsCleared: 0,
      hintsUsed: 0,
      totalSessions: 0,
      longestWord: 0,
      lastPlayed: Date.now()
    };
    
    const updated = {
      ...stats,
      totalWordsFound: stats.totalWordsFound + (newStats.totalWordsFound || 0),
      levelsCleared: stats.levelsCleared + (newStats.levelsCleared || 0),
      hintsUsed: stats.hintsUsed + (newStats.hintsUsed || 0),
      totalSessions: stats.totalSessions + (newStats.totalSessions || 0),
      longestWord: Math.max(stats.longestWord, newStats.longestWord || 0),
      lastPlayed: Date.now()
    };

    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to update local stats:', e);
  }
}

export async function fetchPlayerStats(): Promise<PlayerStats | null> {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export async function requestReview() {
  // No-op
}

export async function createShortcut() {
  // No-op
}

export async function syncHighScoreToYandex(score: number) {
  localStorage.setItem(HIGH_SCORE_KEY, score.toString());
}

export async function reportScoreToLeaderboard(score: number) {
  // No-op (Requires SDK)
}

export async function fetchLeaderboardEntries(limit = 10) {
  // Mock empty response for standalone
  return { entries: [] };
}

export async function fetchHighScoreFromYandex(): Promise<number | null> {
  const saved = localStorage.getItem(HIGH_SCORE_KEY);
  return saved ? parseInt(saved) : 0;
}
