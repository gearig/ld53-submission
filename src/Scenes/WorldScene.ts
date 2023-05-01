import * as Phaser from "phaser";
import {LightPillar, Player, UIObject} from "../GameObjects";
import {MedKit} from "../GameObjects/MedKit";
import {EventDispatcher, EventNames} from "../events";
import {RenderingDepths} from "../common";
import { MissionsService } from "../Missions/MissionsService";
import { MissionStep } from "../Missions/MissionStep";
import { MissionActions } from "../Missions/constants/enums";
import { Mission } from "../Missions/Mission";

declare global {
    var eventDispatcher: EventDispatcher;   
}

globalThis.eventDispatcher = EventDispatcher.getInstance();

export default class WorldScene extends Phaser.Scene {
    private Missions = new MissionsService();
    private player!: Player;
    private totalPoints: number = 0;

    private ui!: UIObject;

    private map!: Phaser.Tilemaps.Tilemap;
    private tileSet!: Phaser.Tilemaps.Tileset;
    private groundLayer!: Phaser.Tilemaps.TilemapLayer;
    private groundSecondaryLayer!: Phaser.Tilemaps.TilemapLayer;
    private onGroundLayer!: Phaser.Tilemaps.TilemapLayer;
    private onGroundSecondaryLayer!: Phaser.Tilemaps.TilemapLayer;
    private foregroundLayer!: Phaser.Tilemaps.TilemapLayer;
    private foregroundSecondaryLayer!: Phaser.Tilemaps.TilemapLayer;
    private collisionsLayer!: Phaser.Tilemaps.TilemapLayer;

    private cyanLightPillar!: LightPillar;
    private purpleLightPillar!: LightPillar;
    private yellowLightPillar!: LightPillar;

    constructor() {
        super('WorldScene');
    }

    preload() {
        this.load.image('tiles', './assets/apocalypse_2.png');
        this.load.tilemapTiledJSON('map', './assets/town-basic.tmj');
    }

    create() {
        this.initMap();
        this.initPlayer();
        this.initUI();
        new MedKit(this, 560, 680, this.player);
        this.initCamera();
        this.listenToEvents();
        this.Missions.initialize();
        this.startNextMission();
    }

    update(time: number, delta: number) {
        const currentMission = this?.Missions?.currentMission;
        this.player.update();
        this.ui.update(currentMission, this.totalPoints);
    }

    private initMap() {
        this.map = this.make.tilemap({key: 'map', tileWidth: 16, tileHeight: 16});
        this.tileSet = this.map.addTilesetImage('post-apocalyptic', 'tiles');
        this.groundLayer = this.map.createLayer('ground', this.tileSet, 0, 0);
        this.groundSecondaryLayer = this.map.createLayer('ground-secondary', this.tileSet, 0, 0);
        this.onGroundLayer = this.map.createLayer('on-ground', this.tileSet, 0, 0);
        this.onGroundSecondaryLayer = this.map.createLayer('on-ground-secondary', this.tileSet, 0, 0);
        this.collisionsLayer = this.map.createLayer('collisions', this.tileSet, 0, 0);
        this.collisionsLayer.setVisible(false);
        this.collisionsLayer.setCollisionByProperty({collides: true});
        this.foregroundLayer = this.map.createLayer('foreground', this.tileSet, 0, 0);
        this.foregroundSecondaryLayer = this.map.createLayer('foreground-secondary', this.tileSet, 0, 0);

        this.groundLayer.depth = RenderingDepths.BACKGROUND;
        this.groundSecondaryLayer.depth = RenderingDepths.BACKGROUND;
        this.onGroundLayer.depth = RenderingDepths.BACKGROUND;
        this.onGroundSecondaryLayer.depth = RenderingDepths.BACKGROUND;
        this.foregroundLayer.depth = RenderingDepths.FOREGROUND;
        this.foregroundSecondaryLayer.depth = RenderingDepths.FOREGROUND;

        this.physics.world.setBounds(0, 0, this.collisionsLayer.width, this.collisionsLayer.height);
    }

    private initPlayer() {
        this.player = new Player(this, 504, 680);
        this.physics.add.collider(this.player, this.collisionsLayer);
    }

    private initUI() {
        this.ui = new UIObject(this, this.player);
    }

    private initCamera() {
        this.cameras.main.setSize(window.game.scale.width, window.game.scale.height);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    }

    private listenToEvents() {
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

    private startNextMission() {
        this.Missions.prepareNextMission();
        this.Missions.currentMission.beginMission();
        console.log({ mission: this.Missions.currentMission });
    }

    private destroyAllPillars() {
        this?.cyanLightPillar?.destroy();
        this?.purpleLightPillar?.destroy();
        this?.yellowLightPillar?.destroy();
    }

    private preparePickUpPillar(step: MissionStep) {
        this.cyanLightPillar = new LightPillar(
            this, 
            step.coords[0], 
            step.coords[1], 
            'cyan', 
            this.player,
            EventNames.GET_SUPPLIES,
            { count: 5 },
            this.Missions.currentMission.dispatchNextStep.bind(this.Missions.currentMission)
        );
    }

    private prepareDropOffPillar(step: MissionStep) {
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
                // const medKits = this.player.getMedKitCount();
                this.Missions.currentMission.deliveryPoints += 100;
                dispatchNextStep();
            }
        );
    }

    private prepareReportPillar(step: MissionStep) {
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
}