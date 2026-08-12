# Lexi.AI - Version History

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

## v2.13.0 (2024-06-25)
### Performance & Content
- **Zero-Latency**: Removed all server round-trips for hints. The game now runs entirely on the client, optimized for Yandex Games static hosting.
- **Pushkin Collection**: Completed the massive 112-level Russian literary expansion.
- **Total Word Coverage**: Audited and added citations for every single valid word in the game.
