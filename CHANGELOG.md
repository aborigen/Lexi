
# Changelog

## [2.3.0] - 2024-06-02
### Removed
- **Esbuild Removal**: Stripped all `esbuild` dependencies, optional binaries, and overrides. 
- **Build Refactoring**: Switched fully to Next.js native SWC compiler for better compatibility and to avoid binary installation scripts.

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
