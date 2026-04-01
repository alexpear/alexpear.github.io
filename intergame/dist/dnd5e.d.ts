import Context from './context';
export default class DnD5e extends Context {
    readonly id: string;
    salientProps(): string[];
    creaturesFilename(): string;
    static run(): void;
}
