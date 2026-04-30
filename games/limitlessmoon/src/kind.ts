// A template, category, or species of creature, such as Robocrab or Archaeologist. The Kind defines the biological and cybernetic traits, but not what items it wears or carries.

import { Idea } from './idea';
import { Util } from './util';

export class Kind {
    id: string = Util.uuid();
    // The main Idea can represent a creature or item, but can't represent a trait.
    // LATER could add subclasses extending Idea to represent that at the Typescript level, if that seems clearer. CreatureIdea, ItemIdea, TraitIdea.

    mainIdea: Idea;
    has: Idea[] = [];

    constructor(idea: Idea) {
        this.mainIdea = idea;
    }

    cost(): number {
        const allIdeas = [this.mainIdea, ...this.has];
        return Util.sum(allIdeas.map((idea) => idea.cost || 0));
    }

    json(): object {
        return {
            id: this.id,
            mainIdea: this.mainIdea.json(),
            traits: this.has.map((t) => t.json()),
        };
    }

    prettyString(): string {
        let mainIdeaName = this.mainIdea.prettyString();

        if (this.has.length === 0) return mainIdeaName;

        let prefix = '';

        for (const component of this.has) {
            if (component?.asmod?.prefix) {
                prefix = component.asmod.prefix;
            } else if (component?.asmod?.add?.prefix) {
                prefix = component.asmod.add.prefix;
            }

            if (component?.asmod?.overwrite?.name) {
                mainIdeaName = component.asmod.overwrite.name;
            }

            // LATER auto test to look for combinations of items that can contribute multiple colliding prefices or name replacements.
        }

        return Util.capitalized(`${prefix}${mainIdeaName}`);
    }

    static sketchesWIP(): object[] {
        // NOTE Don't call this func. It's just a scratchpad.
        return [
            // {
            //     mainIdea: Idea.encyclopedia.creature.human,
            //     traits: [
            //         Idea.encyclopedia.trait.stealthy,
            //         Idea.encyclopedia.trait.gills,
            //     ],
            // },
        ];
    }
}
