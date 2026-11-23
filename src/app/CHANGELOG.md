
# Changelog

## [2.37.0] - 2024-08-05
### Added
- **Level Randomization**: Levels are now shuffled upon game start and language change to provide a non-repetitive gameplay experience.

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
