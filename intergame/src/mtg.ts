import Context from './context';
import Creature from './creature';

export default class MtG extends Context {
    readonly id: string = 'mtg';

    salientProps(creature: Creature): Record<string, number | string> {
        return {}; // TODO
    }
}
