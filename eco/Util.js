'use strict';

var DEFAULTS = exports.DEFAULTS = {
    ROWCOUNT: 12,
    COLCOUNT: 12
};

var NODE_TYPES = exports.NODE_TYPES = {
    region: 'region',
    location: 'location'  // deprecated
};

Util.randomIntBetween = function (minInclusive, maxExclusive) {
    if (!minInclusive || !maxExclusive) {
        console.log('error: Util.randomIntBetween() called with missing parameters.');
        return -1;
    } else if (maxExclusive <= minInclusive) {
        console.log('error: Util.randomIntBetween() called with max <= min.');
        return -1;
    }

    return Math.floor( Math.random() * (maxExclusive - minInclusive) + minInclusive );
};

Util.randomUpTo = function (maxInclusive) {
    return Util.randomIntBetween(0, maxInclusive - 1);
};

Util.randomOf = function (array) {
    var index = Math.floor(Math.random() * array.length);
    return array[index];
};
