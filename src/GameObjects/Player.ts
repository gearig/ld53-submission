import * as Phaser from 'phaser';
import {Actor} from "./Actor";
import Vector2 = Phaser.Math.Vector2;
import { EventNames } from '../events/EventNames';

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
        this.listenToEvents();

        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');
        this.keyQ = this.scene.input.keyboard.addKey('Q');
        this.keyE = this.scene.input.keyboard.addKey('E');

        this.getBody().setSize(12, 8);
        this.getBody().setOffset(2, 12);
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

    private listenToEvents(): void {
        globalThis.eventDispatcher.on(EventNames.HEALTH, (payload: any) => {
            console.log({ payload });
        });
        globalThis.eventDispatcher.on(EventNames.SUPPLIES, (payload: any) => {
            console.log({ payload });
        });
        globalThis.eventDispatcher.on(EventNames.TELEPORT, (payload: any) => {
            console.log({ payload });
        });
        globalThis.eventDispatcher.on(EventNames.MISSION_END, (payload: any) => {
            console.log({ payload });
        });
        globalThis.eventDispatcher.on(EventNames.MISSION_START, (payload: any) => {
            console.log({ payload });
        });
        globalThis.eventDispatcher.on(EventNames.TEST, (payload: any) => {
            console.log({ payload });
        });
    }

    public stopListeningToEvents(): void {
        globalThis.eventDispatcher.off(EventNames.HEALTH);
        globalThis.eventDispatcher.off(EventNames.SUPPLIES);
        globalThis.eventDispatcher.off(EventNames.TELEPORT);
        globalThis.eventDispatcher.off(EventNames.MISSION_END);
        globalThis.eventDispatcher.off(EventNames.MISSION_START);
        globalThis.eventDispatcher.off(EventNames.TEST);
    }
}