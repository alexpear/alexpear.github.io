(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
// Browser entry point: renders sample MTG cards into #card-container.
Object.defineProperty(exports, "__esModule", { value: true });
const mtgconcept_1 = require("./mtgconcept");
const render_1 = require("./render");
function makeCard(name, costString, typeLine, oracleText, colors, power, toughness) {
    const card = new mtgconcept_1.default();
    card.name = name;
    card.costString = costString;
    card.typeLine = typeLine;
    card.oracleText = oracleText;
    card.colors = colors;
    card.power = power;
    card.toughness = toughness;
    return card;
}
const SAMPLE_CARDS = [
    makeCard('Baneslayer Angel', '{3}{W}{W}', 'Creature — Angel', 'Flying, first strike, lifelink, protection from Demons and from Dragons', 'w', 5, 5),
    makeCard('Counterspell', '{U}{U}', 'Instant', 'Counter target spell.', 'u'),
    makeCard('Nyx Weaver', '{1}{B}{G}', 'Enchantment Creature — Spider', 'Reach, deathtouch\n{1}{B}{G}, Exile Nyx Weaver: Return target card from your graveyard to your hand.', 'bg', 2, 3),
    makeCard('Lightning Bolt', '{R}', 'Instant', 'Lightning Bolt deals 3 damage to any target.', 'r'),
    makeCard('Llanowar Elves', '{G}', 'Creature — Elf Druid', '{T}: Add {G}.', 'g', 1, 1),
];
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('card-container');
    if (!container)
        return;
    container.innerHTML = SAMPLE_CARDS.map(render_1.renderCard).join('\n');
});

},{"./mtgconcept":5,"./render":6}],2:[function(require,module,exports){
"use strict";
// A representation of one thing from a game, in Intergame format.
Object.defineProperty(exports, "__esModule", { value: true });
class Concept {
    constructor() {
        // keyed by context id, value is the original data from that context
        this.versions = {};
    }
    type() {
        return 'concept';
    }
}
exports.default = Concept;

},{}],3:[function(require,module,exports){
(function (__dirname){(function (){
"use strict";
// A game or story context, for mapping to or from the Intergame format.
Object.defineProperty(exports, "__esModule", { value: true });
const concept_1 = require("./concept");
const FS = require("fs");
class Context {
    comparisonCSV() {
        const concepts = this.familiar2concepts(`${__dirname}/../data/${this.creaturesFilename()}`);
        const abridgeds = concepts.map((concept) => this.summary(concept));
        // let csv = Object.keys(abridgeds[0]).join(',') + '\n';
        const headers = Object.keys(abridgeds[0]);
        const rows = abridgeds.map((abridged) => headers.map((key) => Context.csvEscape(abridged[key])).join(','));
        return [headers.join(','), ...rows].join('\n');
    }
    summary(creature) {
        const familiarVersion = creature.versions[this.id];
        const summary = {
            contextID: this.id,
        };
        for (const prop of this.salientProps()) {
            summary[prop] = familiarVersion[prop];
        }
        return summary;
    }
    familiar2concepts(path) {
        const raw = JSON.parse(FS.readFileSync(path, 'utf-8'));
        const array = raw?.data || raw?.results || [];
        return array.map((entry) => {
            const concept = new concept_1.default();
            // LATER each of these values in .versions should probably be its own Concept instance.
            concept.versions[this.id] = entry;
            concept.name = String(entry.slug || entry.id || entry.name || '')
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-');
            // LATER move this to dnd5e.ts
            if (entry.alignment) {
                const listed = String(entry.alignment).trim().toLowerCase();
                concept.alignment =
                    {
                        'lawful good': 'lg',
                        'neutral good': 'ng',
                        'chaotic good': 'cg',
                        'lawful neutral': 'ln',
                        neutral: 'nn',
                        'chaotic neutral': 'cn',
                        'lawful evil': 'le',
                        'neutral evil': 'ne',
                        'chaotic evil': 'ce',
                        'any alignment': 'any',
                    }[listed] || listed;
            }
            return concept;
        });
    }
    static csvEscape(value) {
        const str = String(value ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    }
}
exports.default = Context;

}).call(this)}).call(this,"/intergame/dist")
},{"./concept":2,"fs":7}],4:[function(require,module,exports){
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

},{"./context":3}],5:[function(require,module,exports){
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

},{"./concept":2,"./mtg":4}],6:[function(require,module,exports){
"use strict";
// Renders an MtGConcept as an HTML string for a card.html page.
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCard = exports.parseManaSymbols = void 0;
// Converts {W}, {2}, {T} etc. to mana-font <i> tags.
// inCost=true adds ms-cost (colored circle) for the name bar display.
function parseManaSymbols(text, inCost = false) {
    const extra = inCost ? ' ms-cost ms-shadow' : '';
    return text.replace(/\{([^}]+)\}/g, (_, sym) => {
        const cls = sym.toLowerCase().replace('/', '');
        return `<i class="ms ms-${cls}${extra}"></i>`;
    });
}
exports.parseManaSymbols = parseManaSymbols;
function frameClass(colors) {
    if (!colors)
        return 'frame-c';
    if (colors.length > 1)
        return 'frame-m';
    return `frame-${colors[0].toLowerCase()}`;
}
function oracleToHtml(text) {
    if (!text)
        return '';
    return text
        .split('\n')
        .map((para) => `<p>${parseManaSymbols(para)}</p>`)
        .join('');
}
function renderCard(card) {
    const frame = frameClass(card.colors);
    const cost = parseManaSymbols(card.costString, true);
    const oracle = oracleToHtml(card.oracleText);
    const hasPT = card.power !== undefined && card.toughness !== undefined;
    return `<div class="mtg-card ${frame}">
  <div class="card-inner">
    <div class="card-header">
      <div class="card-name">${card.name}</div>
      <div class="card-cost">${cost}</div>
    </div>
    <div class="card-art"></div>
    <div class="card-typeline">
      <div class="card-type">${card.typeLine}</div>
    </div>
    <div class="card-textbox">
      <div class="oracle-text">${oracle}</div>
    </div>
    <div class="card-footer">
      <div class="card-info">&#x2605; Wizards of the Coast</div>
      ${hasPT ? `<div class="card-pt">${card.power}/${card.toughness}</div>` : ''}
    </div>
  </div>
</div>`;
}
exports.renderCard = renderCard;

},{}],7:[function(require,module,exports){

},{}]},{},[1]);
