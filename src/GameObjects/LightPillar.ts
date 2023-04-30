import * as Phaser from "phaser";
import { Interactive } from "./Interactive";
import { Player } from "./Player";

type LightPillarColor = "yellow" | "purple" | "cyan";
type LightPillarEvents = "supplies" | "teleport" | "test";

export class LightPillar extends Interactive {
    private pillarIdentifier: `${LightPillarColor}-light-pillar`;
    // private eventEmitter = new Phaser.Events.EventEmitter();
    private eventName: LightPillarEvents;
    private payload: any;

    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        color: LightPillarColor, 
        player: Player, 
        eventName: LightPillarEvents, 
        payload: any
    ) {
        super(scene, x, y, `${color}-light-pillar`, player);
        this.pillarIdentifier = `${color}-light-pillar`;
        this.eventName = eventName;
        this.payload = payload;
        this.onOverlap.bind(this);
        this.animatePillar();
        this.getBody().setSize(2, 32);
        this.getBody().setOffset(15, 0);
    }

    private animatePillar(): void {
        this.anims.create({
            key: "glow",
            frames: this.anims.generateFrameNumbers(this.pillarIdentifier, {frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}),
            frameRate: 10,
            yoyo: false,
            repeat: -1,
        });
        this.anims.play('glow', true);
    }

    public onOverlap(interactive: LightPillar, player: Player): void {
        globalThis.eventDispatcher.emit(interactive.eventName, interactive.payload);
        interactive.destroy();
    }
}