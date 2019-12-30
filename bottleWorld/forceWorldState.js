'use strict';

const ContinuousWorldState = require('./continuousWorldState.js');

// Environments where the top-level actor is the Force, aka groups of congregating Creatures
class ForceWorldState extends ContinuousWorldState {}

module.exports = ForceWorldState;

