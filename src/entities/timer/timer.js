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
        const minutes = Math.floor(this.time / 60);
        const seconds = Math.floor(this.time % 60);
        return minutes.toString().padStart(2, "0") + ':' + seconds.toString().padStart(2, "0");
    }
}

export class IncrementTimer extends Timer {
    constructor() {
        super();
        this.scheduledEvents = [];
    }

    scheduleEvent(eventTime, callback) {
        this.scheduledEvents.push({time: eventTime, callback, executed: false});
    }

    checkEvents() {
        this.scheduledEvents.forEach(event => {
            if (!event.executed && this.time >= event.time) {
                event.callback();
                event.executed = true;
            }
        });
    }

    clearEvents() {
        this.scheduledEvents = [];
    }

    runTimer() {
        this.time += 0.1;
        this.checkEvents();
        super.runTimer();
    }

    reset() {
        this.time = 0;
    }
}

export class CooldownTimer extends Timer {

    constructor(startTime, {shouldReset = true}) {
        super();
        this.startTime = startTime + 0.9;
        this.time = this.startTime;
        this.onComplete = null;
        this.shouldReset = shouldReset;
    }

    runTimer() {
        this.time -= 0.1;
        if (this.time <= 0) {
            if (this.onComplete !== null) {
                this.onComplete();
            }
            this.reset({});
            if (!this.shouldReset) {
                this.pause();
                return;
            }
        }
        super.runTimer();
    }

    reset({startTime = null}) {
        if (startTime !== null) {
            this.startTime = startTime;
        }
        this.time = this.startTime;
    }

}

export class GameTimer extends CooldownTimer {
    constructor(startTime) {
        super(startTime, {});
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


