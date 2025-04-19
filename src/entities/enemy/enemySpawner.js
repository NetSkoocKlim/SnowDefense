import {CooldownTimer} from "../timer/timer.js";
import {DefaultEnemy} from "./enemyKind/defaultEnemy.js";
import {createDivElement} from "../../utilities.js";

export class EnemySpawner {
    static enemies = [];
    static spawnTimer = -1;
    static maxEnemyCount = 100;

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
        }
    }

    static spawnEnemy({side = null, count = 1}) {
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < EnemySpawner.maxEnemyCount; j++) {
                if (!EnemySpawner.enemies[j].isAlive) {
                    EnemySpawner.enemies[j].spawn({side});
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