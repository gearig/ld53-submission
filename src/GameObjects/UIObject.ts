import * as Phaser from "phaser";
import {Player} from "./Player";

export class UIObject extends Phaser.GameObjects.GameObject {
    private readonly hearts: Phaser.GameObjects.Sprite[] = [];

    constructor(scene: Phaser.Scene, private player: Player) {
        super(scene, "UIObject");
        scene.add.existing(this);
        let maxHp = this.player.getMaxHp();
        maxHp = maxHp % 2 ? maxHp + 1 : maxHp;
        for (let i = 0; i < maxHp; i += 2) {
            let sprite = this.scene.add.sprite(i / 2 * 17 + 1, 0, "icons", "heartFullIcon");
            sprite.setScrollFactor(0);
            this.hearts.push(sprite);
        }
    }

    update(): void {
        this.updateHearts();
    }

    private updateHearts() {
        let hp = this.player.getHp();
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            let maxHp = (i + 1) * 2;
            if (hp >= maxHp) {
                this.hearts[i].setFrame("heartFullIcon");
            } else if (hp === maxHp - 1) {
                this.hearts[i].setFrame("heartHalfIcon");
            } else {
                this.hearts[i].setFrame("heartEmptyIcon");
            }
        }
    }
}