import type Game from './Game';
import combatConfig from './combatConfig';
import createBackgroundView from './view/BackgroundView';
import createMobView from './view/MobView';
import HealthBarView from './view/HealthBarView';

export default class GameController {
    private mobHealth!: HealthBarView;
    private playerHealth!: HealthBarView;

    constructor(private readonly scene: Game) {}

    start(): void {
        const { scene } = this;

        createBackgroundView(scene, scene.layers.get('bg'));
        createMobView(scene, scene.layers.get('mob'), combatConfig.mob);

        const ui = scene.layers.get('ui');
        this.mobHealth = new HealthBarView(scene, ui, combatConfig.hud.mob, combatConfig.mob);
        this.playerHealth = new HealthBarView(scene, ui, combatConfig.hud.player, combatConfig.player);
    }

    setMobHp(hp: number): void {
        this.mobHealth.setHp(hp);
    }

    setPlayerHp(hp: number): void {
        this.playerHealth.setHp(hp);
    }
}
