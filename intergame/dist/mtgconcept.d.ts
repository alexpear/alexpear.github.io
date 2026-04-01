import Concept from './concept';
import Creature from './creature';
export default class MtGConcept extends Concept {
    name: string;
    readonly contextID: string;
    costString: string;
    power: number | undefined;
    toughness: number | undefined;
    typeLine: string;
    oracleText: string;
    keywords: string[];
    colors: string;
    versions: Record<string, Record<string, unknown>>;
    prettyString(): string;
    static importDnD(dndCreature: Creature): MtGConcept;
    appropriateManaValue(): number;
}
