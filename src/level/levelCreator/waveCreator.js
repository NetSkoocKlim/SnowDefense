import {RandomSpawn} from "./spawn/randomSpawn.js";
import {Spawn} from "./spawn/spawn.js";

export class WaveCreator {
    constructor() {
        this.endWaveTime = null;
        this.spawns = [];
        this.randomSpawns = [];
    }

    setEndWaveTime(time) {
        this.endWaveTime = time;
        return this;
    }

    addSpawn(timerValue, enemies) {
        this.spawns.push(new Spawn(timerValue, enemies));
        return this;
    }

    addRandomSpawn(startTimerValue, delay, enemiesPerSpawn, {endTimerValue=null}={}) {
        this.randomSpawns.push(new RandomSpawn(startTimerValue, delay, enemiesPerSpawn, endTimerValue));
        return this;
    }

    build() {
        const obj = { endWaveTime: this.endWaveTime };
        if (this.spawns.length) {
            obj.spawnsCount = this.spawns.length;
            obj.spawns = this.spawns;
        }
        if (this.randomSpawns.length) {
            obj.randomSpawnsCount = this.randomSpawns.length;
            obj.randomSpawns = this.randomSpawns;
        }
        return obj;
    }
}