// TODO move this to alexpear.github.io/util/. Make sure it gets compiled properly by each project that uses it.

export class Util {
    // Note that typeof NaN is also 'number',
    // but it is still despicable.
    static isNumber (x: unknown): boolean {
        return typeof x === 'number' &&
            ! Util.isNaN(x);
    }

    static isString (x: unknown): boolean {
        return typeof x === 'string';
    }

    static isNaN (x: unknown): boolean {
        return Number.isNaN(x);
    }

    static isObject (x: unknown): boolean {
        return typeof x === 'object' &&
            x !== null;
    }

    static isFunction (x: unknown): boolean {
        return typeof x === 'function';
    }

    static isArray (x: unknown): boolean {
        // Later make this more sophisticated, or use a library.
        return x &&
            x['length'] &&
            typeof x.length === 'number' &&
            ! Util.isString(x) &&
            x.length >= 0 &&
            (x.length === 0 || x[0] !== undefined);
    }

    static isPrimitive (x: unknown): boolean {
        if (x === undefined || x === null) {
            return true;
        }

        return [
            'boolean',
            'symbol',
            'bigint',
            'number',
            'string',
        ].includes(
            typeof x
        );
    }

    static array<T> (x: T | T[]): T[] {
        return (Util.isArray(x) ? x : [x]) as T[];
    }

    // Default 0
    static sum (array: number[]): number {
        return Util.array(array).reduce(
            (sumSoFar, element) => {
                const n = Number(element) || 0;
                return sumSoFar + n;
            },
            0
        );
    }

    static randomBelow(maxExclusive: number): number {
        return Math.floor(Math.random() * maxExclusive);
    }

    static randomOf<T>(array: T[]): T {
        return array[Util.randomBelow(array.length)];
    }
}
