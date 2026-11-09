import type Game from './Game';
import combatConfig, { type MarkerKind } from './combatConfig';
import CombatMarkerView from './view/CombatMarkerView';

type Point = { x: number; y: number };
type Step = { dx: number; dy: number };
type ActiveMarker = { view: CombatMarkerView; kind: MarkerKind; remainingMs: number };

export default class MarkerController {
    private readonly active: ActiveMarker[] = [];
    private spawnTimerMs = 0;
    private lastPosition: Point | null = null;
    private pattern: readonly Step[] = [];
    private patternIndex = 0;
    private trapIndexes: number[] = [];
    private directionX = 1;
    private directionY = 1;
    private running = true;

    constructor(
        private readonly scene: Game,
        private readonly onHit: () => void,
        private readonly onMiss: () => void,
        private readonly onTrap: () => void,
    ) {}

    update(delta: number): void {
        if (!this.running) return;

        for (const marker of [...this.active]) {
            marker.remainingMs -= delta;

            if (marker.remainingMs <= 0) {
                this.remove(marker);
                if (marker.kind === 'tap') this.onMiss();
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
        const { position, kind } = this.nextMarker();
        let marker: ActiveMarker;
        const view = new CombatMarkerView(
            this.scene,
            this.scene.layers.get('markers'),
            position.x,
            position.y,
            combatConfig.marker,
            kind,
            () => this.hit(marker),
        );

        marker = { view, kind, remainingMs: combatConfig.marker.lifetimeMs };
        this.active.push(marker);
    }

    private hit(marker: ActiveMarker): void {
        if (!this.running || !this.active.includes(marker)) return;

        this.remove(marker);
        if (marker.kind === 'trap') this.onTrap();
        else this.onHit();
    }

    private remove(marker: ActiveMarker): void {
        const index = this.active.indexOf(marker);
        if (index === -1) return;

        this.active.splice(index, 1);
        marker.view.destroy();
    }

    private nextMarker(): { position: Point; kind: MarkerKind } {
        const { area, patterns } = combatConfig.marker;
        if (this.patternIndex >= this.pattern.length) {
            this.pattern = patterns[Phaser.Math.Between(0, patterns.length - 1)];
            this.patternIndex = 0;
            this.trapIndexes = this.pickTrapIndexes(this.pattern.length);
        }

        const index = this.patternIndex++;
        const kind: MarkerKind = this.trapIndexes.includes(index) ? 'trap' : 'tap';

        if (!this.lastPosition) {
            this.lastPosition = {
                x: Phaser.Math.Between(area.minX, area.maxX),
                y: Phaser.Math.Between(area.minY, area.maxY),
            };
            return { position: this.lastPosition, kind };
        }

        const step = this.pattern[index];
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
        return { position: this.lastPosition, kind };
    }

    private pickTrapIndexes(length: number): number[] {
        const { min, max } = combatConfig.marker.trapsPerPattern;
        const count = Phaser.Math.Between(min, max);
        const chosen: number[] = [];

        while (chosen.length < count) {
            const available: number[] = [];
            for (let i = 1; i < length - 1; i++) {
                if (chosen.every(index => Math.abs(i - index) > 1)) available.push(i);
            }
            if (available.length === 0) break;
            chosen.push(available[Phaser.Math.Between(0, available.length - 1)]);
        }

        return chosen;
    }
}
