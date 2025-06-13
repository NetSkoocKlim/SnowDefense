# Работа с уровнями

Все управление уровнями разделено на два этапа:

1. **Создание описания уровней** (во время инициализации):

   - `LevelInitializer` заполняет `LevelCreator` описаниями уровней и волн.

   - `LevelCreator` накапливает данные о каждом уровне и создает финальный объект.

2. **Использование описания во время игры**:

   - `LevelManager` управляет переходами между уровнями, отпочковкой волн и начислением дохода.

   - `WaveManager` берет описания волн текущего уровня и по таймеру спавнит врагов

---

1. Определение уровней

   1. `LevelInitializer`
      - Точка входа для описания всех уровней
      - Создает экземпляр `LevelCreator`, добавляет уровни через `addLevel` и возвращает готовую структуру:
      ```js
        const creator = new LevelCreator();
        // пример добавления уровня
        creator.addLevel(
            income,           // доход игрока каждые N секунд
            startGold,        // начальное золото
            enemyHp,          // HP врагов (common/elite)
            enemyAttack,      // Атака врагов (common/elite)
            eliteSpawnChance, // шанс появления элитных врагов
            enemyReward,      // награда за убийство врага
            levelConfigFn     // функция для описания волн
        );
        return creator.build();
        ```
      - Внутри `levelConfigFn` вызываются `builder.addWave(fn)` для каждой волны.
   2. `LevelCreator`
      - Хранит массив уровней (`this.levels`).
      - Метод `addLevel(income, startGold, enemyHp, enemyAttack, eliteSpawnChance, enemyReward, configureFn)`:
        1. Формирует объект `builder` c базовыми параметрами.
        2. Если configureFn передана — вызывает ее, передавая `builder`, чтобы добавить волны.
        3. Сохраняет `builder` в `this.levels`.
        4. Возвращает `this` для цепочек вызовов.
      - Метод `build()`:
        - Преобразует внутренние `builder` в чистые описания уровней.
        - Добавляет `waveCount` — количество волн.
        - Возвращает объект `{ levels, levelCount }`.

2. Описание волн
    1. `WaveCreator`
   
       Используется внутри `LevelCreator` для описания каждой волны.
       - Поля:

         - `endWaveTime` — время (в секундах) от начала волны до её завершения.
    
         - `spawns` — массив точечных спавнов (`Spawn`).
    
         - `randomSpawns` — массив рандомных спавнов (`RandomSpawn`).

       - Методы:
            - `setEndWaveTime(time)` — задает `endWaveTime`.
    
           - `addSpawn(timerValue, enemies)` — добавляет `Spawn(timerValue, enemies)` в `spawns`.
    
           - `addRandomSpawn(startTimerValue, delay, enemiesPerSpawn, options)` — добавляет `RandomSpawn`.
    
           - `build()` — возвращает объект, содержащий поля `endWaveTime`, `spawnsCount`, `spawns`, `randomSpawnsCount`, `randomSpawns`.
    2. Классы `Spawn` и `RandomSpawn`
       - `Spawn(timerValue, enemies)` — одиночный спавн врагов:
         - `timerValue` — время спавна.

         - `enemies` — объект вида `{ common: [...], elite: [...] }`.
         
       - `RandomSpawn(startTimerValue, delay, enemiesPerSpawn, endTimerValue)` — спавн с периодическим повторением:
         - `startTimerValue` — начало цикла.

         - `delay` — интервал между спавнами.

         - `enemiesPerSpawn` — количество врагов за один спавн.

         - `endTimerValue` — (опционально) время окончания рандомного спавна.

3. Управления волнами

   `WaveManager` отвечает за пошаговое исполнение описания волн:

   1. Инициализация:

      - Создает `IncrementTimer` для событий внутри волны.

      - Создает `CooldownTimer` для задержки между волнами (`waveEndTimer`).

      - Показывает `NextWavePopup` перед стартом следующей волны.

   2. `setLevelDescription(levelDescription)`:

      - Сохраняет описание текущего уровня.

      - Устанавливает `waveCount`, сбрасывает `currentWave`.

      - Вызывает `setWaveDescription()` для подготовки первой волны.

   3. `setWaveDescription()`:

      - Берет описание волны `this.waveDescription`.

      - Обновляет UI (номер волны).

      - Для каждого Spawn планирует событие `scheduleEvent(timerValue, callback)`:

        - В callback спавнятся common/elite враги через `EnemySpawner.spawnEnemy()`.

      - Для каждого `RandomSpawn` планирует:

        - В callback запускает `EnemySpawner.setSpawnRate(enemiesPerSpawn, delay)`.

        - Если `endTimerValue` задан — планируется событие для `EnemySpawner.unsetSpawnRate()`.

      - Планирует окончание волны через `scheduleEvent(endWaveTime, () => this.endWave())`.

   4. `startNextWave()` — сбрасывает и запускает `waveTimer`.

   5. `endWave()`:

      - Если это последняя волна и все враги убиты — вызывает `Game.levelManager.endLevel()`.

      - Иначе:

        - Для перехода к следующей волне запускает `waveEndTimer` и показывает отсчет во всплывашке.
4. Управление уровнями

   `LevelManager` объединяет волны в полноценную систему уровней:
   
   - Поля:
       - `currentLevel`, `levelCount`, `levelsDescription`, `incomeTimer`.

       - `waveManager` — экземпляр `WaveManager`.

   - `reset()` — сбрасывает статистику и номер уровня.

   - `initLevel() `— настраивает текущий уровень перед стартом:

     - Сбрасывает `incomeTimer`.

     - Из `levelsDescription` получает параметры уровня (`income`, `startGold`, `enemyHp`, ...).

     - Устанавливает данные в `EnemySpawner`.

     - Обновляет панель старта уровня и статистики.

     - Вызывает `waveManager.reset()` и `waveManager.setLevelDescription(...)`.

     - Вызывает `Game.renderStart()` для отрисовки экрана.

   - `startLevel() `— начинает уровень:

     - Запускает `incomeTimer` и `waveManager.startNextWave()`.

     - Показывает подсказку для новичков.

   - `endLevel()` — завершаeт уровень:

     - Обновляет рекордные данные (уровень, время, потраченные ресурсы).

     - Пауза игры, показ панели конца уровня.

     - Если это последний уровень — показывает финальную панель.

5. Итоговый механизм работы
   1. При загрузке: `LevelInitializer.initLevels()` формирует описание всех уровней.

   2. Создается `LevelManager`, он получает `Game.levelData` и настраивает `waveManager`.

   3. `LevelManager.initLevel()` подготавливает первый уровень.

   4. Игрок нажимает "Старт": вызывается `startLevel()`, запускаются таймеры и первая волна.

   5. `WaveManager` спавнит врагов по таймеру, завершает волну, показывает задержку до следующей.

   6. После всех волн `LevelManager.endLevel()` переходит к следующему уровню или завершает игру.
