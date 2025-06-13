# Воспроизведение звуков

В основе механизма воспроизведения звука лежат три класса:

- Массив с конфигурацией аудио — `audioList`

- Класс загрузки аудио — `AudioLoader`

- Класс плавного управления громкостью и состоянием — `AudioFader`

Интеграция происходит в классe `MainMenu`, но
при желании вы можете точно так же вызывать `AudioFader` 
и в любом другом месте игры, важно лишь предоставить ему 
`HTMLAudioElement` из `AudioLoader.items`, о чём подробно далее.

---

1. Конфигурация звуков: `audioList.js`

    - Назначение: хранит ключи, пути и базовые параметры (зацикливание, громкость) всех звуков в игре.
        ```js
        export const audioList = [
          {
            key: "menuMusic",      // уникальный идентификатор
            src: "./sounds/menu.ogg", // путь к файлу
            loop: true,            // зацикливать при воспроизведении?
            volume: 0.7            // начальная громкость (0–1)
          },
          // можно добавить другие звуки:
          // { key: "shot", src: "./sounds/shot.wav", loop: false, volume: 1 },
        ];
        ```
     - `key` — используется для получения аудио из `AudioLoader.items`.

     - `src` — URL-файл, может быть относительным.

     - `loop` — если `true`, при окончании воспроизведения звук будет начинаться заново.

     - `volume` — базовая громкость при загрузке.
2. Загрузка звуков: `AudioLoader`

   - `AudioLoader.items` — статическое поле, в котором после `loadAll` лежат все HTMLAudioElement по ключам.

   - `loadAll(list)` — параллельно инициализирует элементы и ждёт события canplaythrough, означающее полною загрузку звука, для каждого.


3. Управление: `AudioFader`

    ```js
    export class AudioFader {
        constructor(audio, {volume = 1} = {}) {
            this.audio = audio;                                // HTMLAudioElement
            this.targetVolume = Math.min(Math.max(volume, 0), 1);
            this._fadeInterval = null;
        }
        
        //методы: fadeIn(), fadeOut(), stopInstant(), pause(), stopAndReset()
    }
    ```
   - `audio` - хранит загруженный звук

   - `fadeIn()` - Плавно увеличивает громкость от 0 до targetVolume за заданный duration (мс), запускает play(), если звук на паузе.

   - `fadeOut`() - Плавно уменьшает громкость до 0 и ставит на паузу.

   - `stopInstant()` - Мгновенно отключает звук.
   - `pause()` - Ставит на паузу без сброса `currentTime`.
   - `stopAndReset()` - Комбинация `stopInstant()` + `сброс `currentTime` = 0._

4. Интеграция в MainMenu

   - В конструкторе `MainMenu` после загрузки звуков (`AudioLoader.loadAll(audioList)`) получаем нужный элемент 
и оборачиваем его в AudioFader:
        ```js
        // в конструкторе MainMenu
        const menuAudioElement = AudioLoader.items["menuMusic"];
        this.menuAudio = new AudioFader(menuAudioElement, { volume: 0.7 });
        ```
   - Варианты использования:
     - show(): при открытии меню
         ```js
         async show() {
           // ...остальной код анимаций и пауз игры...
           await wait(2000);
           this.menuAudio.fadeIn(1000)
             .catch(() => {
               // для мобильных/браузерных ограничений запускаем по жесту пользователя
               const onUserGesture = () => {
                 this.menuAudio.fadeIn(1000).catch(() => {});
                 // отписываемся
               };
               window.addEventListener("mousedown", onUserGesture, { once: true });
               // keydown, touchstart...
             });
         }
         ```
     - hide(): при закрытии меню
         ```js
         async hide() {
           this.menuAudio.fadeOut(800);
           await wait(3000);
           this.mainScreen.style.display = "none";
         }
         ```
     - `hideInstant()`: мгновенно выключить
         ```js
         hideInstant() {
           this.menuAudio.stopInstant();
           // скрыть DOM-элементы
         }
         ```

> Нюансы применения:
> 
> — В любом другом экране/сцене можно создать свой new AudioFader(AudioLoader.items["ключ"], { volume })
> 
> — Главное — предварительно вызвать await AudioLoader.loadAll(audioList) перед рендером первых экранов
> 
> — Для звуков эффектов (одноразовых) достаточно play() + опционально fadeOut()
> 
> — Если нужно циклическое воспроизведение фонового трека, укажите loop: true в audioList

