'use strict';

// All words that can be well-represented as hexadecimal numbers.

const fs = require('fs');
const WORDS_PATH = '/usr/share/dict/words';
const TextGen = require('./textGen.js');
const Util = require('../../util/util.js');

class L33tWords extends TextGen {
    constructor () {
        super();
    }

    static hexVersions () {
        let words = fs.readFileSync(WORDS_PATH, { encoding: 'utf8' })
            .split('\n');

        words = words.map(
            w => L33tWords.hexOfWord(w)
        )
        .filter(
            // Filter out unconvertable words.
            w => w
        );
        
        return words;
    }

    static stringList (words) {
        return words.sort(
            (a, b) => a.length - b.length
        )
        .join('\n');
    }

    static letters (word) {
        let total = 0;

        for (const char of word) {
            if (/[a-z]/.test(char.toLowerCase())) {
                total += 1;
            }
        }

        return total;
    }

    static hexOfWord (word) {
        let output = '';

        for (let char of word) {
            const hexChar = L33tWords.hexOfChar(char);

            if (! hexChar) {
                return;
            }

            output += hexChar;
        }

        return output + ` (${word})`;
    }

    static hexOfChar (char) {
        const MAP = {
            a: 'A',
            b: 'B',
            c: 'C', 
            d: 'D', 
            e: 'E', 
            f: 'F',
            i: '1',
            o: '0',
            s: '5',
            t: '7',
        };

        return MAP[char.toLowerCase()];
    }

    // TODO - sort fave hexcodes by color similarity somehow.
    faveHexCodeDivs () {
        const htmlStr = L33tWords.FAVES
            .filter(
                line => line.length <= 16
            )
            .map(
                line => {
                    const hexCode = '#' + line.split(' (')[0];
                    const element = L33tWords.asElement(hexCode);

                    // For length-3 codes, also try the doubled code, eg #BAE => #BAEBAE
                    if (hexCode.length === 4) {
                        const doubleCode = hexCode + hexCode.slice(1);
                        return element + '\n' + L33tWords.asElement(doubleCode);
                    }

                    return element;
                }
            )
            .join('\n');

        console.log(htmlStr);
    }

    static asElement (hexCode) {
        return `<label style="background-color: ${hexCode}">${hexCode}</label>`;
    }

    output () {
        const all = L33tWords.hexVersions();
        const str = L33tWords.stringList(all);
        return str;
    }

    static run () {
        const gen = new L33tWords();
        console.log(gen.output());
        gen.faveHexCodeDivs();
    }
}

// text-shadow: white 1px 1px, white 1px -1px, white -1px -1px, white -1px 1px

