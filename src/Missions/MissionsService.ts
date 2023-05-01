import { EventNames } from "../events";
import { Mission } from "./Mission";
import { MissionFactory } from "./MissionFactory";

export class MissionsService {
    public currentMission: Mission = null;

    private initialized: boolean = false;
    private Factory: MissionFactory = null;

    public get severityLevel() {
        if (!this.initialized) return 0;
        return this.Factory.severityLevel;
    }

    public initialize() {
        if (this.initialized) return;
        this.Factory = new MissionFactory()
        this.initialized = true;
    }

    public sleep() {
        if (!this.initialized) return;
        this.currentMission = null;
        this.Factory = null;
        this.initialized = false;
    }

    public prepareNextMission() {
        if (!this.initialized) return;
        this.Factory.severityLevel++;
        this.currentMission = this.Factory.createRandomMission();
    }
}