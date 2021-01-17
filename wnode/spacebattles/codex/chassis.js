const Chassis = module.exports = {
    interceptor: {
        name: 'interceptor',
        cost: 2,
        size: 20,
        weight: 30000, // Later could do this in tonnes, not kg
        durability: 1, // Tempting to sync this with sp in other waffle systems
        slots: 4,
        bonus: {
            // Later could express init bonuses in terms of weight? Altho not for starbases.
            initiative: 2
        },
        startingUpgrades: [
            'ionCannon',
            'nuclearDrive',
            'nuclearSource'
        ]
    },
    cruiser: {
        name: 'cruiser',
        cost: 4,
        size: 200,
        weight: 1000000,
        durability: 1,
        slots: 6,
        bonus: {
            initiative: 1
        },
        startingUpgrades: [
            'ionCannon',
            'electronComputer',
            'hull',
            'nuclearDrive',
            'nuclearSource'
        ]
    },
    dreadnought: {
        name: 'dreadnought',
        cost: 7,
        size: 400,
        weight: 10000000,
        durability: 1,
        slots: 8,
        startingUpgrades: [
            'ionCannon',
            'ionCannon',
            'electronComputer',
            'hull',
            'hull',
            'nuclearDrive',
            'nuclearSource'
        ]
    },
    starbase: {
        name: 'starbase',
        cost: 2,
        techsRequired: ['starbase'],
        size: 100,
        weight: 600000,
        durability: 1,
        slots: 5,
        bonus: {
            initiative: 4,
            power: 3
        },
        startingUpgrades: [
            'ionCannon',
            'electronComputer',
            'hull',
            'hull'
        ],
        cantHave: ['impulse']
    },
    deathmoon: {
        name: 'deathmoon',
        cost: 4,
        techsRequired: ['starbase'],
        size: 100,
        weight: 600000,
        durability: 1,
        slots: 6,
        bonus: {
            durability: 2
        },
        startingUpgrades: [
            'ionCannon',
            'antimatterCannon',
            'electronComputer',
            'hull',
            'nuclearSource',
            'nuclearDrive'
        ],
        cantHave: ['impulse']
    },
    orbital: {
        name: 'orbital',
        cost: 3,
        size: 10000000,
        weight: 101000000000,
        durability: 10000
    },
    monolith: {
        name: 'monolith',
        cost: 8,
        size: 3,
        weight: 10000,
        durability: 100
    },
    ancient: {
        name: 'ancient',
        durability: 2,
        slots: 0,
        bonus: {
            initiative: 2,
            aiming: 1,
            attacks: [
                {
                    dice: 2,
                    damage: 1
                }
            ]
        }
    },
    advancedAncient: {
        name: 'advancedAncient',
        durability: 3,
        slots: 0,
        bonus: {
            initiative: 1,
            aiming: 1,
            attacks: [
                {
                    dice: 1,
                    damage: 2
                }
            ]
        }
    },
    guardian: {
        name: 'guardian',
        durability: 3,
        slots: 0,
        bonus: {
            initiative: 3,
            aiming: 2,
            attacks: [
                {
                    dice: 3,
                    damage: 1
                }
            ]
        }
    },

    advancedGuardian: {
        name: 'advancedGuardian',
        durability: 4,
        slots: 0,
        bonus: {
            initiative: 1,
            aiming: 1,
            attacks: [
                {
                    dice: 2,
                    damage: 2,
                    missile: true
                },
                {
                    dice: 1,
                    damage: 4
                }
            ]
        }
    },
    gcds: {
        name: 'gcds',
        durability: 8,
        slots: 0,
        bonus: {
            aiming: 2,
            attacks: [
                {
                    dice: 1,
                    damage: 4
                }
            ]
        }
    },
    advancedGcds: {
        name: 'advancedGcds',
        durability: 4,
        slots: 0,
        bonus: {
            initiative: 2,
            aiming: 2,
            attacks: [
                {
                    dice: 4,
                    damage: 1,
                    missile: true
                },
                {
                    dice: 1,
                    damage: 4
                }
            ]
        }
    },

    // Homebrew concepts
    // corvette: {
    //     name: 'corvette',
    //     size: 8,
    //     weight: 1000,
    //     durability: 100
    // },
    // frigate: {
    //     name: 'frigate',
    //     size: 8,
    //     weight: 1000,
    //     durability: 100
    // },
    // carrier: {
    //     name: 'carrier',
    //     size: 8,
    //     weight: 1000,
    //     durability: 100
    // }
};
