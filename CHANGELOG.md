
# Changelog

## [2.30.0] - 2024-07-22
### Added
- **Score Particles**: Implemented a dynamic gem-shooting animation that travels from the interaction area to the score counter.
- **Statistics Dialog**: Added a comprehensive visual summary of player achievements (levels, words, hints, etc.).
- **Level Badge**: Integrated a persistent level counter in the global header for immediate progress feedback.
- **Settings Consolidation**: Grouped theme, language, and reset controls into a new "Settings" dropdown menu for a cleaner UI.

### Improved
- **Visual Polish**: Darkened the "Blue Sky" background for better contrast and refined the toast component's glassmorphic effects and positioning.
- **Interaction Alignment**: Rotated the Word Connect letter ring to 45 degrees for superior geometric symmetry.
- **Audio Synthesis**: Refined the Web Audio API SFX melodies (Success/Level Complete) and added a tuning guide for developers.

### Fixed
- **Type Integrity**: Resolved TypeScript errors regarding JSON level casting and missing translation keys.
- **UI Logic**: Fixed a ReferenceError related to the statistics dialog toggle.

## [2.29.0] - 2024-07-21
### Removed
- **Yandex Games SDK**: Core SDK integration removed for standalone deployment. Restoration instructions added to `docs/YANDEX_SDK_RESTORE.md`.
### Changed
- **Persistence**: Switched cloud synchronization to `localStorage` fallbacks for scores and statistics.

## [2.28.0] - 2024-07-20
### Refined
- **Word Connect UI**: Adjusted the letter ring rotation for better visual symmetry and improved gameplay ergonomics.
