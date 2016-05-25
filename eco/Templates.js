'use strict';

module.exports = {
    infantry: {
        name: 'infantry',
        size: 1,
        sprite: '?',
        moveInterval: 12,
        armor: 2,
        attack: 2,
        range: 1
    },
    air: {
        name: 'air',
        sprite: 'A',
        moveInterval: 1,
        armor: 3,
        attack: 6,
        range: 1
    },

    // TODO: range
    tower: {
        name: 'tower',
        sprite: 'T',
        moveInterval: 9999,
        armor: 12,
        attack: 4,
        range: 2
    },
    evangelion: {
        name: 'evangelion',
        sprite: 'E',
        moveInterval: 12,
        armor: 12,
        attack: 6,
        range: 1
    }
};
