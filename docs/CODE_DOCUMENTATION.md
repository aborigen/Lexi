
# Lexi.AI - UI Architecture Documentation

Lexi.AI utilizes a responsive, glassmorphic design built with Tailwind CSS and ShadCN UI. The layout is optimized for both desktop browsers and the Yandex Games mobile overlay, specifically targeting a "zero-scroll" experience.

## Layout Overview

The root layout is located in `src/app/page.tsx` and follows a strict vertical structure:

### 1. Global Header
Manages the application state for localization, scoring, and level resets.
- **Score Persistence**: Synchronized with `localStorage` and Yandex Cloud Storage via `src/lib/yandex-sdk.ts`.
- **Stat Tracking**: A dedicated button to view "Total Words Found" and "Hints Used."
- **Theme Switching**: Toggle between "Blue Sky" (Light) and "Starry Night" (Dark) modes.

### 2. Interaction Engine (WordConnect.tsx)
The core game logic uses a "collision detection" model for letter selection:
- **Polar Positioning**: Letters are calculated using `CIRCLE_RADIUS` and `angle` math to form a perfect ring.
- **Gesture Layer**: A dedicated SVG overlay draws line segments between the selected indices.
- **State-Ref Sync**: Uses a `useRef` to track active indices, ensuring high-performance dragging without re-registering DOM listeners.
- **Word Slots**: A flexible grid at the top that reveals found words with a "Pop-and-Glow" animation.

### 3. AI Advisor (AIAdvisor.tsx)
A Genkit-powered (or level-provided) hint system.
- **Contextual Clues**: Provides citations with missing words.
- **Readability Overlay**: Hints are displayed in a centered `Dialog` (Modal) to ensure maximum legibility on smartphone screens (e.g., iPhone 8).

## Theme: Blue Sky
The visual aesthetic is controlled via `src/app/globals.css`:
- **Animated Backgrounds**: Fixed gradients that change based on theme (Light vs Dark).
- **Glassmorphism**: A custom `.glass` utility class providing backdrop-blur and semi-transparent backgrounds.
- **Dynamic Icons**: Uses `lucide-react` for a consistent, clean UI.

## Performance Optimization
- **Audio Synthesis**: Sound effects are generated via Web Audio API (`audio-manager.ts`) to avoid loading heavy MP3/WAV files.
- **Zero-Regrid**: The WordConnect component avoids layout shifts by using a fixed container size and absolute positioning for letters.
