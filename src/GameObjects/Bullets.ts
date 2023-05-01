import * as Phaser from "phaser";
import {Bullet} from "./Bullet";
import {EventNames} from "../events";

export class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene);
        this.createMultiple({
            classType: Bullet,
            frameQuantity: 9,
            key: "player",
            active: false,
            visible: false,
        });
        globalThis.eventDispatcher.on(EventNames.FIRE, (payload: any) => {
            this.fireBullet(payload.x, payload.y);
        });
    }

    public fireBullet(x: number, y: number) {
        const bullet = this.getFirstDead(false);
        if (bullet) {
            bullet.fire(x, y);
        }
    }
}