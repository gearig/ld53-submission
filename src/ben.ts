import * as Phaser from 'phaser';
import {LoadingScene} from "./Scenes";
import {EventDispatcher} from "./events";
import WorldScene from "./Scenes/WorldScene";
import GameConfig = Phaser.Types.Core.GameConfig;

declare global {
    var baseUrl: string;
    var gameWidth: number;
    var gameHeight: number;
    var eventDispatcher: EventDispatcher;

    interface Window {
        sizeChanged: () => void;
        game: Phaser.Game;
    }
}

globalThis.eventDispatcher = EventDispatcher.getInstance();
globalThis.baseUrl = "assets/";
globalThis.gameWidth = 240;
globalThis.gameHeight = 224;

const gameConfig: GameConfig = {
    title: 'Phaser game tutorial',
    type: Phaser.WEBGL,
    parent: 'game',
    backgroundColor: '#111111',
    scale: {
        mode: Phaser.Scale.ScaleModes.NONE,
        width: globalThis.gameWidth,
        height: globalThis.gameHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
    },
    callbacks: {
        postBoot: () => {
            window.sizeChanged();
        },
    },
    canvasStyle: `display: block; width: 100%; height: 100%;`,
    autoFocus: true,
    audio: {
        disableWebAudio: false,
    },
    scene: [LoadingScene, WorldScene]
};

window.sizeChanged = () => {
    const {innerWidth, innerHeight} = window;
    const {gameWidth, gameHeight} = globalThis;
    const aspect = innerWidth / innerHeight;
    const desiredAspect = gameWidth / gameHeight;
    const scale = Math.floor(aspect >= desiredAspect ? innerHeight / gameWidth : innerWidth / gameHeight);
    const width = Math.round(aspect >= desiredAspect ? gameWidth * aspect : gameWidth);
    const height = Math.round(aspect >= desiredAspect ? gameHeight : gameHeight * (1 / aspect));
    window.game.scale.setZoom(scale);
    window.game.scale.resize(width, height);
    window.game.canvas.style.width = `${innerWidth}px`;
    window.game.canvas.style.height = `${innerHeight}px`;
};
window.onresize = () => window.sizeChanged();

window.game = new Phaser.Game(gameConfig);
