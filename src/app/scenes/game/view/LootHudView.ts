import { panel, text } from './uiDraw';

type Report = { spent: number; estimate: number; current: number; total: number };

export default class LootHudView {
    private readonly progress: Phaser.GameObjects.Text;
    private readonly spent: Phaser.GameObjects.Text;
    private readonly estimated: Phaser.GameObjects.Text;
    private readonly net: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, layer: Phaser.GameObjects.Layer, dungeonName: string) {
        const g = scene.add.graphics();
        panel(g, 20, 24, 680, 98);
        panel(g, 20, 135, 680, 155);
        g.lineStyle(3, 0xb78956, 0.9);
        g.lineBetween(247, 153, 247, 274);
        g.lineBetween(473, 153, 473, 274);

        // Simple bag pictogram, drawn in Phaser like the rest of the frame.
        g.fillStyle(0x9b5728).fillEllipse(77, 87, 66, 51);
        g.fillStyle(0xd58c32).fillEllipse(77, 79, 57, 47);
        g.fillStyle(0x7b3a24).fillTriangle(61, 53, 92, 53, 77, 67);
        g.fillStyle(0xf4b554).fillEllipse(77, 50, 24, 13);
        layer.add(g);

        layer.add(text(scene, 285, 73, dungeonName, 43));
        this.progress = text(scene, 606, 74, '', 42);
        layer.add(this.progress);

        for (const [x, title] of [[132, 'SPENT'], [360, 'EST. VALUE'], [585, 'NET']] as const) {
            layer.add(text(scene, x, 177, title, 21, '#67472f'));
        }
        this.spent = text(scene, 132, 233, '', 38, '#a93220');
        this.estimated = text(scene, 360, 233, '', 38, '#276d28');
        this.net = text(scene, 585, 233, '', 38);
        layer.add(this.spent);
        layer.add(this.estimated);
        layer.add(this.net);
    }

    setReport({ spent, estimate, current, total }: Report): void {
        this.progress.setText(`${current} / ${total}`);
        this.spent.setText(`-${spent}`);
        this.estimated.setText(`+${estimate}`);
        const net = estimate - spent;
        this.net.setText(`${net >= 0 ? '+' : ''}${net}`);
        this.net.setColor(net >= 0 ? '#276d28' : '#a93220');
    }
}
