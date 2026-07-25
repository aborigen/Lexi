
# Lexi.AI - Version History

## v2.10.0 (2024-06-15)
### Architecture
- **JSON Migration**: Levels are now decoupled from code and stored in structured JSON files for English and Russian locales.

## v2.9.0 (2024-06-12)
### UI & Interaction
- **Polished Entry Effects**: Added unique CSS animations for level loading (Slide-in and Zoom).
- **Hint Overlay**: Replaced inline hint text with a centered, high-contrast Dialog for mobile-first legibility.
- **Functional Rankings**: Activated the global leaderboard system via Yandex Games SDK.

## v2.8.0 (2024-06-10)
### Core Architecture
- **Yandex SDK V2 Compliance**: Fully refactored integration to meet latest Yandex Games standards.
- **Performance Audit**: Optimized the `WordConnect` component for high-frequency touch events using state-ref synchronization.

## v2.7.0 (2024-06-06)
### Themes & Content
- **Theme Engine**: Integrated a dynamic theme switcher supporting "Blue Sky" and "Starry Night" modes.
- **Smart Shuffling**: Implemented a randomization engine that shuffles levels on game start and language toggle.
