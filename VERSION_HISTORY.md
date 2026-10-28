
# Lexi.AI - Version History

## v2.36.2 (2024-08-01)
### Platform Expansion
- **Sber Assets**: Created promo materials for Sber Devices in `promo/sber`.

## v2.36.1 (2024-07-31)
### UX Streamlining
- **Automated Progression**: Removed the Level Complete dialog. The game now automatically advances to the next level 2.5 seconds after a success, allowing for a better "flow" state.
- **Seamless Transitions**: Cleaned up code in `page.tsx` by removing the victory dialog state and logic.

## v2.36.0 (2024-07-30)
### Core Gameplay Refactor
- **Linear Progression**: Replaced random level shuffling with a sequential progression system.
- **Level Unlocking**: Added logic to lock future levels until the current one is completed.
- **Persistent State**: Level index and highest reached level are now saved to `localStorage` and synced with platform cloud storage.
- **Anagram Mode**: Refactored to a "One Word" rule where the target is the pangram using all letters.

### UI & UX Enhancements
- **In-Game AI Advisor**: Moved citation hints from a separate modal to a persistent, togglable display within the main `WordGrid`.
- **Default Hints**: The AI Citation is now shown automatically when a level begins.
- **Onboarding Refinement**: Added an animated "Hand Pointer" to demonstrate the draw mechanic to new users.
- **Landscape Optimization**: Wider sidebar layout for better fitting of long words on wide screens.
- **Celebration Timing**: Delayed the Victory Logic by 2 seconds to improve the impact of success animations.

## v2.35.3 (2024-07-29)
### UI Refinement
- **Wider Word Discovery**: Increased the width of the sidebar in landscape orientation to prevent target word letters from wrapping.
- **Single-Line Layout**: Forced a horizontal, non-wrapping layout for letter slots in landscape mode for better visual flow.

## v2.35.2 (2024-07-29)
### Added
- **VK Deployment Automation**: Integrated `vk-miniapps-deploy` for one-click uploading to VK Games hosting.
- **Configuration**: Added `vk-hosting-config.json` template for VK production builds.
- **Documentation**: Added `docs/GIT_WORKFLOW.md` explaining branching strategies for multi-platform development.
