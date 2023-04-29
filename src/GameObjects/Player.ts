import {Actor} from "./Actor";

export class Player extends Actor {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "player");

        this.initAnimations();

        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');

        this.getBody().setSize(16, 16);
        this.getBody().setOffset(0, 4);
    }

    update(): void {
        this.getBody().setVelocity(0);
        if (this.keyW.isDown) {
            this.body.velocity.y = -110;
        }
        if (this.keyA.isDown) {
            this.body.velocity.x = -110;
            // this.checkFlip();
            // this.getBody().setOffset(48, 15);
            this.anims.play('walk', true);
        }
        if (this.keyS.isDown) {
            this.body.velocity.y = 110;
            this.anims.play('walk', true);
        }
        if (this.keyD.isDown) {
            this.body.velocity.x = 110;
            // this.checkFlip();
            // this.getBody().setOffset(15, 15);
            this.anims.play('walk', true);
        }

        if (this.keyW.isDown || this.keyA.isDown || this.keyS.isDown || this.keyD.isDown) {
            this.anims.play('walk', true);
        } else {
            this.anims.stop();
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

    private playAnimation(key: string): void {
        this.anims.play(key, true);
    }
}