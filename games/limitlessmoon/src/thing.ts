// A Thing is any character or physical object in the game world.

import { Util } from './util';

export class Thing {
    id: string = Util.uuid();

    json(): object {
        return {
            id: this.id,
        };
    }
}
