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
        type: 'tap' as const,
        radius: 24,
        lifetimeMs: 900,
        minDelayMs: 150,
        maxDelayMs: 350,
        damageToMob: 1,
        damageToPlayerOnMiss: 1,
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
