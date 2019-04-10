'use strict';

const Timeline = require('./Timeline.js');

// The (backend) model for a fictional encounter or battle in Waffle simulations.
// Spaceful: 3D grid. The unit is the meter.
// The time unit is the second. 
// A Encounter represents all events in a encounter, over a period of minutes to hours.

class Encounter {
    constructor () {
        this.timeline = new Timeline();
        this.things = [];
        // Later might change my mind about how to model this.
        this.actors = [];
    }
}







