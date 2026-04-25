// TODO move this to alexpear.github.io/util/. Make sure it gets compiled properly by each project that uses it.

export class Util {
    // Note that typeof NaN is also 'number',
    // but it is still despicable.
    static isNumber(x: unknown): boolean {
        return typeof x === 'number' && !Util.isNaN(x);
    }

    static isString(x: unknown): boolean {
        return typeof x === 'string';
    }

    static isNaN(x: unknown): boolean {
        return Number.isNaN(x);
    }

    static isObject(x: unknown): boolean {
        return typeof x === 'object' && x !== null;
    }

    static isFunction(x: unknown): boolean {
        return typeof x === 'function';
    }

    static isPrimitive(x: unknown): boolean {
        if (x === undefined || x === null) {
            return true;
        }

        return ['boolean', 'symbol', 'bigint', 'number', 'string'].includes(
            typeof x,
        );
    }

    static array<T>(x: T | T[]): T[] {
        return Array.isArray(x) ? x : [x];
    }

    static exists(x: unknown): boolean {
        return x !== undefined && x !== null && x !== '' && !Util.isNaN(x);
    }

    // Default 0
    static sum(array: number[]): number {
        return Util.array(array).reduce((sumSoFar, element) => {
            const n = Number(element) || 0;
            return sumSoFar + n;
        }, 0);
    }

    static randomBelow(maxExclusive: number): number {
        return Math.floor(Math.random() * maxExclusive);
    }

    static randomOf<T>(array: T[]): T {
        return array[Util.randomBelow(array.length)];
    }

    static randomIntBetween(
        minInclusive: number,
        maxExclusive: number,
    ): number {
        if (!Util.exists(minInclusive) || !Util.exists(maxExclusive)) {
            console.log(
                'error: Util.randomIntBetween() called with missing parameters.',
            );
            throw new Error(`max ${maxExclusive}, min ${minInclusive}`);
        } else if (maxExclusive <= minInclusive) {
            console.log(
                'error: Util.randomIntBetween() called with max <= min.',
            );
            throw new Error(`max ${maxExclusive}, min ${minInclusive}`);
        }

        return Math.floor(
            Math.random() * (maxExclusive - minInclusive) + minInclusive,
        );
    }
}