L33tWords.FAVES = [
    'ABE (Abe)',
    'ACE (ace)',
    'ADA (Ada)',
    'ADD (add)',
    'AD0 (ado)',
    'A55 (ass)',
    'BAA (baa)',
    'BAD (bad)',
    'BAE (bae)',
    'BED (bed)',
    'BEE (bee)',
    'B0A (boa)',
    'B0B (Bob)',
    'B00 (boo)',
    'CAB (cab)',
    'CA7 (cat)',
    'CEE (cee)',
    'C0D (cod)',
    'C00 (coo)',
    'DAB (dab)',
    'DAD (dad)',
    'DA0 (dao)',
    'DEE (dee)',
    'D1B (dib)',
    'D1D (did)',
    'D1E (die)',
    'D0B (DoB)',
    'D0C (doc)',
    'D0D (dod)',
    'D0E (doe)',
    'EBB (ebb)',
    'ED0 (Edo)',
    'FAD (fad)',
    'FAE (fae)',
    'FEE (fee)',
    'F1B (fib)',
    'F0B (fob)',
    'F0E (foe)',
    'F00 (foo)',
    '0AF (oaf)',
    '0DD (odd)',
    '0DE (ode)',
    '5EE',
    '5E7',
    '2FACED (2 faced)',
    '4FACED (4 faced)',
    'ABA5ED (abased)',
    'ABA51C (abasic)',
    'ABBE55 (abbess)',
    'ACAC1A (Acacia)',
    'ACAD1A (Acadia)',
    'ACCEDE (accede)',
    'ACCE55 (access)',
    'ACC057 (accost)',
    'ACE71C (acetic)',
    'ADD1C7 (addict)',
    'AFFEC7 (affect)',
    'A55E55 (assess)',
    'A55E75 (assets)',
    'A55157 (assist)',
    'A77E57 (attest)',
    'BAB1ED (babied)',
    'BACCAE (baccae)',
    'BADCA7',
    'BADD1E',
    `BADDAD`,
    'BA0BAB (baobab)',
    'BEADED (beaded)',
    'BEDDED (bedded)',
    'BEDEAD (be dead)',
    'BEDEAF (be deaf)',
    'BE51DE (beside)',
    'BE551E (Bessie)',
    'BE71DE (betide)',
    'B10515 (biosis)',
    'B1071C (biotic)',
    'B15EC7 (bisect)',
    'B0A71E (boatie)',
    'B0BBED (bobbed)',
    'B0BB1E (Bobbie)',
    'B0BCA7 (bobcat)',
    'B0D1CE (bodice)',
    'B007ED (booted)',
    'B00B00',
    'B055ED (bossed)',
    'CADD1E (caddie)',
    'CA5ADA (casada)',
    'CA551E (Cassie)',
    'C1CADA (cicada)',
    'C0A7ED (coated)',
    'C0BBED (cobbed)',
    'C0FFEE (coffee)',
    'C0071E (cootie)',
    'C055E7 (cosset)',
    'DEBA5E (debase)',
    'DEBA7E (debate)',
    'DEBB1E (Debbie)',
    'DEB7EE (debtee)',
    'DECADE (decade)',
    'DECE17 (deceit)',
    'DEC1DE (decide)',
    'DEC0DE (decode)',
    'DEFACE (deface)',
    'DEFEA7 (defeat)',
    'DEFEC7 (defect)',
    'DE1F1C (deific)',
    'DE5EED (deseed)',
    'DE5157 (desist)',
    'DE7EC7 (detect)',
    'DE7E57 (detest)',
    'D0BBED (dobbed)',
    'D00DAD (doodad)',
    'D077ED (dotted)',
    'EDDA1C (Eddaic)',
    'EDD1E5 (eddies)',
    'EFFACE (efface)',
    'EFFEC7 (effect)',
    'E57AD0 (estado)',
    'E57A7E (estate)',
    'FACADE (facade)',
    'FA5CE5 (fasces)',
    'F1A5C0 (fiasco)',
    'F1E57A (fiesta)',
    'F157ED (fisted)',
    'F177ED (fitted)',
    'F007ED (footed)',
    '1DEA7E (ideate)',
    '10D1DE (iodide)',
    '0B0157 (oboist)',
    '0B5E55 (obsess)',
    '0FF1CE (office)',
    '0FF5E7 (offset)',
    '5ABBA7 (sabbat)',
    '5AD157 (sadist)',
    '5C071A (Scotia)',
    '5EABEE (Seabee)',
    '5EA7ED (seated)',
    '5ECEDE (secede)',
    '5EDA7E (sedate)',
    '5EEDED (seeded)',
    '5E77EE (settee)',
    '57A515 (stasis)',
    '57A7ED (stated)',
    '57A71C (static)',
    '7AC71C (tactic)',
    '7A0157 (Taoist)',
    '7A57ED (tasted)',
    '7A7700 (tattoo)',
    '7E57E5 (testes)',
    '70B1A5 (Tobias)',
    '70FFEE (toffee)',
    '75E75E (tsetse)',
    'AB1071C (abiotic)',
    'BED51DE (bedside)',
    'B1071C5 (biotics)',
    'CA5CADE (cascade)',
    'CA7B0A7 (catboat)',
    'CA7FACE (catface)',
    'DECEA5E (decease)',
    'DE1C1DE (deicide)',
    'D10CE5E (diocese)',
    'D15EA5E (disease)',
    'D155EC7 (dissect)',
    'D157AFF (distaff)',
    'ED1F1CE (edifice)',
    'EFFEC75 (effects)',
    'E1DE71C (eidetic)',
    'FA5C157 (fascist)',
    '5ACCADE (saccade)',
    '5EA51DE (seaside)',
    '5EEDBED (seedbed)',
    '57AFFED (staffed)',
    '57A71C5 (statics)',
    '7ABA5C0 (Tabasco)',
    '7AC71C5 (tactics)',
    '70BACC0 (tobacco)',
    '70CCA7A (toccata)',
    'ADD1C7ED (addicted)',
    'AFFEC7ED (affected)',
    'A5BE5705 (asbestos)',
    'B0A751DE (boatside)',
    'CA7FACED (catfaced)',
    'D1ABE7E5 (diabetes)',
    'D1ABE71C (diabetic)',
    '5EAC0A57 (seacoast)',
    'D1DAC71C (didactic)',
    'D157A57E (distaste)',
    'D155EC7ED (dissected)',
    '0FF1C1A7E (officiate)',
    '5A715F1ED (satisfied)',
    '57A71571C5 (statistics)',
    'D15AFFEC7ED (disaffected)',
    '70BACC0F1ED (tobaccofied)',
    'D15A550C1A7E (disassociate)',
    'D155A715F1ED (dissatisfied)',
];

module.exports = L33tWords;

L33tWords.run();
