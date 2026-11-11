import type GameSession from '../../../game/GameSession';
import { getCatalogItem } from '../../../game/itemCatalog';
import { COUNTER_COLUMNS } from '../../../game/GameSession';
import { text } from './uiDraw';

function formatGold(value: number): string {
    if (value < 10000) return String(value);
    return value.toLocaleString('en-US').replace(/,/g, ' ');
}

export default function createShopView(
    scene: Phaser.Scene,
    background: Phaser.GameObjects.Layer,
    items: Phaser.GameObjects.Layer,
    ui: Phaser.GameObjects.Layer,
    session: GameSession,
): void {
    // Town is behind the transparent shop window.
    background.add(scene.add.image(360, 275, 'atlas', 'shop/town'));
    background.add(scene.add.image(360, 640, 'atlas', 'shop/store'));

    for (let i = 0; i < session.counter.length; i++) {
        const column = i % COUNTER_COLUMNS;
        const row = Math.floor(i / COUNTER_COLUMNS);
        const x = 100 + column * 134;
        const y = 619 + row * 132;

        const slot = scene.add.image(x, y, 'atlas', 'shop/slot');
        if (row === 0) slot.setTint(0xffbdc3);
        items.add(slot);

        const stock = session.counter[i];
        if (!stock) continue;

        const item = getCatalogItem(stock.itemId);
        const icon = scene.add.image(x, y - 2, 'atlas', item.frame).setScale(0.88);
        items.add(icon);

        if (stock.quantity > 1) {
            const count = text(scene, x + 37, y + 37, `${stock.quantity}`, 28, '#fff4de');
            count.setStroke('#302027', 5);
            items.add(count);
        }
    }

    const coin = scene.add.graphics();
    coin.fillStyle(0x2a1b20).fillCircle(530, 40, 26);
    coin.fillStyle(0xc87a16).fillCircle(530, 40, 22);
    coin.fillStyle(0xffd83a).fillCircle(529, 38, 18);
    coin.lineStyle(3, 0xffec86, 0.9).strokeCircle(529, 38, 13);
    ui.add(coin);

    const gold = text(scene, 566, 40, formatGold(session.gold), 42, '#fff4dd');
    gold.setOrigin(0, 0.5);
    gold.setStroke('#38212a', 6);
    ui.add(gold);
}
