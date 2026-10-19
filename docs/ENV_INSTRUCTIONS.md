# Lexi.AI - Environment Configuration Guide

This document explains how to use the `.env` file to configure your local development environment and switch between publishing platforms.

---

## 1. The `.env` File
The `.env` file is located in the root directory of the project. It stores configuration variables that are specific to your local machine.

### Key Variables:
- `NEXT_PUBLIC_GAME_PLATFORM`: Determines which SDK bridge is active.
- `GEMINI_API_KEY`: Your Google AI API key for Genkit (if using server-side features).

---

## 2. Switching Platforms
Lexi.AI uses a **Platform Adapter Pattern**. You can switch the entire game logic (leaderboards, cloud saves, and script injections) by changing the `NEXT_PUBLIC_GAME_PLATFORM` value.

### Supported Values:
1.  **`standalone`** (Default): Uses `localStorage` for all data. Best for standard web hosting.
2.  **`yandex`**: Injects the Yandex Games SDK v2. Enables Cloud Saves and Yandex Leaderboards.
3.  **`vk`**: Injects the VK Games Bridge. Enables VK Storage and Leaderboard boxes.
4.  **`sber`**: Integrates with the Sber Devices Assistant Client.

### How to Switch:
1.  Open the `.env` file.
2.  Update the platform variable:
    ```env
    NEXT_PUBLIC_GAME_PLATFORM=yandex
    ```
3.  Restart your development server: `npm run dev`.

---

## 3. API Keys & Security
The `.env` file is listed in `.gitignore`. **This is intentional and critical for security.**

- **Never commit `.env` to Git**: This prevents your private API keys (like your Gemini key) from being leaked on public repositories.
- **Local Configuration**: Each developer should have their own `.env` file.
- **Production**: When deploying to platforms like Vercel or Firebase App Hosting, you should set these variables in the provider's dashboard instead of a file.

---

## 4. Troubleshooting
- **SDK not loading**: Ensure you have an active internet connection, as the bridge loads SDK scripts from platform CDNs.
- **Variable not updating**: In Next.js, changes to `.env` files require a server restart to take effect.
