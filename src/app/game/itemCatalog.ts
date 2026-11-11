export type CatalogItem = {
    id: string;
    name: string;
    category: 'consumable' | 'weapon' | 'armor' | 'accessory';
    baseValue: number;
    frame: string;
};

// Base values are temporary until shop prices are balanced.
export const itemCatalog: readonly CatalogItem[] = [
    { id: 'health_potion', name: 'Health Potion', category: 'consumable', baseValue: 25, frame: 'items/health_potion' },
    { id: 'mana_potion', name: 'Mana Potion', category: 'consumable', baseValue: 30, frame: 'items/mana_potion' },
    { id: 'antidote', name: 'Antidote', category: 'consumable', baseValue: 20, frame: 'items/antidote' },
    { id: 'iron_rations', name: 'Iron Rations', category: 'consumable', baseValue: 15, frame: 'items/iron_rations' },
    { id: 'scroll_of_return', name: 'Scroll of Return', category: 'consumable', baseValue: 50, frame: 'items/scroll_of_return' },

    { id: 'short_sword', name: 'Short Sword', category: 'weapon', baseValue: 100, frame: 'items/short_sword' },
    { id: 'battle_axe', name: 'Battle Axe', category: 'weapon', baseValue: 140, frame: 'items/battle_axe' },
    { id: 'longbow', name: 'Longbow', category: 'weapon', baseValue: 120, frame: 'items/longbow' },
    { id: 'wizard_staff', name: 'Wizard Staff', category: 'weapon', baseValue: 110, frame: 'items/wizard_staff' },
    { id: 'spear', name: 'Spear', category: 'weapon', baseValue: 80, frame: 'items/spear' },
    { id: 'iron_breastplate', name: 'Iron Breastplate', category: 'armor', baseValue: 180, frame: 'items/iron_breastplate' },
    { id: 'leather_boots', name: 'Leather Boots', category: 'armor', baseValue: 60, frame: 'items/leather_boots' },
    { id: 'knight_shield', name: 'Knight Shield', category: 'armor', baseValue: 130, frame: 'items/knight_shield' },
    { id: 'silver_ring', name: 'Silver Ring', category: 'accessory', baseValue: 90, frame: 'items/silver_ring' },
    { id: 'ruby_necklace', name: 'Ruby Necklace', category: 'accessory', baseValue: 160, frame: 'items/ruby_necklace' },
];

export function getCatalogItem(id: string): CatalogItem {
    const item = itemCatalog.find(entry => entry.id === id);
    if (!item) throw new Error(`Unknown item: ${id}`);
    return item;
}
