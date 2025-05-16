import {CooldownTimer} from "../timer/timer.js";
import {DefaultEnemy} from "./enemyKind/defaultEnemy.js";
import {EliteEnemy} from "./enemyKind/eliteEnemy.js";
import {Game} from "../../game.js";


export class EnemySpawner {
    static enemies = [];
    static eliteEnemies = [];
    static spawnTimer = -1;
    static maxEnemyCount = 100;
    static _enemiesAlive = 0;


    static init() {
        EnemySpawner.initTimer();
        EnemySpawner.initEnemies();
    }

    static initTimer() {
        EnemySpawner.spawnTimer = new CooldownTimer("EnemySpawner", 10, {});
    }

    static initEnemies() {
        for (let i = 0; i < EnemySpawner.maxEnemyCount; i++) {
            EnemySpawner.enemies.push(new DefaultEnemy());
            EnemySpawner.eliteEnemies.push(new EliteEnemy());
        }
    }

    static spawnEnemy({side = null, count = 1, isElite=false}) {
        for (let i = 0; i < count; i++) {
            if (isElite || Math.random() < EliteEnemy.spawnChance) {
                for (let j = 0; j < EnemySpawner.maxEnemyCount; j++) {
                    if (!EnemySpawner.eliteEnemies[j].isAlive) {
                        EnemySpawner.eliteEnemies[j].spawn({side});
                        EnemySpawner.enemiesAlive++;
                        break;
                    }
                }
                continue;
            }
            for (let j = 0; j < EnemySpawner.maxEnemyCount; j++) {
                if (!EnemySpawner.enemies[j].isAlive) {
                    EnemySpawner.enemies[j].spawn({side});
                    EnemySpawner.enemiesAlive++;
                    break;
                }
            }
        }
    }

    static setSpawnRate(spawnCount, seconds) {
        EnemySpawner.spawnTimer.isShouldContinue = true;
        EnemySpawner.spawnTimer.pause();
        EnemySpawner.spawnTimer.reset({startTime: seconds});
        EnemySpawner.spawnTimer.resume();
        EnemySpawner.spawnTimer.onComplete = () => {
            EnemySpawner.spawnEnemy({side: null, count: spawnCount});
        }
    }
}

Object.defineProperty(EnemySpawner, 'enemiesAlive', {
    get() {
        return EnemySpawner._enemiesAlive;
    },
    set(newVal){
        EnemySpawner._enemiesAlive = newVal;
        if (EnemySpawner._enemiesAlive === 0 && Game.levelManager.waveManager.waveComplete === true && Game.levelManager.waveManager.currentWave === Game.levelManager.waveManager.waveCount - 1) {
            Game.levelManager.endLevel();
        }
    },
    configurable: true,
})