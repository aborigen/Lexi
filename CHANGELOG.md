
# Changelog

## [2.11.0] - 2024-06-18
### Added
- **Literary Content Expansion**: Added 44 new Russian levels based on Alexander Pushkin's *Eugene Onegin*, bringing the total to 53 high-quality literary puzzles.
- **Verse Formatting**: Enhanced the hint system to support multi-line poetic citations with improved vertical spacing in the high-visibility overlay.

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
