const lootTinderConfig = {
    width: 720,
    height: 1280,
    dungeonName: 'GRAVEYARD',
    bag: {
        minItems: 4,
        maxItems: 6,
        purchasePrice: 120,
        wholesaleMultiplier: 0.4,
        retailMultiplier: 1.2,
    },
    card: {
        x: 360,
        y: 606,
        width: 560,
        height: 548,
        dragThreshold: 110,
        exitDurationMs: 220,
        appearDurationMs: 170,
    },
    nextCardDelayMs: 90,
    nextBagDelayMs: 1100,
};

export default lootTinderConfig;
