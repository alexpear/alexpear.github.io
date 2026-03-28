import Context from './context';
// import Creature from './creature';

export default class MtG extends Context {
    readonly id: string = 'mtg';

    salientProps(): string[] {
        return [
            'name',
            'type_line',
            'cmc',
            'power',
            'toughness',
            'color_identity',
            'keywords',
            'set_name',
            'oracle_text',
        ];
    }

    creaturesPath(): string {
        return 'data/mtg-afr-creatures-scryfall.json';
    }

    static run(): void {
        const csv = new MtG().comparisonCSV();
        console.log(csv);
    }
}

MtG.run();
