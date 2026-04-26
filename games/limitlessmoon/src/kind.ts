// A template, category, or species of creature, such as Robocrab or Archaeologist. The Kind defines the biological and cybernetic traits, but not what items it wears or carries.

import { Idea } from './idea';
import { Util } from './util';

export class Kind {
    // The main Idea can represent a creature or item, not a trait.
    // LATER could add subclasses extending Idea to represent that at the Typescript level, if that seems clearer. CreatureIdea, ItemIdea, TraitIdea.
    mainIdea: Idea;
    traits: Idea[] = [];

    constructor(idea: Idea) {
        this.mainIdea = idea;
    }

    cost(): number {
        const allIdeas = [this.mainIdea, ...this.traits];
        return Util.sum(allIdeas.map((idea) => idea.cost || 0));
    }

    static sketchesWIP(): object[] {
        // NOTE Don't call this func. It's just a scratchpad.
        return [
            // {
            //     mainIdea: Idea.encyclopedia.human,
            //     traits: [Idea.encyclopedia.stealthy, Idea.encyclopedia.gills],
            // },
        ];
    }
}
