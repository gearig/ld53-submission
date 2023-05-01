import * as Phaser from 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;
import {LoadingScene} from "./Scenes";
import {LightPillar, Player} from "./GameObjects";
import {EventDispatcher, EventNames} from './events';
import { MissionsService } from './Missions/MissionsService';
import { MissionActions, MissionTypes } from './Missions/constants/enums';
import { MissionStep } from './Missions/MissionStep';
import { Mission } from './Missions/Mission';

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
    private Missions = new MissionsService();

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
    private totalPoints: number = 0;

    constructor () {
        super('WorldScene');
    }

    startNextMission() {
        this.Missions.prepareNextMission();
        console.log({ mission: this.Missions.currentMission });
        this.Missions.currentMission.beginMission();
    }

    destroyAllPillars() {
        this?.cyanLightPillar?.destroy();
        this?.purpleLightPillar?.destroy();
        this?.yellowLightPillar?.destroy();
    }

    preparePickUpPillar(step: MissionStep) {
        this.cyanLightPillar = new LightPillar(
            this, 
            step.coords[0], 
            step.coords[1], 
            'cyan', 
            this.player,
            EventNames.GET_SUPPLIES,
            { payload: 1 },
            this.Missions.currentMission.dispatchNextStep.bind(this.Missions.currentMission)
        );
    }

    prepareDropOffPillar(step: MissionStep) {
        const dispatchNextStep = this.Missions.currentMission.dispatchNextStep.bind(this.Missions.currentMission)
        
        this.purpleLightPillar = new LightPillar(
            this, 
            step.coords[0], 
            step.coords[1], 
            'purple', 
            this.player,
            EventNames.GIVE_SUPPLIES,
            { },
            () => {
                // this.Missions.currentMission.deliveryPoints += this.player.getMedKitCount();
                this.Missions.currentMission.deliveryPoints += 100;
                dispatchNextStep();
            }
        );
    }

    prepareReportPillar(step: MissionStep) {
        this.yellowLightPillar = new LightPillar(
            this, 
            step.coords[0], 
            step.coords[1], 
            'yellow', 
            this.player,
            EventNames.REPORT_ARRIVAL,
            { },
            this.Missions.currentMission.dispatchNextStep.bind(this.Missions.currentMission)
        );
    }

    listenToEvents() {
        globalThis.eventDispatcher.on(EventNames.MISSION_STEP_START, (step: MissionStep) => {
            this.destroyAllPillars();

            switch (step.action) {
                case MissionActions.PICKUP: {
                    this.preparePickUpPillar(step);
                    break
                }
                case MissionActions.DROPOFF: {
                    this.prepareDropOffPillar(step);
                    break
                }
                case MissionActions.REPORT: {
                    this.prepareReportPillar(step);
                    break
                }
                default: break;
            }
        });
        globalThis.eventDispatcher.on(EventNames.REPORT_ARRIVAL, () => {
            console.log('reported');
        });
        globalThis.eventDispatcher.on(EventNames.MISSION_END, (completedMission: Mission) => {
            this.totalPoints += completedMission.currentPoints;
            console.log({ points: this.totalPoints });
            this.destroyAllPillars();
            this.startNextMission();
        })
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
        this.listenToEvents();
        this.initMap();
        this.player = new Player(this, 0, 780);
        this.foregroundLayer = this.map.createLayer('foreground', this.tileSet, 0, 0);
        this.foregroundSecondaryLayer = this.map.createLayer('foreground-secondary', this.tileSet, 0, 0);
        this.physics.add.collider(this.player, this.collisionsLayer);
        this.initCamera();
        this.Missions.initialize();
        this.startNextMission();
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
