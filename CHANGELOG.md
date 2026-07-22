
# Changelog

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

## [2.2.0] - 2024-06-01
### Added
- **Simplified UI**: Centered minimalist layout focusing on core gameplay.
- **Russian Levels**: Added 5-letter Russian word puzzles (ПИЛОТ, КОМАР, КНИГА).
- **Landscape Support**: Adaptive grid for better experience on wide screens and tablets.
- **Local Font Stacks**: Switched to system fonts for better performance and offline reliability.

### Changed
- **Code Organization**: Moved levels and word lists to a dedicated `src/lib/levels.ts`.
- **Yandex SDK Refinement**: Improved `signalGameReady` timing and automated language detection.
- **Accessibility**: Implemented dynamic `html lang` attribute updates.

### Fixed
- **Build Stability**: Finalized `esbuild` compatibility for macOS 10.15 (Catalina).
- **Layout Overflow**: Fixed scrolling issues on small viewports.
