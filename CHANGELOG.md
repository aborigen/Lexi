
# Changelog

## [2.6.0] - 2024-06-05
### Added
- **Leaderboard UX**: Integrated a new "Show Leaderboard" button in the header for easier access to global rankings.
- **Automated Score Sync**: Scores are now explicitly reported to Yandex Games leaderboards immediately upon level completion.

### Changed
- **Mobile Optimization**: Redesigned UI for portrait orientation on smartphones, including a more compact header and a reduced scale for the letter circle.
- **Build Pipeline**: Updated archiving scripts to include the project's semantic version in the final ZIP filename for better release tracking.
- **Code Structure**: Refactored game components (renamed `ColumnsGame` to `Game`) for better project clarity.

### Fixed
- **Leaderboard Reporting**: Audited SDK integration to ensure high scores are reported using the latest state values, preventing stale data updates.

## [2.5.0] - 2024-06-04
### Added
- **Static Citation Hints**: Implemented a comprehensive library of pre-defined literary and linguistic hints, allowing for a pure static export without backend dependencies.
- **Dynamic Letter Shuffling**: Letters on the circular interaction board are now randomized upon level load or language switch for increased variety.

### Changed
- **Deployment Mode**: Re-enabled `output: export` in Next.js configuration for standalone publishing.
- **Hint Logic**: Transitioned from LLM-based generation to a performant local retrieval system.

## [2.4.0] - 2024-06-03
### Added
- **Yandex Leaderboards**: Integrated support for the 'leaders' leaderboard, automatically reporting new high scores.
- **Content Localization**: Levels are now strictly filtered by language (English/Russian), ensuring a consistent linguistic experience.

### Changed
- **Level Progression**: Implemented automatic level resets when switching languages to prevent invalid word states.
- **SDK Sync**: Improved synchronization between Yandex Cloud Storage and local high scores.

## [2.3.0] - 2024-06-02
### Added
- **Synthesized Audio**: Implemented a zero-asset `AudioManager` using Web Audio API for interactive sound effects.
- **Dynamic Theme**: Enhanced "Blue Sky" palette with animated sun rays, vibrant gradients, and improved glassmorphism.
- **Game Icon**: Added a high-contrast SVG icon and `GameIcon` component for Yandex Games branding.
- **Build Automation**: New CLI script for generating static exports and ZIP archives for publishing.

### Changed
- **UI Visibility**: Redesigned empty word slot placeholders with better depth and visibility.
- **Performance**: Switched fully to Next.js SWC, removing all `esbuild` dependencies.
