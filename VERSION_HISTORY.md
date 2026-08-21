# Lexi.AI - Version History

## v2.23.0 (2024-07-15)
### Yandex SDK Compliance Refinement
- **Modern Property Only**: Refactored SDK utility to use `ysdk.leaderboards` exclusively, removing the deprecated `getLeaderboards()` fallback to silence platform warnings.
- **Performance**: Streamlined service access for faster leaderboard reporting.

## v2.22.0 (2024-07-14)
### Yandex SDK Standard Compliance
- **Deprecation Fix**: Migrated from `ysdk.getLeaderboards()` to `ysdk.leaderboards` to comply with modern V2 standards.
- **Resilience**: Improved safety checks for the leaderboard service to prevent Proxy-triggered warnings.

## v2.21.0 (2024-07-13)
### SDK Stability Fix
- **Leaderboard Resilience**: Fixed a critical `TypeError` when fetching leaderboard entries by adding a robust service retrieval helper.

## v2.20.0 (2024-07-12)
### Enhanced Marketing Assets
- **Localized Screenshots**: Created 9:16 portrait and 16:9 landscape SVG screenshots for English and Russian locales.
- **Promo Documentation**: Updated `docs/PROMO_MATERIALS.md` with the new screenshot manifest.
