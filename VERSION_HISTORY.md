
# Lexi.AI - Version History

## v2.29.0 (2024-07-21)
### Deployment & Standalone Refactoring
- **SDK Decoupling**: Removed all Yandex Games SDK script injections and platform-specific calls to support generic static hosting.
- **Offline Persistence**: Implemented a `localStorage` engine for all player progress, high scores, and lifetime statistics.
- **Restore Guide**: Created `docs/YANDEX_SDK_RESTORE.md` for future platform re-integration.

## v2.28.0 (2024-07-20)
### UI Refinement
- **Letter Ring Alignment**: Optimized the circular letter interaction by rotating the ring to a 45-degree start, providing a cleaner geometric layout for the interaction engines.
