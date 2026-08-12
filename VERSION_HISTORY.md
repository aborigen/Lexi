
# Lexi.AI - Version History

## v2.15.2 (2024-07-04)
### SDK Maintenance
- **API Modernization**: Switched to `ysdk.leaderboards` property, resolving deprecation warnings in the Yandex environment.
- **Reliability**: Improved error handling during leaderboard initialization.

## v2.15.0 (2024-07-02)
### Adaptive UX & Stability
- **Orientation Awareness**: Dynamic repositioning of the word grid and interaction circle for portrait/landscape.
- **Compact Interaction**: AI Advisor moved to FAB style to prevent overlap with the puzzle board.
- **SDK V2 Fix**: Completely resolved the `_.get` runtime error in Yandex environment.
- **Precision Drawing**: Corrected SVG path logic to ensure lines always track exactly with user input.

## v2.14.0 (2024-06-27)
### Promotion & Retention
- **Yandex SDK V2**: Full integration of Review (Feedback) and Shortcut APIs.
- **Session Stats**: Added tracking for total sessions and longest words discovered.
- **Launch Stability**: Guaranteed language auto-detection and SDK readiness before game start.
