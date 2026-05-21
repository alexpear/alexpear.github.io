import { Expedition } from './expedition';
import { Faction } from './faction';
// import { Group } from './group';
import { hashAxial } from './hex';
import { Item } from './item';
import { Place, Terrain, TERRAIN_LIST } from './place';
import { Util } from './util';

// Lazy procedural hex map. Terrain for each hex is deterministic given the
// planet seed, so panning away and back shows the same world.
export class Planet {
    id: string = Util.uuid();
    seed: number;
    // TODO merge claude's hex cache with expedition.placeGrid
    private cache: Map<string, Place> = new Map();

    factions: Faction[] = [];

    constructor(seed: number = 1) {
        this.seed = seed;
    }

    static random(): Planet {
        const planet = new Planet();

        for (let i = 0; i < 2; i++) {
            planet.factions.push(Faction.random());
        }

        return planet;
    }

    place(q: number, r: number): Place {
        const key = `${q},${r}`;
        let p = this.cache.get(key);
        if (p) return p;
        const h = hashAxial(q, r, this.seed);
        const terrain: Terrain = TERRAIN_LIST[h % TERRAIN_LIST.length];
        p = new Place(q, r, terrain);
        this.cache.set(key, p);
        return p;
    }

    startExpedition(): Expedition {
        const venture = new Expedition(this);

        venture.log();

        return venture;
    }

    json(): object {
        return {
            id: this.id,
            seed: this.seed,
            factions: this.factions.map((f) => f.json()),
        };
    }

    static logExamples(generator: () => Item, quantity: number = 10): void {
        console.log(`\nExample generator outputs:`);

        const examples = [];

        for (let i = 0; i < quantity; i++) {
            examples.push(generator());
        }

        console.log(examples.map((i) => i.prettyString()).join('\n'));
        console.log();
    }

    static test(): void {
        Planet.random().startExpedition();

        Planet.logExamples(Item.randomWeapon, 50);
        // Planet.logExamples(Group.randomCreature);
    }
}

Planet.test();
