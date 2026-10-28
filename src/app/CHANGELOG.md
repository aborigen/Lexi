
# Changelog

## [2.36.2] - 2024-08-01
### Added
- **Sber Promo Materials**: Localized text assets for SberBox and SberPortal added to `promo/sber`.

## [2.36.0] - 2024-07-30
### Added
- **Integrated AI Hints**: AI citation hints are now displayed directly within the Word Grid panel on the main game screen.
- **Auto-Hint Feature**: Literary context hints are now displayed by default at the start of each level to provide immediate educational value.
- **Pangram Gameplay Rule**: Refactored levels to focus on a "One Word Anagram" mechanic, where the goal is to find the single word using all available letters.
- **Refined Onboarding**: Added a smooth hand animation to guide new users through their first word connection.

### Improved
- **Linear Progression**: Implemented sequential level unlocking. Future levels are locked until the current one is mastered.
- **Victory Feedback**: Added a 2-second delay before the Victory Dialog opens to allow celebratory SFX and particle animations to complete.
- **Landscape Ergonomics**: Widened the Word Discovery sidebar in landscape mode to ensure target word slots always fit on a single line.
- **UI Persistence**: Game state (level index, high score, unlocked levels) now persists via `localStorage` and platform cloud storage.

## [2.35.1] - 2024-07-28
### Added
- **Platform Automation**: Added `scripts/build-multiplatform.sh` to handle automated static builds and archiving for Yandex, VK, and Sber.
- **Documentation**: Created `docs/ENV_INSTRUCTIONS.md` for platform configuration.

### Improved
- **Full Localization**: Victory dialog, settings menu, and headers are now fully bilingual (EN/RU).
- **UI Streamlining**: Removed "WORD CONNECT" subtitle from logo area for a cleaner design.
- **Animation Timing**: Increased speed of score particles and shortened success flash duration.
- **Victory Dialog**: Optimized padding and scaling for small mobile devices.
