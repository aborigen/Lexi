# Scoring & Leaderboard Logic - Lexi.AI

The score in Lexi.AI is calculated dynamically based on the complexity of the words discovered and is synchronized with the Yandex Games platform for global competition.

## 1. Word Discovery Scoring
In `WordConnect.tsx`, when a player successfully links a word, the game awards points using a simple but effective formula:
- **Formula**: `Word Length × 10`
- **Example**: Finding a 5-letter word adds **50 points** to the current session score.

## 2. High Score Persistence
The `page.tsx` component monitors the `score` state in real-time. If the current score exceeds the player's personal `highScore`, the application triggers a three-step persistence routine:

1. **Local State**: The `highScore` state is updated and immediately saved to the browser's `localStorage` for quick recovery on refresh.
2. **Cloud Data**: The `syncHighScoreToYandex` function (in `yandex-sdk.ts`) is called to store the value in Yandex Cloud Storage using the `setData` method. This ensures progress is kept across devices.
3. **Global Rankings**: The `reportScoreToLeaderboard` function is invoked to submit the new record to the competitive rankings.

## 3. Yandex SDK V2 Integration
The leaderboard integration follows the modern Yandex Games SDK V2 patterns:
- **Async Initialization**: We use `sdk.getLeaderboards()` (asynchronous) to obtain the leaderboard service instance. This prevents blocking the main thread during initial load.
- **Leaderboard Identifier**: All scores are reported to the technical leaderboard named `'leaders'`.
- **Public Rankings**: The `Leaderboard.tsx` component fetches the top 20 entries to display ranks, player avatars (via `getAvatarSrc`), and scores, creating a sense of community and competition.
