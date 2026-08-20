
# Changelog

## [2.16.0] - 2024-07-08
### Added
- **Atomic Persistence**: Implemented `flush: true` in Yandex Cloud Storage sync to ensure immediate data commitment.
- **Manual Save Button**: Added a dedicated Save action to the global header for explicit user-triggered cloud synchronization.
- **Bilingual Documentation**: Created `docs/SCORING_LOGIC.md` and `docs/HOW_TO_PLAY.md` with full English and Russian support.
### Fixed
- **SDK Stability**: Resolved `TypeError: _.get is not a function` by refactoring the player initialization sequence.
- **Leaderboard API**: Switched from deprecated `getLeaderboards()` to the modern `ysdk.leaderboards` property.
### Changed
- **Minimalist Header**: Removed the "LEXI.AI" text logotype to provide more space for game controls.
- **Enhanced Randomization**: Centralized shuffle logic to ensure unique level and letter layouts on every reset.
- **Layout Precision**: Refined SVG coordinate mapping and dynamic scaling to prevent UI cutoffs on narrow mobile screens.

## [2.15.3] - 2024-07-05
### Verified
- **Game Ready Signal**: Confirmed and reinforced that `LoadingAPI.ready()` is called after all asynchronous assets and cloud data are synchronized.
- **Initialization Sequence**: Added console logging to track the readiness signal for easier platform verification.

## [2.15.2] - 2024-07-04
### Fixed
- **Yandex SDK Deprecation**: Migrated from `ysdk.getLeaderboards()` to `ysdk.leaderboards` property to resolve console warnings and align with V2 API standards.
- **Scoring Documentation**: Updated `docs/SCORING_LOGIC.md` to reflect the new API property usage.

## [2.15.1] - 2024-07-03
### Fixed
- **Leaderboard API**: Corrected the Yandex SDK integration to use the asynchronous `getLeaderboards()` method, resolving a `TypeError` when accessing leaderboard entries.
- **Scoring Logic**: Ensured that leaderboard updates are triggered immediately upon achieving a new high score.

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
