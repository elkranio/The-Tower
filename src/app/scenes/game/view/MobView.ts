type MobLayout = {
    x: number;
    y: number;
    scale: number;
};

export default function createMobView(
    scene: Phaser.Scene,
    layer: Phaser.GameObjects.Layer,
    layout: MobLayout,
): void {
    const mob = scene.add.image(layout.x, layout.y, 'atlas', 'mob');
    mob.setScale(layout.scale);
    layer.add(mob);
}
