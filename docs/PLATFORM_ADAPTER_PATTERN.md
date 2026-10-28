# Platform Adapter Pattern in Lexi.AI

Lexi.AI utilizes the **Platform Adapter Pattern** to maintain a single, clean codebase while deploying to multiple gaming platforms (Yandex Games, VK Games, Sber Salute, and Standalone Web).

## 1. The Core Philosophy
Instead of creating separate branches or repositories for different platforms, Lexi.AI uses a **Unified SDK Bridge** (`src/lib/yandex-sdk.ts`). This bridge abstracts the specific APIs of each platform into a consistent internal interface that the React components can call without knowing which platform is currently active.

## 2. Implementation Overview

### A. Environment Configuration
The active platform is controlled via the `NEXT_PUBLIC_GAME_PLATFORM` environment variable in the `.env` file:
```env
NEXT_PUBLIC_GAME_PLATFORM=yandex # Options: standalone, yandex, vk, sber
```

### B. Dynamic Script Injection
The bridge does not bundle heavy SDKs. Instead, it injects the required platform scripts at runtime during the initialization phase:
- **Yandex**: `https://yandex.ru/games/sdk/v2`
- **VK**: `https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js`
- **Sber**: `https://smart-display.sberdevices.ru/assistant-client.js`

### C. Standardized Interface
The bridge exposes a common set of functions used throughout the app:
- `initYandexSDK()`: Handles platform-specific handshake and script loading.
- `updatePlayerStats()`: Automatically routes data to `localStorage` (all), Yandex Cloud Storage, or VK Storage.
- `reportScoreToLeaderboard()`: Maps internal scores to the specific technical leaderboard IDs of the target platform.
- `getEnvironmentLanguage()`: Detects language from the SDK environment or the browser headers.

## 3. Supported Platform Behaviors

| Feature | Standalone | Yandex Games | VK Games | Sber Salute |
|---------|------------|--------------|----------|-------------|
| **Persistence** | `localStorage` | Cloud Data + Stats | VK Storage | Sber Assistant |
| **Leaderboards**| Local only | Yandex Global LBs | VK Leaderboard Box| Salute Global |
| **Ads** | None | Fullscreen/Rewarded | VK Bridge Ads | Salute Ads |
| **Social** | None | Reviews/Shortcuts | Posts/Friends | N/A |

## 4. Benefits of this Approach
1. **Zero Logic Duplication**: A bug fix in the word-linking logic applies to all platforms simultaneously.
2. **Simplified Build Pipeline**: The `scripts/build-multiplatform.sh` script simply swaps the environment variable and runs a standard `next build`.
3. **Reduced Bundle Size**: Only the necessary platform scripts are loaded by the client's browser.
4. **Maintenance**: Adding a new platform (e.g., Poki or CrazyGames) only requires adding a new case to the `src/lib/yandex-sdk.ts` bridge.

## 5. Development Workflow
When adding a feature that requires platform interaction:
1. Define the function in `src/lib/yandex-sdk.ts`.
2. Implement the `switch (PLATFORM)` logic.
3. Ensure a fallback exists for `standalone` mode so development remains smooth locally.
4. Call the new function from your React components.