'use strict';

// Later, make this YAML or JSON or even custom txt
// Later, make these per-setting
// Later, could consider a inheritance system (elf extends humanoid)
// Later, could add a hierarchy like TAG.Event.Death and TAG.Creature.Human

const Util = require('../util/util.js');

module.exports = Util.makeEnum([
    'Human',
    'Dwarf',
    'Elf',
    'Goblin',
    'Beast',
    'Undead',
    'Construct',
    'Fey',
    'Spirit',
    'Elemental',

    'Blade',
    'Piercing',
    'Impact',
    'Projectile',
    'Fire',
    'Cold',
    'Poison',

    'Necrotic',
    'Radiant',
    'Electric',

    'Action',
    'Attack',
    'Damage',
    'Death',
    'GroupElimination'
]);
