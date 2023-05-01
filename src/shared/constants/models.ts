import { MissionStep } from "../../Missions/MissionStep";
import { MissionTypes } from "../../Missions/constants/enums";

export type Coords = [number, number];
export type MissionConfig = {
    severity: number,
    type: MissionTypes,
    missionSteps: MissionStep[]
}