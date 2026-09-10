
# Lexi.AI - UI Architecture Documentation

Lexi.AI utilizes a responsive, glassmorphic design built with Tailwind CSS and ShadCN UI. The layout is optimized for both desktop browsers and the Yandex Games mobile overlay, specifically targeting a "zero-scroll" experience.

## Layout Overview

The root layout is located in `src/app/page.tsx` and follows a strict vertical structure:

### 1. Global Header
Manages the application state for localization, scoring, and level resets.
- **Score Persistence**: Synchronized with `localStorage` and Yandex Cloud Storage via `src/lib/yandex-sdk.ts`.
- **Stat Tracking**: A dedicated button to view "Total Words Found" and "Hints Used."
- **Settings Dropdown**: Consolidates Theme Switching and Language toggles.

### 2. Interaction Engine (WordConnect.tsx)
The core game logic uses a "collision detection" model for letter selection.
- **Polar Positioning**: Letters are calculated using `CIRCLE_RADIUS` and `angle` math to form a perfect ring.
- **Rotation**: The ring is rotated 45 degrees for better ergonomic access.
- **Gesture Layer**: A dedicated SVG overlay draws line segments between the selected indices.
- **Detailed Mechanics**: See [INTERACTION_MECHANICS.md](./INTERACTION_MECHANICS.md) for the gesture math.

### 3. Audio Synthesis (audio-manager.ts)
Lexi.AI generates all SFX at runtime using the Web Audio API.
- **Tuning**: You can modify pitch (Hz), waveform ('sine', 'square', 'triangle'), and volume directly in `src/lib/audio-manager.ts`.
- **No Assets**: This system ensures 100% offline compatibility and zero-latency feedback without loading external MP3 files.

## Hosting & Environment Notes (Yandex Games)

### Content Security Policy (CSP) Warnings
You may encounter the following warning in the console:
`Unrecognized Content-Security-Policy directive 'report-to'`
- **Cause**: The Yandex Games hosting environment injects a modern CSP directive that some browser versions or integrated webviews do not yet support.
- **Impact**: **Non-fatal**. The browser safely ignores this directive while enforcing the rest of the security policy.

## Theme: Blue Sky
The visual aesthetic is controlled via `src/app/globals.css`:
- **Animated Backgrounds**: Fixed gradients that change based on theme.
- **Glassmorphism**: A custom `.glass` utility class providing backdrop-blur and semi-transparent backgrounds.
