const customerFrames = [
    'clients/sellsword',
    'clients/warrior',
    'clients/wizard',
    'clients/traveler',
    'clients/dwarf',
    'clients/rogue',
    'clients/cleric',
    'clients/orc',
    'clients/scholar',
    'clients/elf_ranger',
];

export default function startCustomerLoop(scene: Phaser.Scene, layer: Phaser.GameObjects.Container): void {
    let lastIndex = -1;

    function nextCustomer(): void {
        let index = Math.floor(Math.random() * customerFrames.length);
        if (index === lastIndex) index = (index + 1) % customerFrames.length;
        lastIndex = index;

        const customer = scene.add.image(80, 434, 'atlas', customerFrames[index]);
        customer.setOrigin(0.5, 1);
        layer.add(customer);

        const shade = { brightness: 0.2 };
        const updateTint = () => {
            const value = Math.round(shade.brightness * 255);
            customer.setTint(Phaser.Display.Color.GetColor(value, value, value));
        };
        updateTint();

        function walkTo(x: number, onComplete: () => void): void {
            scene.tweens.add({ targets: customer, x, duration: 1280, ease: 'Linear', onComplete });
            scene.tweens.add({
                targets: customer,
                y: 424,
                duration: 160,
                ease: 'Sine.InOut',
                yoyo: true,
                repeat: 3,
            });
        }

        scene.tweens.add({ targets: shade, brightness: 1, duration: 1280, onUpdate: updateTint });
        walkTo(360, () => {
            scene.time.delayedCall(1800, () => {
                scene.tweens.add({ targets: shade, brightness: 0.2, duration: 1280, onUpdate: updateTint });
                walkTo(640, () => {
                    customer.destroy();
                    scene.time.delayedCall(500, nextCustomer);
                });
            });
        });
    }

    scene.time.delayedCall(400, nextCustomer);
}
