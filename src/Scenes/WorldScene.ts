import * as Phaser from "phaser";
import {LightPillar, Player, UIObject} from "../GameObjects";
import {MedKit} from "../GameObjects/MedKit";
import {EventNames} from "../events";
import {RenderingDepths} from "../common";
import { MissionsService } from "../Missions/MissionsService";
import { MissionStep } from "../Missions/MissionStep";
import { MissionActions } from "../Missions/constants/enums";
import { Mission } from "../Missions/Mission";
import {Bullet} from "../GameObjects/Bullet";
import {Bullets} from "../GameObjects/Bullets";


export default class WorldScene extends Phaser.Scene {
    private player!: Player;

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

    public bulletGroup: Phaser.Physics.Arcade.Group;

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
        this.initBullets();
        new MedKit(this, 560, 680, this.player);
        this.cyanLightPillar = new LightPillar(this, 407, 624, 'cyan', this.player, EventNames.GIVE_SUPPLIES, {payload: 1});
        this.purpleLightPillar = new LightPillar(this, 128, 780, 'purple', this.player, EventNames.TELEPORT, {payload: 2});
        this.yellowLightPillar = new LightPillar(this, 192, 780, 'yellow', this.player, EventNames.TEST, {payload: 3});
        this.initCamera();
    }

    update(time: number, delta: number) {
        const currentMission = this?.Missions?.currentMission;
        this.ui.update(currentMission, this.totalPoints);
        this.player.update(time, delta);
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

    private initBullets() {
        this.bulletGroup = new Bullets(this);
        this.physics.add.collider(this.bulletGroup, this.collisionsLayer, (bullet: Bullet) => {
            bullet.disable();
        });
    }

    private initUI() {
        this.ui = new UIObject(this, this.player);
    }

    private initCamera() {
        this.cameras.main.setSize(window.game.scale.width, window.game.scale.height);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    }
}