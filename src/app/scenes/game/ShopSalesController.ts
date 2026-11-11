import GameSession from '../../game/GameSession';
import createShopView from './view/ShopView';
import startCustomerLoop from './view/CustomerLoopView';

export default function startShopSales(
    scene: Phaser.Scene,
    session: GameSession,
    shop: ReturnType<typeof createShopView>,
): void {
    startCustomerLoop(scene, shop.customerLayer, (leave) => {
        const targetCount = 1 + Math.floor(Math.random() * 4);
        const basket: Phaser.GameObjects.Image[] = [];
        let total = 0;

        function takeNext(): void {
            if (basket.length === targetCount) {
                checkout();
                return;
            }

            const availableSlots: number[] = [];
            for (let i = 0; i < session.counter.length; i++) {
                if (session.counter[i]?.quantity) availableSlots.push(i);
            }

            if (availableSlots.length === 0) {
                checkout();
                return;
            }

            const index = availableSlots[Math.floor(Math.random() * availableSlots.length)];
            const purchased = session.takeCounterItem(index);
            if (!purchased) {
                checkout();
                return;
            }

            total += purchased.price;
            basket.push(shop.takeItem(index, purchased.itemId));

            // Every new item recenters the entire row while it is flying in.
            for (let i = 0; i < basket.length; i++) {
                const x = 360 + (i - (basket.length - 1) / 2) * 80;
                scene.tweens.add({
                    targets: basket[i],
                    x,
                    y: 455,
                    scale: 0.6,
                    duration: 260,
                    ease: 'Cubic.Out',
                });
            }

            scene.time.delayedCall(330, takeNext);
        }

        function checkout(): void {
            if (total === 0) {
                scene.time.delayedCall(450, leave);
                return;
            }

            scene.time.delayedCall(320, () => {
                const previousGold = session.gold;
                session.completeSale(total);
                shop.showPayment(previousGold, total);
                if (scene.cache.audio.exists('sfx')) {
                    scene.sound.playAudioSprite('sfx', 'click', { volume: 0.35 });
                }

                scene.tweens.add({
                    targets: basket,
                    alpha: 0,
                    scale: 0.5,
                    duration: 180,
                    ease: 'Cubic.In',
                    onComplete: () => basket.forEach((item) => item.destroy()),
                });
                scene.time.delayedCall(550, leave);
            });
        }

        scene.time.delayedCall(250, takeNext);
    });
}
