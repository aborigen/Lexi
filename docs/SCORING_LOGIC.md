# Scoring & Leaderboard Logic - Lexi.AI / Логика подсчета очков и таблицы лидеров

The score in Lexi.AI is calculated dynamically based on the complexity of the words discovered and is synchronized with the Yandex Games platform for global competition.

---

## English (en)

### 1. Word Discovery Scoring
In `WordConnect.tsx`, when a player successfully links a word, the game awards points using a simple but effective formula:
- **Formula**: `Word Length × 10`
- **Example**: Finding a 5-letter word adds **50 points** to the current session score.

### 2. High Score Persistence
The `page.tsx` component monitors the `score` state in real-time. If the current score exceeds the player's personal `highScore`, the application triggers a three-step persistence routine:

1. **Local State**: The `highScore` state is updated and immediately saved to the browser's `localStorage` for quick recovery on refresh.
2. **Cloud Data**: The `syncHighScoreToYandex` function (in `yandex-sdk.ts`) is called to store the value in Yandex Cloud Storage using the `setData` method. This ensures progress is kept across devices.
3. **Global Rankings**: The `reportScoreToLeaderboard` function is invoked to submit the new record to the competitive rankings.

### 3. Yandex SDK V2 Integration
The leaderboard integration follows the modern Yandex Games SDK V2 patterns:
- **Async Initialization**: We use `sdk.getLeaderboards()` (asynchronous) to obtain the leaderboard service instance. This prevents blocking the main thread during initial load.
- **Leaderboard Identifier**: All scores are reported to the technical leaderboard named `'leaders'`.
- **Public Rankings**: The `Leaderboard.tsx` component fetches the top 20 entries to display ranks, player avatars (via `getAvatarSrc`), and scores, creating a sense of community and competition.

---

## Russian (ru)

### 1. Начисление очков за найденные слова
В компоненте `WordConnect.tsx`, когда игрок успешно соединяет буквы в слово, игра начисляет очки по простой, но эффективной формуле:
- **Формула**: `Длина слова × 10`
- **Пример**: За нахождение слова из 5 букв к текущему счету сессии добавляется **50 очков**.

### 2. Сохранение рекордов
Компонент `page.tsx` отслеживает состояние `score` в реальном времени. Если текущий счет превышает личный рекорд игрока (`highScore`), приложение запускает трехэтапную процедуру сохранения:

1. **Локальное состояние**: Значение `highScore` обновляется и немедленно сохраняется в `localStorage` браузера для быстрого восстановления при обновлении страницы.
2. **Облачные данные**: Вызывается функция `syncHighScoreToYandex` (в `yandex-sdk.ts`) для сохранения значения в облачном хранилище Яндекса с помощью метода `setData`. Это гарантирует сохранение прогресса на разных устройствах.
3. **Глобальный рейтинг**: Вызывается функция `reportScoreToLeaderboard` для отправки нового рекорда в соревновательный рейтинг.

### 3. Интеграция с Yandex SDK V2
Интеграция таблицы лидеров соответствует современным паттернам Yandex Games SDK V2:
- **Асинхронная инициализация**: Мы используем асинхронный метод `sdk.getLeaderboards()` для получения экземпляра сервиса таблиц лидеров. Это предотвращает блокировку основного потока во время начальной загрузки.
- **Идентификатор таблицы**: Все результаты отправляются в техническую таблицу лидеров с названием `'leaders'`.
- **Публичный рейтинг**: Компонент `Leaderboard.tsx` запрашивает 20 лучших записей для отображения рангов, аватаров игроков (через `getAvatarSrc`) и очков, создавая атмосферу сообщества и конкуренции.
