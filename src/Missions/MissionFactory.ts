import { EventNames } from "../events";
import { Mission } from "./Mission";
import { MissionStep } from "./MissionStep";
import { StepBuilder } from "./StepBuilder";
import { MissionTypes } from "./constants/enums";

class MissionFactory {
    /**
     * Severity level defaults to 0, but must be at least 1 to generate missions. 
     */
    public severityLevel: number = 0;

    private get totalSteps() {
        /**
         * Getting the total steps for a mission from the severity level ends up looking like this:
         * 
         * Sev :: Steps
         * ------------
         *  1  ::  1
         *  2  ::  1
         *  3  ::  2
         *  4  ::  2
         *  5  ::  3
         *  6  ::  3
         *  7  ::  4
         *  8  ::  4
         * 
         * ... and so on.
         */
        return Math.ceil(this.severityLevel / 2);
    }

    constructor() {}

    public createRandomMission(): Mission {
        const missionType = StepBuilder.selectRandomMissionType();

        return this.createMissionFromType(missionType);
    }

    private createMissionFromType(type: MissionTypes) {
        switch(type) {
            case MissionTypes.PICKUP_DROPOFF: {
                return this.createRandomPickupDropoffMission();
            }
            case MissionTypes.REPORT: {
                return this.createRandomReportMission();
            }
            default: return null;
        }
    }

    private createRandomPickupDropoffMission(): Mission {
        const missionSteps: MissionStep[] = [];

        for (let i = 0; i < this.totalSteps; i++) {
            const item = StepBuilder.selectRandomMissionItem();
            const pickUpStep = StepBuilder.getPickUpStep(item);
            const dropOffStep = StepBuilder.getDropOffStep(item);
            missionSteps.push(pickUpStep, dropOffStep);
        }

        return new Mission({
            severity: this.severityLevel,
            type: MissionTypes.PICKUP_DROPOFF,
            missionSteps: missionSteps
        })
    }

    private createRandomReportMission(): Mission {
        const missionSteps: MissionStep[] = [];

        for (let i = 0; i < this.totalSteps; i++) {
            const reportStep = StepBuilder.getRandomReportStep();
            missionSteps.push(reportStep);
        }

        return new Mission({
            severity: this.severityLevel,
            type: MissionTypes.REPORT,
            missionSteps: missionSteps
        })
    }
}

export { MissionFactory };