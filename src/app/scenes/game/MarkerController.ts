import type Game from './Game';
import combatConfig from './combatConfig';
import CombatMarkerView from './view/CombatMarkerView';

type Point = { x: number; y: number };
type Step = { dx: number; dy: number };
type ActiveMarker = { view: CombatMarkerView; remainingMs: number };

export default class MarkerController {
    private readonly active: ActiveMarker[] = [];
    private spawnTimerMs = 0;
    private lastPosition: Point | null = null;
    private pattern: readonly Step[] = [];
    private patternIndex = 0;
    private directionX = 1;
    private directionY = 1;
    private running = true;

    constructor(
        private readonly scene: Game,
        private readonly onHit: () => void,
        private readonly onMiss: () => void,
    ) {}

    update(delta: number): void {
        if (!this.running) return;

        for (const marker of [...this.active]) {
            marker.remainingMs -= delta;

            if (marker.remainingMs <= 0) {
                this.remove(marker);
                this.onMiss();
                if (!this.running) return;
            } else {
                marker.view.setRemaining(marker.remainingMs / combatConfig.marker.lifetimeMs);
            }
        }

        this.spawnTimerMs -= delta;
        if (this.spawnTimerMs <= 0) {
            this.spawn();
            this.spawnTimerMs = combatConfig.marker.spawnIntervalMs;
        }
    }

    stop(): void {
        this.running = false;
        for (const marker of this.active) marker.view.destroy();
        this.active.length = 0;
    }

    private spawn(): void {
        const position = this.nextPosition();
        let marker: ActiveMarker;
        const view = new CombatMarkerView(
            this.scene,
            this.scene.layers.get('markers'),
            position.x,
            position.y,
            combatConfig.marker,
            () => this.hit(marker),
        );

        marker = { view, remainingMs: combatConfig.marker.lifetimeMs };
        this.active.push(marker);
    }

    private hit(marker: ActiveMarker): void {
        if (!this.running || !this.active.includes(marker)) return;

        this.remove(marker);
        this.onHit();
    }

    private remove(marker: ActiveMarker): void {
        const index = this.active.indexOf(marker);
        if (index === -1) return;

        this.active.splice(index, 1);
        marker.view.destroy();
    }

    private nextPosition(): Point {
        const { area, patterns } = combatConfig.marker;
        if (!this.lastPosition) {
            this.lastPosition = {
                x: Phaser.Math.Between(area.minX, area.maxX),
                y: Phaser.Math.Between(area.minY, area.maxY),
            };
            return this.lastPosition;
        }

        if (this.patternIndex >= this.pattern.length) {
            this.pattern = patterns[Phaser.Math.Between(0, patterns.length - 1)];
            this.patternIndex = 0;
        }

        const step = this.pattern[this.patternIndex++];
        let x = this.lastPosition.x + step.dx * this.directionX;
        let y = this.lastPosition.y + step.dy * this.directionY;

        if (x < area.minX || x > area.maxX) {
            this.directionX *= -1;
            x = this.lastPosition.x + step.dx * this.directionX;
        }
        if (y < area.minY || y > area.maxY) {
            this.directionY *= -1;
            y = this.lastPosition.y + step.dy * this.directionY;
        }

        this.lastPosition = {
            x: Phaser.Math.Clamp(x, area.minX, area.maxX),
            y: Phaser.Math.Clamp(y, area.minY, area.maxY),
        };
        return this.lastPosition;
    }
}
