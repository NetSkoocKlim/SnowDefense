import {LevelCreator} from "./levelCreator/levelCreator.js";

export class LevelInitializer {
    static initLevels () {
        const creator = new LevelCreator();

        creator.addLevel(10,0, {common: 60, elite: null},{common: 1, elite: null},
            0, {common: 5, elite: null},level => {

            level.addWave(w =>
                w.setEndWaveTime(20)
                    .addSpawn(3, { common: [{ side: 1, count: 1 }], elite: null })
                    .addSpawn(8, { common: [{ side: 3, count: 1 }], elite: null })
                    .addSpawn(12, { common:
                            [{ side: 1, count: 1 }, { side: 2, count: 1 }], elite: null })
                    .addSpawn(16, { common:
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
            0, {common: 15, elite: null}, level => {

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
                w.setEndWaveTime(10)
                    .addRandomSpawn(1, 2, 2)
                    .addSpawn(5, {common:[{side: 1, count: 2}, {side: 3, count: 2}], elite: null})
            );
            level.addWave(w =>
                w.setEndWaveTime(12)
                    .addRandomSpawn(4, 3, 10)
            );

        });

        creator.addLevel(35, 85,{common: 90, elite: 110},{common: 2, elite: 4},
            0.2, {common: 10, elite: 20},level => {
            level.addWave(w =>
                w.setEndWaveTime(12)
                    .addSpawn(3, {
                        common: [{ side: 1, count: 2 }, { side: 3, count: 1 }],
                        elite: [{ side: 2, count: 1 }]
                    })
                    .addRandomSpawn(9, 1.0, 3)
            );

            level.addWave(w =>
                w.setEndWaveTime(10)
                    .addSpawn(3, { common: [{ side: 2, count: 2 }, { side: 4, count: 2 }], elite:[ { side: 3, count: 2 }] })
            );


            level.addWave(w =>
                w.setEndWaveTime(12)
                    .addSpawn(5, {common:[{side: 2, count: 7}, {side: 1, count: 7},{side: 3, count: 7}]})
            );

            level.addWave(w =>
                w.setEndWaveTime(20)
                    .addSpawn(5, { common: [{ side: 1, count: 3 }, { side: 4, count: 2 }], elite:[]})
                    .addRandomSpawn(10, 2.0, 10)
            );
        });

        creator.addLevel(60, 110,{common: 100, elite: 120},{common: 3, elite: 6}, 0.45, {common: 10, elite: 30},level => {

            level.addWave(w =>
                w.setEndWaveTime(15)
                    .addSpawn(2, { common: [{ side: 1, count: 4 }, { side: 2, count: 4 }], elite: [{ side: 3, count: 2 }] })
            );

            level.addWave(w =>
                w.setEndWaveTime(18)
                    .addSpawn(3, { common: [{ side: 3, count: 6 }, { side: 4, count: 6 }], elite: [{ side: 1, count: 3 }] })
            );

            level.addWave(w =>
                w.setEndWaveTime(15)
                    .addRandomSpawn(2, 5, 10)
            );

            level.addWave(w =>
                w.setEndWaveTime(22)
                    .addSpawn(3, { common: [{ side: 2, count: 10 }, { side: 4, count: 10 }, {side: 3, count: 10}]})
                    .addRandomSpawn(10, 5, 20)
            );
        });

        return creator.build();
    }

}