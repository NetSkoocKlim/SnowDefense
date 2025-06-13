# Обзор проекта

Проект SnowDefense — это браузерная tower-defense игра, 
выполненную на чистом JavaScript, HTML5 и Canvas API. 
Игра состоит из волн врагов, башен, мина и системы улучшений. 
Цель игрока — защитить базу от снежных существ, 
размещая и улучшая оборонительные сооружения.

---

1. Структура проекта

    Ниже подробно описана структура всего проекта
    ```   
       SnowDefense/
       ├── index.html
       ├── style.css
       ├── src/
       │   ├── game.js          // Точка входа, инициализация canvas и запуск цикла
       │   ├── canvas/
       │   │   └── canvas.js    // Обёртка для API Canvas (отрисовка, очистка)
       │   ├── entities/
       │   │   ├── tower/
       │   │   │   ├── tower.js          // Класс Tower, логика стрельбы
       │   │   │   └── towerUI.js        // Отрисовка и взаимодействие UI башен
       │   │   ├── enemy/
       │   │   │   ├── enemy.js          // Базовый класс Enemy
       │   │   │   └── enemySpawner.js   // Спавн врагов по волнам
       │   │   ├── mine/
       │   │   │   ├── mine.js           // Класс мины, урон при взрыве
       │   │   │   └── mineSpawner.js    // Логика размещения и активации мин
       │   │   └── base/
       │   │       └── base.js           // Класс базы, точка поражения
       │   ├── collision/
       │   │   └── collision.js   // Реализация SAT для проверки столкновений
       │   ├── timer/
       │   │   ├── IncrementTimer.js    // Таймер событий (спавн, апгрейд)
       │   │   └── CooldownTimer.js     // Перезарядка для башен и способностей
       │   ├── audio/
       │   │   ├── audioLoader.js       // Загрузка аудио-файлов
       │   │   └── audioList.js         // Список и ключи звуков
       │   ├── listeners.js      // Регистрация событий мыши и клавиатуры
       │   └── upgrade/
       │       ├── upgrade.js           // Класс Upgrade, хранит стоимость и уровни
       │       └── upgradeUI.js         // Графический интерфейс для апгрейдов
       ├── assets/              // Изображения (спрайты, иконки)
       └── sounds/              // Звуковые файлы (mp3, wav)
     ```

2. Технологии и стек
   - JavaScript
     - Используются import и export для разделения логики по файлам.

     - Пример импорта в src/game.js:
         ```js
         import Game from './game.js';
         import { initCanvas } from './canvas/canvas.js';
    
         const ctx = initCanvas('gameCanvas');
         const game = new Game(ctx);
         game.start();
         ```

   - HTML5 + Canvas API

     - Элемент canvas отвечает за динамическую отрисовку всей игры.

     - Функция отрисовки очищает холст и перерисовывает все объекты каждый кадр:
       ```js
       clearCanvas(ctx);
       entities.forEach(obj => obj.draw(ctx));
       ```

   - CSS
       В файле style.css описываются все стили HTML элементов проекта

3. Установка и запуск игры
    1. Склонируйте репозиторий проекта:
       ```
       git clone <url> SnowDefense
       cd SnowDefense
       ```
   2. Запустите локальный сервер в корне проекта (нужен HTTP для загрузки модулей):
        ```
      python -m http.server 8000
       # или `live-server .`
      ```
   3. Откройте в браузере:
      ```
      http://localhost:8000/index.html
      ```

4. Дальнейшее чтение

    Для более полного погружения в проект необходимо ознакомиться с директорией mechanics, где описаны все основные 
механики, присутствующие в игре