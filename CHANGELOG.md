
# Changelog

## [2.29.0] - 2024-07-21
### Removed
- **Yandex Games SDK**: Core SDK integration removed for standalone deployment. Restoration instructions added to `docs/YANDEX_SDK_RESTORE.md`.
### Changed
- **Persistence**: Switched cloud synchronization to `localStorage` fallbacks for scores and statistics.

## [2.28.0] - 2024-07-20
### Refined
- **Word Connect UI**: Adjusted the letter ring rotation to 45 degrees for better visual symmetry and improved gameplay ergonomics.

## [2.27.0] - 2024-07-19
### Changed
- **Leaderboard Refactor**: Implemented a more robust data processing algorithm with client-side deduplication, explicit sorting, and unique keying based on player IDs.
- **Player Highlighting**: Added specific UI logic to identify and highlight the current user's entry in global rankings.
- **Enhanced UX**: Added error handling with retry capability and improved loading/empty states for the leaderboard.
