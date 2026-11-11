export type Category = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material' | 'curio';
export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC';

export type CatalogItem = {
    id: string;
    name: string;
    frame: string;
    category: Category;
    baseValue: number;
    traits?: readonly string[];
};

export type BagItem = CatalogItem & {
    rarity?: Rarity;
    trait?: string;
    unidentified?: boolean;
};

// Frame keys match the packed atlas. Names and values are temporary prototype data.
const entries: ReadonlyArray<[string, string, Category, number, (readonly string[])?]> = [
    ['Pickaxe', '35', 'weapon', 38, ['Sturdy', 'Deep Miner']],
    ['Herb Bundle', '25', 'material', 18],
    ['Ruby Ring', '16', 'accessory', 92, ['Lucky', 'Fire Touched']],
    ['Skull', '29', 'curio', 22],
    ['Ancient Tome', '36', 'curio', 115],
    ['Crossbow', '07', 'weapon', 74, ['Quickdraw', 'Hunter']],
    ['Steel Armor', '12', 'armor', 106, ['Reinforced', 'Lightweight']],
    ['Leather Hide', '27', 'material', 25],
    ['Hand Axe', '03', 'weapon', 34, ['Sharp', 'Balanced']],
    ['Ruby', '18', 'material', 87],
    ['Golden Idol', '34', 'curio', 126],
    ['Short Sword', '01', 'weapon', 84, ['Fire Touched', 'Vampiric']],
    ['Star Wand', '09', 'weapon', 69, ['Arcane', 'Radiant']],
    ['Spiked Mace', '04', 'weapon', 63, ['Heavy', 'Crushing']],
    ['Knight Helm', '11', 'armor', 58, ['Reinforced', 'Warding']],
    ['Health Potion', '19', 'consumable', 27],
    ['Mana Potion', '20', 'consumable', 29],
    ['Lantern', '33', 'curio', 21],
    ['Torch', '23', 'consumable', 9],
    ['Old Key', '30', 'curio', 31],
    ['Iron Ore', '26', 'material', 17],
    ['Dagger', '02', 'weapon', 39, ['Swift', 'Poisoned']],
    ['Throwing Knife', '05', 'weapon', 23, ['Balanced', 'Sharp']],
    ['Wizard Staff', '08', 'weapon', 77, ['Arcane', 'Elderwood']],
    ['Sapphire Pendant', '17', 'accessory', 99, ['Lucky', 'Warding']],
    ['Bone Pile', '28', 'material', 12],
    ['Sealed Scroll', '21', 'consumable', 37],
    ['Steel Gloves', '14', 'armor', 54, ['Reinforced', 'Swift']],
    ['Traveler Cloak', '15', 'armor', 46, ['Lightweight', 'Shadow Woven']],
    ['Leather Boots', '13', 'armor', 44, ['Swift', 'Sturdy']],
    ['Bomb', '22', 'consumable', 41],
    ['Wooden Bow', '06', 'weapon', 61, ['Hunter', 'Swift']],
    ['Knight Shield', '10', 'armor', 86, ['Warding', 'Reinforced']],
    ['Treasure Map', '31', 'curio', 64],
    ['Coiled Rope', '32', 'consumable', 13],
    ['Cured Meat', '24', 'consumable', 16],
];

export const itemCatalog: readonly CatalogItem[] = entries.map(([name, id, category, baseValue, traits]) => ({
    id: `item_${id}`,
    name,
    frame: `item_icons/icon_${id}`,
    category,
    baseValue,
    traits,
}));

const rarities: readonly Rarity[] = ['COMMON', 'COMMON', 'COMMON', 'UNCOMMON', 'UNCOMMON', 'RARE', 'EPIC'];

export function generateBag(minItems: number, maxItems: number): BagItem[] {
    const count = minItems + Math.floor(Math.random() * (maxItems - minItems + 1));
    return Array.from({ length: count }, () => {
        const base = itemCatalog[Math.floor(Math.random() * itemCatalog.length)];
        if (!base.traits) return { ...base };

        return {
            ...base,
            rarity: rarities[Math.floor(Math.random() * rarities.length)],
            trait: Math.random() < 0.3 ? base.traits[Math.floor(Math.random() * base.traits.length)] : undefined,
            unidentified: Math.random() < 0.12,
        };
    });
}
