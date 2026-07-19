
# Lexi.AI - UI Architecture Documentation

Lexi.AI utilizes a responsive, glassmorphic design built with Tailwind CSS and ShadCN UI. The layout is optimized for both desktop browsers and the Yandex Games mobile overlay.

## Layout Overview

The root layout is located in `src/app/page.tsx` and follows a three-part structure:

### 1. Global Header
Manages the application state for localization, scoring, and level resets.
- **Language Toggle**: Switches between `en` and `ru` namespaces in `translations.ts`.
- **Score Persistence**: High scores are synchronized with `localStorage` and Yandex Cloud Storage via `src/lib/yandex-sdk.ts`.

### 2. Strategic Grid (`lg:grid-cols-[1fr_2fr_1fr]`)
On desktop, the game uses a balanced grid to provide all information at a glance.
- **Found Words (Left)**: Tracks discovered combinations.
- **Game Engine (Center)**: The `WordConnect` component handles interaction logic.
- **AI Sidebar (Right)**: Hosts the `AIAdvisor` for Genkit-powered hints.

### 3. Responsive Stacking
On screens smaller than 1024px (Tailwind `lg` breakpoint), the grid transforms:
1. **Game Engine** moves to the top for immediate accessibility.
2. **Found Words** follows to provide feedback on progress.
3. **AI Advisor** is placed at the bottom to minimize visual clutter during active play.

## Component: WordConnect.tsx

The core game logic uses a "collision detection" model for letter selection:
- **Polar Positioning**: Letters are calculated using `CIRCLE_RADIUS` and `angle` math to form a perfect ring.
- **Interaction Model**: Supports `onMouseMove` and `onTouchMove`. It calculates the distance between the cursor/finger and letter centers to trigger a "hit".
- **SVG Layer**: A dedicated SVG overlay draws line segments between the selected indices in `selectedIndices`.

## Theme: Blue Sky
The visual aesthetic is controlled via `src/app/globals.css` using:
- **HSL Variables**: Primary yellow (`--primary`) and background blue (`--background`).
- **CSS Backgrounds**: A radial-gradient "Sun" and multiple radial-gradient "Clouds" positioned fixed to the viewport.
- **Glassmorphism**: A custom `.glass` utility class providing backdrop-blur and semi-transparent backgrounds.
