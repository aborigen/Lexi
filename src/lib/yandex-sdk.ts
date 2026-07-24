'use client';

/**
 * @fileOverview Utility for interacting with the Yandex Games SDK V2.
 */

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
    // Check for global YaGames object injected by the V2 script
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
      console.warn('Yandex Games V2 script not found on window. Ensure https://yandex.ru/games/sdk/v2 is loaded.');
      resolve(null);
    }
  });
}

/**
 * Returns the current Yandex SDK instance if initialized.
 */
export function getYandexSDK(): YandexSDK | null {
  return yandexInstance;
}

/**
 * Signals to Yandex Games that the game has finished loading and is ready for interaction.
 * Crucial for V2 compliance.
 */
export function signalGameReady() {
  const sdk = getYandexSDK();
  if (sdk?.features?.LoadingAPI) {
    sdk.features.LoadingAPI.ready();
    console.log('Yandex Games V2: LoadingAPI.ready() signaled');
  }
}

/**
 * Gets the environment language from Yandex SDK and maps to supported app languages.
 */
export function getEnvironmentLanguage(): string {
  const sdk = getYandexSDK();
  const rawLang = sdk?.environment?.i18n?.lang || 'en';
  // Normalize to supported codes
  if (rawLang.toLowerCase().startsWith('ru')) return 'ru';
  return 'en';
}

/**
 * Syncs the high score to Yandex Cloud Storage.
 */
export async function syncHighScoreToYandex(score: number) {
  const sdk = getYandexSDK();
  if (!sdk) return;

  try {
    const storage = await sdk.getStorage();
    const data = await storage.get(['highScore']);
    const currentHigh = data?.highScore || 0;

    if (score > currentHigh) {
      await storage.set({ highScore: score });
      console.log('High score updated in Yandex Cloud storage');
    }
  } catch (e) {
    console.warn('Failed to sync high score to Yandex storage:', e);
  }
}

/**
 * Reports the high score to the Yandex leaderboard.
 * Assumes a leaderboard named 'leaders' is configured in the developer console.
 */
export async function reportScoreToLeaderboard(score: number) {
  const sdk = getYandexSDK();
  if (!sdk) return;

  try {
    const lb = await sdk.getLeaderboards();
    await lb.setLeaderboardScore('leaders', score);
    console.log('Score reported to Yandex leaderboard "leaders":', score);
  } catch (e) {
    console.warn('Failed to report score to Yandex leaderboard:', e);
  }
}

/**
 * Fetches top leaderboard entries.
 */
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
    console.warn('Failed to fetch leaderboard entries:', e);
    return null;
  }
}

/**
 * Fetches the high score from Yandex Cloud Storage upon game start.
 */
export async function fetchHighScoreFromYandex(): Promise<number | null> {
  const sdk = getYandexSDK();
  if (!sdk) return null;

  try {
    const storage = await sdk.getStorage();
    const data = await storage.get(['highScore']);
    return (data && typeof data.highScore === 'number') ? data.highScore : 0;
  } catch (e) {
    console.warn('Failed to fetch high score from Yandex:', e);
    return null;
  }
}
