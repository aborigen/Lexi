# Changelog

## [2.23.0] - 2024-07-15
### Changed
- **Yandex SDK Standard Compliance**: Fully migrated to `ysdk.leaderboards` and removed all references to the deprecated `getLeaderboards()` method.
- **Refined Service Access**: Improved the `getLeaderboardService` helper to be more direct and efficient.

## [2.22.0] - 2024-07-14
### Fixed
- **Yandex SDK Deprecation**: Resolved `ysdk.getLeaderboards()` deprecation by fully migrating to the modern `ysdk.leaderboards` property.
- **Resilient API Handling**: Updated `getLeaderboardService` to strictly prioritize the Promise-based property and avoid triggering Proxy-based deprecation warnings.

## [2.21.0] - 2024-07-13
### Fixed
- **Leaderboard API**: Resolved `TypeError: _.getLeaderboardEntries is not a function` by implementing a robust service retrieval helper with fallback logic for older SDK environments.

## [2.20.0] - 2024-07-12
### Added
- **Gameplay Screenshots**: Generated vector SVG screenshots for both orientations (Portrait/Landscape) and languages (EN/RU).
- **Asset Manifest**: Updated promotional documentation to include all mandatory store visual assets.

## [2.19.0] - 2024-07-11
### Added
- **Localized Russian Promo Assets**: Created `public/promo/cover_ru.svg` and `public/promo/icon_ru_512.svg` with Russian branding.
- **Asset Documentation**: Updated `docs/PROMO_MATERIALS.md` to include references to localized Russian visual assets.
