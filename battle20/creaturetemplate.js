'use strict';

// A stat block for a certain creature type.
// Later, may want to merge this with WNode classes.

const ActionTemplate = require('./actiontemplate.js');
const Util = require('../util/util.js');

// Later store these enums in another file
const SIZE = {
    Tiny: 0.5,
    Small: 0.7,
    Medium: 1,
    Large: 2,
    Huge: 3,
    Gargantuan: 4,
    Colossal: 6
};

const TAG = {
    Humanoid: 'humanoid',
    Human: 'human',
    Dwarf: 'dwarf',
    Elf: 'elf',
    Soldier: 'soldier',
    Blade: 'blade',
    Projectile: 'projectile'
};

module.exports = class CreatureTemplate {
    constructor () {

    }

    static example () {
        const template = new CreatureTemplate();

        // Dwarf Axe Thrower
        template.tags = [
            TAG.Dwarf,
            TAG.Humanoid,
            TAG.Soldier
        ];

        template.size = SIZE.Small;
        template.hp = 3;
        template.defense = 17;
        template.actions = [
            ActionTemplate.example()
        ];

        template.resistance = {};
        template.resistance[TAG.Mental] = 1;
        template.resistance[TAG.Piercing] = 1;
        template.resistance[TAG.Blade] = 1;
        template.resistance[TAG.Impact] = 1;

        return template;
    }
}
