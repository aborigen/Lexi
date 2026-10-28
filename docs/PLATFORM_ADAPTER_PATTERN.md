# Platform Adapter Pattern in Lexi.AI (Refactored)

Lexi.AI utilizes the **Platform Adapter Pattern** to maintain a single codebase while deploying to Yandex Games, VK Games, Sber Salute, and Standalone Web.

## 1. Strategic Refactoring
The architecture has been updated to provide a more modular "Strategy" approach. The bridge (`src/lib/yandex-sdk.ts`) serves as the **Context**, and the platform-specific blocks inside it act as the **Strategies**.

## 2. Sber Devices (Salute) Specialization
Sber integration requires a two-way communication channel between the web app and the Salute Assistant.

### How it works for Sber:
- **State Feedback**: The app periodically sends its state to the Assistant so the voice scenario knows what level the user is on.
- **Voice Commands**: The refactored bridge is prepared to receive events via `on('data')`, allowing the game to respond to commands like "Start Level" or "Get Hint" spoken to the device.
- **TV Optimization**: The bridge ensures that persistence is handled correctly for shared TV devices via the Salute storage logic.

## 3. Unified Interface Reference

| Method | Yandex Games | VK Games | Sber Salute | Standalone |
|--------|--------------|----------|-------------|------------|
| `initYandexSDK()` | `YaGames.init()` | `VKBridge.init()`| `AssistantClient.create()` | No-op |
| `updatePlayerStats()`| `player.setStats()`| `VKWebAppStorageSet` | `assistant.sendData()` | `localStorage` |
| `syncHighScore()` | `player.setData()` | N/A (LB only) | `assistant.sendData()` | `localStorage` |
| `reportScore()` | `lb.setScore()` | `ShowLBBox` | `assistant.sendData()` | No-op |

## 4. Development Benefits
1. **Isolation**: You can simulate any platform by changing the `.env` variable.
2. **Clean UI**: React components are not cluttered with `if (yandex) ... else if (sber)` blocks.
3. **Voice Readiness**: The Sber scaffold is ready for integration with voice-activated gameplay.
