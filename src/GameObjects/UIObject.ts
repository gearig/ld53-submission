import * as Phaser from "phaser";
import {Player} from "./Player";
import {RenderingDepths} from "../common";

export class UIObject extends Phaser.GameObjects.GameObject {
    private readonly hearts: Phaser.GameObjects.Sprite[] = [];
    private readonly medKit: Phaser.GameObjects.Sprite;
    private readonly medKitText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, private player: Player) {
        super(scene, "UIObject");
        scene.add.existing(this);

        let maxHp = this.player.getMaxHp();
        maxHp = maxHp % 2 ? maxHp + 1 : maxHp;
        for (let i = 0; i < maxHp; i += 2) {
            const sprite = this.scene.add.sprite(i / 2 * 17 + 1, 0, "icons", "heartFullIcon");
            sprite.setScrollFactor(0);
            sprite.depth = 10000000;
            this.hearts.push(sprite);
        }

        this.medKit = this.scene.add.sprite(0, 0, "medKit", 0);
        this.medKit.setOrigin(0, 0);
        this.medKit.setScrollFactor(0);
        this.medKit.depth = RenderingDepths.UI;
        this.medKitText = this.scene.add.text(0, 0, "0", {
            color: "#ffffff",
            fontSize: "16px",
            align: "right",
        });
        this.medKitText.setOrigin(1, 0);
        this.medKitText.setScrollFactor(0);
        this.medKitText.depth = RenderingDepths.UI;
    }

    update(): void {
        this.updateHearts();
        this.updateMedKit();
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

    private updateMedKit() {
        this.medKitText.setText(this.player.getMedKitCount().toString());
        this.medKit.setPosition(window.game.scale.width - 16, 0);
        this.medKitText.setPosition(window.game.scale.width - 16, 0);
    }
}