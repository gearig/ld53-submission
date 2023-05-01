import { Coords } from "../../shared/constants/models";
import { MissionActions, MissionItems, ReportLocations } from "./enums";

export interface MissionStepBody {
    action: MissionActions,
    item?: MissionItems,
    coords: Coords,
    text?: string
    completeStep(success: boolean): void;
};

export type MissionStepConfig = {
    action: MissionActions,
    item?: MissionItems,
    coords: Coords,
    text?: string
}