import { panel, text } from './uiDraw';

type Report = { profit: number; current: number; total: number };

export default class LootHudView {
    private readonly progress: Phaser.GameObjects.Text;
    private readonly profit: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, layer: Phaser.GameObjects.Layer, dungeonName: string) {
        const g = scene.add.graphics();
        panel(g, 20, 24, 680, 98);
        panel(g, 20, 135, 680, 125);

        // Simple bag pictogram, drawn in Phaser like the rest of the frame.
        g.fillStyle(0x9b5728).fillEllipse(77, 87, 66, 51);
        g.fillStyle(0xd58c32).fillEllipse(77, 79, 57, 47);
        g.fillStyle(0x7b3a24).fillTriangle(61, 53, 92, 53, 77, 67);
        g.fillStyle(0xf4b554).fillEllipse(77, 50, 24, 13);
        layer.add(g);

        layer.add(text(scene, 285, 73, dungeonName, 43));
        this.progress = text(scene, 606, 74, '', 42);
        layer.add(this.progress);

        layer.add(text(scene, 360, 170, 'EST. PROFIT', 25, '#67472f'));
        this.profit = text(scene, 360, 222, '', 59);
        layer.add(this.profit);
    }

    setReport({ profit, current, total }: Report): void {
        this.progress.setText(`${current} / ${total}`);
        this.profit.setText(`${profit > 0 ? '+' : ''}${profit} G`);
        this.profit.setColor(profit > 0 ? '#276d28' : profit < 0 ? '#a93220' : '#67472f');
    }
}
