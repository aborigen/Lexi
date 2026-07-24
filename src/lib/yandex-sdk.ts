'use client';

/**
 * @fileOverview Utility for interacting with the Yandex Games SDK V2.
 */

export interface PlayerStats {
  totalWordsFound: number;
  levelsCleared: number;
  hintsUsed: number;
  lastPlayed: number;
}

export interface YandexStorage {
  get: (keys: string[]) => Promise<Record<string, any>>;
  set: (data: Record<string, any>) => Promise<void>;
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
      onError?: (error: any) => void;
    }) => void;
  };
  getStorage: () => Promise<YandexStorage>;
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

/**
 * Initializes the Yandex Games SDK V2.
 */
export async function initYandexSDK(): Promise<YandexSDK | null> {
  if (typeof window === 'undefined') return null;
  if (yandexInstance) return yandexInstance;

  return new Promise((resolve) => {
    // @ts-ignore
    if (typeof window.YaGames !== 'undefined') {
      // @ts-ignore
      window.YaGames.init().then((sdk: YandexSDK) => {
        yandexInstance = sdk;
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

export function signalGameReady() {
  const sdk = getYandexSDK();
  if (sdk?.features?.LoadingAPI) {
    sdk.features.LoadingAPI.ready();
    console.log('Yandex Games V2: LoadingAPI.ready() signaled');
  }
}

export function getEnvironmentLanguage(): string {
  const sdk = getYandexSDK();
  const rawLang = sdk?.environment?.i18n?.lang || 'en';
  if (rawLang.toLowerCase().startsWith('ru')) return 'ru';
  return 'en';
}

/**
 * Updates player statistics in Yandex Cloud Storage.
 */
export async function updatePlayerStats(newStats: Partial<PlayerStats>) {
  const sdk = getYandexSDK();
  if (!sdk) return;

  try {
    const storage = await sdk.getStorage();
    const currentData = await storage.get(['stats']);
    const stats: PlayerStats = currentData.stats || {
      totalWordsFound: 0,
      levelsCleared: 0,
      hintsUsed: 0,
      lastPlayed: Date.now()
    };

    const updatedStats: PlayerStats = {
      totalWordsFound: stats.totalWordsFound + (newStats.totalWordsFound || 0),
      levelsCleared: stats.levelsCleared + (newStats.levelsCleared || 0),
      hintsUsed: stats.hintsUsed + (newStats.hintsUsed || 0),
      lastPlayed: Date.now()
    };

    await storage.set({ stats: updatedStats });
    console.log('Player statistics updated in Yandex Cloud');
  } catch (e) {
    console.warn('Failed to update player stats:', e);
  }
}

/**
 * Fetches player statistics from Yandex Cloud Storage.
 */
export async function fetchPlayerStats(): Promise<PlayerStats | null> {
  const sdk = getYandexSDK();
  if (!sdk) return null;

  try {
    const storage = await sdk.getStorage();
    const data = await storage.get(['stats']);
    return data.stats || null;
  } catch (e) {
    console.warn('Failed to fetch player stats:', e);
    return null;
  }
}

export async function syncHighScoreToYandex(score: number) {
  const sdk = getYandexSDK();
  if (!sdk) return;

  try {
    const storage = await sdk.getStorage();
    const data = await storage.get(['highScore']);
    const currentHigh = data?.highScore || 0;

    if (score > currentHigh) {
      await storage.set({ highScore: score });
    }
  } catch (e) {
    console.warn('Failed to sync high score:', e);
  }
}

export async function reportScoreToLeaderboard(score: number) {
  const sdk = getYandexSDK();
  if (!sdk) return;

  try {
    const lb = await sdk.getLeaderboards();
    await lb.setLeaderboardScore('leaders', score);
  } catch (e) {
    console.warn('Failed to report score:', e);
  }
}

export async function fetchLeaderboardEntries(limit = 10) {
  const sdk = getYandexSDK();
  if (!sdk) return null;

  try {
    const lb = await sdk.getLeaderboards();
    return await lb.getLeaderboardEntries('leaders', { 
      includeUser: true, 
      quantityTop: limit 
    });
  } catch (e) {
    console.warn('Failed to fetch leaderboard:', e);
    return null;
  }
}

export async function fetchHighScoreFromYandex(): Promise<number | null> {
  const sdk = getYandexSDK();
  if (!sdk) return null;

  try {
    const storage = await sdk.getStorage();
    const data = await storage.get(['highScore']);
    return (data && typeof data.highScore === 'number') ? data.highScore : 0;
  } catch (e) {
    console.warn('Failed to fetch high score:', e);
    return null;
  }
}
