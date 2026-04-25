// A company is 1+ colocated Groups of the same Faction.

import { Group } from './group';
import { Util } from './util';

export class Company {
    groups: Group[] = [];

    constructor(groups: Group[]) {
        this.groups = groups;
    }

    cost(): number {
        return Util.sum(this.groups.map((group) => group.cost()));
    }

    add(group: Group): void {
        this.groups.push(group);
    }
}

/** Could rename to
 * Company
 * Army
 * Banner
 */
