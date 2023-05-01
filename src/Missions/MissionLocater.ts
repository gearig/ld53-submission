import { Coords } from "../shared/constants/models";
import { getRandomFromArr } from "../shared/helpers/get_random_from_arr";
import { DROPOFF_LOCATIONS, PICKUP_LOCATIONS, REPORT_LOCATIONS } from "./constants/constants";
import { MissionItems, ReportLocations } from "./constants/enums";

export class MissionLocater {
    public static getPickUpLocationCoords(item: MissionItems): Coords {
        return getRandomFromArr(PICKUP_LOCATIONS[item]);
    }

    public static getDropOffLocationCoords(item: MissionItems): Coords {
        return getRandomFromArr(DROPOFF_LOCATIONS[item]);
    }

    public static getReportLocationCoords(reportTo: ReportLocations): Coords {
        return REPORT_LOCATIONS[reportTo];
    }
}