export class RandomSpawn {
    startTimerValue;
    endTimerValue = null;
    delay;
    enemiesPerSpawn;
    eliteSpawnChance = null;

    constructor(startTimerValue, delay, enemiesPerSpawn, endTimerValue, eliteSpawnChance) {
        this.startTimerValue = startTimerValue;
        this.endTimerValue = endTimerValue;
        this.delay = delay;
        this.enemiesPerSpawn = enemiesPerSpawn;
        this.eliteSpawnChance = eliteSpawnChance;
    }
}