import Phaser from 'phaser';

export default class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // load images for our preload scene
        this.load.image('preload_logo', 'assets/images/boot/preload_logo.png');

        // load images for orientation lock
        // this.load.image('play_landscape', 'assets/images/boot/play_landscape.png');
        // this.load.image('play_portrait', 'assets/images/boot/play_portrait.png');
    }

    create() {
        console.log('boot scene loaded');
        this.scene.start('Preload');
    }
}
