import * as Phaser from 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;
import {LoadingScene} from "./Scenes";
import {Player} from "./GameObjects";

declare global {
    var baseUrl: string;
    var gameWidth: number;
    var gameHeight: number;

    interface Window {
        sizeChanged: () => void;
        game: Phaser.Game;
    }
}

globalThis.baseUrl = "assets/";
globalThis.gameWidth = 240;
globalThis.gameHeight = 224;

export default class DemoScene extends Phaser.Scene {
    private player!: Player;
    private map!: Phaser.Tilemaps.Tilemap;
    private tileSet!: Phaser.Tilemaps.Tileset;
    private groundLayer!: Phaser.Tilemaps.TilemapLayer;
    private groundSecondaryLayer!: Phaser.Tilemaps.TilemapLayer;
    private onGroundLayer!: Phaser.Tilemaps.TilemapLayer;
    private onGroundSecondaryLayer!: Phaser.Tilemaps.TilemapLayer;
    private collisionsLayer!: Phaser.Tilemaps.TilemapLayer;

    constructor() {
        super('DemoScene');
    }

    init(data: unknown) {
        console.log("DemoScene.init", data);
    }

    preload() {
        console.log("DemoScene.preload");
        this.load.image('tiles', './assets/apocalypse_2.png');
        this.load.tilemapTiledJSON('map', './assets/town-basic.tmj');
    }

    create() {
        console.log("DemoScene.create");
        this.initMap();
        this.player = new Player(this, 0, 0);
        this.physics.add.collider(this.player, this.collisionsLayer);
        this.initCamera();
    }

    update(time: number, delta: number) {
        this.player.update();
    }

    initMap() {
        this.map = this.make.tilemap({key: 'map', tileWidth: 16, tileHeight: 16});
        this.tileSet = this.map.addTilesetImage('post-apocalyptic', 'tiles');
        this.groundLayer = this.map.createLayer('ground', this.tileSet, 0, 0);
        this.groundSecondaryLayer = this.map.createLayer('ground-secondary', this.tileSet, 0, 0);
        this.onGroundLayer = this.map.createLayer('on-ground', this.tileSet, 0, 0);
        this.onGroundSecondaryLayer = this.map.createLayer('on-ground-secondary', this.tileSet, 0, 0);
        this.collisionsLayer = this.map.createLayer('collisions', this.tileSet, 0, 0);
        this.collisionsLayer.setVisible(false);
        this.collisionsLayer.setCollisionByProperty({collides: true});
        this.physics.world.setBounds(0, 0, this.collisionsLayer.width, this.collisionsLayer.height);
    }

    private initCamera() {
        console.log(window.game.scale.width, window.game.scale.height);
        this.cameras.main.setSize(window.game.scale.width, window.game.scale.height);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
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
        width: 240,
        height: 224,
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
