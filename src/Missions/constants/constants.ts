import {COORDS} from '../../shared/constants/location_coords.js';
import { Coords } from '../../shared/constants/models.js';
import { MissionItems, MissionTypes, ReportLocations } from "./enums";

export const START_LOCATION = COORDS.start;
export const LANDMARKS = COORDS.landmarks;
export const BLUE_RESIDENTIAL = COORDS.residential.blue;
export const GREEN_RESIDENTIAL = COORDS.residential.green;
export const ORANGE_RESIDENTIAL = COORDS.residential.orange;
export const YELLOW_RESIDENTIAL = COORDS.residential.yellow;

export const BLUE_COORDS = Object.values(BLUE_RESIDENTIAL);
export const GREEN_COORDS = Object.values(GREEN_RESIDENTIAL);
export const ORANGE_COORDS = Object.values(ORANGE_RESIDENTIAL);
export const YELLOW_COORDS = Object.values(YELLOW_RESIDENTIAL);
export const ALL_RESIDENTIAL_COORDS = [
    ...BLUE_COORDS,
    ...GREEN_COORDS,
    ...ORANGE_COORDS,
    ...YELLOW_COORDS
];

const MULTI_PICKUP_LOCATIONS = {
    [MissionItems.CORPSE]: [
        LANDMARKS.hospital,
        ...ALL_RESIDENTIAL_COORDS   
    ]
};

const MULTI_DROPOFF_LOCATIONS = {
    [MissionItems.CAR_PARTS]: [
        LANDMARKS.carLot,
        ...ALL_RESIDENTIAL_COORDS
    ],
    [MissionItems.ELECTRICAL_PARTS]: [
        LANDMARKS.electric,
        LANDMARKS.radio,
        LANDMARKS.militaryBase,
        ...ALL_RESIDENTIAL_COORDS
    ],
    [MissionItems.MUNITIONS]: [
        LANDMARKS.militaryBase,
        ...ALL_RESIDENTIAL_COORDS
    ]
};

export const PICKUP_LOCATIONS = {
    [MissionItems.CAR_PARTS]: [LANDMARKS.warehouse],
    [MissionItems.CORPSE]: MULTI_PICKUP_LOCATIONS[MissionItems.CORPSE],
    [MissionItems.ELECTRICAL_PARTS]: [LANDMARKS.warehouse],
    [MissionItems.FOOD]: [LANDMARKS.grocery],
    [MissionItems.MEDICAL]: [LANDMARKS.hospital],
    [MissionItems.MUNITIONS]: [LANDMARKS.gunDepot],
};

export const DROPOFF_LOCATIONS = {
    [MissionItems.CAR_PARTS]: MULTI_DROPOFF_LOCATIONS[MissionItems.CAR_PARTS],
    [MissionItems.CORPSE]: [LANDMARKS.cemetary],
    [MissionItems.ELECTRICAL_PARTS]: MULTI_DROPOFF_LOCATIONS[MissionItems.ELECTRICAL_PARTS],
    [MissionItems.FOOD]: ALL_RESIDENTIAL_COORDS,
    [MissionItems.MEDICAL]: ALL_RESIDENTIAL_COORDS,
    [MissionItems.MUNITIONS]: MULTI_DROPOFF_LOCATIONS[MissionItems.MUNITIONS],
}

export const REPORT_LOCATIONS = {
    [ReportLocations.CEMETARY]: LANDMARKS.cemetary as Coords,
    [ReportLocations.HOSPITAL]: LANDMARKS.hospital as Coords,
    [ReportLocations.MILITARY_BASE]: LANDMARKS.militaryBase as Coords,
    [ReportLocations.MYSTERIOUS_BUILDING]: ORANGE_RESIDENTIAL['?'] as Coords,
    [ReportLocations.POWER_STATION]: LANDMARKS.electric as Coords,
    [ReportLocations.RADIO_HQ]: LANDMARKS.radio as Coords,
}

export const MISSION_TYPES: MissionTypes[] = [MissionTypes.PICKUP_DROPOFF, MissionTypes.REPORT];
export const MAX_SEVERITY_LEVEL = 5;