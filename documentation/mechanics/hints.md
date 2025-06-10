# Механизм подсказок (туториала)

`HintManager` — менеджер подсказок для игры. 
Позволяет последовательно показывать пользователю 
текстовые подсказки, выделяя нужные элементы 
интерфейса и реагируя на клики или автоматические триггеры.

---

1. Концепция и назначение

    Менеджер подсказок решает задачу «вступительного туториала» и ряда других обучающих подсказок:
    
    - Создаёт затемнённый оверлей (.hint-overlay) поверх игрового поля.
    
    - Выделяет (блестящей рамкой) элементы интерфейса по CSS-селектору или показывает подсказку «без цели».
    
    - Рендерит модальное окно с текстом подсказки и кнопками «Далее»/«Пропустить».
    
    - Приостанавливает игру на время показа подсказок (`Game.pauseGame()/resumeGame()`).
    
    - Обрабатывает триггеры: автоматическое продолжение, клики по целевому элементу, нажатие «Далее» или «Пропустить».
    
    - Группирует подсказки (например, `group: "intro"`) и позволяет:
    
      - проверять, показана ли уже группа (`isGroupShown`)
    
      - сбрасывать состояние (`resetGroup`)
    
      - полностью пропускать группу (`skipGroup`)
    
      - определять завершённость группы по финальному id (`isCompleteGroup`).

2. Инициализация и назначение

   1. Создание Overlay

      - В конструкторе создаётся div class="hint-overlay", прикрепляемый к #game, и скрывается стилем:
        ```js
            this.overlay = this.createOverlay();
            this.overlay.style.display = 'none';
      ```
   
   2. Конфигурирование финальных подсказок по группам

    - Определяем id подсказки, на которой вся цепочка одной из групп завершится
        ```js
            this.finalHintByGroup = {
              intro: 'intro_16'
            };
        ```
   3. Регистрация массива подсказок
      - Каждый объект-подсказка имеет свойства:
        - `id` — уникальный идентификатор
        - `group` — группа подсказок
        - `text` — HTML-текст подсказки
        - `target` — цель выделения: `{type: 'none'}` или `{type: 'dom', selector: '.css-класс'}`
        - `trigger` — `{type: 'auto'|'next'|'click', selector?: '.css'}`
        - `nextId` — id следующей подсказки в цепочке или null
        - `modal` — всегда `true` (на будущее можно отключать клик вне подсказки)
        - `shown` — флаг, что показывалась (инициализируется false)
        - `start` — у первой подсказки группы; даёт кнопку «Пропустить»

   
3. Основные методы
   - `registerHints(hintsArray)`
   
      - Преобразует массив `hintsArray` в объект `{ [id]: hint }` для быстрого доступа
     
   - `start(id)`
   
     - Ставит игру на паузу (`Game.pauseGame()`)
     
     - Запускает показ подсказки с данным `id`.

   - `showHint(id)`
   
     - Помечает `hint.shown = true` и сохраняет в `this.current`.
     
     - Вызывает `highlightTarget(hint.target)` и `renderTooltip(hint.text, showNextBtn)`.
     
     - Подключает обработчики через `attachTrigger(hint)`.
     
   - `attachTrigger(hint)`
   
     - Для `trigger.type === 'click'` добавляет слушатель на указанную selector: при клике скрывает оверлей и, 
     спустя 50 мс, вызывает `onTrigger()`.
     
     - Для кнопок «Далее» (`.btn-next`) вызывает `onTrigger()`.
     
     - Для кнопки «Пропустить» вызывает `skipGroup(this.current.group)`.
   
   - `onTrigger()`
   
     - Убирает текущую подсказку и рамку (`cleanupCurrent()`).
     
     - Если есть nextId — показывает её, иначе завершает туториал (`endTutorial()`).
     
   - `highlightTarget(target)`
   
     - Показывает оверлей (`this.overlay.style.display = 'block'`).
     
     - Если `target.type==='dom'`, вычисляет позицию элемента selector в #game и рисует поверх него рамку `div class="hint-blink"`.
     
   - `cleanupCurrent()`
   
     - Удаляет DOM-элементы подсказки и рамки.
     
   - `hideTutorial()`
   
     - Полностью скрывает подсказку и оверлей.
     
   - `endTutorial()`
     - Вызывает hideTutorial(), сбрасывает this.current и снимает паузу с игры (`Game.resumeGame()`).
     
   - Состояние групп
   
     - `isGroupShown(groupId)` — была ли показана первая подсказка группы.
    
     - `resetGroup(groupId)` — сбрасывает `shown=false` у всех подсказок группы.
    
     - `skipGroup(groupId)` — помечает все `shown=true` и сразу `endTutorial()`.
    
     - `isCompleteGroup(groupId) `— `true`, когда показан `finalHintByGroup[groupId]`.


4. Пример использования
   В `LevelManager` при старте уровня запускается туториал, если группа ещё не показана:
    ```js
    startLevel() {
      //…  
      if (!Game.hintManager.isGroupShown("intro")) {
        Game.hintManager.start('intro_1');
      }
    }
    ```
   В `MainMenu` при показе меню туториал скрывается, а если не завершён — сбрасывается:

    ```js
    show() {
        //…  
        Game.hintManager.hideTutorial();
        //…
        if (!Game.hintManager.isCompleteGroup('intro')) {
            Game.hintManager.resetGroup('intro');
        }
        //…
    }
    ```

5. Интеграция собственных подсказок
   1. Определите группу: добавьте в `finalHintByGroup` ключ–id финальной подсказки:
      ```js
      this.finalHintByGroup['myGroup'] = 'myGroup_3';
       ```
   3. Сформируйте массив подсказок:
      ```js
       const hints = [
           { id: 'myGroup_1', group: 'myGroup', text: 'Приветствие…', target: {type:'none'}, trigger:{type:'auto'}, nextId:'myGroup_2', modal:true, shown:false, start:true },
           { id: 'myGroup_2', group: 'myGroup', text: 'Укажем на кнопку…', target:{type:'dom', selector:'.my-button'}, trigger:{type:'click', selector:'.my-button'}, nextId:'myGroup_3', modal:true, shown:false },
           { id: 'myGroup_3', group: 'myGroup', text: 'Завершаем туториал.', target:{type:'none'}, trigger:{type:'next'}, nextId:null, modal:true, shown:false },
       ];
       Game.hintManager.registerHints(hints);
       ```
   3. Запуск: в нужном месте кода:
      ```js
         if (!Game.hintManager.isGroupShown('myGroup')) {
            Game.hintManager.start('myGroup_1');
         }
       ```

   4. Опционально: сброс/пропуск где угодно:
      ```js
         Game.hintManager.resetGroup('myGroup');
         Game.hintManager.skipGroup('myGroup');
      ```
   5. Иные советы по настройке  
      - Используйте trigger.type: 'auto' для автоматических всплывающих подсказок.  
      - Для подсказок, где нужно явно кликнуть по элементу, задавайте trigger.type: 'click' и selector. 
      - Если подсказка не привязана к DOM-элементу, оставляйте target.type: 'none'.  
      - Опциональная кнопка «Пропустить» добавляется у start-подсказки.
   
