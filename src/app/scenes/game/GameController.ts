import type Game from './Game';
import combatConfig from './combatConfig';
import MarkerController from './MarkerController';
import createBackgroundView from './view/BackgroundView';
import createMobView from './view/MobView';
import HealthBarView from './view/HealthBarView';

export default class GameController {
    private mobHealth!: HealthBarView;
    private playerHealth!: HealthBarView;
    private mob!: Phaser.GameObjects.Image;
    private markers!: MarkerController;
    private mobHp = combatConfig.mob.hp;
    private playerHp = combatConfig.player.hp;
    private finished = false;

    constructor(private readonly scene: Game) {}

    start(): void {
        const { scene } = this;

        createBackgroundView(scene, scene.layers.get('bg'));
        this.mob = createMobView(scene, scene.layers.get('mob'), combatConfig.mob);

        const ui = scene.layers.get('ui');
        this.mobHealth = new HealthBarView(scene, ui, combatConfig.hud.mob, combatConfig.mob);
        this.playerHealth = new HealthBarView(scene, ui, combatConfig.hud.player, combatConfig.player);
        this.markers = new MarkerController(scene, () => this.hitMarker(), () => this.missMarker(), () => this.trapMarker());
    }

    update(delta: number): void {
        if (!this.finished) this.markers.update(delta);
    }

    private hitMarker(): void {
        if (this.finished) return;

        this.mobHp = Math.max(0, this.mobHp - combatConfig.marker.damageToMob);
        this.mobHealth.setHp(this.mobHp);
        this.hitMobEffect();

        if (this.mobHp === 0) this.endFight('Victory!');
    }

    private hitMobEffect(): void {
        const { scene, mob } = this;
        scene.tweens.killTweensOf(mob);
        mob.setX(combatConfig.mob.x - 10);
        mob.setTintFill(0xffffff);
        scene.tweens.add({
            targets: mob,
            x: combatConfig.mob.x,
            duration: 120,
            ease: 'Cubic.Out',
            onComplete: () => mob.clearTint(),
        });
    }

    private missMarker(): void {
        this.damagePlayer(combatConfig.marker.damageToPlayerOnMiss);
    }

    private trapMarker(): void {
        this.damagePlayer(combatConfig.marker.damageToPlayerOnTrap);
    }

    private damagePlayer(damage: number): void {
        if (this.finished) return;

        this.playerHp = Math.max(0, this.playerHp - damage);
        this.playerHealth.setHp(this.playerHp);

        if (this.playerHp === 0) this.endFight('Defeat!');
    }

    private endFight(message: string): void {
        this.finished = true;
        this.markers.stop();

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
