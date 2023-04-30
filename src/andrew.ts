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

export default class DemoScene extends Phaser.Scene {
    private map!: Phaser.Tilemaps.Tilemap;
    // private miniMap!: Phaser.Cameras.Scene2D.Camera;
    private tileSet!: Phaser.Tilemaps.Tileset;
    private groundLayer!: Phaser.Tilemaps.TilemapLayer;
    private groundSecondaryLayer!: Phaser.Tilemaps.TilemapLayer;
    private onGroundLayer!: Phaser.Tilemaps.TilemapLayer;
    private onGroundSecondaryLayer!: Phaser.Tilemaps.TilemapLayer;
    private foregroundLayer!: Phaser.Tilemaps.TilemapLayer;
    private collisionsLayer!: Phaser.Tilemaps.TilemapLayer;
    private player!: Player;
    
    constructor () {
        super('DemoScene');
    }

    init (data: unknown) {
        console.log("DemoScene.init", data);
    }

    initMap() {
        this.map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
        this.tileSet = this.map.addTilesetImage('post-apocalyptic', 'tiles');
        this.groundLayer = this.map.createLayer('ground', this.tileSet, 0, 0);
        this.groundSecondaryLayer = this.map.createLayer('ground-secondary', this.tileSet, 0, 0);
        this.onGroundLayer = this.map.createLayer('on-ground', this.tileSet, 0, 0);
        this.onGroundSecondaryLayer = this.map.createLayer('on-ground-secondary', this.tileSet, 0, 0);
        this.collisionsLayer = this.map.createLayer('collisions', this.tileSet, 0, 0);
        this.collisionsLayer.setVisible(false);
        this.collisionsLayer.setCollisionByProperty({ collides: true });
    }

    // initMiniMap() {
    //     this.miniMap = this.cameras.add(0, 0, 240, 224).setZoom(0.1);
    //     this.miniMap.setBackgroundColor(0x000000);
    //     this.miniMap.scrollX = 0;
    //     this.miniMap.scrollY = 0;
    //     this.miniMap.setBounds(0, 0, 240, 224);
    //     this.miniMap.startFollow(this.player, true, 0.1, 0.1);
    // }

    initCamera() {
        console.log(window.game.scale.width, window.game.scale.height);
        this.cameras.main.setSize(window.game.scale.width, window.game.scale.height);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }

    preload () {
        this.load.image('tiles', './assets/apocalypse_2.png');
        this.load.tilemapTiledJSON('map', './assets/town-basic.tmj');
    }

    create () {
        this.initMap();
        this.player = new Player(this, 0, 780);
        this.foregroundLayer = this.map.createLayer('foreground', this.tileSet, 0, 0);
        this.initCamera();
        this.physics.add.collider(this.player, this.collisionsLayer);
        // this.initMiniMap();
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
        height: window.innerHeight
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
