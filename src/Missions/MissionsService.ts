import { Mission } from "./Mission";
import { MissionFactory } from "./MissionFactory";
import { MAX_SEVERITY_LEVEL } from "./constants/constants";

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
        if (this.Factory.severityLevel < MAX_SEVERITY_LEVEL) {
            this.Factory.severityLevel++;
        }
        this.currentMission = this.Factory.createRandomMission();
    }
}