
# Changelog

## [2.7.0] - 2024-06-06
### Added
- **Theme Engine**: Implemented dynamic theme switching between "Blue Sky" (Light) and "Starry Night" (Dark) with HSL persistence.
- **Literary Content**: Expanded Russian library with 10+ new levels featuring classic poetry (Pushkin, Lermontov, Tyutchev).
- **Gameplay Shuffling**: Implemented automatic level randomization on game start and language switch.
- **Backtrack Mechanics**: Added intuitive "undo" gesture support to the WordConnect interaction circle.

### Changed
- **UI Optimization**: Redesigned layout for a zero-scroll experience on mobile devices and removed the redundant bottom found-words list.
- **Architecture**: Split level data into modular language-specific files (`en.ts`, `ru.ts`) for better maintainability.
- **Error Handling**: Hardened JSON parsing logic during initialization to prevent "Unexpected end of JSON input" errors.

### Fixed
- **State Sync**: Improved cleanup logic when transitioning between levels to prevent ghost letters and paths.
- **Performance**: Memoized circular position calculations to reduce re-render overhead.

## [2.6.0] - 2024-06-05
### Added
- **Leaderboard UX**: Integrated a new "Show Leaderboard" button in the header for easier access to global rankings.
- **Automated Score Sync**: Scores are now explicitly reported to Yandex Games leaderboards immediately upon level completion.

### Changed
- **Mobile Optimization**: Redesigned UI for portrait orientation on smartphones, including a more compact header and a reduced scale for the letter circle.
- **Build Pipeline**: Updated archiving scripts to include the project's semantic version in the final ZIP filename for better release tracking.
- **Code Structure**: Refactored game components (renamed `ColumnsGame` to `Game`) for better project clarity.

### Fixed
- **Leaderboard Reporting**: Audited SDK integration to ensure high scores are reported using the latest state values, preventing stale data updates.
