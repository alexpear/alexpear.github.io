// A gathering of homogenous colocated Creatures. Only the leader has a personality.

import { Idea } from './idea';
import { Util } from './util';

export class Group {
    id: string = Util.uuid();
    ideas: Idea[] = [];
    quantity: number = 1;

    constructor(ideas: Idea[] | Idea, quantity: number = 1) {
        this.ideas = Array.isArray(ideas) ? ideas : [ideas];
        this.quantity = quantity;
    }

    cost(): number {
        return this.quantity * Util.sum(this.ideas.map((idea) => idea.cost));
    }

    isCreature(): boolean {
        return this.ideas[0].isCreature();
    }

    isItem(): boolean {
        return this.ideas[0].isItem();
    }

    copy(quantity: number = this.quantity): Group {
        return new Group(this.ideas, quantity);
    }

    json(): object {
        return {
            id: this.id,
            ideas: this.ideas.map((i) => i.json()),
            quantity: this.quantity,
        };
    }

    prettyString(): string {
        let mainIdeaName = this.ideas[0].prettyString();

        let prefix = '';

        for (let i = 0; i < this.ideas.length; i++) {
            const idea = this.ideas[i];
            if (idea?.asmod?.prefix) {
                prefix = idea.asmod.prefix;
            } else if (idea?.asmod?.add?.prefix) {
                prefix = idea.asmod.add.prefix;
            }

            if (idea?.asmod?.overwrite?.name) {
                mainIdeaName = idea.asmod.overwrite.name;
            }

            // LATER auto test to look for combinations of items that can contribute multiple colliding prefices or name replacements.
        }

        mainIdeaName = Util.capitalized(`${prefix}${mainIdeaName}`);

        const chassisQuantity = `${mainIdeaName} x${this.quantity}`;

        return chassisQuantity;

        // TODO the data model should perhaps handle some nesting, like a modified creature with a modified item, eg Ghosttongue Scout with Electrorifle <-> [scout, ghosttongue, gun, battery, extendedBarrel]
    }
}
