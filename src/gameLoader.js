import {Canvas} from "./canvas/canvas.js";

export class GameLoader {
    constructor() {
        this.parent = document.getElementById("game");
        this.loadingText = "Загрузка";
        this.container = null;
        this.textEl = null;
        this.snowContainer = null;
    }

    createScreen() {
        this.container = document.createElement('div');
        this.container.id = 'loading-screen';

        this.textEl = document.createElement('div');
        this.textEl.id = 'loading-text';
        this.textEl.textContent = this.loadingText;

        this.snowContainer = document.createElement('div');
        this.snowContainer.className = 'snow-container';

        this.container.appendChild(this.textEl);
        this.container.appendChild(this.snowContainer);
        this.parent.appendChild(this.container);

        this.createSnowflakes(300);
    }

    show() {
        if (!this.container) this.createScreen();
        this.container.style.display = 'flex';
    }

    hide() {
        if (!this.container) return;
        this.container.style.display = 'none';
    }

    createSnowflakes(count) {
        for (let i = 0; i < count; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.textContent = '❆';


            const rnd = () => ({
                speed: `${(3 + Math.random() * 5).toFixed(2)}s`,
                delay: `${(Math.random() * 5).toFixed(2)}s`,
                drift: `${(Math.random() * 100 - 50).toFixed(0)}px`,
                left: `${Math.random() * 100}%`,
                size: `${(8 + Math.random() * 12) * Canvas.scale}px`
            });

            const apply = () => {
                const p = rnd();
                flake.style.setProperty('--speed', p.speed);
                flake.style.setProperty('--delay', p.delay);
                flake.style.setProperty('--drift', p.drift);
                flake.style.left = p.left;
                flake.style.fontSize = p.size;
            };
            apply();
            flake.addEventListener('animationiteration', () => {
                flake.style.animation = 'none';
                flake.offsetHeight;
                apply();
                flake.style.animation = '';
            });

            this.snowContainer.appendChild(flake);
        }
    }
}