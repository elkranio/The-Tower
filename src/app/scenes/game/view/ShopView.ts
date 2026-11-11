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
) {
    // Customers render between the town and the shop window.
    background.add(scene.add.image(360, 275, 'atlas', 'shop/town'));
    const customerLayer = scene.add.container(0, 0);
    background.add(customerLayer);
    background.add(scene.add.image(360, 640, 'atlas', 'shop/store'));

    const slotIcons: (Phaser.GameObjects.Image | null)[] = Array(session.counter.length).fill(null);
    const slotCounts: (Phaser.GameObjects.Text | null)[] = Array(session.counter.length).fill(null);

    function slotPosition(index: number): { x: number; y: number } {
        const column = index % COUNTER_COLUMNS;
        const row = Math.floor(index / COUNTER_COLUMNS);
        return { x: 100 + column * 134, y: 619 + row * 132 };
    }

    function refreshSlot(index: number): void {
        slotIcons[index]?.destroy();
        slotCounts[index]?.destroy();
        slotIcons[index] = null;
        slotCounts[index] = null;

        const stock = session.counter[index];
        if (!stock) return;

        const { x, y } = slotPosition(index);
        const item = getCatalogItem(stock.itemId);
        const icon = scene.add.image(x, y - 2, 'atlas', item.frame).setScale(0.88);
        items.add(icon);
        slotIcons[index] = icon;

        if (stock.quantity > 1) {
            const count = text(scene, x + 37, y + 37, `${stock.quantity}`, 28, '#fff4de');
            count.setStroke('#302027', 5);
            items.add(count);
            slotCounts[index] = count;
        }
    }

    for (let i = 0; i < session.counter.length; i++) {
        const { x, y } = slotPosition(i);
        const slot = scene.add.image(x, y, 'atlas', 'shop/slot');
        if (i < COUNTER_COLUMNS) slot.setTint(0xffbdc3);
        items.add(slot);
        refreshSlot(i);
    }

    function takeItem(slotIndex: number, itemId: string): Phaser.GameObjects.Image {
        const { x, y } = slotPosition(slotIndex);
        refreshSlot(slotIndex);

        const icon = scene.add.image(x, y - 2, 'atlas', getCatalogItem(itemId).frame).setScale(0.88);
        items.add(icon);
        return icon;
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

    function showPayment(previousGold: number, amount: number): void {
        const display = { gold: previousGold };
        const finalGold = previousGold + amount;
        scene.tweens.add({
            targets: display,
            gold: finalGold,
            duration: 420,
            ease: 'Cubic.Out',
            onUpdate: () => gold.setText(formatGold(Math.round(display.gold))),
            onComplete: () => gold.setText(formatGold(finalGold)),
        });

        const gain = text(scene, 566, 105, `+${formatGold(amount)}`, 28, '#9bea70');
        gain.setOrigin(0, 0.5);
        gain.setStroke('#38212a', 5);
        ui.add(gain);
        scene.tweens.add({
            targets: gain,
            y: 87,
            alpha: 0,
            duration: 650,
            delay: 350,
            ease: 'Cubic.In',
            onComplete: () => gain.destroy(),
        });
    }

    return { customerLayer, takeItem, showPayment };
}
