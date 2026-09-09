
# How to Restore Yandex Games SDK V2 - Lexi.AI

This document contains the original code and instructions required to restore full Yandex Games SDK integration for cloud saves, leaderboards, and ad support.

## Step 1: Restore the SDK Script
Add the following script to the `<head>` section of `src/app/layout.tsx`:

```tsx
<Script 
  src="https://yandex.ru/games/sdk/v2" 
  strategy="beforeInteractive"
/>
```

## Step 2: Restore the SDK Utility
Replace the content of `src/lib/yandex-sdk.ts` with the version that uses the `YaGames` global object. The core logic involves:
1. Initializing with `window.YaGames.init()`.
2. Obtaining the `player` instance with `sdk.getPlayer()`.
3. Using `sdk.leaderboards` (Promise) for rankings.

## Step 3: Enable SDK Features in Page.tsx
In `src/app/page.tsx`, re-enable the following calls:
- `signalGameReady()` in the initialization `useEffect`.
- `syncHighScoreToYandex(score)` and `reportScoreToLeaderboard(score)` inside the high score effect.
- `updatePlayerStats()` for tracking gameplay metrics.
- `requestReview()` and `createShortcut()` for platform engagement.

## Key SDK Methods (Reference)
- **Stats**: `player.setStats({ levelsCleared: 1 })`
- **Data**: `player.setData({ highScore: 100 }, true)`
- **Leaderboard**: `(await sdk.leaderboards).setLeaderboardScore('leaders', score)`
- **Loading**: `sdk.features.LoadingAPI.ready()`
