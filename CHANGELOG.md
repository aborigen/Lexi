# Changelog

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
- **Asset Documentation**: Updated `docs/PROMO_MATERIALS.md` with links to localized Russian visual assets.

## [2.18.0] - 2024-07-10
### Added
- **Localized Marketing Assets**: Enhanced `docs/PROMO_MATERIALS.md` with polished Russian marketing copy and metadata.
- **Store Readiness**: Optimized short and full descriptions for the Yandex Games Russian locale.

## [2.17.0] - 2024-07-09
### Added
- **SVG Promo Assets**: Generated `public/promo/cover.svg` (800x470) and `public/promo/icon_512.svg` (512x512) for platform publishing.
- **Asset Documentation**: Updated `docs/PROMO_MATERIALS.md` with direct references to the new SVG source files.

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
