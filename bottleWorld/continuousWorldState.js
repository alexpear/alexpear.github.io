'use strict';

const WorldState = require('./worldState.js');

// Continuous-space environments, as opposed to discrete grids or graphs.
class ContinuousWorldState extends WorldState {}

module.exports = ContinuousWorldState;
