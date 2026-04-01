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
