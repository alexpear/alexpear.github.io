"use strict";
// A representation of one thing from a game, in Intergame format.
Object.defineProperty(exports, "__esModule", { value: true });
const concept_1 = require("./concept");
const mtg_1 = require("./mtg");
class MtGConcept extends concept_1.default {
    constructor() {
        super(...arguments);
        this.name = ''; // lowercase, spaces as hyphens.
        this.contextID = 'mtg';
        this.costString = '';
        this.typeLine = '';
        this.oracleText = '';
        this.keywords = [];
        this.colors = '';
        // keyed by context id, value is the original data from that context
        this.versions = {};
    }
    prettyString() {
        const powerToughness = this.power
            ? `${this.power}/${this.toughness}`
            : '';
        return `${this.name} ${this.costString} - ${this.typeLine} ${powerToughness}`;
    }
    // LATER we will do mtg.import(dnd.export(creature)), passing thru the intergame format
    static importDnD(dndCreature) {
        const card = new MtGConcept();
        card.name = dndCreature.name || '';
        const rawDnD = dndCreature.versions.dnd5e;
        card.typeLine = 'Creature';
        const bestDamageAbility = Math.max(Number(rawDnD.strength), Number(rawDnD.dexterity), Number(rawDnD.intelligence), Number(rawDnD.wisdom), Number(rawDnD.charisma));
        const power = Math.round((bestDamageAbility - 10) / 2);
        card.power = power >= 0 ? power : 0;
        const toughness = Math.round((Number(rawDnD.constitution) - 10) / 2);
        card.toughness = toughness >= 1 ? toughness : 1;
        card.colors = mtg_1.default.alignment2color(dndCreature.alignment);
        // LATER functionize
        const mv = card.appropriateManaValue();
        const genericMana = mv - card.colors.length;
        const genericSymbol = genericMana > 0 ? `{${genericMana}}` : '';
        const colorSymbols = card.colors
            .split('')
            .map((c) => `{${c.toUpperCase()}}`)
            .join('');
        // eg {2}{W}{B}
        card.costString = `${genericSymbol}${colorSymbols}`;
        return card;
    }
    appropriateManaValue() {
        const colorPenalty = this.colors === '' ? 1 : 0;
        return Math.round(((this.power || 0) + (this.toughness || 0)) / 2 +
            colorPenalty +
            this.keywords.length / 2);
    }
}
exports.default = MtGConcept;
