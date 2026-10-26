
# Changelog

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

## [2.35.2] - 2024-07-29
### Added
- **VK Deployment Automation**: Integrated `vk-miniapps-deploy` for one-click uploading to VK Games hosting.
- **Configuration**: Added `vk-hosting-config.json` template for VK production builds.
- **Documentation**: Added `docs/GIT_WORKFLOW.md` explaining branching strategies for multi-platform development.

## [2.35.1] - 2024-07-28
### Added
- **Multi-Platform Automation**: Added `scripts/build-multiplatform.sh` to handle automated static builds and archiving for Yandex, VK, and Sber.
- **Documentation**: Created `docs/ENV_INSTRUCTIONS.md` providing clear guidance on switching publishing platforms.

### Improved
- **Full Localization**: Completed translation of the Victory (Level Complete) dialog, settings menu, and all global UI headers.
- **UI Streamlining**: Removed the "WORD CONNECT" subtitle from the main header to enhance brand clarity.
- **Animation Snappiness**: Shortened the Score particle animation duration and tightened the badge flash timing for more immediate feedback.
- **Mobile Ergonomics**: Refined the Victory dialog dimensions and paddings to ensure it fits perfectly on ultra-small mobile displays.
