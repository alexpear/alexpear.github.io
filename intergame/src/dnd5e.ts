import Context from './context';
import Creature from './creature';

export default class DnD5e extends Context {
    readonly id: string = 'dnd5e';

    salientProps(creature: Creature): Record<string, number | string> {
        return {}; // TODO
    }
}
