// A herd of horses is a instance of class Group where herd.idea is a pointer to Idea.encyclopedia.horse. This is the singular global object that describes the traits of horses. It's a instance of class Idea. It's like the wikipedia page 'Horse', or the Platonic idea of a horse.

import { Util } from './util';

// TODO The builder Github Action will create .yml.js files from the data/*.yml files.
import thingsYML from '../data/things.yml.js';

import YAML from 'yaml';

export class Idea {
    cost: number = 1;
    weight: number = 1;
    ideaType: 'creature' | 'item' | 'trait';

    static encyclopedia: Record<string, Idea> = {};

    static init(): void {
        const rawThings = YAML.load(thingsYML);
        // TODO imitate templates.js. Also populate a .ideaType field, etc.
    }

    isCreature(): boolean {
        return this.ideaType === 'creature';
    }

    isItem(): boolean {
        return this.ideaType === 'item';
    }

    static random(): Idea {
        return Util.randomOf(Object.values(Idea.encyclopedia));
    }

    static randomCreature(): Idea {
        // LATER check if this runs slow. Multiple speedup options.
        return Util.randomOf(
            Object.values(Idea.encyclopedia).filter((idea) =>
                idea.isCreature(),
            ),
        );
    }
}

Idea.init();
