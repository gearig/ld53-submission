import * as Phaser from "phaser";
import {RenderingDepths} from "../common";
import Vector2 = Phaser.Math.Vector2;

export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "player", 6);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.getBody().setCollideWorldBounds(true);
        this.getBody().setSize(1, 1);
        this.getBody().setOffset(9, 8);
    }

    protected getBody(): Phaser.Physics.Arcade.Body {
        return this.body as Phaser.Physics.Arcade.Body;
    }

    public fire(x: number, y: number) {
        this.getBody().reset(x, y);
        this.setActive(true);
        this.setVisible(true);

        const mousePosition = this.scene.input.mousePointer.position;
        const mainCamera = this.scene.cameras.main;
        const adjustedMousePosition = new Vector2(mousePosition.x + mainCamera.scrollX, mousePosition.y + mainCamera.scrollY);
        const adjustedPlayerPosition = new Vector2(x, y);
        const angle = Phaser.Math.Angle.BetweenPoints(adjustedPlayerPosition, adjustedMousePosition);

        this.depth = RenderingDepths.FOREGROUND;
        this.setRotation(angle);
        const velocity = Vector2.RIGHT.clone().rotate(angle).normalize();
        this.getBody().setVelocity(velocity.x * 200, velocity.y * 200);
    }

    public preUpdate(time: number, delta: number) {
        if (this.x > this.scene.cameras.main.scrollX + this.scene.cameras.main.width ||
            this.x < this.scene.cameras.main.scrollX ||
            this.y > this.scene.cameras.main.scrollY + this.scene.cameras.main.height ||
            this.y < this.scene.cameras.main.scrollY
        ) {
            this.disable();
        }
    }

    public disable() {
        this.setActive(false);
        this.setVisible(false);
    }
}