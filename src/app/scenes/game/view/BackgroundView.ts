export default function createBackgroundView(scene: Phaser.Scene, layer: Phaser.GameObjects.Layer): void {
    const g = scene.add.graphics();
    g.fillStyle(0x32272e).fillRect(0, 0, 720, 1280);
    g.fillStyle(0x44313b, 0.65).fillTriangle(0, 0, 220, 0, 0, 480);
    g.fillStyle(0x241e2b, 0.6).fillTriangle(720, 0, 720, 530, 545, 0);
    g.fillStyle(0x59424d, 0.32).fillTriangle(0, 930, 240, 1280, 0, 1280);
    g.fillStyle(0x211c27, 0.45).fillTriangle(720, 920, 720, 1280, 520, 1280);
    layer.add(g);
}
