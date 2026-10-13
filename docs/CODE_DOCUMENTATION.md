
# Lexi.AI - UI Architecture Documentation

Lexi.AI utilizes a responsive, glassmorphic design built with Tailwind CSS and ShadCN UI. The layout is optimized for multiple publishing platforms via a unified SDK bridge.

## Multi-Platform Publishing

The game supports quick switching between publishing platforms using the `NEXT_PUBLIC_GAME_PLATFORM` environment variable in `.env`.

### Supported Platforms:
1. **standalone**: Standard web build using `localStorage` for all persistence.
2. **yandex**: Integrates Yandex Games SDK (Cloud saves, Leaderboards).
3. **vk**: Integrates VK Games SDK (VK Bridge, Storage, Leaderboards).
4. **sber**: Integrates Sber Devices Assistant Client.

### How to Switch:
1. Open `.env`.
2. Change `NEXT_PUBLIC_GAME_PLATFORM` to your target (e.g., `vk`).
3. Restart the dev server or rebuild the project. The `src/lib/yandex-sdk.ts` (Bridge) will automatically load the required scripts and map the API calls.

## Layout Overview

The root layout is located in `src/app/page.tsx` and follows a strict vertical structure:

### 1. Global Header
Manages the application state for localization, scoring, and level resets.
- **Score Persistence**: Synchronized via the Platform Bridge.
- **Stat Tracking**: Uses unified `updatePlayerStats` calls.

### 2. Word Discovery Matrix (WordGrid.tsx)
A dedicated panel that tracks the player's progress within the current level.
- **Compact UI**: Optimized for mobile screens.

### 3. Interaction Engine (WordConnect.tsx)
The core game logic using a "collision detection" model for letter selection.

### 4. Audio Synthesis (audio-manager.ts)
Lexi.AI generates all SFX at runtime using the Web Audio API.

## Hosting & Environment Notes
- **Static Export**: The project uses `next export` for 100% compatibility with static game hosting.
- **Dynamic SDKs**: Scripts are loaded only when needed by the bridge to keep initial bundle size small.
