# Система анимаций

В основе механизма анимации лежит универсальный класс 
`SpriteAnimator`, который отвечает за смену кадров, 
масштабирование спрайтов и взаимодействие 
с таймерами `CooldownTimer`. Для специфики врагов 
используется наследник `EnemyAnimator`, расширяющий 
функционал тремя типами анимаций. 
---
1.Базовый класс `SpriteAnimator`

**Назначение:**

- Отвечает за управление сменой кадров и масштабирование любых спрайтов.
- Служит основой для всех визуальных эффектов в игре.

**Поля и параметры:**

- `frameDelay` (по умолчанию 0.2) — задержка между кадрами (в секундах).
- `currentFrame` — индекс текущего кадра.
- `scale` — коэффициент масштабирования (0.1 * Canvas.scale).
- `frameDelayTimer` — экземпляр `CooldownTimer`, запускающий метод `getNextFrame()` по окончании задержки.


**Методы:**

- `stopAnimation()` и `resumeAnimation()` для остановки и возобновления анимации:


- `changeAnimation(spriteImg, spriteImgWidth, spriteImgHeight, framesCount)` — настраивает новую анимацию

- `getNextFrame() — переключает на следующий кадр по кругу


2.Специализация для врагов: `EnemyAnimator`

Наследуя `SpriteAnimator`, класс `EnemyAnimator` загружает и переключает специфичные для врагов анимации: 
движения, атаки и (для элитных) скрытия

Инициализация и загрузка изображений:
```js
constructor(kind, moveSprite, attackSprite, hideSprite) {
  super(`${kind} enemy`);
  this.enemySpritesPath = `${this.assetsPath}enemy/${kind}/`;
  this.moveSprite = moveSprite;
  this.attackSprite = attackSprite;
  this.hideSprite = hideSprite;
  this.loadImages();
}

loadImages() {
  this.moveSpriteImg = new Image();
  this.moveSpriteImg.src = this.enemySpritesPath + this.moveSprite.path;

  this.attackSpriteImg = new Image();
  this.attackSpriteImg.src = this.enemySpritesPath + this.attackSprite.path;

  if (this.hideSprite) {
    this.hideSpriteImg = new Image();
    this.hideSpriteImg.src = this.enemySpritesPath + this.hideSprite.path;
  }
}
```

Переключатели анимаций:

- Движение:
```js
toggleMoveAnimation() {
  this.frameDelayTimer.reset({ startTime: 0.2 });
  this.changeAnimation(
    this.moveSpriteImg,
    this.moveSprite.width,
    this.moveSprite.height,
    this.moveSprite.frameCount
  );
}
```
- Атака:
```js
toggleAttackAnimation() {
  this.frameDelayTimer.reset({ startTime: 0.15 });
  this.changeAnimation(
    this.attackSpriteImg,
    this.attackSprite.width,
    this.attackSprite.height,
    this.attackSprite.frameCount
  );
}
```
- Скрытие (только для элитных):
```js
toggleHideAnimation() {
  this.changeAnimation(
    this.hideSpriteImg,
    this.hideSprite.width,
    this.hideSprite.height,
    this.hideSprite.frameCount
  );
}
```

>Важно: `frameDelayTimer.reset({ startTime: X })`
> позволяет задать индивидуальную задержку
> для каждого типа анимации.

3.Интеграция анимаций в класс `Enemy`

   В `Enemy` экземпляр `EnemyAnimator` используется 
   для смены и отрисовки анимаций внутри методов `setMove()`, `setAttack()`, `setHide()`, `handleAttack()`:
   1. `setMove()`: переключает анимацию движения и обновляет размеры спрайта:
   2. `setAttack()`: переключает анимацию атаки и запускает таймер перезарядки:
   3. `handleAttack()`:
      - Если таймер перезарядки не активен и текущий кадр последний — наносит урон и приостанавливает анимацию.
      - Иначе — запускает или приостанавливает анимацию в зависимости от состояния таймера.

   
4.Другие примеры использования
   - `DefaultEnemy`: наследует `Enemy`, задаёт размеры и создаёт `EnemyAnimator` для базового типа врага.

   - `EliteEnemy`: добавляет анимацию скрытия через метод `toggleHideAnimation()` и собственный `hideTimer`.

   - `Mine`: использует `SpriteAnimator` для анимации взрыва, где `frameDelay` установлен в 0.5, а число кадров — 8.

