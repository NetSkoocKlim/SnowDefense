import { createDivElement } from "../utilities.js";
import { CooldownTimer } from "../timer/timer.js";
import {Game} from "../game.js";
import {Canvas} from "../canvas";


export class CountdownDisplay {
    constructor(options = {}) {
        this.options = {
            containerClass: options.containerClass || "countdown-container",
            animationDuration: options.animationDuration || 1000
        };
        this.isRunning = false;
        this.createContainer();
        this.setupTimer();
    }

    createContainer() {
        this.container = createDivElement(
            document.querySelector("#game"),
            { x: 0, y: 0 },
            Canvas.width,
            Canvas.height,
            this.options.containerClass
        );

        this.digitEl = document.createElement("div");
        this.digitEl.classList.add('countdown-digit');
        this.container.appendChild(this.digitEl);
        this.container.style.display = 'none';
    }

    setupTimer() {
        this.timer = new CooldownTimer("countdown", 3, { shouldReset: false });
        this.lastDisplay = null;

        this.timer.onTick = () => {
            if (!this.isRunning) return;
            const displayValue = Math.ceil(this.timer.time);
            if (displayValue !== this.lastDisplay && displayValue > 0) {
                this.showNumber(displayValue);
                this.lastDisplay = displayValue;
            }
        };

        this.timer.onComplete = () => {
            this.timer.isShouldContinue = false;
            Game.resumeGame();
            this.timer.pause();
            this.container.style.display = 'none';
        };
    }

    showNumber(n) {
        if (!this.isRunning) return;
        this.digitEl.textContent = n.toString();
        this.digitEl.style.animation = 'none';
        this.digitEl.offsetWidth;

        const animName = n === 1 ? 'countdownFinalGrow' : 'countdownGrowFade';
        this.digitEl.style.animation = `${animName} ${this.options.animationDuration}ms ease forwards`;

        const onEnd = () => {
            if (!this.isRunning) return;
            if (n === 1) {
                this.digitEl.textContent = '';
            }
            this.digitEl.removeEventListener('animationend', onEnd);
        };
        this.digitEl.addEventListener('animationend', onEnd);
    }

    start() {
        this.container.style.display = 'block';
        this.timer.isShouldContinue = true;
        if (this.isRunning) return;
        this.isRunning = true;
        this.showNumber(3);
        this.lastDisplay = 3;
        this.timer.reset({});
        this.timer.resume();
    }


    stop() {
        this.container.style.display = 'none';
        this.timer.isShouldContinue = false;
        if (!this.isRunning) return;
        this.isRunning = false;
        this.timer.pause();
    }

}
