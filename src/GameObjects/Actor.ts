import * as Phaser from 'phaser';

export class Actor extends Phaser.Physics.Arcade.Sprite {
    protected hp: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, protected readonly maxHp: number = 6) {
        super(scene, x, y, texture);
        this.hp = this.maxHp;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.getBody().setCollideWorldBounds(true);
    }

    protected getBody(): Phaser.Physics.Arcade.Body {
        return this.body as Phaser.Physics.Arcade.Body;
    }

    public getHp(): number {
        return this.hp;
    }

    public getMaxHp(): number {
        return this.maxHp;
    }
}