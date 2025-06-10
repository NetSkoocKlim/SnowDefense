# Улучшения (Апргрейды)

Система улучшений позволяет игроку 
прокачивать различные параметры объекта
(оружия, мин, спаунеров и т.д.) с помощью внутриигровой валюты. 
Каждый тип улучшения определяется набором уровней (`levels`),
где на каждом уровне задаётся стоимость (`nextUpgradeCost`) и 
эффект (`value`).

---

1.  Ключевые компоненты:

    - Класс `Upgrade` — базовый класс, описывающий одно направление улучшения.
    
    - Наследники `BaseUpgrade`, `MineUpgrade` — статические описания наборов уровней и стартовых настроек.
    
    - Интеграция с игровыми сущностями — перенос статистик в классы `BaseGun`, `MineSpawner`.
    
    - UI-панели — `BaseUpgradePanel` и `ShopPanel` для отображения и управления улучшениями.
    
    - Утилиты — функция глубокого клонирования для копирования настроек.

2. Класс `Upgrade`

   Базовый класс управления единичным направлением улучшений.Поля:

   - `name` — название улучшения (для UI).

   - `levels` — массив объектов `{ nextUpgradeCost, value }`.

   - `upgradeDescription` — описание эффекта.

   - `currentLevel` — текущий уровень прокачки.

   - `maxLevel` — максимальное количество уровней.

3. Преднастроенные наборы улучшений
   1. `BaseUpgrade` 
    
      Статические параметры для базового оружия:
       ```js
        export class BaseUpgrade {
        static attackUpgradeLevels = [ ... ];      // Уровни урона
        static smoothingUpgradeLevels = [ ... ];   // Уровни скорости наведения
        static reloadUpgradeLevels = [ ... ];      // Уровни времени перезарядки
        
            static startUpgrades = {
                attack: new Upgrade("Атака", BaseUpgrade.attackUpgradeLevels, "Увеличь сытность своих снарядов!"),
                smoothing: new Upgrade("Скорость вращения", BaseUpgrade.smoothingUpgradeLevels, "Не позволь врагу подобраться со спины!"),
                reloadTime: new Upgrade("Время перезарядки", BaseUpgrade.reloadUpgradeLevels, "Стреляй быстрее!")
            }
        }
        ```
   2. `MineUpgrade`
      Статические параметры для спаунера мин:
       ```js
        export class MineUpgrade {
        static explosionDamageUpgradeLevels = [ ... ]; // Урон
        static explosionRadiusUpgradeLevels = [ ... ]; // Радиус
        static spawnRateUpgradeLevels = [ ... ];      // Частота спауна
        static upgradeLevels = [ ... ];                // Общая прокачка мин
        
            static startUpgrades = {
                explosionDamage: new Upgrade("attack", MineUpgrade.explosionDamageUpgradeLevels, "Сытность"),
                explosionRadius: new Upgrade("radius", MineUpgrade.explosionRadiusUpgradeLevels, "Радиус насыщения"),
                spawnRate: new Upgrade("spawnRate", MineUpgrade.spawnRateUpgradeLevels, "Время изготовки"),
                grades: new Upgrade("grades", MineUpgrade.upgradeLevels, "Улучшить характеристики мин")
            }
        }
        ```

4. Интеграция с игровыми объектами

    1. `BaseGun`
        - В конструкторе выполняется глубокое клонирование стартовых улучшений:
            ```js
            this.stats = deepClone(BaseUpgrade.startUpgrades);
            ```
       - Геттеры для доступа к значениям:
           ```js
             get attackDamage() {
                return this.stats.attack.value.value;
             }
             get smoothing() {
                return this.stats.smoothing.value.value;
             }
             get reloadTime() {
                return this.stats.reloadTime.value.value;
             }
            ```
       - При сбросе вызова `reset()` сбрасываются параметры и таймеры.

       - Метод `fire()` и `lerpAngle()` используют текущие значения улучшений для расчётов.
   2. `MineSpawner`
      - Статические поля:

        ```js
        static mineStats = deepClone(MineUpgrade.startUpgrades);
        ```
      
      - Геттеры, возвращающие актуальные значения:
        ```js
        static get explosionDamage() { return MineSpawner.mineStats.explosionDamage.value.value; }
        static get explosionRadius() { return MineSpawner.mineStats.explosionRadius.value.value * Canvas.scale; }
        static get spawnRate() { return MineSpawner.mineStats.spawnRate.value.value; }
        static get grades() { return MineSp
        ```
   

5. UI-панели
   1. `BaseUpgradePanel`

        Отвечает за отображение и управление улучшениями базового оружия.
    
      - Создание записей для каждого улучшения из `Game.base.gun.stats`.
    
      - Методы:
    
          - `updateAll()` — обновляет состояние кнопок и индикаторов уровней.
    
          - `onUpgrade(key, callback)` — регистрирует обработчик клика по кнопке улучшения.
    
          - `onBackClick(callback)` — обработчик закрытия панели.

    2. `ShopPanel`

        Отвечает за разблокировку и прокачку минок.
    
       - Изначально содержит кнопку покупки разблокировки за `MineSpawner.mineUnlockCost`.
    
       - После покупки меняет тип записи на `upgrade` и добавляет индикаторы уровней и текущие значения параметров.
    
       - Методы:
           - `buySpawnUnlock()` — разблокировка и инициализация спауна.
           - `buyGradesUpgrade()` — покупка повышения уровня характеристик всех мин.