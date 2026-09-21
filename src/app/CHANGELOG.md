# Changelog

## [2.33.0] - 2024-07-25
### Improved
- **Victory Dialog Responsiveness**: Refactored the "Level Complete" dialog to use dynamic padding, icon scaling, and font sizes. It now fits perfectly on small mobile screens without vertical overflow.
- **Bilingual Context**: Added word translations to all level hints (Russian for English levels, English for Russian levels) to enhance educational value.

### Fixed
- **Header Duplication**: Resolved a bug causing the game header to render twice on certain viewports.
- **UI Ergonomics**: Removed redundant "Save Progress" button as game state persists automatically.

## [2.32.0] - 2024-07-24
### Added
- **English Level Expansion**: Added new high-polish levels featuring 5-letter target words (`SPEED`, `HEART`, `LIGHT`, `POWER`, `BRAIN`, `SMILE`) with full dictionary sub-words.
- **Level Explorer List**: Integrated a level catalog dialog component accessible via a grid matrix icon, allowing players to view all items and jump between levels.

### Fixed
- **Layout Redundancy**: Removed duplicate header blocks causing stacked top-bars on mobile and landscape viewports.
- **Gesture Exclusions**: Shielded the ring shuffle container from hover highlights and accidental activation during live touch interactions.

## [2.31.0] - 2024-07-23
### Added
- **WordGrid Component**: Extracted and enhanced the word matrix UI into a dedicated component with a discovery counter.
- **Shake Animation**: Added visual haptic feedback for incorrect word attempts.
- **Current Word Preview**: Implemented a floating "pill" UI that shows the word being constructed in real-time.

### Improved
- **Score Counter**: Refined the score animation to use a step size of 5 for smoother counting.
- **UI Architecture**: Decoupled the word grid logic from the interaction engine for better modularity.

### Fixed
- **Type Integrity**: Resolved several strict TypeScript errors regarding component prop passing.
