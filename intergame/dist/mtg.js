"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context");
// import Creature from './creature';
class MtG extends context_1.default {
    constructor() {
        super(...arguments);
        this.id = 'mtg';
    }
    salientProps() {
        return [
            'name',
            'type_line',
            'cmc',
            'power',
            'toughness',
            'color_identity',
            'keywords',
            'set_name',
            'oracle_text',
        ];
    }
    creaturesFilename() {
        return 'mtg-afr-creatures-scryfall.json';
    }
    static alignment2color(abbrv) {
        return ({
            lg: 'w',
            ng: 'wg',
            cg: 'g',
            cn: 'r',
            ce: 'br',
            ne: 'b',
            le: 'ub',
            ln: 'u',
            nn: '',
        }[abbrv?.toLowerCase() || ''] || '');
    }
    static run() {
        const csv = new MtG().comparisonCSV();
        console.log(csv);
    }
}
exports.default = MtG;
if (require.main === module) {
    MtG.run();
}
// TODO tsc -p tsconfig.json
