import {CooldownTimer} from "../timer/timer.js";
import {Mine} from "./mine.js";
import {MineUpgrade} from "../upgrade/mineUpgrade.js";
import {Canvas} from "../canvas";


export class MineSpawner {

    static mineSpawnCost = 100;

    static mines = [];
    static spawnTimer = -1;
    static maxMinesCount = 100;

    static mineStats = {
        ...MineUpgrade.startUpgrades
    }

    static get explosionDamage() {
        return MineSpawner.mineStats.explosionDamage.value.value;
    }

    static get explosionRadius() {
        return MineSpawner.mineStats.explosionRadius.value.value * Canvas.scale;
    }


    static init() {
        MineSpawner.initTimer();
        MineSpawner.initMines();
    }

    static initTimer() {
        MineSpawner.spawnTimer = new CooldownTimer("EnemySpawner", 4, {});
    }

    static initMines() {
        for (let i = 0; i < MineSpawner.maxMinesCount; i++) {
            MineSpawner.mines.push(new Mine());
        }
    }

    static spawnMine({side = null, count = 1}) {
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < MineSpawner.maxMinesCount; j++) {
                if (MineSpawner.mines[j].isExplode) {
                    MineSpawner.mines[j].spawn({side});
                    break;
                }
            }
        }
    }

    static setSpawnRate(spawnCount, seconds) {
        MineSpawner.spawnTimer.isShouldContinue = true;
        MineSpawner.spawnTimer.pause();
        MineSpawner.spawnTimer.reset({startTime: seconds});
        MineSpawner.spawnTimer.resume();
        MineSpawner.spawnTimer.onComplete = () => {
            MineSpawner.spawnMine({side: null, count: spawnCount});
        }
    }
}