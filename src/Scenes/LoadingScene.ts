import {Scene} from "phaser";

export class LoadingScene extends Scene {
    constructor() {
        super("LoadingScene");
    }

    init(data: unknown) {
        console.log("LoadingScene.init", data);
    }

    preload() {
        console.log("LoadingScene.preload");
        this.load.baseURL = globalThis.baseUrl;
        this.load.spritesheet("player", "free_character_nude.png", {
            frameWidth: 16,
            frameHeight: 20,
        });

        /*
        const sprite = this.add.sprite(100, 100, "player");
        sprite.play("walkDown");*/
    }

    create() {
        console.log("LoadingScene.create");
        this.scene.start("DemoScene");
    }

    update(time: number, delta: number) {
    }
}