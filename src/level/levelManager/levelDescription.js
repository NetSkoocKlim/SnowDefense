export const levelDescription = {
    levels: [
        {

        },
        {
            waves: [
                {
                    minTimerValue: 60,
                    spawnsCount: 5,
                    randomSpawnsCount: 3,
                    spawns: [
                        {
                            timerValue: 5,
                            enemies: {
                                common: [
                                    {
                                        side: 0,
                                        count: 1,
                                    },
                                    {
                                        side: 2,
                                        count: 1,
                                    },
                                ],
                                elite: null,
                            }
                        },
                        {
                            timerValue: 7,
                            enemies: {
                                common: [
                                    {
                                        side: 1,
                                        count: 1,
                                    },
                                    {
                                        side: 3,
                                        count: 1,
                                    }
                                ],
                                elite: null,
                            }
                        },
                        {
                            timerValue: 16,
                            enemies: {
                                common: [
                                    {
                                        side: 0,
                                        count: 3,
                                    },
                                ],
                                elite: null,
                            },
                        },
                        {
                            timerValue: 30,
                            enemies: {
                                common: [
                                    {
                                        side: 0,
                                        count: 3,
                                    },
                                ],
                                elite: null,
                            },
                        },
                        {
                            timerValue: 33,
                            enemies: {
                                common: [
                                    {
                                        side: 0,
                                        count: 3,
                                    },
                                ],
                                elite: null,
                            },
                        }
                    ],
                    randomSpawns: [
                        {
                            timerValue: 3,
                            enemyCount: 1,
                            delay: 800,
                            elite: null,
                        },
                        {
                            timerValue: 15,
                            enemyCount: 2,
                            delay: 1200,
                            elite: null,
                        },
                        {
                            timerValue: 35,
                            delay: 1200,
                            enemyCount: 3,
                            elite: {
                                chanceOfSpawn: 0.05,
                                maxCount: 1
                            }
                        },
                    ],
                    enemyModification: null,
                },
                {

                }
            ],
            waveCount: 1,
        },


    ],
    levelCount: 1,

}