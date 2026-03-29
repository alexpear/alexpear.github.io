// A game or story context, for mapping to or from the Intergame format.

import Concept from './concept';
import Creature from './creature';

import * as FS from 'fs';

export default abstract class Context {
    abstract readonly id: string;

    comparisonCSV(): string {
        const concepts = this.familiar2concepts(this.creaturesPath());

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

    abstract creaturesPath(): string;
    abstract salientProps(): string[];

    familiar2concepts(path: string): Concept[] {
        const raw = JSON.parse(FS.readFileSync(path, 'utf-8'));
        const array = raw?.data || raw?.results || [];

        return array.map((entry: Record<string, unknown>) => {
            const concept = new Concept();

            concept.versions[this.id] = entry;
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
