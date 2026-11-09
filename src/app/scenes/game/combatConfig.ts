export type MarkerKind = 'tap' | 'trap';

const combatConfig = {
    mob: {
        name: 'Goblin',
        hp: 20,
        maxHp: 20,
        x: 360,
        y: 700,
        scale: 0.85,
    },
    player: {
        name: 'HP',
        hp: 10,
        maxHp: 10,
    },
    marker: {
        radius: 24,
        lifetimeMs: 900,
        spawnIntervalMs: 250,
        appearFromScale: 0.75,
        appearDurationMs: 100,
        appearEase: 'Cubic.Out',
        trapsPerPattern: { min: 1, max: 2 },
        patterns: [
            [
                { dx: 52, dy: -20 },
                { dx: 54, dy: -16 },
                { dx: 56, dy: -8 },
                { dx: 56, dy: 8 },
                { dx: 54, dy: 16 },
                { dx: 52, dy: 20 },
                { dx: 50, dy: 14 },
            ],
            [
                { dx: 52, dy: -24 },
                { dx: 52, dy: 28 },
                { dx: 52, dy: -28 },
                { dx: 52, dy: 28 },
                { dx: 52, dy: -28 },
                { dx: 52, dy: 28 },
                { dx: 52, dy: -24 },
            ],
        ],
        damageToMob: 1,
        damageToPlayerOnMiss: 1,
        damageToPlayerOnTrap: 1,
        area: {
            minX: 120,
            maxX: 600,
            minY: 380,
            maxY: 1000,
        },
        fillColor: 0x167b26,
        borderColor: 0x16151b,
        borderWidth: 5,
        trackColor: 0x15391c,
        ringColor: 0x57ff42,
        ringWidth: 7,
        ringInset: 9,
        trap: {
            fillColor: 0xa52129,
            borderColor: 0x261218,
            trackColor: 0x4e1820,
            ringColor: 0xff695c,
        },
    },
    hud: {
        mob: {
            x: 16,
            y: 80,
            width: 688,
            height: 80,
            labelWidth: 222,
            color: 0xff4f42,
        },
        player: {
            x: 16,
            y: 1176,
            width: 688,
            height: 80,
            labelWidth: 145,
            color: 0x50cf35,
        },
    },
};

export default combatConfig;
