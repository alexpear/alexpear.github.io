// A Place is one hex on a Planet. Prototype: terrain type + placeholder flavor.
// Note: a Place's identity is its (q, r) coords on the Planet, not a uuid.

export enum Terrain {
    Plains = 'plains',
    Hills = 'hills',
    Forest = 'forest',
    Mountains = 'mountains',
    Water = 'water',
    Desert = 'desert',
}

export const TERRAIN_COLORS: Record<Terrain, string> = {
    [Terrain.Plains]: '#7aa861',
    [Terrain.Hills]: '#b08a4d',
    [Terrain.Forest]: '#2f6b3a',
    [Terrain.Mountains]: '#8a8a8a',
    [Terrain.Water]: '#3b6fb5',
    [Terrain.Desert]: '#d6b170',
};

export const TERRAIN_LIST: Terrain[] = [
    Terrain.Plains,
    Terrain.Hills,
    Terrain.Forest,
    Terrain.Mountains,
    Terrain.Water,
    Terrain.Desert,
];

export class Place {
    q: number;
    r: number;
    terrain: Terrain;

    constructor(q: number, r: number, terrain: Terrain) {
        this.q = q;
        this.r = r;
        this.terrain = terrain;
    }

    name(): string {
        const label =
            this.terrain.charAt(0).toUpperCase() + this.terrain.slice(1);
        return `${label} (${this.q}, ${this.r})`;
    }

    // Placeholder flavor text shown in Place View.
    flavor(): string[] {
        return [
            `Terrain: ${this.terrain}`,
            `Axial coord: ${this.q}, ${this.r}`,
            'No creatures sighted.',
            'No items on the ground.',
        ];
    }

    color(): string {
        return TERRAIN_COLORS[this.terrain];
    }

    json(): object {
        return {
            q: this.q,
            r: this.r,
            terrain: this.terrain,
        };
    }
}
