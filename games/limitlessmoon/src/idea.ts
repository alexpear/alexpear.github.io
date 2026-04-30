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

const IDEA_TYPES: IdeaType[] = ['creature', 'item', 'trait'];

export class Idea {
    id: string = '';
    cost: number = 1;
    weight: number = 1;
    ideaType: IdeaType;
    asmod?: ModEffects;

    static encyclopedia: Record<IdeaType, Record<string, Idea>> = {
        creature: {},
        item: {},
        trait: {},
    };

    static init(): void {
        for (const ideaType of IDEA_TYPES) {
            const bucket = (THINGS as Record<string, Record<string, object>>)[
                ideaType
            ];

            if (!bucket) continue;

            for (const [id, def] of Object.entries(bucket)) {
                const idea = Object.assign(new Idea(), def, { id, ideaType });
                Idea.encyclopedia[ideaType][id] = idea;
            }
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

    static random(): Idea {
        const all = IDEA_TYPES.flatMap((t) =>
            Object.values(Idea.encyclopedia[t]),
        );

        return Util.randomOf(all);
    }

    static randomCreature(): Idea {
        return Util.randomOf(Object.values(Idea.encyclopedia.creature));
    }
}

Idea.init();
