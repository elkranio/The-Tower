import BaseScene from '../BaseScene';
import LayerManager from '../../../system/LayerManager';
import GameSession from '../../game/GameSession';
import createShopView from './view/ShopView';
import startCustomerLoop from './view/CustomerLoopView';

const layers = ['bg', 'cards', 'ui'] as const;
type LayerKeys = (typeof layers)[number];

export default class Game extends BaseScene<LayerKeys> {
    private readonly session = new GameSession();

    constructor() {
        super('Game');
    }

    protected createLayerManager(): LayerManager<LayerKeys> {
        return new LayerManager(this, layers);
    }

    protected start(): void {
        const customerLayer = createShopView(
            this,
            this.layers.get('bg'),
            this.layers.get('cards'),
            this.layers.get('ui'),
            this.session,
        );
        startCustomerLoop(this, customerLayer);
    }
}
