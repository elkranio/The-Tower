import type combatConfig from '../combatConfig';

type MarkerConfig = typeof combatConfig.marker;

export default class CombatMarkerView {
    private readonly graphics: Phaser.GameObjects.Graphics;
    private readonly hitArea: Phaser.GameObjects.Zone;

    constructor(
        scene: Phaser.Scene,
        layer: Phaser.GameObjects.Layer,
        x: number,
        y: number,
        private readonly config: MarkerConfig,
        onTap: () => void,
    ) {
        this.graphics = scene.add.graphics().setPosition(x, y);
        layer.add(this.graphics);

        const diameter = config.radius * 2;
        this.hitArea = scene.add.zone(x, y, diameter, diameter);
        this.hitArea.setInteractive(
            new Phaser.Geom.Circle(config.radius, config.radius, config.radius),
            Phaser.Geom.Circle.Contains,
        );
        this.hitArea.on('pointerdown', onTap);
        layer.add(this.hitArea);

        this.setRemaining(1);
    }

    setRemaining(fraction: number): void {
        const remaining = Phaser.Math.Clamp(fraction, 0, 1);
        const { radius, fillColor, borderColor, borderWidth, trackColor, ringColor, ringWidth, ringInset } = this.config;
        const ringRadius = radius - ringInset;

        this.graphics.clear();
        this.graphics.fillStyle(fillColor);
        this.graphics.fillCircle(0, 0, radius);
        this.graphics.lineStyle(borderWidth, borderColor);
        this.graphics.strokeCircle(0, 0, radius);
        this.graphics.lineStyle(ringWidth, trackColor);
        this.graphics.strokeCircle(0, 0, ringRadius);

        if (remaining > 0) {
            this.graphics.lineStyle(ringWidth, ringColor);
            this.graphics.beginPath();
            this.graphics.arc(0, 0, ringRadius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * remaining);
            this.graphics.strokePath();
        }
    }

    destroy(): void {
        this.hitArea.destroy();
        this.graphics.destroy();
    }
}
