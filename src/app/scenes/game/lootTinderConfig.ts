const lootTinderConfig = {
    width: 720,
    height: 1280,
    dungeonName: 'GRAVEYARD',
    bag: {
        minItems: 4,
        maxItems: 6,
        purchasePrice: 120,
        rejectMultiplier: 0.4,
        takeMultiplier: 1.2,
    },
    card: {
        x: 360,
        y: 666,
        width: 560,
        height: 668,
        dragThreshold: 110,
        exitDurationMs: 220,
        appearDurationMs: 170,
    },
    nextCardDelayMs: 90,
    nextBagDelayMs: 1100,
};

export default lootTinderConfig;
