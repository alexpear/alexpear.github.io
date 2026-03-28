// A fictional creature or character, in Intergame format.

import Concept from './concept';

export default class Creature extends Concept {
    type(): string {
        return 'creature';
    }
}
