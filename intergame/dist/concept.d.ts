export default class Concept {
    name: string | undefined;
    contextID: string | undefined;
    versions: Record<string, Record<string, unknown>>;
    alignment: string | undefined;
    type(): string;
}
