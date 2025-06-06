import {CooldownTimer} from "../../timer/timer.js";
import {Mine} from "./mine.js";
import {MineUpgrade} from "../upgrade/mineUpgrade.js";
import {Canvas} from "../../canvas/canvas.js";
import {deepClone} from "../../utilities.js";


export class MineSpawner {

    static mineUnlockCost = 70;

    static mines = [];
    static spawnTimer = -1;
    static maxMinesCount = 100;

    static mineStats = deepClone(MineUpgrade.startUpgrades);

    static get explosionDamage() {
        return MineSpawner.mineStats.explosionDamage.value.value;
    }

    static get explosionRadius() {
        return MineSpawner.mineStats.explosionRadius.value.value * Canvas.scale;
    }

    static get spawnRate() {
        return MineSpawner.mineStats.spawnRate.value.value;
    }

    static get grades() {
        return MineSpawner.mineStats.grades;
    }

    static init() {
        MineSpawner.initTimer();
        MineSpawner.initMines();
    }

    static reset() {
        MineSpawner.unsetSpawnRate();

        MineSpawner.mineStats = deepClone(MineUpgrade.startUpgrades);

        MineSpawner.mines.forEach(mine => {
            mine.reset();
        })
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

    static setSpawnRate(seconds) {
        MineSpawner.spawnTimer.isShouldContinue = true;
        MineSpawner.spawnTimer.pause();
        MineSpawner.spawnTimer.reset({startTime: seconds});
        MineSpawner.spawnTimer.resume();
        MineSpawner.spawnTimer.onComplete = () => {
            MineSpawner.spawnMine({side: null, count: 1});
        }
    }

    static unsetSpawnRate() {
        MineSpawner.spawnTimer.pause();
        MineSpawner.spawnTimer.reset({});
        MineSpawner.spawnTimer.onComplete = null;
        MineSpawner.isShouldContinue = false;
    }

}