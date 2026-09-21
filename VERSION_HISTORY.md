
# Lexi.AI - Version History

## v2.33.0 (2024-07-25)
### Improved
- **Victory Dialog Responsiveness**: Refactored the "Level Complete" victory dialog using dynamic paddings, icon scaling, and fluid text parameters to prevent overflow on ultra-small viewport mobile screens.
- **WordGrid Component Compactness**: Redesigned sizing matrices and height limitations for small and narrow landscape/portrait viewports to secure unobstructed gesture interactions.
- **Bilingual Context**: Integrated contextual translations into dictionary items across all level modules (Russian translations for English levels, English translations for Pushkin citations) to increase educational gameplay quality.

### Fixed
- **Header Duplication**: Resolved structural stacking bug causing multiple identical master navigation headers to map onto specific viewports.
- **UI Ergonomics**: Suppressed manual "Save Progress" trigger component since save states automatically cycle to local cache stores dynamically.

## v2.32.0 (2024-07-24)
### Added
- **English Level Expansion**: Added new high-polish levels featuring 5-letter target words (`SPEED`, `HEART`, `LIGHT`, `POWER`, `BRAIN`, `SMILE`) with full dictionary sub-words.
- **Level Explorer List**: Integrated a level catalog dialog component accessible via a grid matrix icon, allowing players to view all items and jump between levels.

## v2.31.0 (2024-07-23)
### Added
- **WordGrid Component**: Extracted and enhanced the word matrix UI into a dedicated component with a discovery counter.
- **Shake Animation**: Added visual haptic feedback for incorrect word attempts.
- **Current Word Preview**: Implemented a floating "pill" UI that shows the word being constructed in real-time.

## v2.30.0 (2024-07-22)
### Animation & UX Overhaul
- **Particle Engine**: Added high-performance gem particles for score increments.
- **Header Badge**: Persistent Level display integrated into the main HUD.
- **Consolidated Settings**: Refactored the header to include a unified settings dropdown.
- **Visual Contrast**: Darkened the light theme background to improve readability of glassmorphic elements.
- **Build Stability**: Fixed all remaining TypeScript build errors and ReferenceErrors.

## v2.29.0 (2024-07-21)
### Deployment & Standalone Refactoring
- **SDK Decoupling**: Removed all Yandex Games SDK script injections and platform-specific calls to support generic static hosting.
- **Offline Persistence**: Implemented a `localStorage` engine for all player progress, high scores, and lifetime statistics.
- **Restore Guide**: Created `docs/YANDEX_SDK_RESTORE.md` for future platform re-integration.

## v2.28.0 (2024-07-20)
### UI Refinement
- **Letter Ring Alignment**: Optimized the circular letter interaction by rotating the ring to a 45-degree start, providing a cleaner geometric layout for the interaction engines.
