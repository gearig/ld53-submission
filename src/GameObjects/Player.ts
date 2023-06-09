import * as Phaser from 'phaser';
import {Actor} from "./Actor";
import {EventNames, GetSuppliesPayload} from '../events';
import Vector2 = Phaser.Math.Vector2;

export class Player extends Actor {
    private medKits: number = 0;
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private keyQ: Phaser.Input.Keyboard.Key;
    private keyE: Phaser.Input.Keyboard.Key;
    private keySpace: Phaser.Input.Keyboard.Key;
    private lastFired: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "player");

        this.initAnimations();
        this.listenToEvents();

        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');
        this.keyQ = this.scene.input.keyboard.addKey('Q');
        this.keyE = this.scene.input.keyboard.addKey('E');
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.getBody().setSize(12, 8);
        this.getBody().setOffset(2, 8);
    }

    update(time: number, delta: number): void {
        const canFire = time > this.lastFired + 500;
        const canWalk = time > this.lastFired + 250;
        this.depth = this.y;
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

        if (canWalk) {
            this.getBody().setVelocity(velocity.x, velocity.y);
        } else {
            this.getBody().setVelocity(0);
        }

        if (this.keySpace.isDown) {
            if (canFire) {
                this.anims.play('fire', true);
                globalThis.eventDispatcher.emit(EventNames.FIRE, {x: this.x + 8, y: this.y});
                this.lastFired = time;
            }
        } else if (velocity.length() > 0) {
            this.anims.play('walk', true);
        } else if (canWalk) {
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
            frames: this.anims.generateFrameNumbers("player", {frames: [0, 1, 2, 3]}),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: "fire",
            frames: this.anims.generateFrameNumbers("player", {frames: [5, 4]}),
            frameRate: 8
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

    private listenToEvents(): void {
        globalThis.eventDispatcher.on(EventNames.HEALTH, (payload: any) => {
            console.log({payload});
        });
        globalThis.eventDispatcher.on(EventNames.GET_SUPPLIES, (payload: GetSuppliesPayload) => {
            this.medKits += payload.count;
        });
        globalThis.eventDispatcher.on(EventNames.GIVE_SUPPLIES, (payload: any) => {
            console.log({payload});
        });
        globalThis.eventDispatcher.on(EventNames.TELEPORT, (payload: any) => {
            console.log({payload});
        });
        globalThis.eventDispatcher.on(EventNames.TEST, (payload: any) => {
            console.log({payload});
        });
    }

    public stopListeningToEvents(): void {
        globalThis.eventDispatcher.off(EventNames.HEALTH);
        globalThis.eventDispatcher.off(EventNames.GET_SUPPLIES);
        globalThis.eventDispatcher.off(EventNames.GIVE_SUPPLIES);
        globalThis.eventDispatcher.off(EventNames.TELEPORT);
        globalThis.eventDispatcher.off(EventNames.TEST);
        globalThis.eventDispatcher.off(EventNames.GET_SUPPLIES);
    }

    public getMedKitCount(): number {
        return this.medKits;
    }
}