"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context");
// import Creature from './creature';
class DnD5e extends context_1.default {
    constructor() {
        super(...arguments);
        this.id = 'dnd5e';
    }
    salientProps() {
        return [
            'slug',
            'alignment',
            'type',
            'subtype',
            'armor_class',
            'hit_points',
            'strength',
            'dexterity',
            'constitution',
            'intelligence',
            'wisdom',
            'charisma',
            'cr',
        ];
    }
    creaturesFilename() {
        return 'dnd5e-monsters.json';
    }
    static run() {
        const csv = new DnD5e().comparisonCSV();
        console.log(csv);
    }
}
exports.default = DnD5e;
// DnD5e.run();
