import type Game from './Game';
import combatConfig from './combatConfig';
import createBackgroundView from './view/BackgroundView';
import createMobView from './view/MobView';
import HealthBarView from './view/HealthBarView';
import CombatMarkerView from './view/CombatMarkerView';

export default class GameController {
    private mobHealth!: HealthBarView;
    private playerHealth!: HealthBarView;
    private mobHp = combatConfig.mob.hp;
    private playerHp = combatConfig.player.hp;
    private marker: CombatMarkerView | null = null;
    private markerTimeLeft = 0;
    private nextMarkerDelay = 0;
    private finished = false;

    constructor(private readonly scene: Game) {}

    start(): void {
        const { scene } = this;

        createBackgroundView(scene, scene.layers.get('bg'));
        createMobView(scene, scene.layers.get('mob'), combatConfig.mob);

        const ui = scene.layers.get('ui');
        this.mobHealth = new HealthBarView(scene, ui, combatConfig.hud.mob, combatConfig.mob);
        this.playerHealth = new HealthBarView(scene, ui, combatConfig.hud.player, combatConfig.player);
    }

    update(delta: number): void {
        if (this.finished) return;

        if (this.marker) {
            this.markerTimeLeft -= delta;
            if (this.markerTimeLeft <= 0) {
                this.missMarker();
            } else {
                this.marker.setRemaining(this.markerTimeLeft / combatConfig.marker.lifetimeMs);
            }
            return;
        }

        this.nextMarkerDelay -= delta;
        if (this.nextMarkerDelay <= 0) this.spawnMarker();
    }

    private spawnMarker(): void {
        const { scene } = this;
        const { area } = combatConfig.marker;
        const x = Phaser.Math.Between(area.minX, area.maxX);
        const y = Phaser.Math.Between(area.minY, area.maxY);

        this.marker = new CombatMarkerView(
            scene,
            scene.layers.get('markers'),
            x,
            y,
            combatConfig.marker,
            () => this.hitMarker(),
        );
        this.markerTimeLeft = combatConfig.marker.lifetimeMs;
    }

    private hitMarker(): void {
        if (this.finished || !this.marker) return;

        this.removeMarker();
        this.mobHp = Math.max(0, this.mobHp - combatConfig.marker.damageToMob);
        this.mobHealth.setHp(this.mobHp);

        if (this.mobHp === 0) {
            this.endFight('Victory!');
        } else {
            this.scheduleNextMarker();
        }
    }

    private missMarker(): void {
        this.removeMarker();
        this.playerHp = Math.max(0, this.playerHp - combatConfig.marker.damageToPlayerOnMiss);
        this.playerHealth.setHp(this.playerHp);

        if (this.playerHp === 0) {
            this.endFight('Defeat!');
        } else {
            this.scheduleNextMarker();
        }
    }

    private removeMarker(): void {
        this.marker?.destroy();
        this.marker = null;
    }

    private scheduleNextMarker(): void {
        const { minDelayMs, maxDelayMs } = combatConfig.marker;
        this.nextMarkerDelay = Phaser.Math.Between(minDelayMs, maxDelayMs);
    }

    private endFight(message: string): void {
        this.finished = true;
        const { scene } = this;
        const { width, height } = scene.scale;
        const ui = scene.layers.get('ui');

        const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x151321, 0.7);
        overlay.setInteractive();
        overlay.on('pointerdown', () => scene.scene.restart());
        ui.add(overlay);

        ui.add(scene.add.text(width / 2, height / 2 - 24, message, {
            fontFamily: 'Arial',
            fontSize: '52px',
            fontStyle: 'bold',
            color: '#ffffff',
        }).setOrigin(0.5));
        ui.add(scene.add.text(width / 2, height / 2 + 42, 'Tap to restart', {
            fontFamily: 'Arial',
            fontSize: '26px',
            color: '#ffffff',
        }).setOrigin(0.5));
    }
}
