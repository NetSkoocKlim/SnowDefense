export class Canvas {
    static ctx;
    static width;
    static height;
    static canvas;

    static async initCanvas() {
        Canvas.canvas = document.querySelector('#canvas');
        Canvas.ctx = Canvas.canvas.getContext('2d');
        await Canvas.setCanvasSize();
    }

    static async setCanvasSize() {
        const canvasSize = Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth);
        const gameDiv = document.querySelector('#game');
        gameDiv.style.width = canvasSize + 'px';
        gameDiv.style.height = canvasSize + 'px';

        Canvas.canvas.width = canvasSize;
        Canvas.canvas.height = canvasSize;
        Canvas.width = canvasSize;
        Canvas.height = canvasSize;
        Canvas.scale = Canvas.width / 844;
        Canvas.canvas.style.position = "absolute";
    }

}