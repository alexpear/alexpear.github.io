import Context from './context';
export default class MtG extends Context {
    readonly id: string;
    salientProps(): string[];
    creaturesFilename(): string;
    static alignment2color(abbrv?: string): string;
    static run(): void;
}
