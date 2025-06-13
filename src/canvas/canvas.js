/**
 * Класс Canvas отвечает за инициализацию и управление элементом <canvas> для игры.
 *
 * Атрибуты класса:
 * @property {CanvasRenderingContext2D} ctx   — 2D-контекст для рисования на canvas.
 * @property {number}                 width — ширина canvas (в пикселях).
 * @property {number}                 height— высота canvas (в пикселях).
 * @property {HTMLCanvasElement}      canvas— элемент <canvas> из DOM.
 * @property {number}                 scale — масштаб для преобразования игровых координат
 *                                            (вычисляется на основании ширины canvas).
 */
export class Canvas {
    static ctx;
    static width;
    static height;
    static canvas;
    static scale;

    /**
     * Выполняет инициализацию canvas:
     * - Получает элемент <canvas> с id="canvas" из DOM.
     * - Получает 2D-контекст рисования.
     * - Устанавливает размер canvas и масштаб.
     *
     * @returns {void}
     */
    static initCanvas() {
        Canvas.canvas = document.querySelector('#canvas');
        Canvas.ctx = Canvas.canvas.getContext('2d');
        Canvas.setCanvasSize();
    }

    /**
     * Устанавливает размеры canvas и контейнера игры (#game) в соответствии с
     * меньшей из сторон окна браузера, чтобы сохранить квадрат.
     * Вычисляет масштаб (scale) как отношение текущей ширины к базовому размеру 844.
     *
     * @returns {void}
     */
    static setCanvasSize() {
        // Вычисляем размер canvas: минимальное значение между шириной и высотой окна браузера
        const canvasSize = Math.min(
            document.documentElement.clientHeight,
            document.documentElement.clientWidth
        );

        // Находим контейнер игры и задаём ему квадратные размеры
        const gameDiv = document.querySelector('#game');
        gameDiv.style.width = canvasSize + 'px';
        gameDiv.style.height = canvasSize + 'px';

        // Устанавливаем размеры самого элемента <canvas>
        Canvas.canvas.width = canvasSize;
        Canvas.canvas.height = canvasSize;
        Canvas.width = canvasSize;
        Canvas.height = canvasSize;

        // Вычисляем масштаб относительно базового размера 844
        Canvas.scale = Canvas.width / 844;

        // Устанавливаем абсолютное позиционирование canvas
        Canvas.canvas.style.position = "absolute";
    }
}
