
# Changelog

## [2.10.0] - 2024-06-15
### Changed
- **Data Architecture**: Refactored game level storage into external JSON files (`en.json` and `ru.json`) to improve maintainability and simplify future content updates.
- **Level Loading**: Updated the core levels engine to unified imports from localized JSON resources.

## [2.9.0] - 2024-06-12
### Added
- **UI Animations**: Implemented "Slide-in-from-left" for the Word Grid and "Zoom-in" for the Interaction Circle to enhance game feel.
- **Mobile Accessibility**: Hints now appear in a high-visibility centered overlay (Dialog) for better legibility on smaller screens like iPhone 8.
- **Live Leaderboard**: Fully implemented the `Leaderboard` component, fetching real-time data from Yandex Games SDK V2.
- **Rich Content**: Added multiple Russian levels featuring classic poetry from Pushkin's *Eugene Onegin*.

### Fixed
- **Interaction Accuracy**: Audited `WordConnect` component; corrected container sizing to prevent letter clipping and optimized gesture collision detection.
- **Next.js Stability**: Hardened event registration logic using the Ref-Sync pattern to prevent Next.js framework invariants during rapid dragging.

## [2.8.0] - 2024-06-10
### Changed
- **Yandex V2 Refactor**: Complete rewrite of the Yandex SDK integration for full V2 compatibility, including strictly-typed interfaces and `LoadingAPI` signaling.
- **Performance Optimization**: Implemented high-performance state tracking in `WordConnect.tsx` to ensure lag-free circular interactions.

## [2.7.0] - 2024-06-06
### Added
- **Theme Engine**: Implemented dynamic theme switching between "Blue Sky" (Light) and "Starry Night" (Dark).
- **Gameplay Shuffling**: Implemented automatic level randomization on game start.
