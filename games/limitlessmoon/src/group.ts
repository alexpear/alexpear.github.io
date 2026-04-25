// A gathering of homogenous colocated Creatures. Only the leader has a personality.

import { Idea } from './idea';
import { Kind } from './kind';

export class Group {
    kind: Kind;
    quantity: number = 1;
    items: Kind[] = [];

    constructor(kind: Kind | Idea, quantity: number) {
        this.kind = kind instanceof Kind ? kind : new Kind(kind);
        this.quantity = quantity;
    }

    cost(): number {
        return this.quantity * this.kind.cost();
    }

    add(item: Kind): void {
        this.items.push(item);
    }
}
