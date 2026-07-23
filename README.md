
# Lexi.AI - Word Connect Puzzle

A bright and engaging Word Connect puzzle game built with Next.js, React, and Firebase Genkit.

## GitHub Repository
[https://github.com/aborigen/Lexi.git](https://github.com/aborigen/Lexi.git)

## Features
- **Circular Interaction**: Intuitive line drawing to form words.
- **AI Advisor (Powered by Genkit)**: Smart hints that provide famous citations with missing words, helping you guess the answer through context.
- **Yandex SDK Integration**: Cloud high-score synchronization and leaderboard support.
- **Dynamic Theming**: Support for "Blue Sky" (Light) and "Starry Night" (Dark) modes.
- **Fully Localized**: Play in English or Russian with custom content for both.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & ShadCN UI
- **AI Engine**: [Genkit](https://github.com/firebase/genkit) using Google Gemini
- **Platform**: Yandex Games SDK

## How Genkit is Used
Lexi.AI leverages **Genkit** to create a sophisticated hint system. Unlike simple "reveal a letter" hints, our AI Advisor uses Genkit's `defineFlow` and `definePrompt` to:
1. **Analyze State**: Accesses the current level's letters and your found words.
2. **Contextual Generation**: Uses LLMs to find or create famous quotes that include a target word you haven't found yet.
3. **Structured Response**: Safely replaces the target word with "_____" and returns a structured JSON object to the UI.

## Documentation
- [UI Architecture](./docs/CODE_DOCUMENTATION.md)
- [Yandex Games Promo Materials](./docs/PROMO_MATERIALS.md)

## Getting Started
To get started, take a look at `src/app/page.tsx`.
