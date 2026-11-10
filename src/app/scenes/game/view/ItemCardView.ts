import type { BagItem, Rarity } from '../data/itemCatalog';
import config from '../lootTinderConfig';
import { getItemValues } from '../data/itemValuation';
import { panel, text } from './uiDraw';

type Direction = 'reject' | 'take';

const rarityColors: Record<Rarity, number> = {
    COMMON: 0x786b59,
    UNCOMMON: 0x568c32,
    RARE: 0x3979ad,
    EPIC: 0x8f43ab,
};

export default class ItemCardView {
    private readonly container: Phaser.GameObjects.Container;
    private readonly scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, layer: Phaser.GameObjects.Layer, item: BagItem, onSwipe: (direction: Direction) => void) {
        this.scene = scene;
        const { x, y, width, height } = config.card;
        const g = scene.add.graphics();
        panel(g, -width / 2, -height / 2, width, height, 0xffdc9e, 28);

        g.fillStyle(0xe9b879, 0.5).fillRoundedRect(-220, -282, 440, 289, 22);
        g.fillStyle(0xffe9b4, 0.65).fillRoundedRect(-212, -276, 424, 274, 19);
        g.fillStyle(0xbb814b, 0.18).fillRoundedRect(-226, 201, 452, 124, 12);
        g.lineStyle(2, 0xa96d3b, 0.55).strokeRoundedRect(-226, 201, 452, 124, 12);
        g.lineStyle(2, 0xad8255, 0.55).lineBetween(-205, 245, 205, 245);

        const icon = scene.add.image(0, -145, 'atlas', item.frame).setScale(1.95);
        const titleSize = item.name.length > 16 ? 34 : item.name.length > 12 ? 39 : 46;
        const name = text(scene, 0, 72, item.name.toUpperCase(), titleSize);

        const rarity = item.rarity;
        const badge = scene.add.graphics();
        badge.fillStyle(rarity ? rarityColors[rarity] : 0xc3935c).fillRoundedRect(-151, 104, 302, 54, 13);
        badge.lineStyle(3, 0x422932, 0.8).strokeRoundedRect(-151, 104, 302, 54, 13);
        const label = text(scene, 0, 131, rarity ?? item.category.toUpperCase(), 29, '#fff2d4');
        label.setStroke('#3a272a', 3);

        let traitText = '';
        if (item.unidentified) traitText = 'UNIDENTIFIED';
        else if (item.trait) traitText = item.trait.toUpperCase();
        const trait = text(scene, 0, 175, traitText, 27, item.unidentified ? '#8d4099' : '#a14424');

        const values = getItemValues(item.baseValue);
        const receipt: Phaser.GameObjects.Text[] = [];
        const rows = [
            { y: 225, label: 'BASE VALUE', amount: `${item.baseValue} G`, color: '#86603c' },
            { y: 267, label: 'REJECT', amount: `+${values.reject} G`, color: '#a13c2a' },
            { y: 301, label: 'TAKE', amount: `+${values.take} G`, color: '#34752b' },
        ];
        for (const row of rows) {
            const label = text(scene, -197, row.y, row.label, 24, row.color).setOrigin(0, 0.5);
            const amount = text(scene, 197, row.y, row.amount, 28, row.color).setOrigin(1, 0.5);
            receipt.push(label, amount);
        }

        this.container = scene.add.container(x, y, [g, icon, name, badge, label, trait, ...receipt]);
        this.container.setSize(width, height).setInteractive({ useHandCursor: true });
        scene.input.setDraggable(this.container);
        layer.add(this.container);

        this.container.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            this.container.x = dragX;
            this.container.y = Phaser.Math.Clamp(dragY, y - 40, y + 40);
            this.container.angle = Phaser.Math.Clamp((dragX - x) * 0.055, -16, 16);
        });
        this.container.on('dragend', () => {
            const dx = this.container.x - x;
            if (Math.abs(dx) >= config.card.dragThreshold) {
                onSwipe(dx < 0 ? 'reject' : 'take');
            } else {
                scene.tweens.add({ targets: this.container, x, y, angle: 0, duration: 140, ease: 'Cubic.Out' });
            }
        });

        this.container.setScale(0.94).setAlpha(0);
        scene.tweens.add({
            targets: this.container,
            scale: 1, alpha: 1,
            duration: config.card.appearDurationMs,
            ease: 'Cubic.Out',
        });
    }

    exit(direction: Direction, onComplete: () => void): void {
        this.container.disableInteractive();
        this.scene.tweens.killTweensOf(this.container);
        this.scene.tweens.add({
            targets: this.container,
            x: direction === 'reject' ? -420 : 1140,
            angle: direction === 'reject' ? -18 : 18,
            alpha: 0,
            duration: config.card.exitDurationMs,
            ease: 'Cubic.In',
            onComplete: () => {
                this.container.destroy();
                onComplete();
            },
        });
    }
}
