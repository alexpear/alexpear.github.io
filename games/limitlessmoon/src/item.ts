// A set of Ideas representing an inanimate thing that a character can possess.

import { Idea } from './idea';
import { Util } from './util';

export class Item {
    id: string = Util.uuid();
    mainIdea: Idea;
    has: Idea[] = [];

    constructor(mainIdea: Idea) {
        this.mainIdea = mainIdea;
    }

    cost(): number {
        return this.mainIdea.cost + Util.sum(this.has.map((idea) => idea.cost));
    }

    weight(): number {
        return (
            this.mainIdea.weight + Util.sum(this.has.map((idea) => idea.weight))
        );
    }

    json(): object {
        return {
            id: this.id,
            mainIdea: this.mainIdea.id,
            has: this.has.map((i) => i.id),
        };
    }

    prettyString(): string {
        let mainIdeaName = this.mainIdea.prettyString();

        let prefix = '';

        for (let i = 0; i < this.has.length; i++) {
            const idea = this.has[i];
            if (idea?.asmod?.prefix) {
                prefix += ` ${idea.asmod.prefix}`;
            } else if (idea?.asmod?.add?.prefix) {
                prefix += ` ${idea.asmod.add.prefix}`;
            }

            if (idea?.asmod?.overwrite?.name) {
                mainIdeaName = idea.asmod.overwrite.name;
            }

            console.log(`(processed subidea ${idea.id})`);

            // LATER auto test to look for combinations of items that can contribute multiple colliding prefices or name replacements.
        }

        mainIdeaName = `${prefix}${mainIdeaName}`
            .split(' ')
            .filter((word) => word.length > 0)
            .map((word) => Util.capitalized(word.trim().toLowerCase()))
            .join(' ');

        const ideaIDs = [this.mainIdea.id].concat(this.has.map((i) => i.id));

        const chassisQuantity = `${mainIdeaName} (${ideaIDs.join(', ')})`;

        return chassisQuantity;
    }

    maybeAddParts(): void {
        if (!this.mainIdea.slots || Math.random() < 0.2) return;

        // Add more parts/mods to this item's slots.
        const modCandidates = Util.shuffle(
            Object.values(Idea.encyclopedia.item).filter((idea) => {
                if (!this.mainIdea.slots?.[idea?.asmod?.slot]) return false;

                return [this.mainIdea.id, 'any', undefined].includes(
                    idea.asmod?.attachto,
                );
            }),
        );

        // console.log(`maybeAddParts() with ${modCandidates.length} candidates`);

        for (const mod of modCandidates) {
            if (!this.slotIsOpen(mod.asmod.slot)) continue;

            this.has.push(mod);

            // We might be done.
            if (Math.random() < 0.5) return;
        }
    }

    slotIsOpen(slot: string): boolean {
        if (!this.mainIdea.slots) return false;

        let copiesOfThisSlot = this.mainIdea.slots[slot] || 0;

        for (let i = 0; i < this.has.length; i++) {
            if (this.has[i].asmod?.slot === slot) {
                copiesOfThisSlot--;
            }

            if (copiesOfThisSlot < 1) {
                return false;
            }
        }

        return true;
    }

    copy(): Item {
        const newItem = new Item(this.mainIdea);
        newItem.has = [...this.has]; // Shallow copy the Ideas
        return newItem;
    }

    static randomItem(): Item {
        const weapon = new Item(Idea.randomItem());

        weapon.maybeAddParts();

        return weapon;
    }

    static randomWeapon(): Item {
        const weapon = new Item(Idea.randomWeapon());

        weapon.maybeAddParts();

        return weapon;
    }
}

// class ItemPile {
//     item: Item;
//     quantity: number = 1;

//     constructor (item: Item) {
//         this.item = item;
//     }
// }
