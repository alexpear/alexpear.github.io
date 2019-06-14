'use strict';

const WorldState = require('./worldState.js');

// Continuous-space environments, as opposed to grids or graphs.
class ContinuousWorldState extends WorldState {}

module.exports = ContinuousWorldState;
