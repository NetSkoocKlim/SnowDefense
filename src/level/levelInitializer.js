import {LevelCreator} from "./levelCreator/levelCreator.js";

export class LevelInitializer {
    static initLevels () {
        const creator = new LevelCreator();

        creator.addLevel(10,0, {common: 60, elite: null},{common: 1, elite: null},
            0, {common: 5, elite: null},level => {

            level.addWave(w =>
                w.setEndWaveTime(22)
                    .addSpawn(3, { common: [{ side: 1, count: 1 }], elite: null })
                    .addSpawn(8, { common: [{ side: 3, count: 1 }], elite: null })
                    .addSpawn(13, { common:
                            [{ side: 1, count: 1 }, { side: 2, count: 1 }], elite: null })
                    .addSpawn(18, { common:
                            [{ side: 3, count: 1 }, { side: 4, count: 1 }], elite: null })
            );

            level.addWave(w =>
                w.setEndWaveTime(20)
                    .addSpawn(4, { common: [{ side: 2, count: 2 }], elite: null })
                    .addSpawn(7, { common: [{ side: 2, count: 1 }], elite: null })
                    .addSpawn(13, { common: [{ side: 1, count: 2 }], elite: null })
                    .addSpawn(16, { common: [{ side: 3, count: 1 }], elite: null })
            );

            level.addWave(w =>
                w.setEndWaveTime(23)
                    .addRandomSpawn(1, 2.0, 1, {endTimerValue: 14})
                    .addSpawn(17, { common:
                            [{ side: 1, count: 1 }, { side: 2, count: 1 }, { side: 3, count: 1 }], elite: null })
            );
        });

        creator.addLevel(15, 50,{common: 70, elite: null},{common: 2, elite: null},
            0, {common: 10, elite: null}, level => {

            level.addWave(w =>
                w.setEndWaveTime(20)
                    .addSpawn(3, { common: [{ side: 3, count: 1 }], elite: null })
                    .addSpawn(5, { common: [{ side: 3, count: 1 }], elite: null })
                    .addSpawn(8, { common: [{ side: 2, count: 2 }], elite: null })
                    .addSpawn(14, { common: [{ side: 2, count: 3 }], elite: null })
            );

            level.addWave(w =>
                w.setEndWaveTime(14)
                    .addRandomSpawn(1, 4.0, 1, {endTimerValue: 20})
                    .addSpawn(10, { common: [{ side: 1, count: 2}], elite: null})
                    .addSpawn(14, { common: [{ side: 2, count: 1 }, { side: 4, count: 1 }], elite: null})
            );

            level.addWave(w =>
                w.setEndWaveTime(12)
                    .addRandomSpawn(5, 1.5, 2)
            );
        });

        creator.addLevel(25, 100,{common: 100, elite: 150},{common: 2, elite: 5},
            0.05, {common: 5, elite: 50},level => {
            level.addWave(w =>
                w.setEndWaveTime(12)
                    .addSpawn(3, {
                        common: [{ side: 1, count: 3 }, { side: 3, count: 3 }],
                        elite: [{ side: 2, count: 1 }]
                    })
                    .addRandomSpawn(6, 1.0, 2)
            );

            level.addWave(w =>
                w.setEndWaveTime(16)
                    .addSpawn(8, { common: [{ side: 2, count: 4 }, { side: 4, count: 4 }], elite:[ { side: 3, count: 1 }] })
            );

            level.addWave(w =>
                w.setEndWaveTime(20)
                    .addSpawn(5, { common: [{ side: 1, count: 5 }, { side: 4, count: 5 }], elite:[ null ]})
                    .addRandomSpawn(10, 2.0, 3)
            );
        });

        creator.addLevel(40, 150,{common: 100, elite: 150},{common: 3, elite: 6}, 0.1, {common: 20, elite: 60},level => {

            level.addWave(w =>
                w.setEndWaveTime(15)
                    .addSpawn(4, { common: [{ side: 1, count: 5 }, { side: 2, count: 5 }], elite: { side: 3, count: 2 } })
                    .addRandomSpawn(7, 1.2, 3)
            );

            level.addWave(w =>
                w.setEndWaveTime(18)
                    .addSpawn(6, { common: [{ side: 3, count: 6 }, { side: 4, count: 6 }], elite: { side: 1, count: 2 } })
            );

            level.addWave(w =>
                w.setEndWaveTime(22)
                    .addSpawn(10, { common: [{ side: 2, count: 8 }, { side: 4, count: 8 }], elite: { side: 2, count: 3 } })
                    .addRandomSpawn(12, 1.5, 4)
            );
        });

        return creator.build();
    }

}