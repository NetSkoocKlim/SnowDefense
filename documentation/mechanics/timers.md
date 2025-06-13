# Кастомная система таймеров

В игре используется система таймеров для отслеживания времени, 
выполнения периодических действий и реализации механики задержки (cooldown) 
и отложенных событий. Всего выделено три класса:

  - `Timer` — базовый класс с минимальным функционалом запуска и приостановки.

  - `IncrementTimer` — наследник `Timer` для накопления времени с шагом фиксированной длительности и возможностью планирования событий.

  - `CooldownTimer` — наследник `Timer` для обратного отсчёта от заданного значения до нуля и вызова обработчика по завершении.

Каждый экземпляр при создании автоматически добавляется в 
глобальный массив `Timer.timers`,
что позволяет массово управлять всеми таймерами (например, при паузе всей игры).

---

1. Класс `Timer`

   Базовый класс, предоставляющий общие механизмы запуска,
приостановки и форматирования текущего времени.
    - Поля
      - `name` — уникальное имя таймера (используется для отладки).
      - `time`  — текущее значение времени (секунды).
      - `timerId` — идентификатор отложенного вызова (`setTimeout`) или `null`, если остановлен.
      - `onTick`  — коллбэк, вызываемый при каждом шаге таймера (в дочерних классах).
      - `isShouldContinue` — флаг, разрешающий продолжать работу (например, после глобальной паузы).

   - Методы

     - `constructor(name)`:
     
        Инициализирует поля, добавляет `this` в `Timer.timers`.

     - `pause()`: 
     
        Прекращает текущий цикл: `clearTimeout(this.timerId)` и сбрасывает `timerId` в `null`.

     - `runTimer()`: 
     
        Если `timerId` не равен `null`, инициирует новый `setTimeout(() => this.runTimer(), 50)`.
        > Важно: базовый `runTimer` не изменяет `time`!

     - `resume()`:

        Устанавливает` timerId = setTimeout(() => this.runTimer(), 50)` без изменения `time`.

     - `get seconds()`:
     
        Геттер возвращает число секунд (целых) текущего time: `Math.floor((this.time + 0.9999) % 60)`.

     - `toString()`:
        Форматирует time в виде MM:SS, например "02:05" для 125 секунд.

2. Класс `IncrementTimer`

   Наследник `Timer`, увеличивающий счётчик и позволяющий планировать события на определённые моменты времени.
    ```js
    class IncrementTimer extends Timer {
      scheduledEvents: Array<{time: number, callback: () => void, executed: boolean}>;
    }
    ```
   - Поля
     - `scheduledEvents` — массив запланированных событий: `{ time, callback, executed }`

       - `time` — момент (в секундах) для срабатывания.

       - `callback` — функция, вызываемая при достижении `time`.

       - `executed` — флаг, чтобы событие не выполнилось повторно.

   - Методы

       - `scheduleEvent(eventTime: number, callback: () => void)`
     
           Добавляет в `scheduledEvents` новую запись.
    
       - `checkEvents()`: 
     
           Проходит по `scheduledEvents`, и если `!executed && this.time >= time`, запускает callback и выставляет `executed = true`.
    
       - `clearEvents()`: 
     
           Очищает массив `scheduledEvents` (удаляет все будущие события).
    
       - Переопределённый `runTimer()`: 
    
         - Увеличивает `this.time += 0.05`.
    
         - Вызывает `checkEvents()`.
    
         - Если есть `onTick`, вызывает его.
    
         - Вызывает базовый `super.runTimer()`.

       - `reset()`:
   
          - Сбрасывает `this.time = 0`, но не очищает события и не приостанавливает таймер.
3. Класс `CooldownTimer`

   Наследник `Timer` для обратного отсчёта и автоматического сброса или остановки по завершении.
    ```js
    class CooldownTimer extends Timer {
        startTime;
        onComplete;
        shouldReset;
    }
    ```
   - Поля
     - `startTime` — значение, с которого начинается обратный отсчёт.

     - `onComplete` — событие, срабатывающие при достижении таймера нуля.

     - `shouldReset` — разрешать ли автоматический сброс и продолжение после достижения нуля.

   - Методы
     - `constructor(name, startTime, {shouldReset = true})`
       - Инициализирует обратный отсчёт, устанавливает `time = startTime`, `shouldReset`, `onComplete = null`.

     - Переопределённый `runTimer()`
       - Отнимает `this.time -= 0.05`.

       - Если` time <= 0`:

       - Вызывает `onComplete`, если он задан.

       - Вызывает `reset()`.

       - Если `!shouldReset`, приостанавливает таймер (`pause()`) и выходит.

       - Вызывает `onTick`, если задан.

       - Вызывает базовый `super.runTimer()`.
     - `reset({startTime} = {})`
       - Если передан аргумент `startTime`, обновляет `this.startTime`, затем устанавливает `this.time = this.startTime`.
4. Управление всеми таймерами
   Поля и методы класса Game позволяют автоматически приостанавливать и возобновлять все созданные таймеры:
    - `Timer.timers` — глобальный массив всех экземпляров.
    - `pauseGame()` вызывает `pause()` для каждого таймера с активным `timerId`.
    - `resumeGame()` через `checkAndContinue()` возобновляет только те таймеры, у которых `isShouldContinue = true`.
5. Примеры использования

    1. Отслеживание общего времени игры
        ```js
        // В файле game.js
        Game.timer = new IncrementTimer("GameTimer");
        Game.timer.onTick = () => {
        Game.statsPanel.update({ elapsedMs: Game.timer.time });
        };
        Game.timer.isShouldContinue = true;
        // По запуску уровня:
        Game.timer.resume();
        ```
       Здесь `IncrementTimer` накапливает общее прошедшее время с шагом 50 мс и обновляет UI.
   
    2. Планирование спавна волн врагов
        ```js
        // В WaveManager.setWaveDescription():
        incrementTimer.scheduleEvent(spawnTime, () => {
        EnemySpawner.spawnEnemy({ side, count, isElite });
        });
        ```
       Когда `incrementTimer.time` достигает `spawnTime`, вызывается переданный коллбэк и создаются враги.
   3. Таймер отката перезарядки оружия башни
        ```js
        // В TowerGun:
        this.reloadTimer = new CooldownTimer("TowerGunReload", this.reloadTime, { shouldReset: false });
        this.reloadTimer.onComplete = () => { this.reload(); };
        this.reloadTimer.isShouldContinue = true;
        // После выстрела:
        this.reloadTimer.resume();
        ```
      `CooldownTimer` уменьшает `time` до нуля, затем срабатывает `onComplete`, восстанавливая возможность стрельбы.