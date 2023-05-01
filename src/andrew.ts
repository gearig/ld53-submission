import * as Phaser from 'phaser';
import {LoadingScene} from "./Scenes";
import {LightPillar, Player} from "./GameObjects";
import {EventDispatcher, EventNames} from './events';
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

export default class WorldScene extends Phaser.Scene {
    private map!: Phaser.Tilemaps.Tilemap;
    // private miniMap!: Phaser.Cameras.Scene2D.Camera;
    private tileSet!: Phaser.Tilemaps.Tileset;
    private groundLayer!: Phaser.Tilemaps.TilemapLayer;
    private groundSecondaryLayer!: Phaser.Tilemaps.TilemapLayer;
    private onGroundLayer!: Phaser.Tilemaps.TilemapLayer;
    private onGroundSecondaryLayer!: Phaser.Tilemaps.TilemapLayer;
    private foregroundLayer!: Phaser.Tilemaps.TilemapLayer;
    private foregroundSecondaryLayer!: Phaser.Tilemaps.TilemapLayer;
    private collisionsLayer!: Phaser.Tilemaps.TilemapLayer;
    private player!: Player;
    private cyanLightPillar!: LightPillar;
    private purpleLightPillar!: LightPillar;
    private yellowLightPillar!: LightPillar;
    
    constructor () {
        super('WorldScene');
    }

    init (data: unknown) {
        console.log("WorldScene.init", data);
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
        this.physics.world.setBounds(0, 0, this.collisionsLayer.width, this.collisionsLayer.height);
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
        this.cameras.main.setSize(window.game.scale.width, window.game.scale.height);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }

    preload () {
        this.load.image('tiles', './assets/apocalypse_2.png');
        this.load.tilemapTiledJSON('map', './assets/town-basic.tmj');
    }

    create () {
        this.initMap();
        this.player = new Player(this, 503, 687/*780*/);
        this.cyanLightPillar = new LightPillar(
            this, 
            407, 
            624, 
            'cyan', 
            this.player,
            EventNames.GIVE_SUPPLIES,
            { payload: 1 }
        );
        this.purpleLightPillar = new LightPillar(
            this, 
            128, 
            780, 
            'purple', 
            this.player,
            EventNames.TELEPORT, 
            { payload: 2 }
        );
        this.yellowLightPillar = new LightPillar(
            this, 
            192, 
            780, 
            'yellow', 
            this.player,
            EventNames.TEST, 
            { payload: 3 }
        );
        this.foregroundLayer = this.map.createLayer('foreground', this.tileSet, 0, 0);
        this.foregroundSecondaryLayer = this.map.createLayer('foreground-secondary', this.tileSet, 0, 0);
        this.physics.add.collider(this.player, this.collisionsLayer);
        this.initCamera();
        // this.initMiniMap();
    }

    update(time: number, delta: number) {
        this.player.update();
    }
}

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
