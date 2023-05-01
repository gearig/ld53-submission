import { Coords } from "../shared/constants/models";
import { MissionLocater } from "./MissionLocater";
import { MissionStep } from "./MissionStep";
import { MISSION_TYPES, REPORT_LOCATIONS } from './constants/constants';
import { MissionActions, MissionItems, MissionTypes, ReportLocations } from "./constants/enums";
import { MissionStepConfig } from "./constants/models";

export class StepBuilder {
    public static selectRandomMissionItem(): MissionItems {
        const itemCategories = Object.keys(MissionItems);
        const randomIndex = Math.floor(Math.random() * itemCategories.length);
        const category = itemCategories[randomIndex];

        return MissionItems[category];
    }

    public static selectRandomMissionType(): MissionTypes {
        const randomIndex = Math.floor(Math.random() * MISSION_TYPES.length);
        return MISSION_TYPES[randomIndex];
    }

    public static getRandomReportStep(): MissionStep {
        const action: MissionActions = MissionActions.REPORT;
        const reportLocations = Object.entries(REPORT_LOCATIONS);
        const randomIndex = Math.floor(Math.random() * reportLocations.length);
        const locationDetails = reportLocations[randomIndex]; 
        const reportTo = locationDetails[0] as ReportLocations;
        const coords: Coords = locationDetails[1];

        const config = {
            action,
            coords,
            text: reportTo
        };

        return new MissionStep(config);
    }

    public static getPickUpStep(item: MissionItems): MissionStep {
        const action: MissionActions = MissionActions.PICKUP;
        const pickUpLocation = MissionLocater.getPickUpLocationCoords(item);

        const config: MissionStepConfig = {
            action,
            item,
            coords: pickUpLocation,
        };

        return new MissionStep(config);
    }

    public static getDropOffStep(item: MissionItems): MissionStep {
        const action: MissionActions = MissionActions.DROPOFF;
        const dropOffLocation = MissionLocater.getDropOffLocationCoords(item);

        const config = {
            action,
            item,
            coords: dropOffLocation,
        };

        return new MissionStep(config);
    }
}