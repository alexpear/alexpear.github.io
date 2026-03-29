// A representation of one thing from a game, in Intergame format.

export default class Concept {
    name: string; // lowercase, spaces as hyphens.
    contextID: string; // lowercase, spaces as hyphens. Motive: can append to filenames.

    // keyed by context id, value is the original data from that context
    versions: Record<string, Record<string, boolean | number | string>> = {};

    type(): string {
        return 'concept';
    }
}
