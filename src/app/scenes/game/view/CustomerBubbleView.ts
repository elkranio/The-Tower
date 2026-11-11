import BBCodeText from 'phaser3-rex-plugins/plugins/bbcodetext.js';

const speech =
    'На [color=#ac4e2f]кладбище[/color] опять нежить. Стража собирает добровольцев. Говорят, без зелий туда лучше не соваться.';
const words = speech.split(' ');

function fadeWord(word: string, alpha: number): string {
    const colored = word.match(/^\[color=#([0-9a-f]{6})\](.*)\[\/color\]$/i);
    if (!colored) return `[color=rgba(61,37,32,${alpha})]${word}[/color]`;

    const color = parseInt(colored[1], 16);
    const red = (color >> 16) & 255;
    const green = (color >> 8) & 255;
    const blue = color & 255;
    return `[color=rgba(${red},${green},${blue},${alpha})]${colored[2]}[/color]`;
}

// The bubble grows upwards, keeping its tail pointed at the visitor.
export default function showCustomerBubble(scene: Phaser.Scene, onComplete: () => void): void {
    const bubble = scene.add.graphics();
    const label = new BBCodeText(scene, 360, 0, '', {
        fontFamily: 'Rubik, Arial, sans-serif',
        fontSize: '32px',
        fontStyle: 'bold',
        color: '#3d2520',
        halign: 'center',
        wrap: { mode: 'word', width: 620 },
        lineSpacing: 3,
    });
    scene.add.existing(label);
    label.setOrigin(0.5, 0);

    let visibleWords = 0;

    function revealWord(step = 0): void {
        const current = fadeWord(words[visibleWords], step / 3);
        label.setText([...words.slice(0, visibleWords), current].join(' '));

        const width = Phaser.Math.Clamp(label.width + 48, 170, 688);
        const height = Math.max(64, label.height + 32);
        const left = 360 - width / 2;
        const bottom = 285;
        const top = bottom - height;

        bubble.clear();
        bubble.fillStyle(0x24130f, 0.28).fillRoundedRect(left, top + 4, width, height, 18);
        bubble.fillStyle(0x4c2920).fillRoundedRect(left, top, width, height, 18);
        bubble.fillStyle(0xfff1d1).fillRoundedRect(left + 3, top + 3, width - 6, height - 6, 15);
        bubble.fillStyle(0x4c2920).fillTriangle(343, bottom - 2, 377, bottom - 2, 360, bottom + 20);
        bubble.fillStyle(0xfff1d1).fillTriangle(347, bottom - 4, 373, bottom - 4, 360, bottom + 14);
        label.setPosition(360, top + 16);

        if (step < 3) {
            scene.time.delayedCall(25, () => revealWord(step + 1));
            return;
        }

        visibleWords += 1;
        if (visibleWords < words.length) {
            scene.time.delayedCall(100, () => revealWord());
        } else {
            scene.time.delayedCall(2000, () => {
                bubble.destroy();
                label.destroy();
                onComplete();
            });
        }
    }

    revealWord();
}
