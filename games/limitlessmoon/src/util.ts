// TODO move this to alexpear.github.io/util/. Make sure it gets compiled properly by each project that uses it.

export class Util {
    static randomBelow(maxExclusive: number): number {
        return Math.floor(Math.random() * maxExclusive);
    }

    static randomOf<T>(array: T[]): T {
        return array[Util.randomBelow(array.length)];
    }
}
