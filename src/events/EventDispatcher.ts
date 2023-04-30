import * as Phaser from "phaser";

class EventDispatcher extends Phaser.Events.EventEmitter {
    private static instance: EventDispatcher;

    constructor() {
        super();
    }

    public static getInstance(): EventDispatcher {
        if (!EventDispatcher.instance) {
            EventDispatcher.instance = new EventDispatcher();
        }
        return EventDispatcher.instance;
    }
}

export { EventDispatcher };