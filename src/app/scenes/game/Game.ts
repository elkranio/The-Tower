import BaseScene from '../BaseScene';
import LayerManager from '../../../system/LayerManager';
import GameController from './GameController';

const layers = ['bg', 'mob', 'markers', 'ui'] as const;
type LayerKeys = (typeof layers)[number];

export default class Game extends BaseScene<LayerKeys> {
    private controller?: GameController;

    constructor() {
        super('Game');
    }

    protected createLayerManager(): LayerManager<LayerKeys> {
        return new LayerManager(this, layers);
    }

    protected start(): void {
        this.controller = new GameController(this);
        this.controller.start();
    }

    update(_time: number, delta: number): void {
        this.controller?.update(delta);
    }
}
