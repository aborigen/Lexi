
'use client';

/**
 * @fileOverview Utility for interacting with the Yandex Games SDK V2.
 * Uses the Player object for robust data persistence and follows modern V2 patterns.
 */

export interface PlayerStats {
  totalWordsFound: number;
  levelsCleared: number;
  hintsUsed: number;
  lastPlayed: number;
  totalSessions: number;
  longestWord: number;
}

export interface YandexPlayer {
  setData: (data: Record<string, any>, flush?: boolean) => Promise<void>;
  getData: (keys?: string[]) => Promise<Record<string, any>>;
  setStats: (stats: Record<string, number>) => Promise<void>;
  getStats: (keys?: string[]) => Promise<Record<string, number>>;
  getAvatarSrc: (size: 'small' | 'medium' | 'large') => string;
  publicName: string;
}

export interface YandexLeaderboards {
  setLeaderboardScore: (name: string, score: number, extraData?: string) => Promise<void>;
  getLeaderboardPlayerEntry: (name: string) => Promise<any>;
  getLeaderboardEntries: (name: string, options?: {
    includeUser?: boolean;
    quantityAround?: number;
    quantityTop?: number;
  }) => Promise<any>;
}

export interface YandexSDK {
  auth: {
    getPlayerData: () => Promise<any>;
    openAuthDialog: () => Promise<void>;
  };
  getLeaderboards: () => Promise<YandexLeaderboards>;
  adv: {
    showFullscreenAdv: (callbacks?: {
      onOpen?: () => void;
      onClose?: (wasShown: boolean) => void;
      onError?: (error: any) => void;
      onOffline?: () => void;
    }) => void;
    showRewardedVideo: (callbacks?: {
      onOpen?: () => void;
      onRewarded?: () => void;
      onClose?: () => void;
    }) => void;
  };
  getPlayer: (options?: { scopes?: boolean }) => Promise<YandexPlayer>;
  feedback?: {
    canReview: () => Promise<{ value: boolean; reason?: string }>;
    requestReview: () => Promise<{ feedbackSent: boolean }>;
  };
  shortcut?: {
    canShowPrompt: () => Promise<{ canShow: boolean }>;
    showPrompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
  };
  features: {
    LoadingAPI?: {
      ready: () => void;
    };
  };
  environment: {
    i18n: {
      lang: string;
      tld: string;
    };
  };
}

let yandexInstance: YandexSDK | null = null;
let playerInstance: YandexPlayer | null = null;
let lbInstance: YandexLeaderboards | null = null;

/**
 * Initializes the Yandex Games SDK V2 and the Player object.
 */
export async function initYandexSDK(): Promise<YandexSDK | null> {
  if (typeof window === 'undefined') return null;
  if (yandexInstance) return yandexInstance;

  return new Promise((resolve) => {
    // @ts-ignore
    if (typeof window.YaGames !== 'undefined') {
      // @ts-ignore
      window.YaGames.init().then(async (sdk: YandexSDK) => {
        yandexInstance = sdk;
        try {
          // Initialize player silently to enable data features
          playerInstance = await sdk.getPlayer({ scopes: false });
        } catch (e) {
          console.warn('Yandex Player init failed (common in local or private modes):', e);
        }
        console.log('Yandex SDK V2 initialized successfully');
        resolve(sdk);
      }).catch((e: any) => {
        console.error('Yandex SDK V2 failed to initialize:', e);
        resolve(null);
      });
    } else {
      console.warn('Yandex Games V2 script not found on window.');
      resolve(null);
    }
  });
}

export function getYandexSDK(): YandexSDK | null {
  return yandexInstance;
}

export function getPlayerInstance(): YandexPlayer | null {
  return playerInstance;
}

/**
 * Signals to Yandex V2 that the game is ready and loading is complete.
 */
export function signalGameReady() {
  const sdk = getYandexSDK();
  if (sdk?.features?.LoadingAPI) {
    try {
      sdk.features.LoadingAPI.ready();
    } catch (e) {
      console.error('Failed to signal LoadingAPI.ready():', e);
    }
  }
}

/**
 * Retrieves the language from the Yandex environment.
 */
export function getEnvironmentLanguage(): string {
  const sdk = getYandexSDK();
  const rawLang = sdk?.environment?.i18n?.lang || 
                 (typeof navigator !== 'undefined' ? (navigator.language || (navigator as any).userLanguage) : 'en');
  
  if (rawLang.toLowerCase().startsWith('ru')) return 'ru';
  return 'en';
}

