import P34TOptions from '../../../config/p34t.options';
import { AudioManager } from '../../../system/AudioManager';

export default class Preload extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    init() {
        const { width, height } = this.scale;

        // show the preload logo
        const logo = this.add.image(width / 2, height / 2 - 100, 'preload_logo');

        // show the loading bar
        const barBg = this.add.graphics();
        barBg.fillStyle(0x5a1200, 1);
        barBg.fillRect(width / 2 - 150, height / 2 + 100, 300, 30);

        const barFill = this.add.graphics();

        this.load.on('progress', (value: number) => {
            barFill.clear();
            barFill.fillStyle(0xff950a);
            barFill.fillRect(width / 2 - 148, height / 2 + 2 + 100, 296 * value, 26);
        });
    }

    preload() {
        // atlases
        this.load.setPath(`assets/images`);
        this.load.multiatlas('atlas', `atlas.json?v=${Math.random()}`);
        this.load.setPath('');

        // load audiosprite
        const sfxVersion = Date.now();
        this.load.audioSprite('sfx', `assets/sfx/sfx.json?v=${sfxVersion}`, [
            `assets/sfx/sfx.ogg?v=${sfxVersion}`,
            `assets/sfx/sfx.mp3?v=${sfxVersion}`,
        ]);

        // load music files individually
        this.load.audio('ost', 'assets/music/demo.ogg');

        // load bitmap fonts
        for (const font of P34TOptions.fonts) {
            this.load.bitmapFont(font, `assets/fonts/${font}_0.png`, `assets/fonts/${font}.fnt`);
        }

        // load spine animations
        // this.load.spine('frog', 'assets/spine/frog.json', 'assets/spine/frog.atlas');
    }

    async create() {
        console.log('Preload scene loaded');
        try {
            const font = new FontFace('Rubik', 'url(assets/fonts/rubik.ttf)', { weight: '100 900' });
            await font.load();
            document.fonts.add(font);
        } catch (error) {
            console.warn('Rubik font failed to load:', error);
        }
        this.scene.start('Game');
    }
}
