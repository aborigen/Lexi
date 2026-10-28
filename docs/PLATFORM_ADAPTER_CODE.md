# Platform Adapter Pattern - Refactored Code Walkthrough

This document provides a technical deep-dive into the refactored **Platform Adapter Pattern** implementation in Lexi.AI, focusing on the enhanced Sber Devices integration.

## 1. Modular SDK Bridge (`src/lib/yandex-sdk.ts`)

The bridge now uses a clean `switch-case` architecture within each method to route data to the correct platform SDK without leaking implementation details into the UI components.

### A. Initialization & Script Injection
Scripts are loaded only once, and initialization is tailored to each platform's handshake requirements.
```typescript
case 'sber':
  // Salute Assistant Client integration
  await loadScript('https://smart-display.sberdevices.ru/assistant-client.js');
  sdkInstance = (window as any).AssistantClient.createAssistant({
    getState: () => ({ /* current game data */ })
  });
  break;
```

### B. The Sber Salute Implementation
For Sber Devices, the bridge handles:
1. **State Sync**: Providing the `getState` callback to the `AssistantClient` so voice commands can access the current score/level.
2. **Message Bus**: Using `sdkInstance.sendData` to notify the Sber Scenario about achievements (e.g., `action: 'new_high_score'`).
3. **Event Listening**: Setting up `sdkInstance.on('data', ...)` to react to remote messages from the assistant.

### C. Standardized Stats Management
`updatePlayerStats` now handles persistence across all targets:
- **Standalone**: `localStorage`.
- **Yandex**: `playerInstance.setStats`.
- **VK**: `VKWebAppStorageSet`.
- **Sber**: `assistant.sendData({ action: 'update_stats', ... })`.

## 2. Platform-Agnostic UI (`src/app/page.tsx`)

The UI components remain "pure" and interact only with the bridge functions.

```typescript
// Example: The UI doesn't know it's talking to Sber or Yandex
useEffect(() => {
  if (score > highScore) {
    syncHighScoreToYandex(score); // Automatically routes to cloud
    reportScoreToLeaderboard(score); // Automatically shows LB box or sends data
  }
}, [score]);
```

## 3. Key Improvements in Version 2.37.0
- **Resilience**: Added guard clauses to prevent errors if a script fails to load.
- **Salute Support**: Implemented the `sendData` pattern for Sber Salute scenario synchronization.
- **Leaderboard V2**: Updated Yandex logic to prefer the `sdk.leaderboards` property over the deprecated `getLeaderboards()` method.
