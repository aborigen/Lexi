# Changelog

## [2.32.0] - 2024-07-24
### Added
- **English Level Expansion**: Added new high-polish levels featuring 5-letter target words (`SPEED`, `HEART`, `LIGHT`, `POWER`, `BRAIN`, `SMILE`) with full dictionary sub-words.
- **Bilingual Level Context**: Appended explicit translations in parentheses to the end of every hint (Russian translations for English levels, English translations for Russian literary levels) to enhance educational value.
- **Level Explorer List**: Integrated a level catalog dialog component accessible via a grid matrix icon, allowing players to view all items and jump between levels.

### Fixed
- **Layout Redundancy**: Removed duplicate header blocks causing stacked top-bars on mobile and landscape viewports.
- **Gesture Exclusions**: Shielded the ring shuffle container from hover highlights and accidental activation during live touch interactions.

## [2.31.0] - 2024-07-23
### Added
- **WordGrid Component**: Extracted and enhanced the word matrix UI into a dedicated component with a discovery counter.
- **Shake Animation**: Added visual feedback for incorrect word attempts.
- **Current Word Preview**: Implemented a floating "pill" UI that shows the word being constructed in real-time.

### Improved
- **Score Counter**: Refined the score animation to use a step size of 5 for smoother counting.
- **UI Architecture**: Decoupled the word grid logic from the interaction engine for better modularity.

### Fixed
- **Type Integrity**: Resolved several strict TypeScript errors regarding component prop passing.

## [2.30.0] - 2024-07-22
### Added
- **Score Particles**: Implemented a dynamic gem-shooting animation that travels from the interaction area to the score counter.
- **Statistics Dialog**: Added a comprehensive visual summary of player achievements (levels, words, hints, etc.).
- **Level Badge**: Integrated a persistent level counter in the global header for immediate progress feedback.
- **Settings Consolidation**: Grouped theme, language, and reset controls into a new "Settings" dropdown menu for a cleaner UI.
