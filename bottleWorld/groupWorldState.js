'use strict';

const ContinuousWorldState = require('./continuousWorldState.js');

// Environments where the top-level actor is the Group, aka homogenous colocated groups of congregating Creatures
class GroupWorldState extends ContinuousWorldState {}

module.exports = GroupWorldState;
