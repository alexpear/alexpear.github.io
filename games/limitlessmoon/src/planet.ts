import { hashAxial } from './hex';
import { Expedition } from './expedition';
import { Place, Terrain, TERRAIN_LIST } from './place';

// Lazy procedural hex map. Terrain for each hex is deterministic given the
// planet seed, so panning away and back shows the same world.
export class Planet {
    seed: number;
    private cache: Map<string, Place> = new Map();

    constructor(seed: number = 1) {
        this.seed = seed;
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
        // TODO
    }
}
