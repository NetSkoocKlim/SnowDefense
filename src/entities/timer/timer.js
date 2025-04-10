import {createDivElement} from "../../utilities.js";

export class Timer {

    static timers = [];

    constructor() {
        this.time = 0;
        this.timerId = 0;
        this.resume();
        Timer.timers.push(this);
    }

    runTimer() {
        this.timerId = setTimeout(() => this.runTimer(), 100);
    }

    pause() {
        clearTimeout(this.timerId);
        this.timerId = null;
    }

    resume() {
        this.timerId = setTimeout(() => this.runTimer(), 100);
    }

    toString() {
        return (Math.floor(this.time / 60)).toString().padStart(2, "0") + ':' + Math.floor((this.time % 60)).toString().padStart(2, "0") ;
    }
}

export class IncrementTimer extends Timer {
    constructor() {
        super();
    }
    runTimer() {
        this.time += 0.1;
        super.runTimer();
    }
}

export class CooldownTimer extends Timer {

    constructor(startTime) {
        super();
        this.startTime = startTime + 0.9;
        this.time = this.startTime;
        this.onComplete = null;
    }

    runTimer() {
        this.time -= 0.1;
        if (this.time <= 0) {
            if (this.onComplete !== null) {
                this.onComplete();
            }
            this.reset({});
        }
        super.runTimer();
    }

    reset({startTime=null}) {
        if (startTime !== null) {
            this.startTime = startTime;
        }
        this.time = this.startTime;
    }

}

export class GameTimer extends CooldownTimer {
    constructor() {
        super(6);
        this.timerDiv = createDivElement(document.querySelector("#game"), null, null, null, 'timer');
        this.span = document.createElement("span");
        this.span.id = "timer";
        this.span.classList.add("timer");
        this.timerDiv.appendChild(this.span);
        this.span.textContent = this.toString();
    }
    runTimer() {
        this.span.textContent = this.toString();
        super.runTimer();
    }
}


