# Lexi.AI - Development Chat History

This document provides a summary of the key development milestones and architectural decisions made during the creation of Lexi.AI.

## Session Overview
**Goal**: Build a polished, AI-enhanced Word Connect puzzle game optimized for the Yandex Games platform with high-quality Russian literary content.

## Key Milestones

### 1. Literary Content Expansion
- **Action**: Integrated over 112 levels for the Russian locale based on Alexander Pushkin's *Eugene Onegin*.
- **Decision**: Used JSON-based level storage for fast, zero-latency loading.
- **Outcome**: A rich cultural experience that differentiates Lexi.AI from generic word games.

### 2. AI Advisor & Hint System
- **Action**: Developed a Genkit-powered hint system that provides poetic citations with missing target words.
- **Decision**: For production stability and static hosting compatibility, citations are pre-baked into the level data, with the AI logic handled client-side to simulate an "intelligent" response.
- **Outcome**: A unique "Citation Hint" mechanic that encourages players to use context clues.

### 3. Yandex Games SDK V2 Integration
- **Action**: Implemented full SDK support in `src/lib/yandex-sdk.ts`.
- **Key Features**:
  - **Cloud Sync**: High scores and player stats are saved to Yandex Cloud Storage.
  - **Leaderboards**: Integrated global competitive ranking.
  - **Language Auto-Detection**: Language is detected via SDK at launch (before `signalGameReady`).
  - **Loading API**: Explicitly signaled `ready()` once all resources and data were loaded.

### 4. UI/UX Refinements
- **Action**: Implemented a glassmorphic "Blue Sky" and "Starry Night" theme.
- **Onboarding**: Added an animated "Hand Pointer" that demonstrates the drag mechanic to new users.
- **Optimization**: Disabled the global context menu to prevent accidental browser popups during gameplay.

### 5. Architectural Optimization for Static Export
- **Action**: Refactored the app to remove all Next.js Server Actions.
- **Decision**: Enabled `output: 'export'` in `next.config.ts`.
- **Outcome**: The game is now 100% compatible with Yandex Games static hosting, offering zero-latency performance and full offline support.

## Technical Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & ShadCN UI
- **AI**: Genkit (Development) / Static Library (Production)
- **Game Engine**: Custom React Logic for WordConnect
- **Platform**: Yandex Games SDK V2
