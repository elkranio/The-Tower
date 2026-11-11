import { text } from './uiDraw';

export default class ActionButtonsView {
    constructor(scene: Phaser.Scene, layer: Phaser.GameObjects.Layer, onSell: () => void, onKeep: () => void) {
        this.addButton(scene, layer, 192, 1127, 'SELL', 0xb66d32, 0x89431f, onSell);
        this.addButton(scene, layer, 528, 1127, 'KEEP', 0x679b27, 0x3d6819, onKeep);
    }

    private addButton(
        scene: Phaser.Scene,
        layer: Phaser.GameObjects.Layer,
        x: number, y: number, label: string,
        fill: number, shade: number, onClick: () => void,
    ): void {
        const g = scene.add.graphics();
        g.fillStyle(0x130e14, 0.5).fillRoundedRect(-149, -54, 306, 118, 22);
        g.fillStyle(0x392329).fillRoundedRect(-154, -65, 308, 120, 23);
        g.fillStyle(shade).fillRoundedRect(-149, -60, 298, 110, 20);
        g.fillStyle(fill).fillRoundedRect(-143, -57, 286, 91, 17);
        g.lineStyle(3, 0xfbc185, 0.42).strokeRoundedRect(-139, -54, 278, 84, 15);
        const caption = text(scene, 0, -6, label, 40, '#fff4d8');
        caption.setStroke('#3a1b18', 5);

        const button = scene.add.container(x, y, [g, caption]);
        button.setSize(306, 118).setInteractive({ useHandCursor: true });
        button.on('pointerdown', onClick);
        layer.add(button);
    }
}
