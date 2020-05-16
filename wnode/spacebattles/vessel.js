'use strict';

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');
const Thing = require('./thing.js');

module.exports = class Vessel extends Thing {
    constructor (chassisTemplate, parts, coord) {
        super(chassisTemplate);

        this.chassis = chassisTemplate;
        this.components = this.components.concat(parts || []);

        if (! this.isLegal()) {
            throw new Error(`I cannot construct this illegal ship! ${this.debugString()}`);
        }

        this.coord = coord;

        this.maxDurability = this.getDurability();
        this.currentDurability = this.maxDurability;
    }

    debugString () {
        return JSON.stringify(this.toJson(), undefined, '    ');
    }

    legal () {
        // TODO
        // Check how many Parts are among this.components
        // Compare to number of slots in chassis
        // Check power consumption total
    }

    getInitiative () {

    }

    getTravelDistance () {

    }

    // Hull total + 1
    getDurability () {

    }

    getMissileAttack () {

    }

    getNormalAttack () {

    }

    getShieldPenalty () {

    }

    static getExampleAttack () {
        return {
            missile: true,
            aiming: 1,
            dice: 4,
            // damage is per die
            damage: 2
        };
    }

    traitSumFromParts () {

    }

    rollAttackDice () {

    }

    getExampleAttackDice () {
        // These are the rolled dice that are available to be assigned to targets.
        return [
            {
                rolled: 7,
                damage: 2
            },
            {
                rolled: 2,
                damage: 2
            }
        ];
    }

    // input: array of rolled dice.
    // Returns number of durability points that would be lost by absorbing these dice.
    // No side effects.
    damageFromDice (dice) {

    }

    randomizeParts (techs) {
        techs = techs || [];


    }

    static randomEclipseShip () {
        const chassisName = Util.randomOf([
            'interceptor',
            'cruiser',
            'dreadnought',
            'starbase',
            // 'ancient',
            // 'guardian',
            // 'gccs'
        ]);

        const vessel = new Vessel(Chassis[chassisName]);

        vessel.randomizeParts();

        return vessel;
    }


};
