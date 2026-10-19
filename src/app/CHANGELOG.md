# Changelog

## [2.35.1] - 2024-07-28
### Added
- **Platform Automation**: Added `scripts/build-multiplatform.sh` to handle automated static builds and archiving for Yandex, VK, and Sber.
- **Documentation**: Created `docs/ENV_INSTRUCTIONS.md` for platform configuration.

### Improved
- **Full Localization**: Victory dialog, settings menu, and headers are now fully bilingual (EN/RU).
- **UI Streamlining**: Removed "WORD CONNECT" subtitle from logo area for a cleaner design.
- **Animation Timing**: Increased speed of score particles and shortened success flash duration.
- **Victory Dialog**: Optimized padding and scaling for small mobile devices.

## [2.34.0] - 2024-07-26
### Improved
- **Success Feedback**: Added high-impact success flash and ring pulses to reward correct word identification.
- **Shuffle UX**: Integrated kinetic "jumble" animations for letters when the shuffle button is pressed.
- **UI Depth**: Added a glassmorphic grounding ring behind the interactive letter circle.

## [2.33.0] - 2024-07-25
### Improved
- **Victory Dialog Responsiveness**: Refactored the "Level Complete" dialog to use dynamic padding, icon scaling, and font sizes. It now fits perfectly on small mobile screens without vertical overflow.
- **Bilingual Context**: Added word translations to all level hints (Russian for English levels, English for Russian levels) to enhance educational value.

### Fixed
- **Header Duplication**: Resolved a bug causing the game header to render twice on certain viewports.
- **UI Ergonomics**: Removed redundant "Save Progress" button as game state persists automatically.
