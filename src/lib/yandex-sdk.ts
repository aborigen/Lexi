'use client';

/**
 * @fileOverview Multi-Platform SDK Bridge for Lexi.AI.
 * 
 * This refactored bridge uses a Strategy-like pattern to handle platform-specific
 * implementations for Yandex Games, VK Mini Apps, and Sber Salute.
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
 * Internal helper to load scripts dynamically.
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return resolve();
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Initializes the specific platform SDK.
 */
export async function initYandexSDK(): Promise<any> {
  if (typeof window === 'undefined') return null;

  console.log(`[Lexi Bridge] Initializing Platform: ${PLATFORM.toUpperCase()}`);

  try {
    switch (PLATFORM) {
      case 'yandex':
        await loadScript('https://yandex.ru/games/sdk/v2');
        if ((window as any).YaGames) {
          sdkInstance = await (window as any).YaGames.init();
          playerInstance = await sdkInstance.getPlayer({ scopes: false });
          console.log('[Lexi Bridge] Yandex SDK Ready');
        }
        break;

      case 'vk':
        await loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js');
        if ((window as any).vkBridge) {
          sdkInstance = (window as any).vkBridge;
          await sdkInstance.send('VKWebAppInit');
          console.log('[Lexi Bridge] VK Bridge Ready');
        }
        break;

      case 'sber':
        // Sber Salute Assistant Client
        await loadScript('https://smart-display.sberdevices.ru/assistant-client.js');
        if ((window as any).assistant) {
          // The assistant global is often provided by the wrapper or script
          sdkInstance = (window as any).assistant;
        } else if ((window as any).AssistantClient) {
          // Standard creation for Sber devices
          sdkInstance = (window as any).AssistantClient.createAssistant({
            getState: () => ({
              stats: JSON.parse(localStorage.getItem(STATS_KEY) || '{}'),
              highScore: parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0')
            })
          });
          
          // Listen for assistant events (Voice commands, etc)
          sdkInstance.on('data', (event: any) => {
            console.log('[Lexi Bridge] Sber Event:', event);
            if (event.type === 'smart_app_data') {
              // Handle custom voice commands from the Sber Scenario here
            }
          });
        }
        console.log('[Lexi Bridge] Sber Salute Ready');
        break;

      default:
        console.log('[Lexi Bridge] Standalone Mode: Using LocalStorage');
    }
  } catch (err) {
    console.error(`[Lexi Bridge] ${PLATFORM} Initialization failed:`, err);
  }
  return sdkInstance;
}

/**
 * Signals to the platform that the game is loaded and interactive.
 */
export function signalGameReady() {
  if (PLATFORM === 'yandex' && sdkInstance?.features?.LoadingAPI) {
    sdkInstance.features.LoadingAPI.ready();
  } else if (PLATFORM === 'sber') {
    // Sber signaling is handled via initial state or assistant.ready() if available
  }
}

/**
 * Detects the preferred language from the platform environment.
 */
export function getEnvironmentLanguage(): string {
  if (PLATFORM === 'yandex' && sdkInstance) {
    return sdkInstance.environment.i18n.lang === 'ru' ? 'ru' : 'en';
  }
  if (PLATFORM === 'sber' && sdkInstance?.character) {
    // Sber specific character lang if available
    return 'ru'; // Salute is primarily Russian
  }
  if (typeof navigator !== 'undefined') {
    const rawLang = navigator.language || (navigator as any).userLanguage;
    if (rawLang.toLowerCase().startsWith('ru')) return 'ru';
  }
  return 'en';
}

/**
 * Unified persistence for player statistics.
 */
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

  // Local Fallback
  localStorage.setItem(STATS_KEY, JSON.stringify(updated));

  // Platform Routing
  switch (PLATFORM) {
    case 'yandex':
      if (playerInstance) playerInstance.setStats(updated);
      break;
    case 'vk':
      if (sdkInstance) {
        sdkInstance.send('VKWebAppStorageSet', { 
          key: STATS_KEY, 
          value: JSON.stringify(updated) 
        });
      }
      break;
    case 'sber':
      // Sber typically uses sendData to sync state back to the scenario
      if (sdkInstance) {
        sdkInstance.sendData({
          action: 'update_stats',
          stats: updated
        });
      }
      break;
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

/**
 * Unified high score synchronization.
 */
export async function syncHighScoreToYandex(score: number) {
  localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  
  if (PLATFORM === 'yandex' && playerInstance) {
    playerInstance.setData({ highScore: score }, true);
  } else if (PLATFORM === 'sber' && sdkInstance) {
    sdkInstance.sendData({ action: 'new_high_score', score });
  }
}

/**
 * Unified leaderboard reporting.
 */
export async function reportScoreToLeaderboard(score: number) {
  try {
    switch (PLATFORM) {
      case 'yandex':
        if (sdkInstance) {
          // Use modern leaderboards property if available, otherwise getLeaderboards()
          const lbService = sdkInstance.leaderboards || await sdkInstance.getLeaderboards();
          await lbService.setLeaderboardScore('leaders', score);
        }
        break;
      case 'vk':
        if (sdkInstance) {
          sdkInstance.send('VKWebAppShowLeaderBoardBox', { user_result: score });
        }
        break;
      case 'sber':
        // Sber usually manages leaderboards via their cloud logic linked to the assistant
        if (sdkInstance) {
          sdkInstance.sendData({ action: 'report_score', score });
        }
        break;
    }
  } catch (e) {
    console.warn('[Lexi Bridge] Leaderboard report failed', e);
  }
}

/**
 * Fetches entries from the platform leaderboard.
 */
export async function fetchLeaderboardEntries(limit = 10) {
  try {
    if (PLATFORM === 'yandex' && sdkInstance) {
      const lbService = sdkInstance.leaderboards || await sdkInstance.getLeaderboards();
      return await lbService.getLeaderboardEntries('leaders', { quantityTop: limit });
    }
  } catch (e) {
    console.error('[Lexi Bridge] Fetch leaderboard failed:', e);
  }
  return { entries: [] };
}

export function getPlayerInstance(): any {
  return playerInstance;
}
