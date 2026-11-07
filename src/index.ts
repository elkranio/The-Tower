import Phaser from 'phaser';
import gameConfig from './config/gameConfig';
import Boot from './app/scenes/boot/Boot';
import Preload from './app/scenes/preload/Preload';
import Game from './app/scenes/game/Game';

import applyResponsiveScaling from './utils/applyResponsiveScaling';
import enforceOrientation from './utils/enforceOrientation';
import P34TOptions from './config/p34t.options';

window.addEventListener('load', async () => {
    applyResponsiveScaling(gameConfig);
    enforceOrientation();
    if (P34TOptions.title) document.title = P34TOptions.title;

    gameConfig.scene = [Boot, Preload, Game];
    new Phaser.Game(gameConfig);
});
