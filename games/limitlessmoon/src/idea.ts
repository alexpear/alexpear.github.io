// A herd of horses is a instance of class Group where herd.idea is a pointer to Idea.encyclopedia.horse. This is the singular global object that describes the traits of horses. It's a instance of class Idea. It's like the wikipedia page 'Horse', or the Platonic idea of a horse.

// TODO The builder Github Action will create .yml.js files from the data/*.yml files.
import thingsYML from '../data/things.yml.js';

import YAML from 'yaml';

export class Idea {
    static encyclopedia: Record<string, Idea> = {};

    static init(): void {
        const rawThings = YAML.load(thingsYML);
        // TODO imitate templates.js
    }

    isCreature(): boolean {}
}

Idea.init();
