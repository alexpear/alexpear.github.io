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
    },
    human: {
        name: 'human',
        sprite: 'h',
        moveInterval: 12,
        armor: 2,
        attack: 2,
        range: 1,
        canCreate: {
            'settlement': 0.01
        }
    },
    settlement: {
        name: 'settlement',
        sprite: 'H',
        moveInterval: null,
        armor: 12,
        attack: 4,
        range: 1,
        canCreate: {
            'human': 0.02
        }
    }
};
