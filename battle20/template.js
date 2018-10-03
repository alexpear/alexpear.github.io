'use strict';

// A stat block for a certain creature type.
// Later, may want to merge this with WNode classes.

const Util = require('../Util.js');

// Later store these enums in another file
const SIZE = {
    Tiny: 0.5,
    Small: 0.8,
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

class CreatureTemplate {
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

        return template;
    }
}

// Could extend a class Template if that simplifies anything.
// TODO: Move to its own file.
class ActionTemplate {
    constructor () {

    }

    static example () {
        const template = new ActionTemplate();

        // Dwarven throwing axe
        template.tags = [
            TAG.Dwarf,
            TAG.Blade,
            TAG.Projectile
        ];

        template.hit = 4;
        template.damage = 1;

        return template;
    }
}

