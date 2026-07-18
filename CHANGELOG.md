
# Changelog

## [2.1.3] - 2024-05-31
### Fixed
- **Legacy macOS Support**: Added `npm overrides` to force `esbuild@0.19.12`. This resolves `dyld` symbol errors on macOS 10.15 (Catalina) where newer esbuild binaries fail due to missing system APIs.

## [2.1.2] - 2024-05-30
### Fixed
- **Build Compatibility**: Removed explicit `esbuild` pins to allow the package manager to resolve compatible binaries for macOS 10.15 (Catalina).
- **Tooling**: Added explicit `tsx` to `devDependencies` to ensure Genkit development scripts have a reliable runner.

## [2.1.1] - 2024-05-29
### Fixed
- **esbuild Fix**: Added `@esbuild/darwin-x64` to `optionalDependencies` to resolve native binary installation failures on macOS 10.15 Catalina.

## [2.1.0] - 2024-05-28
### Added
- **OS Compatibility**: Explicitly pinned `esbuild` version and updated `browserslist` to ensure builds work on macOS 10.15 (Catalina) and Safari 13.
- **Static Export**: Enabled `output: 'export'` in `next.config.ts` for standalone deployment.

## [2.0.0] - 2024-05-27
### Added
- **Total Pivot**: Refactored from Columns.AI (match-3) to Lexi.AI (Word Connect).
- **Circular Interaction**: New drawing mechanic for linking letters to form words.
- **Word Validation System**: Dictionary-based validation with level progression.
- **Lexical AI**: Updated GenAI flow to provide linguistic hints instead of grid strategies.
- **SVG Line Drawing**: Smooth visual feedback for word selection.

## [1.4.0] - 2024-05-26
### Added
- **Blue Sky Theme**: Redesigned the UI with a sunny day aesthetic.
