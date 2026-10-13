
'use client';

/**
 * @fileOverview Multi-Platform SDK Bridge for Lexi.AI.
 * 
 * This bridge abstracts platform-specific APIs (Yandex, VK, Sber) 
 * into a single unified interface. The active platform is determined 
 * by the NEXT_PUBLIC_GAME_PLATFORM environment variable.
 */

export interface PlayerStats {
  totalWordsFound: number;
  levelsCleared: number;
  hintsUsed: number;
  lastPlayed: number;
  totalSessions: number;
  longestWord: number;
}

type GamePlatform = 'standalone' | 'yandex' | 'vk' | 'sber';

const PLATFORM: GamePlatform = (process.env.NEXT_PUBLIC_GAME_PLATFORM as GamePlatform) || 'standalone';
const STATS_KEY = 'lexi_player_stats';
const HIGH_SCORE_KEY = 'lexi_high_score';

let sdkInstance: any = null;
let playerInstance: any = null;

/**
 * Loads the platform-specific script dynamically.
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}

export async function initYandexSDK(): Promise<any> {
  if (typeof window === 'undefined') return null;

  console.log(`Lexi.AI: Initializing for platform: ${PLATFORM}`);

  try {
    switch (PLATFORM) {
      case 'yandex':
        await loadScript('https://yandex.ru/games/sdk/v2');
        if ((window as any).YaGames) {
          sdkInstance = await (window as any).YaGames.init();
          playerInstance = await sdkInstance.getPlayer({ scopes: false });
        }
        break;
      case 'vk':
        await loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js');
        if ((window as any).vkBridge) {
          sdkInstance = (window as any).vkBridge;
          await sdkInstance.send('VKWebAppInit');
        }
        break;
      case 'sber':
        await loadScript('https://smart-display.sberdevices.ru/assistant-client.js');
        // Sber Assistant initialization would happen here
        break;
      default:
        console.log('Lexi.AI: Standalone mode active.');
    }
  } catch (err) {
    console.error(`Failed to init ${PLATFORM} SDK:`, err);
  }
  return sdkInstance;
}

export function signalGameReady() {
  if (PLATFORM === 'yandex' && sdkInstance?.features?.LoadingAPI) {
    sdkInstance.features.LoadingAPI.ready();
  }
}

export function getEnvironmentLanguage(): string {
  if (PLATFORM === 'yandex' && sdkInstance) {
    return sdkInstance.environment.i18n.lang === 'ru' ? 'ru' : 'en';
  }
  if (typeof navigator !== 'undefined') {
    const rawLang = navigator.language || (navigator as any).userLanguage;
    if (rawLang.toLowerCase().startsWith('ru')) return 'ru';
  }
  return 'en';
}

export async function updatePlayerStats(newStats: Partial<PlayerStats>) {
  const currentStats = await fetchPlayerStats() || {
    totalWordsFound: 0,
    levelsCleared: 0,
    hintsUsed: 0,
    totalSessions: 0,
    longestWord: 0,
    lastPlayed: Date.now()
  };
  
  const updated = {
    ...currentStats,
    totalWordsFound: currentStats.totalWordsFound + (newStats.totalWordsFound || 0),
    levelsCleared: currentStats.levelsCleared + (newStats.levelsCleared || 0),
    hintsUsed: currentStats.hintsUsed + (newStats.hintsUsed || 0),
    totalSessions: currentStats.totalSessions + (newStats.totalSessions || 0),
    longestWord: Math.max(currentStats.longestWord, newStats.longestWord || 0),
    lastPlayed: Date.now()
  };

  // 1. Save locally
  localStorage.setItem(STATS_KEY, JSON.stringify(updated));

  // 2. Platform specific cloud save
  if (PLATFORM === 'yandex' && playerInstance) {
    playerInstance.setStats(updated);
  } else if (PLATFORM === 'vk' && sdkInstance) {
    // VK Storage example
    sdkInstance.send('VKWebAppStorageSet', { key: STATS_KEY, value: JSON.stringify(updated) });
  }
}

export async function fetchPlayerStats(): Promise<PlayerStats | null> {
  try {
    // Always check local first for speed
    const saved = localStorage.getItem(STATS_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export async function syncHighScoreToYandex(score: number) {
  localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  
  if (PLATFORM === 'yandex' && playerInstance) {
    playerInstance.setData({ highScore: score }, true);
  }
}

export async function reportScoreToLeaderboard(score: number) {
  if (PLATFORM === 'yandex' && sdkInstance) {
    try {
      const lb = await sdkInstance.getLeaderboards();
      lb.setLeaderboardScore('leaders', score);
    } catch (e) {
      console.warn('Leaderboard report failed', e);
    }
  } else if (PLATFORM === 'vk' && sdkInstance) {
    sdkInstance.send('VKWebAppShowLeaderBoardBox', { user_result: score });
  }
}

export async function fetchLeaderboardEntries(limit = 10) {
  if (PLATFORM === 'yandex' && sdkInstance) {
    const lb = await sdkInstance.getLeaderboards();
    return await lb.getLeaderboardEntries('leaders', { quantityTop: limit });
  }
  return { entries: [] };
}

export function getPlayerInstance(): any {
  return playerInstance;
}
