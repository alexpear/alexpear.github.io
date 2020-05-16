const Chassis = module.exports = {
    interceptor: {
        cost: 2,
        size: 20,
        weight: 30000, // Later could do this in tonnes, not kg
        durability: 1, // Tempting to sync this with sp in other waffle systems
        slots: 4,
        bonus: [
            // Later could express init bonuses in terms of weight? Altho not for starbases.
            initiative: 2
        ],
        startingUpgrades: [
            'ionCannon',
            'fissionDrive',
            'fissionReactor'
        ]
    },
    cruiser: {
        cost: 4,
        size: 200,
        weight: 1000000,
        durability: 1,
        slots: 6,
        bonus: [
            initiative: 1
        ],
        startingUpgrades: [
            'ionCannon',
            'electronComputer',
            'hullArmor',
            'fissionDrive',
            'fissionReactor'
        ]
    },
    dreadnought: {
        cost: 7,
        size: 400,
        weight: 10000000,
        durability: 1,
        slots: 8,
        startingUpgrades: [
            'ionCannon',
            'ionCannon',
            'electronComputer',
            'hullArmor',
            'hullArmor',
            'fissionDrive',
            'fissionReactor'
        ]
    },
    starbase: {
        cost: 2,
        techsRequired: ['starbase'],
        size: 100,
        weight: 600000,
        durability: 1,
        slots: 5,
        bonus: [
            initiative: 4,
            power: 3
        ],
        startingUpgrades: [
            'ionCannon',
            'electronComputer',
            'hullArmor',
            'hullArmor'
        ],
        cantHave: ['impulse']
    },
    orbital: {
        cost: 3,
        size: 10000000,
        weight: 101000000000,
        durability: 10000
    },
    monolith: {
        cost: 8,
        size: 3,
        weight: 10000,
        durability: 100
    },
    corvette: {
        size: 8,
        weight: 1000,
        durability: 100
    },
    frigate: {
        size: 8,
        weight: 1000,
        durability: 100
    },
    carrier: {
        size: 8,
        weight: 1000,
        durability: 100
    }
};
