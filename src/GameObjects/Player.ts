import * as Phaser from 'phaser';
import {Actor} from "./Actor";
import Vector2 = Phaser.Math.Vector2;

export class Player extends Actor {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private keyQ: Phaser.Input.Keyboard.Key;
    private keyE: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "player");

        this.initAnimations();

        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');
        this.keyQ = this.scene.input.keyboard.addKey('Q');
        this.keyE = this.scene.input.keyboard.addKey('E');

        this.getBody().setSize(12, 8);
        this.getBody().setOffset(2, 12);

        globalThis.eventDispatcher.on('test', (payload: any) => {
            console.log({ payload });
        });
    }

    update(): void {
        const velocity: Vector2 = new Vector2();
        if (this.keyW.isDown) {
            velocity.add(Vector2.UP);
        }
        if (this.keyA.isDown) {
            velocity.add(Vector2.LEFT);
        }
        if (this.keyS.isDown) {
            velocity.add(Vector2.DOWN);
        }
        if (this.keyD.isDown) {
            velocity.add(Vector2.RIGHT);
        }

        velocity.scale(64);
        this.getBody().setVelocity(velocity.x, velocity.y);

        if (velocity.length() > 0) {
            this.anims.play('walk', true);
        } else {
            this.anims.stop();
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
            this.decrementHp();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            this.incrementHp();
        }
    }

    private initAnimations(): void {
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("player", {frames: [0, 1, 2]}),
            frameRate: 4,
            yoyo: true,
            repeat: -1,
        });
    }

    private incrementHp(): void {
        this.hp++;
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        }
    }

    private decrementHp(): void {
        this.hp--;
        if (this.hp < 0) {
            this.hp = 0;
        }
    }
}