'use strict';

module.exports = {
    infantry: {
        size: 1,
        moveInterval: 12,
        armor: 2,
        attack: 2
    },
    air: {
        sprite: 'A',
        moveInterval: 1,
        armor: 3,
        attack: 6
    },

    // TODO: range
    tower: {
        sprite: 'T',
        moveInterval: 9999,
        armor: 12,
        attack: 4
    },
    evangelion: {
        sprite: 'E',
        moveInterval: 12,
        armor: 12,
        attack: 6
    }
};
