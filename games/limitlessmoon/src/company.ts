// A company is 1+ colocated Groups of the same Faction.

import { Group } from './group';
import { Util } from './util';

export class Company {
    id: string = Util.uuid();
    groups: Group[] = [];

    // Complex companies might include a detailed combined-arms army, or a fellowship of 9 + 1 pony.
    readonly MAX_GROUPS: number = 10;

    constructor(groups: Group[]) {
        this.groups = groups;
    }

    cost(): number {
        return Util.sum(this.groups.map((group) => group.cost()));
    }

    add(group: Group): void {
        this.groups.push(group);
    }

    json(): object {
        return {
            id: this.id,
            groups: this.groups.map((g) => g.json()),
        };
    }
}

/** Could rename to
 * Company
 * Army
 * Banner
 *
 * LATER Do we want to be able to model nested vehicle assignments?
 * Mechanized company
 * Airborne company
 * Spaceship fleet carrying smaller vehicles & infantry
 */
