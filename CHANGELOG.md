# Changelog

## [2.15.0] - 2024-07-02
### Added
- **Responsive Layout Engine**: Implemented adaptive layouts that intelligently shift components between portrait and landscape modes to avoid cutoffs.
- **FAB Advisor**: Refactored the AI Advisor into a compact Floating Action Button (FAB) for better ergonomics and more screen real estate.
### Fixed
- **SVG Drawing Correction**: Resolved a critical coordinate mapping bug that caused connection lines to draw incorrectly or disappear on scaled mobile screens.
- **Yandex SDK Stability**: Fixed `TypeError: _.get is not a function` by refactoring the SDK bridge to use modern `Player` and `Leaderboards` V2 objects.
### Changed
- **Visual Refinement**: Rotated the letter circle by 30 degrees clockwise and reduced its radius for a more balanced aesthetic.
- **Minimalist Branding**: Simplified the global header by removing the text logotype, leaving only the primary icon.

## [2.14.0] - 2024-06-27
### Added
- **Promotion Toolkit**: Integrated Yandex Games Feedback API and Shortcut API to boost game ranking and player retention.
- **Enhanced Analytics**: New stats tracking for `Total Sessions` and `Longest Word Found`, synchronized with Yandex Cloud Storage.
- **Engagement Prompts**: Intelligent review requests and shortcut suggestions triggered after level completion milestones.

## [2.13.0] - 2024-06-25
### Added
- **Literary Masterpiece**: Finalized the Russian library with 112+ high-quality levels based on Pushkin's *Eugene Onegin*.
- **Comprehensive Hints**: Every single valid word (including sub-words) now has a literary citation or contextual hint available via the AI Advisor.
