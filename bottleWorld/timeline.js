'use strict';

// Analogous to a Halo 3 Theater replay.

const util = require('../util/util.js');
const WorldState = require('./worldState.js');

module.exports = class Timeline {
    constructor () {
        this.startState = new WorldState();
        this.events = [];
    }
}



