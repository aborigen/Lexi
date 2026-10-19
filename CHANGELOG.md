# Changelog

## [2.35.1] - 2024-07-28
### Added
- **Multi-Platform Automation**: Added `scripts/build-multiplatform.sh` to handle automated static builds and archiving for Yandex, VK, and Sber.
- **Documentation**: Created `docs/ENV_INSTRUCTIONS.md` providing clear guidance on switching publishing platforms.

### Improved
- **Full Localization**: Completed translation of the Victory (Level Complete) dialog, settings menu, and all global UI headers.
- **UI Streamlining**: Removed the "WORD CONNECT" subtitle from the main header to enhance brand clarity.
- **Animation Snappiness**: Shortened the Score particle animation duration and tightened the badge flash timing for more immediate feedback.
- **Mobile Ergonomics**: Refined the Victory dialog dimensions and paddings to ensure it fits perfectly on ultra-small mobile displays.

## [2.35.0] - 2024-07-27
### Added
- **Major Level Expansion**: Integrated 30 new high-quality English levels featuring 5-letter target words and full bilingual hints.
- **Multi-Platform SDK Bridge**: Implemented a unified adapter for Yandex Games, VK Games, and Sber Devices support via `NEXT_PUBLIC_GAME_PLATFORM`.
- **Promo Materials**: Created a `promo/` directory with localized English and Russian descriptions for store publishing.

### Improved
- **"Vortex" Shuffle Animation**: Redesigned the shuffle interaction with a collapsing vortex effect, blurring, and kinetic pop-out.
- **UI Grounding**: Added a glassmorphic ring background to the interaction area for better visual depth.
- **Success Feedback**: Polished the "Success Flash" and grid revelation animations for a more rewarding game feel.

## [2.34.0] - 2024-07-26
### Added
- **Refined Success Feedback**: Implemented a "Success Flash" animation that provides immediate celebratory visual confirmation when a word is correctly guessed.
- **Kinetic Shuffle Feedback**: Added a jumble animation for letters and a 360-spin for the shuffle icon to make reordering feel more physical and responsive.
- **Interaction Ring Background**: Added a glassmorphic background layer under the letter ring to improve UI depth and accessibility.

## [2.33.0] - 2024-07-25
### Improved
- **Victory Dialog Responsiveness**: Refactored the "Level Complete" victory dialog using dynamic paddings, icon scaling, and fluid text parameters to prevent overflow on ultra-small viewport mobile screens.
- **WordGrid Component Compactness**: Redesigned sizing matrices and height limitations for small and narrow landscape/portrait viewports to secure unobstructed gesture interactions.
- **Bilingual Context**: Integrated contextual translations into dictionary items across all level modules (Russian translations for English levels, English translations for Pushkin citations) to increase educational gameplay quality.

### Fixed
- **Header Duplication**: Resolved structural stacking bug causing multiple identical master navigation headers to map onto specific viewports.
- **UI Ergonomics**: Suppressed manual "Save Progress" trigger component since save states automatically cycle to local cache stores dynamically.
