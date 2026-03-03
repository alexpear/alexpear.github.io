// Browser-compatible subset of devzone/util.js
class Util {
    static exists(x) {
        return x !== undefined &&
            x !== null &&
            x !== '' &&
            !Number.isNaN(x);
    }
    static randomIntBetween(minInclusive, maxExclusive) {
        if (!Util.exists(minInclusive) || !Util.exists(maxExclusive)) {
            throw new Error(`Util.randomIntBetween() called with missing parameters: max ${maxExclusive}, min ${minInclusive}`);
        }
        else if (maxExclusive <= minInclusive) {
            throw new Error(`Util.randomIntBetween() called with max <= min: max ${maxExclusive}, min ${minInclusive}`);
        }
        return Math.floor(Math.random() * (maxExclusive - minInclusive) + minInclusive);
    }
    static randomBelow(maxExclusive) {
        return Math.floor(Math.random() * maxExclusive);
    }
    static randomOf(array) {
        return array[Util.randomBelow(array.length)];
    }
    // decimalPlaces is optional and defaults to 0.
    static randomRange(minInclusive, maxExclusive, decimalPlaces) {
        if (maxExclusive < minInclusive) {
            const temp = minInclusive;
            minInclusive = maxExclusive;
            maxExclusive = temp;
        }
        const unrounded = (Math.random() * (maxExclusive - minInclusive)) + minInclusive;
        const factor = Math.pow(10, decimalPlaces || 0);
        return Math.round(unrounded * factor) / factor;
    }
    static log(input) {
        const info = typeof input === 'string'
            ? input
            : JSON.stringify(input, undefined, '    ');
        console.log(info);
    }
}
