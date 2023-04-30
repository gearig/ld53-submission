import { Interactive } from "./Interactive";

type LightPillarColor = "yellow" | "purple" | "cyan";

export class LightPillar extends Interactive {
    constructor(scene: Phaser.Scene, x: number, y: number, color: LightPillarColor) {
        super(scene, x, y, `${color}-light-pillar`, scene.player);
    }
}