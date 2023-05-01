import { EventNames } from "../events/EventNames";
import { MissionConfig } from "../shared/constants/models";
import { MissionStep } from "./MissionStep";
import { MissionTypes } from "./constants/enums";

export class Mission {
    public severity: number;
    public type: MissionTypes;
    public missionSteps: MissionStep[];
    public potentialCasualties: number;
    public casualties: number = 0;
    public success: boolean = true;
    public deliveryPoints: number;
    public currentStepIndex: number;

    private timeStarted: number;
    private timeEnded: number;
    private casualtyTimer;

    public get currentPoints() {
        if (!this.success || !this.deliveryPoints) return 0;

        const msSinceStart = (this.timeEnded || Date.now()) - this.timeStarted;
        const secondsSinceStart = Math.floor(msSinceStart / 1000);
        const unroundedPoints = (this.deliveryPoints / secondsSinceStart) * 1000 * this.severity;
        return Math.ceil(unroundedPoints);
    }

    public get currentStep() {
        return this.missionSteps[this.currentStepIndex] || null;
    }

    public get aliveRemaining() {
        return this.potentialCasualties - this.casualties;
    }

    constructor(config: MissionConfig) {
        this.severity = config.severity;
        this.type = config.type;
        this.missionSteps = config.missionSteps;
        this.potentialCasualties = this.severity * 10;
    }

    public beginMission() {
        this.currentStepIndex = 0;
        this.deliveryPoints = 0;
        this.timeStarted = Date.now();
        this.beginCasualties();
        globalThis.eventDispatcher.emit(EventNames.MISSION_STEP_START, this.currentStep);
    }

    public endMission(success: boolean = true) { // Mission ends in success unless explicity stated otherwise
        if (!this.timeEnded) {
            this.success = success;
            this.timeEnded = Date.now();
            this.endCasualties();
            globalThis.eventDispatcher.emit(EventNames.MISSION_END, this);
        }
    }

    public dispatchNextStep() {
        this.currentStepIndex++;
        const nextStep = this.currentStep;

        if (!nextStep) {
            return this.endMission();
        }

        globalThis.eventDispatcher.emit(EventNames.MISSION_STEP_START, nextStep);
    }

    private beginCasualties() {
        const casualtyTimer = this.severity < 3 ? 1500 : 1000;
        this.casualtyTimer = setInterval(() => {
            this.casualties++;
            if (this.casualties === this.potentialCasualties) {
                this.endMission(false);
            }
        }, casualtyTimer);
    }

    private endCasualties() {
        clearInterval(this.casualtyTimer);
    }
}