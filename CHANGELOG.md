# Changelog

## [2.33.0] - 2024-07-25
### Improved
- **Victory Dialog Responsiveness**: Refactored the "Level Complete" victory dialog using dynamic paddings, icon scaling, and fluid text parameters to prevent overflow on ultra-small viewport mobile screens.
- **WordGrid Component Compactness**: Redesigned sizing matrices and height limitations for small and narrow landscape/portrait viewports to secure unobstructed gesture interactions.
- **Bilingual Context**: Integrated contextual translations into dictionary items across all level modules (Russian translations for English levels, English translations for Pushkin citations) to increase educational gameplay quality.

### Fixed
- **Header Duplication**: Resolved structural stacking bug causing multiple identical master navigation headers to map onto specific viewports.
- **UI Ergonomics**: Suppressed manual "Save Progress" trigger component since save states automatically cycle to local cache stores dynamically.

## [2.32.0] - 2024-07-24
### Added
- **English Level Expansion**: Added new high-polish levels featuring 5-letter target words (`SPEED`, `HEART`, `LIGHT`, `POWER`, `BRAIN`, `SMILE`) with full dictionary sub-words.
- **Level Explorer List**: Integrated a level catalog dialog component accessible via a grid matrix icon, allowing players to view all items and jump between levels.

## [2.31.0] - 2024-07-23
### Added
- **WordGrid Component**: Extracted and enhanced the word matrix UI into a dedicated component with a discovery counter.
- **Shake Animation**: Added visual haptic feedback for incorrect word attempts.
- **Current Word Preview**: Implemented a floating "pill" UI that shows the word being constructed in real-time.

## [2.30.0] - 2024-07-22
### Added
- **Score Particles**: Implemented a dynamic gem-shooting animation that travels from the interaction area to the score counter.
- **Statistics Dialog**: Added a comprehensive visual summary of player achievements (levels, words, hints, etc.).
- **Level Badge**: Integrated a persistent level counter in the global header for immediate progress feedback.
- **Settings Consolidation**: Grouped theme, language, and reset controls into a new "Settings" dropdown menu for a cleaner UI.
