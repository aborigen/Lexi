# Lexi.AI - Version History

## v2.35.0 (2024-07-27)
### Major Features & Expansion
- **English Level Mastery**: Added 30 new 5-letter levels, significantly increasing game longevity and vocabulary depth.
- **Universal SDK Bridge**: Unified support for Yandex, VK, and Sber Devices under a single adapter pattern.
- **"Vortex" Interaction**: New high-energy shuffle animation with scale collapse and motion blur.
- **Store Assets**: Generated comprehensive English and Russian promotional materials for multi-platform publishing.

## v2.34.0 (2024-07-26)
### Added
- **Refined Success Feedback**: Implemented high-impact visual confirmation for correct words, including success flashes and ring pulses.
- **Kinetic Shuffle**: Added kinetic jumble animations for letters and icon spinning when reshuffling the board.
- **Grounding Ring**: Integrated a new glassmorphic background layer behind the letter circle for better visual grounding.

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
