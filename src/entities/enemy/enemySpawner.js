import {CooldownTimer} from "../../timer/timer.js";
import {DefaultEnemy} from "./enemyKind/defaultEnemy.js";
import {EliteEnemy} from "./enemyKind/eliteEnemy.js";
import {Game} from "../../game.js";


export class EnemySpawner {
    static enemies = [];
    static eliteEnemies = [];
    static spawnTimer;
    static maxEnemyCount = 100;
    static _enemiesAlive = 0;

    static eliteSpawnChance = 0;
    static enemyHp;
    static enemyAttack;
    static enemyReward;


    static init() {
        EnemySpawner.initTimer();
        EnemySpawner.initEnemies();
    }

    static initTimer() {
        EnemySpawner.spawnTimer = new CooldownTimer("EnemySpawner", 10, {});
    }

    static initEnemies() {
        for (let i = 0; i < EnemySpawner.maxEnemyCount; i++) {
            EnemySpawner.enemies[i] = new DefaultEnemy();
            EnemySpawner.eliteEnemies[i] = new EliteEnemy();
        }
    }

    static reset() {
        EnemySpawner.unsetSpawnRate();

        EnemySpawner.enemies.forEach(enemy => {
            enemy.reset();
        })

        EnemySpawner.eliteEnemies.forEach(enemy => {
            enemy.reset();
        })

        EnemySpawner.enemiesAlive = undefined;
    }


    static spawnEnemy({side = null, count = 1, isElite = false}) {
        for (let i = 0; i < count; i++) {
            if (isElite || Math.random() < EnemySpawner.eliteSpawnChance) {
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
        EnemySpawner.unsetSpawnRate();

        EnemySpawner.spawnTimer.onComplete = () => {
            EnemySpawner.spawnEnemy({side: null, count: spawnCount});
        }
        EnemySpawner.spawnTimer.isShouldContinue = true;
        EnemySpawner.spawnTimer.reset({startTime:seconds});
        EnemySpawner.spawnTimer.resume();
    }

    static unsetSpawnRate() {
        EnemySpawner.spawnTimer.onComplete = null;
        EnemySpawner.spawnTimer.pause();
        EnemySpawner.spawnTimer.reset({});
        EnemySpawner.isShouldContinue = false;
    }

}

Object.defineProperty(EnemySpawner, 'enemiesAlive', {
    get() {
        return EnemySpawner._enemiesAlive;
    },
    set(newVal) {
        if (newVal === undefined) {
            EnemySpawner._enemiesAlive = 0;
        }
        else {
            EnemySpawner._enemiesAlive = newVal;
            if (EnemySpawner._enemiesAlive === 0 && Game.levelManager.waveManager.waveComplete === true
                && Game.levelManager.waveManager.currentWave === Game.levelManager.waveManager.waveCount - 1) {
                Game.levelManager.endLevel();
            }
        }

    },
    configurable: true,
})