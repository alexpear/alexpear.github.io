// A herd of horses is a instance of class Group where herd.idea is a pointer to Idea.encyclopedia.creature.horse. This is the singular global object that describes the traits of horses. It's a instance of class Idea. It's like the wikipedia page 'Horse', or the Platonic idea of a horse.

import { Util } from './util';
import { THINGS } from './generated/things.gen';

export type IdeaType = 'creature' | 'item' | 'trait';
export type DamageType =
    | 'impact'
    | 'blade'
    | 'pierce'
    | 'fire'
    | 'laser'
    | 'electric'
    | 'sonic'
    | 'acid'
    | 'nano'
    | 'antigrav'
    | 'data';
export type Condition =
    | 'ko'
    | 'berserk'
    | 'aflame'
    | 'poisoned'
    | 'cursed'
    | 'blessed';

type Attack = {
    range?: number;
    damage?: number;
    shotspersec?: number;
    stealth?: number;
    type?: DamageType;
};

type ModEffects = {
    attachto?: string;
    slot?: string;
    prefix?: string;
    add?: ModAdditions;
    overwrite?: Overwrites;
};

type ModAdditions = {
    damagetype?: DamageType;
    damage?: number;
    range?: number;
    stealth?: number;
    shotspersec?: number;
    effect?: string;
    prefix?: string;
};

type Overwrites = { name?: string; damagetype?: DamageType; hands?: number };

type IdeaCategory = {
    [key: string]: Idea | MetaEntry;
    meta: MetaEntry;
}

type MetaEntry = { likelySum: number };

const IDEA_TYPES: IdeaType[] = ['creature', 'item', 'trait'];

export class Idea {
    id: string = '';
    cost: number = 1;
    weight: number = 1;
    likely: number = 1;
    ideaType: IdeaType;
    attack?: Attack;
    asmod?: ModEffects;
    slots?: Record<string, number>;

    static encyclopedia: Record<IdeaType, IdeaCategory> = {
        creature: { meta: { likelySum: 1 } },
        item: { meta: { likelySum: 1 } },
        trait: { meta: { likelySum: 1 } },
    };

    static init(): void {
        for (const ideaType of IDEA_TYPES) {
            const bucket = (THINGS as Record<string, Record<string, object>>)[
                ideaType
            ];

            if (!bucket) continue;

            let likelySum = 0;

            for (const [id, def] of Object.entries(bucket)) {
                const idea = Object.assign(new Idea(), def, { id, ideaType });
                Idea.encyclopedia[ideaType][id] = idea;
                likelySum += idea.likely;
            }

            // Idea.encyclopedia[ideaType].meta = { likelySum };
            Idea.encyclopedia[ideaType].meta.likelySum = likelySum;
            // Idea.encyclopedia.meta[ideaType].likelySum = likelySum;
        }
    }

    isCreature(): boolean {
        return this.ideaType === 'creature';
    }

    isItem(): boolean {
        return this.ideaType === 'item';
    }

    json(): string {
        return this.id;
    }

    prettyString(): string {
        return Util.fromCamelCase(this.id);
    }
    
    static entries(ideaType: IdeaType): Idea[] {
        return Object.keys(Idea.encyclopedia[ideaType])
            .filter((key) => key !== 'meta')
            .map((key => Idea.encyclopedia[ideaType][key] as Idea));
    }

    static random(): Idea {
        // TODO likely weighting
        const all = IDEA_TYPES.flatMap((t) =>
            Idea.entries(t)
        );

        return Util.randomOf(all);
    }

    static randomCreature(): Idea {
        return Util.randomOf(Object.values(Idea.encyclopedia.creature));
    }

    static randomItem(): Idea {
        return Util.randomOf(Object.values(Idea.encyclopedia.item));
    }

    static randomWeapon(): Idea {
        return Util.randomOf(
            Object.values(Idea.encyclopedia.item).filter((idea) => idea.attack),
        );
    }
}

Idea.init();
