// A game or story context, for mapping to or from the Intergame format.

import Concept from './concept';

import FS from 'fs';

export default class Context {
    readonly id: string;

    comparisonCSV(): string {
        const concepts = this.familiar2concepts(this.creaturesPath());

        for (const name in concepts) {
            const salientProps = this.salientProps(concepts[name]);
        }

        return ''; // TODO
    }

    familiar2concepts(path: string): Record<string, Concept> {
        const concepts = {};

        const raw = JSON.parse(FS.readFileSync(path, 'utf-8'));
        const array = raw?.data || raw?.results || [];

        for (const entry of array) {
            const concept = new Concept();
            concept.versions[this.id] = entry;

            concepts[entry.name] = concept;
        }

        return concepts;
    }

    // static run (): void {
    //     const csv = new Context().;
    // }
}
