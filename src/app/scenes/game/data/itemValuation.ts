import config from '../lootTinderConfig';

export function getItemValues(baseValue: number): { wholesale: number; retail: number } {
    return {
        wholesale: Math.round(baseValue * config.bag.wholesaleMultiplier),
        retail: Math.round(baseValue * config.bag.retailMultiplier),
    };
}
