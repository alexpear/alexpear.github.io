
const EventType = require('./eventType.js');

class Event {

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
