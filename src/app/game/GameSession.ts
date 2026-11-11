import { itemCatalog, type BagItem } from './itemCatalog';

export const COUNTER_COLUMNS = 5;
export const COUNTER_ROWS = 4;

export type StockItem = {
    instanceId: number;
    item: BagItem;
    quantity: number;
};

export default class GameSession {
    gold = 1240;
    inventory: StockItem[] = [];
    counter: (StockItem | null)[] = Array(COUNTER_COLUMNS * COUNTER_ROWS).fill(null);

    constructor() {
        // Temporary starting stock for the shop layout test.
        let nextId = 1;
        const stock = (catalogId: string, quantity = 1): StockItem => {
            const item = itemCatalog.find(entry => entry.id === catalogId);
            if (!item) throw new Error(`Unknown item: ${catalogId}`);

            return { instanceId: nextId++, item: { ...item }, quantity };
        };

        this.counter[0] = stock('item_19', 6);
        this.counter[1] = stock('item_20', 4);
        this.counter[2] = stock('item_01');
        this.counter[3] = stock('item_21', 3);
        this.counter[4] = stock('item_23', 8);

        this.inventory = [
            stock('item_10'),
            stock('item_12'),
            stock('item_24', 5),
        ];
    }
}
