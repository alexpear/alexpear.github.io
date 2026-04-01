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

    creaturesFilename(): string {
        return 'mtg-afr-creatures-scryfall.json';
    }

    static alignment2color(abbrv?: string): string {
        return (
            {
                lg: 'w',
                ng: 'wg',
                cg: 'g',
                cn: 'r',
                ce: 'br',
                ne: 'b',
                le: 'ub',
                ln: 'u',
                nn: '',
            }[abbrv?.toLowerCase() || ''] || ''
        );
    }

    static run(): void {
        const csv = new MtG().comparisonCSV();
        console.log(csv);
    }
}

if (require.main === module) {
    MtG.run();
}

// TODO tsc -p tsconfig.json
