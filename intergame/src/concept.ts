// A representation of one thing from a game, in Intergame format.

export default class Concept {
    name: string | undefined; // lowercase, spaces as hyphens.
    contextID: string | undefined; // lowercase, spaces as hyphens. Motive: can append to filenames.

    // keyed by context id, value is the original data from that context
    versions: Record<string, Record<string, unknown>> = {};
    alignment: string | undefined; // lg, nn, ce, etc.

    type(): string {
        return 'concept';
    }
}
