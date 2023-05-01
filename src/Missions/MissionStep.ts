import { Coords } from "../shared/constants/models";
import { MissionActions, MissionItems } from "./constants/enums";
import { MissionStepConfig } from "./constants/models";

export class MissionStep {
    public action: MissionActions;
    public item?: MissionItems;
    public coords: Coords;
    public text?: string;

    constructor(config: MissionStepConfig) {
        this.action = config.action;
        this.item = config?.item;
        this.coords = config.coords;
        this.text = config?.text;
    }
}