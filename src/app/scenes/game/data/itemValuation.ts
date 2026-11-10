import config from '../lootTinderConfig';

export function getItemValues(baseValue: number): { reject: number; take: number } {
    return {
        reject: Math.round(baseValue * config.bag.rejectMultiplier),
        take: Math.round(baseValue * config.bag.takeMultiplier),
    };
}
