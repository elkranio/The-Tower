import { getCatalogItem } from './itemCatalog';

export const COUNTER_COLUMNS = 5;
export const COUNTER_ROWS = 4;

export type StockItem = {
    instanceId: number;
    itemId: string;
    quantity: number;
    quality?: 'common';
};

export default class GameSession {
    gold = 1240;
    inventory: StockItem[] = [];
    counter: (StockItem | null)[] = Array(COUNTER_COLUMNS * COUNTER_ROWS).fill(null);

    constructor() {
        // Temporary starting stock until inventory management is added.
        let nextId = 1;
        const stock = (itemId: string, quantity = 1): StockItem => {
            const item = getCatalogItem(itemId);
            if (!Number.isInteger(quantity) || quantity < 1) throw new Error(`Invalid quantity: ${quantity}`);
            if (item.category !== 'consumable' && quantity !== 1) {
                throw new Error(`Equipment cannot stack: ${itemId}`);
            }

            const result: StockItem = { instanceId: nextId++, itemId, quantity };
            if (item.category !== 'consumable') result.quality = 'common';
            return result;
        };

        this.counter[0] = stock('health_potion', 10);
        this.counter[1] = stock('mana_potion', 10);
        this.counter[2] = stock('antidote', 10);
        this.counter[3] = stock('iron_rations', 10);
        this.counter[4] = stock('scroll_of_return', 10);

        this.inventory = [
            stock('short_sword'),
            stock('knight_shield'),
            stock('iron_breastplate'),
        ];
    }
}
