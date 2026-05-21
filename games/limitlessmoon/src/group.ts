// A gathering of homogenous colocated Creatures. Only the leader has a personality.

import { Idea, Condition } from './idea';
import { Item } from './item';
import { Util } from './util';

export class Group {
    id: string = Util.uuid();
    quantity: number = 1;
    mainIdea: Idea;
    traits: Idea[] = [];
    items: Item[] = [];
    conditions: Condition[] = [];

    // . this is for Mecha pilots or aircraft carriers
    // . could type this as (Group | Item)[] if I want it reusable as a adventurer inventory bag.
    // . groups inside the transporting array can't physically interact with the world, but can think and talk over radio. or exit. they're safe unless the outer Group takes severe damage.
    transporting: Group[] = [];

    constructor(mainIdea: Idea, quantity: number = 1) {
        this.mainIdea = mainIdea;
        this.quantity = quantity;
    }

    cost(): number {
        return (
            this.quantity *
            (this.mainIdea.cost +
                Util.sum(this.traits.map((idea) => idea.cost)) +
                Util.sum(this.items.map((item) => item.cost())))
        );
    }

    isCreature(): boolean {
        return this.mainIdea.isCreature();
    }

    isItem(): boolean {
        return this.mainIdea.isItem();
    }

    // place(): Place {

    // }

    copy(quantity: number = this.quantity): Group {
        const newGroup = new Group(this.mainIdea, quantity);
        newGroup.traits = [...this.traits];
        newGroup.items = this.items.map((i) => i.copy());
        newGroup.conditions = [...this.conditions];
        newGroup.transporting = this.transporting.map((group) => group.copy());
        return newGroup;
    }

    json(): object {
        return {
            id: this.id,
            quantity: this.quantity,
            mainIdea: this.mainIdea.id,
            ideas: this.traits.map((i) => i.id),
            items: this.items.map((i) => i.json()),
            conditions: this.conditions.map((c) => c),
        };
    }

    prettyString(): string {
        return this.mainIdea.id;
        // TODO adapt this func to handle .traits, items
    }

    static randomCreature(): Group {
        const group = new Group(Idea.randomCreature(), 1);

        // TODO chance of adding more ideas & Items

        return group;
    }
}
