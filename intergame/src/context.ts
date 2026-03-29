// A game or story context, for mapping to or from the Intergame format.

import Concept from './concept';
import Creature from './creature';

import FS from 'fs';

export default abstract class Context {
    readonly id: string;

    comparisonCSV(): string {
        const concepts = this.familiar2concepts(this.creaturesPath());

        const abridgeds = concepts.map((concept) => this.summary(concept));

        // let csv = Object.keys(abridgeds[0]).join(',') + '\n';
        const headers = Object.keys(abridgeds[0]);

        return abridgeds
            .map((abridged) =>
                headers.map((header) => abridged[header]).join(','),
            )
            .join('\n');
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

    // static run (): void {
    //     const csv = new Context().;
    // }
}