/**
 * Updates player statistics in Yandex Cloud Storage using the Player object.
 */
export async function updatePlayerStats(newStats: Partial<PlayerStats>) {
  if (!playerInstance) return;

  try {
    const stats = await playerInstance.getStats(['totalWordsFound', 'levelsCleared', 'hintsUsed', 'totalSessions', 'longestWord']);
    
    const updatedStats = {
      totalWordsFound: (Number(stats?.totalWordsFound) || 0) + (newStats.totalWordsFound || 0),
      levelsCleared: (Number(stats?.levelsCleared) || 0) + (newStats.levelsCleared || 0),
      hintsUsed: (Number(stats?.hintsUsed) || 0) + (newStats.hintsUsed || 0),
      totalSessions: (Number(stats?.totalSessions) || 0) + (newStats.totalSessions || 0),
      longestWord: Math.max(Number(stats?.longestWord) || 0, newStats.longestWord || 0)
    };

    await playerInstance.setStats(updatedStats);
  } catch (e) {
    console.warn('Failed to update player stats:', e);
  }
}

/**
 * Fetches player statistics from Yandex Cloud Storage.
 */
export async function fetchPlayerStats(): Promise<PlayerStats | null> {
  if (!playerInstance) return null;

  try {
    const stats = await playerInstance.getStats(['totalWordsFound', 'levelsCleared', 'hintsUsed', 'totalSessions', 'longestWord']);
    return {
      totalWordsFound: Number(stats?.totalWordsFound) || 0,
      levelsCleared: Number(stats?.levelsCleared) || 0,
      hintsUsed: Number(stats?.hintsUsed) || 0,
      totalSessions: Number(stats?.totalSessions) || 0,
      longestWord: Number(stats?.longestWord) || 0,
      lastPlayed: Date.now()
    };
  } catch (e) {
    console.warn('Failed to fetch player stats:', e);
    return null;
  }
}

/**
 * Prompts the user to leave a review.
 */
export async function requestReview() {
  const sdk = getYandexSDK();
  if (!sdk || !sdk.feedback) return;

  try {
    const { value } = await sdk.feedback.canReview();
    if (value) {
      await sdk.feedback.requestReview();
    }
  } catch (e) {
    console.warn('Failed to request review:', e);
  }
}

/**
 * Prompts the user to create a desktop shortcut.
 */
export async function createShortcut() {
  const sdk = getYandexSDK();
  if (!sdk || !sdk.shortcut) return;

  try {
    const { canShow } = await sdk.shortcut.canShowPrompt();
    if (canShow) {
      await sdk.shortcut.showPrompt();
    }
  } catch (e) {
    console.warn('Failed to show shortcut prompt:', e);
  }
}

export async function syncHighScoreToYandex(score: number) {
  if (!playerInstance) return;

  try {
    const data = await playerInstance.getData(['highScore']);
    const currentHigh = Number(data?.highScore) || 0;

    if (score > currentHigh) {
      await playerInstance.setData({ highScore: score });
    }
  } catch (e) {
    console.warn('Failed to sync high score:', e);
  }
}

export async function reportScoreToLeaderboard(score: number) {
  const sdk = getYandexSDK();
  if (!sdk) return;

  try {
    if (!lbInstance) {
      lbInstance = await sdk.getLeaderboards();
    }
    await lbInstance.setLeaderboardScore('leaders', score);
  } catch (e) {
    console.warn('Failed to report score to leaderboard:', e);
  }
}

export async function fetchLeaderboardEntries(limit = 10) {
  const sdk = getYandexSDK();
  if (!sdk) return null;

  try {
    if (!lbInstance) {
      lbInstance = await sdk.getLeaderboards();
    }
    return await lbInstance.getLeaderboardEntries('leaders', { 
      includeUser: true, 
      quantityTop: limit 
    });
  } catch (e) {
    console.warn('Failed to fetch leaderboard:', e);
    return null;
  }
}

export async function fetchHighScoreFromYandex(): Promise<number | null> {
  if (!playerInstance) return null;

  try {
    const data = await playerInstance.getData(['highScore']);
    return (data && typeof data.highScore === 'number') ? data.highScore : 0;
  } catch (e) {
    console.warn('Failed to fetch high score from Yandex:', e);
    return null;
  }
}
