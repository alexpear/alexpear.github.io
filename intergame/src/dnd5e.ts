import Context from './context';
// import Creature from './creature';

export default class DnD5e extends Context {
    readonly id: string = 'dnd5e';

    salientProps(): string[] {
        return [
            'slug',
            'alignment',
            'type',
            'subtype',
            'armor_class',
            'hit_points',
            'strength',
            'dexterity',
            'constitution',
            'intelligence',
            'wisdom',
            'charisma',
            'cr',
        ];
    }

    creaturesPath(): string {
        return 'data/dnd5e-monsters.json';
    }

    static run(): void {
        const csv = new DnD5e().comparisonCSV();
        console.log(csv);
    }
}

DnD5e.run();
