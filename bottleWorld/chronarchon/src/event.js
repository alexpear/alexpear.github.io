
const EventType = require('./eventType.js');
const Group = require('./group.js');

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
            Group.example()
        ];

        return event;
    }
}

module.exports = Event;
