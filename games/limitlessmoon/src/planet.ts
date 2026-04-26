import { hashAxial } from './hex';
import { Expedition } from './expedition';
import { Place, Terrain, TERRAIN_LIST } from './place';
import { Faction } from './faction';
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
}

// Run during testing.
Planet.random().startExpedition();
