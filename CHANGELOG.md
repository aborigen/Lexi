
# Changelog

## [2.15.1] - 2024-07-03
### Fixed
- **Leaderboard API**: Corrected the Yandex SDK integration to use the asynchronous `getLeaderboards()` method, resolving a `TypeError` when accessing leaderboard entries.

## [2.15.0] - 2024-07-02
### Added
- **Responsive Layout Engine**: Implemented adaptive layouts that intelligently shift components between portrait and landscape modes to avoid cutoffs.
- **FAB Advisor**: Refactored the AI Advisor into a compact Floating Action Button (FAB) for better ergonomics and more screen real estate.
### Fixed
- **SVG Drawing Correction**: Resolved a critical coordinate mapping bug that caused connection lines to draw incorrectly or disappear on scaled mobile screens.
- **Yandex SDK Stability**: Fixed `TypeError: _.get is not a function` by refactoring the SDK bridge to use modern `Player` and `Leaderboards` V2 objects.
### Changed
- **Visual Refinement**: Rotated the letter circle by 30 degrees clockwise and reduced its radius for a more balanced aesthetic.
- **Minimalist Branding**: Simplified the global header by removing the text logotype, leaving only the primary icon.
