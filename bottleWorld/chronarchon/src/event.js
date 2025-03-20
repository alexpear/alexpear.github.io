
const EventType = require('./eventType.js');

class Event {
    constructor () {
        // this.type;
        // this.t;
        // this.entities;
        this.created = Date.now();
        this.users = [];
        this.id = Util.uuid();
    }

    toYml () {
        return Yaml.dump(
            this, 
            // LATER write entities as their ids.
            {
                sortKeys: true,
            },
        );
    }

    static example () {
        const event = new Event();

        event.type = EventType.INTRODUCE;
        event.entities = [
            Entity.example()
        ];

        return event;
    }
}

module.exports = Event;
