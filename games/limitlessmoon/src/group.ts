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

        for (let i = 1; i < this.ideas.length; i++) {
            const idea = this.ideas[i];
            if (idea?.asmod?.prefix) {
                prefix += ` ${idea.asmod.prefix}`;
            } else if (idea?.asmod?.add?.prefix) {
                prefix += ` ${idea.asmod.add.prefix}`;
            }

            if (idea?.asmod?.overwrite?.name) {
                mainIdeaName = idea.asmod.overwrite.name;
            }

            // console.log(`(processed subidea ${idea.id})`);

            // LATER auto test to look for combinations of items that can contribute multiple colliding prefices or name replacements.
        }

        mainIdeaName = `${prefix}${mainIdeaName}`
            // .trim()
            .split(' ')
            .filter((word) => word.length > 0)
            .map((word) => Util.capitalized(word.trim().toLowerCase()))
            .join(' ');

        const chassisQuantity = `${mainIdeaName} (${this.ideas.map((i) => i.id).join(', ')}) x${this.quantity}`;

        return chassisQuantity;

        // TODO the data model should perhaps handle some nesting, like a modified creature with a modified item, eg Ghosttongue Scout with Electrorifle <-> [scout, ghosttongue, gun, battery, extendedBarrel]
    }

    static randomItem(): Group {
        const group = new Group(Idea.randomItem(), 1);

        group.maybeAddParts();

        return group;
    }

    static randomWeapon(): Group {
        const group = new Group(Idea.randomWeapon(), 1);

        group.maybeAddParts();

        return group;
    }

    static randomCreature(): Group {
        const group = new Group(Idea.randomCreature(), 1);

        // TODO chance of adding more ideas

        return group;
    }

    maybeAddParts(): void {
        if (!this.ideas[0].slots || Math.random() < 0.2) return;

        // Add more parts/mods to this item's slots.
        const modCandidates = Util.shuffle(
            Object.values(Idea.encyclopedia.item).filter(
                (idea) => idea.slots?.[idea?.asmod?.slot],
            ),
        );

        // console.log(`maybeAddParts() with ${modCandidates.length} candidates`);

        for (const mod of modCandidates) {
            if (!this.slotIsOpen(mod.asmod.slot)) continue;

            this.ideas.push(mod);

            // We might be done.
            if (Math.random() < 0.5) return;
        }
    }

    slotIsOpen(slot: string): boolean {
        if (!this.ideas[0].slots) return false;

        let copiesOfThisSlot = this.ideas[0].slots[slot] || 0;

        for (let i = 1; i < this.ideas.length; i++) {
            if (this.ideas[i].asmod?.slot === slot) {
                copiesOfThisSlot--;
            }

            if (copiesOfThisSlot < 1) {
                return false;
            }
        }

        return true;
    }
}
