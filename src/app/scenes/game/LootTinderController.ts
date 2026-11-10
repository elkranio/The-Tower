import type Game from './Game';
import config from './lootTinderConfig';
import { generateBag, type BagItem } from './data/itemCatalog';
import { getItemValues } from './data/itemValuation';
import createBackgroundView from './view/BackgroundView';
import LootHudView from './view/LootHudView';
import ActionButtonsView from './view/ActionButtonsView';
import ItemCardView from './view/ItemCardView';
import { text } from './view/uiDraw';

type Decision = 'reject' | 'take';

export default class LootTinderController {
    private hud!: LootHudView;
    private card: ItemCardView | null = null;
    private bag: BagItem[] = [];
    private itemIndex = 0;
    private profit = -config.bag.purchasePrice;
    private busy = false;

    constructor(private readonly scene: Game) {}

    start(): void {
        const { scene } = this;
        createBackgroundView(scene, scene.layers.get('bg'));
        this.hud = new LootHudView(scene, scene.layers.get('ui'), config.dungeonName);
        new ActionButtonsView(scene, scene.layers.get('ui'), () => this.choose('reject'), () => this.choose('take'));
        this.newBag();
    }

    private newBag(): void {
        this.bag = generateBag(config.bag.minItems, config.bag.maxItems);
        this.itemIndex = 0;
        this.profit = -config.bag.purchasePrice;
        this.busy = false;
        this.showItem();
    }

    private showItem(): void {
        this.updateReport();
        this.card = new ItemCardView(
            this.scene,
            this.scene.layers.get('cards'),
            this.bag[this.itemIndex],
            direction => this.choose(direction),
        );
    }

    private choose(decision: Decision): void {
        if (this.busy || !this.card) return;
        this.busy = true;

        const item = this.bag[this.itemIndex];
        this.profit += getItemValues(item.baseValue)[decision];
        this.updateReport();

        this.card.exit(decision, () => {
            this.card = null;
            this.itemIndex += 1;
            if (this.itemIndex < this.bag.length) {
                this.scene.time.delayedCall(config.nextCardDelayMs, () => {
                    this.busy = false;
                    this.showItem();
                });
            } else {
                this.finishBag();
            }
        });
    }

    private finishBag(): void {
        const complete = text(this.scene, 360, 652, 'BAG COMPLETE', 49, '#ffe5aa');
        complete.setStroke('#37202a', 7);
        this.scene.layers.get('cards').add(complete);
        this.scene.time.delayedCall(config.nextBagDelayMs, () => {
            complete.destroy();
            this.newBag();
        });
    }

    private updateReport(): void {
        this.hud.setReport({
            profit: this.profit,
            current: Math.min(this.itemIndex + 1, this.bag.length),
            total: this.bag.length,
        });
    }
}
