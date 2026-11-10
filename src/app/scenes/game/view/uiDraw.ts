export function panel(
    graphics: Phaser.GameObjects.Graphics,
    x: number, y: number, width: number, height: number,
    fill = 0xffd89c,
    radius = 18,
): void {
    graphics.fillStyle(0x160e13, 0.45).fillRoundedRect(x + 5, y + 7, width, height, radius);
    graphics.fillStyle(0x382126).fillRoundedRect(x - 3, y - 3, width + 6, height + 6, radius + 3);
    graphics.fillStyle(0xb57944).fillRoundedRect(x, y, width, height, radius);
    graphics.fillStyle(fill).fillRoundedRect(x + 5, y + 5, width - 10, height - 11, radius - 3);
    graphics.lineStyle(2, 0xffebbd, 0.9).strokeRoundedRect(x + 9, y + 9, width - 18, height - 21, radius - 5);
}

export function text(
    scene: Phaser.Scene,
    x: number, y: number, value: string,
    size: number, color = '#3d2626',
): Phaser.GameObjects.Text {
    return scene.add.text(x, y, value, {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: `${size}px`,
        fontStyle: 'bold',
        color,
    }).setOrigin(0.5);
}
