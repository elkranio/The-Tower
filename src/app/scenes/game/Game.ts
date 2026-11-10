import BaseScene from '../BaseScene';
import LayerManager from '../../../system/LayerManager';
import LootTinderController from './LootTinderController';

const layers = ['bg', 'cards', 'ui'] as const;
type LayerKeys = (typeof layers)[number];

export default class Game extends BaseScene<LayerKeys> {
    constructor() {
        super('Game');
    }

    protected createLayerManager(): LayerManager<LayerKeys> {
        return new LayerManager(this, layers);
    }

    protected start(): void {
        new LootTinderController(this).start();
    }
}
