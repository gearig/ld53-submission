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
        this.load.atlas("icons", "free_icons1.png", {
            frames: {
                "redBottleIcon": {
                    frame: {x: 0, y: 0, w: 16, h: 16},
                    anchor: {x: 0, y: 0}
                },
                "greenBottleIcon": {
                    frame: {x: 16, y: 0, w: 16, h: 16},
                    anchor: {x: 0, y: 0}
                },
                "purpleBottleIcon": {
                    frame: {x: 32, y: 0, w: 16, h: 16},
                    anchor: {x: 0, y: 0}
                },
                "swordIcon": {
                    frame: {x: 0, y: 16, w: 16, h: 16},
                    anchor: {x: 0, y: 0}
                },
                "shieldIcon": {
                    frame: {x: 16, y: 16, w: 16, h: 16},
                    anchor: {x: 0, y: 0}
                },
                "helmetIcon": {
                    frame: {x: 32, y: 16, w: 16, h: 16},
                    anchor: {x: 0, y: 0}
                },
                "heartFullIcon": {
                    frame: {x: 0, y: 32, w: 16, h: 16},
                    anchor: {x: 0, y: 0}
                },
                "heartHalfIcon": {
                    frame: {x: 16, y: 32, w: 16, h: 16},
                    anchor: {x: 0, y: 0}
                },
                "heartEmptyIcon": {
                    frame: {x: 32, y: 32, w: 16, h: 16},
                    anchor: {x: 0, y: 0}
                }
            },
            meta: {
                scale: 1
            }
        });
        // this.load.spritesheet("icons", "free_icons1.png", {
        //     frameWidth: 16,
        //     frameHeight: 16,
        // });

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