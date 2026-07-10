# Changelog

All notable changes to this project will be documented in this file.

## [1.4.0] - 2024-05-26
### Added
- **Blue Sky Theme**: Redesigned the UI with a sunny day aesthetic, featuring a CSS-animated sun, clouds, and sky gradients.
- **UI Localization**: Full support for English and Russian, automatically detecting Yandex Games environment settings.
- **Language Switcher**: Added a manual toggle in the header to switch between supported languages.
- **Technical Documentation**: Created `docs/CODE_DOCUMENTATION.md` detailing the match-3 logic and game loop architecture.
- **Yandex Game Ready**: Implemented `LoadingAPI.ready()` signal to comply with Yandex Games SDK requirements.

### Changed
- **UI Layout**: Optimized the "Gem Rarity" widget to display items in a row for better space utilization.
- **Glassmorphism**: Refined glass effects to work with the new light-themed sky background.

## [1.3.0] - 2024-05-25
### Added
- **Yandex Games SDK**: Integrated Yandex Games SDK for high-score synchronization with cloud storage.
- **Cloud Sync**: High scores now automatically sync between Yandex Cloud and LocalStorage.

## [1.2.0] - 2024-05-24
### Added
- **Mobile Support**: Full responsive design for smartphones.
- **On-Screen Controls**: Dedicated touch-friendly buttons for Left, Right, Cycle, and Fast Drop.
- **Improved UI**: Glassmorphism aesthetic optimized for small screens.

### Fixed
- **React State Sync Error**: Resolved "Cannot update a component while rendering a different component" by deferring parent state notifications.
- **Infinite Render Loop**: Fixed "Maximum update depth exceeded" by properly memoizing game loop callbacks and stabilizing hook dependencies.

## [1.1.0] - 2024-05-23
### Changed
- **Total Pivot**: Refactored from "Pulp Drop" (physics merge) to "Columns.AI" (grid-based match-3).
- **Match-3 Engine**: Implemented a grid logic system supporting horizontal, vertical, and diagonal matches.
- **AI Advisor**: Updated the GenAI flow to analyze grid columns and stack rotation instead of physics positions.

## [1.0.0] - 2024-05-22
### Added
- Initial physics-based "Pulp Drop" prototype using Matter.js.
- AI suggestion integration for optimal drop coordinates.
