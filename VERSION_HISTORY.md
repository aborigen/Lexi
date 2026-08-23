# Lexi.AI - Version History

## v2.25.0 (2024-07-17)
### New Features
- **Level Navigation**: Added a "Skip Level" button (`SkipForward` icon) to the header for easier testing and gameplay.

## v2.24.0 (2024-07-16)
### Project Reorganization
- **Asset Cleanup**: Removed the `public/promo` folder.
- **Source Management**: Moved all SVG promotional materials to the root `promo/` directory to separate store assets from runtime public assets.

## v2.23.0 (2024-07-15)
### Yandex SDK Compliance Refinement
- **Modern Property Only**: Refactored SDK utility to use `ysdk.leaderboards` exclusively, removing the deprecated `getLeaderboards()` fallback to silence platform warnings.
- **Performance**: Streamlined service access for faster leaderboard reporting.

## v2.22.0 (2024-07-14)
### Yandex SDK Standard Compliance
- **Deprecation Fix**: Migrated from `ysdk.getLeaderboards()` to `ysdk.leaderboards` to comply with modern V2 standards.
- **Resilience**: Improved safety checks for the leaderboard service to prevent Proxy-triggered warnings.
