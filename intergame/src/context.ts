// A game or story context, for mapping to or from the Intergame format.

import Concept from './concept';
import Creature from './creature';

import * as FS from 'fs';

export default abstract class Context {
    abstract readonly id: string;

    comparisonCSV(): string {
        const concepts = this.familiar2concepts(
            `${__dirname}/../data/${this.creaturesFilename()}`,
        );

        const abridgeds = concepts.map((concept) => this.summary(concept));

        // let csv = Object.keys(abridgeds[0]).join(',') + '\n';
        const headers = Object.keys(abridgeds[0]);

        const rows = abridgeds.map((abridged) =>
            headers.map((key) => Context.csvEscape(abridged[key])).join(','),
        );

        return [headers.join(','), ...rows].join('\n');
    }

    summary(creature: Creature): Record<string, unknown> {
        const familiarVersion = creature.versions[this.id];
        const summary: Record<string, unknown> = {
            contextID: this.id,
        };

        for (const prop of this.salientProps()) {
            summary[prop] = familiarVersion[prop];
        }

        return summary;
    }

    abstract creaturesFilename(): string;
    abstract salientProps(): string[];

    familiar2concepts(path: string): Concept[] {
        const raw = JSON.parse(FS.readFileSync(path, 'utf-8'));
        const array = raw?.data || raw?.results || [];

        return array.map((entry: Record<string, unknown>) => {
            const concept = new Concept();

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

    static csvEscape(value: unknown): string {
        const str = String(value ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    }

    // static run (): void {
    //     const csv = new Context().;
    // }
}
