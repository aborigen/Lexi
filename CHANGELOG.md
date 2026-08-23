# Changelog

## [2.25.0] - 2024-07-17
### Added
- **Level Skipping**: Added a "Next Level" button in the header to allow players to manually advance levels.
- **Improved UX**: Users can now bypass difficult levels using the skip icon.

## [2.24.0] - 2024-07-16
### Removed
- **Redundant Assets**: Deleted the `public/promo` directory.
- **Cleanup**: Reorganized all store promotional materials to the root `promo/` folder for better source management.

## [2.23.0] - 2024-07-15
### Changed
- **Yandex SDK Standard Compliance**: Fully migrated to `ysdk.leaderboards` and removed all references to the deprecated `getLeaderboards()` method.
- **Refined Service Access**: Improved the `getLeaderboardService` helper to be more direct and efficient.

## [2.22.0] - 2024-07-14
### Fixed
- **Yandex SDK Deprecation**: Resolved `ysdk.getLeaderboards()` deprecation by fully migrating to the modern `ysdk.leaderboards` property.
- **Resilient API Handling**: Updated `getLeaderboardService` to strictly prioritize the Promise-based property and avoid triggering Proxy-based deprecation warnings.
