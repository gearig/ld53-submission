import * as Phaser from "phaser";
import {Player} from "./Player";
import {RenderingDepths} from "../common";
import { Coords } from "../shared/constants/models";
import { Mission } from "../Missions/Mission";
import { MAX_SEVERITY_LEVEL } from "../Missions/constants/constants";

export class UIObject extends Phaser.GameObjects.GameObject {
    private readonly hearts: Phaser.GameObjects.Sprite[] = [];
    private readonly medKit: Phaser.GameObjects.Sprite;
    private readonly medKitText: Phaser.GameObjects.Text;
    private readonly skull: Phaser.GameObjects.Sprite;
    private readonly skullText: Phaser.GameObjects.Text;
    private readonly pointsText: Phaser.GameObjects.Text;
    // private missionIndicator: Phaser.GameObjects.Sprite;
    private readonly directionalArrow: Phaser.GameObjects.Sprite;
    private readonly missionProgressInd: Phaser.GameObjects.Sprite[] = [];

    public set directionalArrowRotation(angle: number) {
        this.directionalArrow.rotation = angle;
    }

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

        const maxSteps = Math.ceil(MAX_SEVERITY_LEVEL / 2) * 2; // multiply by 2 to account for pickup/dropoff missions
        for (let i = 0; i < maxSteps; i++) {
            const sprite = this.scene.add.sprite(i * 9 + 1, 17, "missionSteps", "stepIncomplete");
            sprite.setScrollFactor(0);
            sprite.setVisible(false);
            sprite.depth = 10000000;
            this.missionProgressInd.push(sprite);
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

        this.skull = this.scene.add.sprite(0, 0, "skull", 0);
        this.skull.setOrigin(0, 0);
        this.skull.setScrollFactor(0);
        this.skull.depth = RenderingDepths.UI;
        this.skullText = this.scene.add.text(0, 0, "0", {
            color: "#ffffff",
            fontSize: "16px",
            align: "right",
        });
        this.skullText.setOrigin(1, 0);
        this.skullText.setScrollFactor(0);
        this.skullText.depth = RenderingDepths.UI;
        
        this.pointsText = this.scene.add.text(0, 0, "0", {
            color: "#ffffff",
            fontSize: "16px",
            align: "right",
        });
        this.pointsText.setOrigin(1, 0);
        this.pointsText.setScrollFactor(0);
        this.pointsText.depth = RenderingDepths.UI;

        this.scene.load.image('directionalArrow', 'assets/arrow.png');
        this.directionalArrow = this.scene.add.sprite(9, 34, 'directionalArrow');
        this.directionalArrow.setOrigin(0.5, 0.5);
        this.directionalArrow.setScrollFactor(0);
        this.directionalArrow.depth = RenderingDepths.UI
    }

    update(currentMission: Mission, totalPoints: number): void {
        this.updateHearts();
        this.updateMedKit();

        if (currentMission) {
            this.updateSkull(currentMission);
            this.updatePoints(totalPoints);
            this.updateMissionProgress(currentMission);
            this.updateDirectionalArrow(currentMission?.currentStep.coords);
        }
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
        this.medKit.setPosition(window.game.scale.width - 16, 17);
        this.medKitText.setPosition(window.game.scale.width - 16, 17);
    }

    private updateSkull(currentMission: Mission) {
        this.skullText.setText(`${currentMission.casualties}/${currentMission.potentialCasualties}`);
        this.skull.setPosition(window.game.scale.width - 16, 34);
        this.skullText.setPosition(window.game.scale.width - 17, 34);
    }

    private updatePoints(points: number) {
        this.pointsText.setText(`${points}`);
        this.pointsText.setPosition(window.game.scale.width - 1, 0);
    }

    private updateMissionProgress(currentMission: Mission) {
        const stepNumber = currentMission.currentStepIndex;
        const totalSteps = currentMission.missionSteps.length;
        this.missionProgressInd.map((ind, i) => {
            if (i < stepNumber) {
                ind.setFrame("stepComplete");
                ind.setVisible(true);
            } else if (i < totalSteps) {
                ind.setFrame("stepIncomplete");
                ind.setVisible(true);
            } else {
                ind.setVisible(false);
            }
        });
    }

    private updateDirectionalArrow(missionStepCoords: Coords) {
        const angle = Phaser.Math.Angle.Between(
            this.player.x, 
            this.player.y, 
            missionStepCoords[0], 
            missionStepCoords[1]
        );
        this.directionalArrow.rotation = angle;
    }
}