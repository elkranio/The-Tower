type HealthBarLayout = {
    x: number;
    y: number;
    width: number;
    height: number;
    labelWidth: number;
    color: number;
};

type HealthData = {
    name: string;
    hp: number;
    maxHp: number;
};

export default class HealthBarView {
    private readonly fill: Phaser.GameObjects.Graphics;
    private readonly hpText: Phaser.GameObjects.Text;
    private readonly barX: number;
    private readonly barY: number;
    private readonly barWidth: number;
    private readonly barHeight: number;
    private readonly maxHp: number;
    private readonly color: number;

    constructor(scene: Phaser.Scene, layer: Phaser.GameObjects.Layer, layout: HealthBarLayout, data: HealthData) {
        this.maxHp = data.maxHp;
        this.color = layout.color;
        this.barX = layout.x + layout.labelWidth;
        this.barY = layout.y + 16;
        this.barWidth = layout.width - layout.labelWidth - 16;
        this.barHeight = layout.height - 32;

        const frame = scene.add.graphics();
        frame.fillStyle(0xffdfad);
        frame.fillRoundedRect(layout.x, layout.y, layout.width, layout.height, 14);
        frame.lineStyle(4, 0x201b26);
        frame.strokeRoundedRect(layout.x, layout.y, layout.width, layout.height, 14);
        frame.fillStyle(0x48393f);
        frame.fillRoundedRect(this.barX, this.barY, this.barWidth, this.barHeight, 10);
        frame.lineStyle(3, 0x201b26);
        frame.strokeRoundedRect(this.barX, this.barY, this.barWidth, this.barHeight, 10);
        layer.add(frame);

        const label = scene.add.text(layout.x + 22, layout.y + layout.height / 2, data.name, {
            fontFamily: 'Arial',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#201b26',
        }).setOrigin(0, 0.5);
        layer.add(label);

        this.fill = scene.add.graphics();
        layer.add(this.fill);

        this.hpText = scene.add.text(this.barX + this.barWidth / 2, layout.y + layout.height / 2, '', {
            fontFamily: 'Arial',
            fontSize: '30px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#201b26',
            strokeThickness: 5,
        }).setOrigin(0.5);
        layer.add(this.hpText);

        this.setHp(data.hp);
    }

    setHp(hp: number): void {
        const currentHp = Phaser.Math.Clamp(hp, 0, this.maxHp);
        const fillWidth = this.barWidth * (currentHp / this.maxHp);

        this.fill.clear();
        if (fillWidth > 0) {
            this.fill.fillStyle(this.color);
            this.fill.fillRoundedRect(this.barX, this.barY, fillWidth, this.barHeight, Math.min(10, fillWidth / 2));
        }
        this.hpText.setText(`${currentHp} / ${this.maxHp}`);
    }
}
