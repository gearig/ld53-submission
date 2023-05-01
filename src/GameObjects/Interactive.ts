import * as Phaser from "phaser";
import {Player} from "./Player";

export abstract class Interactive extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, private player: Player) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.getBody().setCollideWorldBounds(true);
        this.getBody().setImmovable(true);
        this.depth = this.y;

        this.scene.physics.add.overlap(this, this.player, this.onOverlap.bind(this));
    }
    protected getBody(): Phaser.Physics.Arcade.Body {
        return this.body as Phaser.Physics.Arcade.Body;
    }

    abstract onOverlap(interactive: Interactive, player: Player): void;
}