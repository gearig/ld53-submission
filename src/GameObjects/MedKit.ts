import {Interactive} from "./Interactive";
import {Player} from "./Player";
import {EventNames} from "../events";

export class MedKit extends Interactive {
    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
        super(scene, x, y, "medKit", player);
        this.getBody().setSize(8, 8);
        this.getBody().setOffset(4, 8);
        this.initAnimations();
        this.anims.play("spin", true);
    }

    onOverlap(interactive: Interactive, player: Player): void {
        this.scene.sound.play('pickupMedKit');
        globalThis.eventDispatcher.emit(EventNames.GET_SUPPLIES, {count: 3});
        interactive.destroy();
    }

    private initAnimations(): void {
        this.anims.create({
            key: "spin",
            frames: this.anims.generateFrameNumbers("medKit", {start: 0, end: 5}),
            frameRate: 8,
            repeat: -1,
        });
    }
}