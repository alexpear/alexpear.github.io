'use strict';

const Util = require('../util/util.js');

module.exports = class Event {
    constructor (type, subject, object) {
        this.subject = subject;
        this.object = object;
    }
};

Event.TYPES = Util.makeEnum([
    'Arrival',
    'AbilityReady',
    'Attack',
    'Death'
]);
