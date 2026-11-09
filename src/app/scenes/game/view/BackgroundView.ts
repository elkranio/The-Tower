export default function createBackgroundView(scene: Phaser.Scene, layer: Phaser.GameObjects.Layer): void {
    const { width, height } = scene.scale;
    const background = scene.add.image(width / 2, height / 2, 'atlas', 'bg');
    background.setDisplaySize(width, height);
    layer.add(background);
}
