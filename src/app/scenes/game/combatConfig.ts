const combatConfig = {
    mob: {
        name: 'Goblin',
        hp: 320,
        maxHp: 400,
        x: 360,
        y: 700,
        scale: 0.85,
    },
    player: {
        name: 'HP',
        hp: 100,
        maxHp: 120,
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
