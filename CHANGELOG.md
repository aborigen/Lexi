
# Changelog

## [2.2.0] - 2024-06-01
### Added
- **Simplified UI**: Centered minimalist layout focusing on core gameplay.
- **Russian Levels**: Added 5-letter Russian word puzzles (ПИЛОТ, КОМАР, КНИГА).
- **Landscape Support**: Adaptive grid for better experience on wide screens and tablets.
- **Local Font Stacks**: Switched to system fonts for better performance and offline reliability.

### Changed
- **Code Organization**: Moved levels and word lists to a dedicated `src/lib/levels.ts`.
- **Yandex SDK Refinement**: Improved `signalGameReady` timing and automated language detection.
- **Accessibility**: Implemented dynamic `html lang` attribute updates.

### Fixed
- **Build Stability**: Finalized `esbuild` compatibility for macOS 10.15 (Catalina).
- **Layout Overflow**: Fixed scrolling issues on small viewports.

## [2.1.4] - 2024-05-31
### Fixed
- **Installation Fix**: Added explicit `@esbuild/darwin-x64` to `optionalDependencies` to bypass `node install.js` script failures on macOS 10.15.

## [2.1.3] - 2024-05-31
### Fixed
- **Legacy macOS Support**: Added `npm overrides` to force `esbuild@0.19.12`. This resolves `dyld` symbol errors on macOS 10.15 (Catalina).

## [2.1.2] - 2024-05-30
### Fixed
- **Build Compatibility**: Removed explicit `esbuild` pins to allow the package manager to resolve compatible binaries for macOS 10.15.

## [2.1.0] - 2024-05-28
### Added
- **OS Compatibility**: Explicitly pinned `esbuild` version and updated `browserslist` for Safari 13.
- **Static Export**: Enabled `output: 'export'` in `next.config.ts`.

## [2.0.0] - 2024-05-27
### Added
- **Total Pivot**: Refactored from Columns.AI to Lexi.AI (Word Connect).
- **Circular Interaction**: New drawing mechanic for linking letters.
- **Word Validation**: Dictionary-based system with level progression.
- **Lexical AI**: GenAI flow providing cryptic linguistic hints.
