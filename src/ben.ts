import * as Phaser from 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;
import {LoadingScene} from "./Scenes";
import {Player} from "./GameObjects";

declare global {
    var baseUrl: string;

    interface Window {
        sizeChanged: () => void;
        game: Phaser.Game;
    }
}

globalThis.baseUrl = "assets/";

export default class DemoScene extends Phaser.Scene
{
    private player!: Player;
    constructor ()
    {
        super('DemoScene');
    }

    init (data: unknown) {
        console.log("DemoScene.init", data);
    }

    preload ()
    {
        console.log("DemoScene.preload");
    }

    create ()
    {
        console.log("DemoScene.create");
        this.player = new Player(this, 100, 100);
    }

    update(time: number, delta: number) {
        this.player.update();
    }
}

const config: GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#111111',
    width: 240,
    height: 224,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    pixelArt: true,
    scene: [LoadingScene, DemoScene]
};

const gameConfig: GameConfig = {
    title: 'Phaser game tutorial',
    type: Phaser.WEBGL,
    parent: 'game',
    backgroundColor: '#111111',
    scale: {
        mode: Phaser.Scale.ScaleModes.NONE,
        width: window.innerWidth,
        height: window.innerHeight,
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
    scene: [LoadingScene, DemoScene]
};

window.sizeChanged = () => {
    if (window.game.isBooted) {
        setTimeout(() => {
            window.game.scale.resize(window.innerWidth, window.innerHeight);
            window.game.canvas.setAttribute(
                'style',
                `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
            );
        }, 100);
    }
};
window.onresize = () => window.sizeChanged();

window.game = new Phaser.Game(gameConfig);

console.log("weeee");
