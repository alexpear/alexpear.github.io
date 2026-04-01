// File format for representing things from multiple games

import Context from './context';
import DnD5e from './dnd5e';
import MtGConcept from './mtgconcept';

class Intergame extends Context {
    id: string = 'intergame';

    salientProps(): string[] {
        return [];
    }

    creaturesFilename(): string {
        return '';
    }

    static run(): void {
        const dnd = new DnD5e();
        const dndCreatures = dnd.familiar2concepts(
            `${__dirname}/../data/${dnd.creaturesFilename()}`,
        );

        const mtgCards = dndCreatures.map((creature) =>
            MtGConcept.importDnD(creature),
        );

        console.log(
            JSON.stringify(
                mtgCards.map((card) => card.prettyString()),
                undefined,
                4,
            ),
        );
    }
}

Intergame.run();
