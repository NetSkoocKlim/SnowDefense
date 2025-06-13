# Механизм коллизий

1. Обзор

   В игре коллизии обрабатываются собственным механизмом 
на базе двух основных компонентов:

- Классы коллизий: `PolygonCollision` и `CircleCollision` описывают геометрию и умеют отрисовывать области.
- Алгоритмы детектирования: статические методы класса Collision реализуют три варианта проверки:
  - `checkPolygonsCollision` (SAT: Separating Axes Theoreme)
  -` checkPolygonAndPointCollision` (Ray-casting для точек)
  - `checkPolygonAndCircleCollision` (контроль попадания круга в полигоны и к отрезкам)
  

2. Алгоритмы детектирования

   1. `checkPolygonsCollision(polygon1, polygon2)`

       Использует теорему разделяющей оси (SAT):
       - Получаем все оси: для каждого ребра обоих полигонов вычисляем нормаль.
    
        - Проецируем вершины обоих полигонов на каждую нормаль (PolygonCollision.projectPolygon).
        
        - Проверяем интервалы проекций: если на какой-либо оси интервалы не пересекаются, коллизии нет.
        
        - Иначе — тела пересекаются.

   2. `checkPolygonAndPointCollision(poly, point)`

       Тест точки в полигоне через переброс луча вправо:
    
        - Перебираем все рёбра.
        
        - Если горизонтальный "луч" пересекает рёбро, инвертируем флаг внутри.
        
        - По итогу, если `inside=true` — точка внутри.

   3. `checkPolygonAndCircleCollision(polygon, circle)`

       Комбинирует два подхода:
    
       - Точка в полигоне: если центр круга внутри — коллизия.
       - Ближайшее расстояние от центра до каждого отрезка многоугольника:
         - Вычисляем проекцию точки на отрезок.
         - Находим ближайшую точку (ограничив t в [0,1]).
         - Сравниваем квадрат расстояния с радиусом круга radius^2.


3. Примеры использования

   1. Проверка пули об стенки дорожки (BaseGunBullet)

       Если коллизия с границами (полигонами pathCollisions) обнаружена — пуля удаляется.
        ```js
        checkWallConflict() {
          for (const path of Collision.pathCollisions) {
            if (Collision.checkPolygonAndCircleCollision(path, this.collisions.circleCollision))
              return true;
            if (Collision.checkPolygonsCollision(path, this.collisions.triangleCollision))
              return true;
          }
          return false;
        }
        ```
   2. Определение наступания на минку (Mine)
       
        По событию детонации цикл пробегает по всем врагам и если кто-то напоролся на коллизию минки, то запускаем анимацию взрыва.
        ```js
        enemyInRadius() {
            for (const enemy of allEnemies) {
                if (!enemy.isAlive) continue;
                if (
                    Collision.checkPolygonAndCircleCollision(enemy.collisions.head, this.mineCollision) ||
                    Collision.checkPolygonAndCircleCollision(enemy.collisions.body, this.mineCollision)
                ) {
                    return true;
                }
            }
            return false;
        }
        ```
