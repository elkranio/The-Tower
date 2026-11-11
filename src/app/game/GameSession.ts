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
    gold = 0;
    inventory: StockItem[] = [];
    counter: (StockItem | null)[] = Array(COUNTER_COLUMNS * COUNTER_ROWS).fill(null);

    // Remove one available unit from a display slot. Money changes only at checkout.
    takeCounterItem(slotIndex: number): { itemId: string; price: number } | null {
        const stock = this.counter[slotIndex];
        if (!stock || stock.quantity < 1) return null;

        const price = Math.round(getCatalogItem(stock.itemId).baseValue * 1.2);
        stock.quantity -= 1;
        if (stock.quantity === 0) this.counter[slotIndex] = null;

        return { itemId: stock.itemId, price };
    }

    completeSale(total: number): void {
        if (!Number.isInteger(total) || total <= 0) throw new Error(`Invalid sale total: ${total}`);
        this.gold += total;
    }

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

        // Temporary display stock: ten equipment types, with five extra instances.
        const equipment = [
            'short_sword', 'battle_axe', 'longbow', 'wizard_staff', 'spear',
            'iron_breastplate', 'leather_boots', 'knight_shield', 'silver_ring', 'ruby_necklace',
            'short_sword', 'wizard_staff', 'iron_breastplate', 'leather_boots', 'ruby_necklace',
        ];
        for (let i = 0; i < equipment.length; i++) {
            this.counter[5 + i] = stock(equipment[i]);
        }

        this.inventory = [
            stock('short_sword'),
            stock('knight_shield'),
            stock('iron_breastplate'),
        ];
    }
}
