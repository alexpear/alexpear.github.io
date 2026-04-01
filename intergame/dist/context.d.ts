import Concept from './concept';
import Creature from './creature';
export default abstract class Context {
    abstract readonly id: string;
    comparisonCSV(): string;
    summary(creature: Creature): Record<string, unknown>;
    abstract creaturesFilename(): string;
    abstract salientProps(): string[];
    familiar2concepts(path: string): Concept[];
    static csvEscape(value: unknown): string;
}
