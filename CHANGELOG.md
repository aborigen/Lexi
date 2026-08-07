
# Changelog

## [2.14.0] - 2024-06-27
### Added
- **Promotion Toolkit**: Integrated Yandex Games Feedback API and Shortcut API to boost game ranking and player retention.
- **Enhanced Analytics**: New stats tracking for `Total Sessions` and `Longest Word Found`, synchronized with Yandex Cloud Storage.
- **Engagement Prompts**: Intelligent review requests and shortcut suggestions triggered after level completion milestones.
### Changed
- **Launch Optimization**: Refined initialization flow with precise `LoadingAPI.ready()` signaling only after all cloud data is synced.
- **Player Immersion**: Disabled global browser context menu to prevent accidental interruptions during gameplay.

## [2.13.0] - 2024-06-25
### Added
- **Literary Masterpiece**: Finalized the Russian library with 112+ high-quality levels based on Pushkin's *Eugene Onegin*.
- **Comprehensive Hints**: Every single valid word (including sub-words) now has a literary citation or contextual hint available via the AI Advisor.
### Changed
- **Static Export Optimization**: Refactored the entire app to remove Server Actions. The game is now 100% compatible with `output: 'export'`, ensuring seamless performance on Yandex Games.
- **Content Audit**: Completed a full audit of all level data; fixed inconsistencies between letter sets and valid word lists.

## [2.12.0] - 2024-06-20
### Added
- **Onboarding System**: Implemented a dynamic "Hand Pointer" animation for first-time users. It demonstrates the core "drag-to-connect" mechanic using the first level's letters.
- **Persistence**: Onboarding completion status is now saved in `localStorage`.

## [2.11.0] - 2024-06-18
### Added
- **Literary Content Expansion**: Added initial bulk of Russian levels based on Alexander Pushkin.
- **Verse Formatting**: Enhanced the hint system to support multi-line poetic citations.
