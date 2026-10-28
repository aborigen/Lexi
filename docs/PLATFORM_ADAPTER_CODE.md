# Platform Adapter Pattern - Code Walkthrough

This document provides a technical deep-dive into the implementation of the **Platform Adapter Pattern** used in Lexi.AI.

## 1. The Bridge Utility (`src/lib/yandex-sdk.ts`)

This file acts as the "Concrete Adapter" that translates internal game requests into platform-specific SDK calls.

### A. Platform Identification
We use environment variables set at build time to determine the target platform.
```typescript
type GamePlatform = 'standalone' | 'yandex' | 'vk' | 'sber';
const PLATFORM: GamePlatform = (process.env.NEXT_PUBLIC_GAME_PLATFORM as GamePlatform) || 'standalone';
```

### B. Dynamic Script Loading
To keep the initial bundle small, we inject the platform's heavy SDK only when the game initializes.
```typescript
function loadScript(src: string): Promise<void> {
  // Logic to append <script> to <head> and resolve on 'onload'
}
```

### C. The Initialization Logic
The `initYandexSDK` function handles the "Handshake" for each platform.
```typescript
export async function initYandexSDK(): Promise<any> {
  switch (PLATFORM) {
    case 'yandex':
      await loadScript('https://yandex.ru/games/sdk/v2');
      sdkInstance = await (window as any).YaGames.init();
      playerInstance = await sdkInstance.getPlayer({ scopes: false });
      break;
    case 'vk':
      await loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js');
      sdkInstance = (window as any).vkBridge;
      await sdkInstance.send('VKWebAppInit');
      break;
    // ... other platforms
  }
}
```

### D. Unified Stats Storage
The UI calls `updatePlayerStats`, and the bridge decides where to send it.
```typescript
export async function updatePlayerStats(newStats: Partial<PlayerStats>) {
  // 1. Always save to LocalStorage for offline/fallback
  localStorage.setItem(STATS_KEY, JSON.stringify(updated));

  // 2. Route to the active cloud provider
  if (PLATFORM === 'yandex' && playerInstance) {
    playerInstance.setStats(updated); // Yandex Stats API
  } else if (PLATFORM === 'vk' && sdkInstance) {
    sdkInstance.send('VKWebAppStorageSet', { ... }); // VK Bridge Storage
  }
}
```

## 2. The Consumer Logic (`src/app/page.tsx`)

The game UI never talks to Yandex or VK directly. It only talks to the bridge.

### A. Initialization on Mount
```typescript
useEffect(() => {
  const init = async () => {
    await initYandexSDK(); // Handshake and script loading
    const envLang = getEnvironmentLanguage(); // Auto-detect language
    setLang(envLang);
    signalGameReady(); // Tell the platform the loading bar can disappear
  };
  init();
}, []);
```

### B. Event-Driven Syncing
When a record is broken, the UI calls two bridge methods without caring which platform is running.
```typescript
useEffect(() => {
  if (score > highScore) {
    setHighScore(score);
    syncHighScoreToYandex(score); // Saves data to cloud
    reportScoreToLeaderboard(score); // Submits to rankings
  }
}, [score, highScore]);
```

## 3. Benefits Summary
- **Independence**: The UI components are "clean" and free of platform-specific SDK objects like `YaGames` or `vkBridge`.
- **Testability**: You can test the entire game loop in `standalone` mode (using `localStorage`) without needing a connection to Yandex or VK servers.
- **Extensibility**: To add a new platform, you only modify `src/lib/yandex-sdk.ts`.
