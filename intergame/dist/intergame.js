"use strict";
// File format for representing things from multiple games
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context");
const dnd5e_1 = require("./dnd5e");
const mtgconcept_1 = require("./mtgconcept");
class Intergame extends context_1.default {
    constructor() {
        super(...arguments);
        this.id = 'intergame';
    }
    salientProps() {
        return [];
    }
    creaturesFilename() {
        return '';
    }
    static run() {
        const dnd = new dnd5e_1.default();
        const dndCreatures = dnd.familiar2concepts(`${__dirname}/../data/${dnd.creaturesFilename()}`);
        const mtgCards = dndCreatures.map((creature) => mtgconcept_1.default.importDnD(creature));
        console.log(JSON.stringify(mtgCards.map((card) => card.prettyString()), undefined, 4));
    }
}
Intergame.run();
