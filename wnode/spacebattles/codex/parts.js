const Parts = module.exports = {
    hull: {
        power: 0,
        weight: 1000,
        durability: 1
    },
    improvedHull: {
        power: 0,
        weight: 1000,
        durability: 2
    },
    ionCannon: {
        power: -1,
        // weight: 10,
        attack: {
            dice: 1,
            damage: 1
        }
    },
    plasmaCannon: {
        power: -2,
        attack: {
            dice: 1,
            damage: 2
        },
        techsRequired: ['this']
    },
    plasmaTurret: {
        power: -3,
        attack: {
            dice: 2,
            damage: 2
        },
        unique: true
    },
    plasmaMissile: {
        power: 1,
        attack: {
            missile: true,
            dice: 2,
            damage: 2
        },
        techsRequired: ['this']
    },
    solitonCannon: {
        power: -3,
        attack: {
            dice: 1,
            damage: 3
        },
        techsRequired: ['this'],
        rareTech: true
    },
    solitonTurret: {
        power: -2,
        attack: {
            dice: 2,
            damage: 3
        },
        initiative: -2,
        unique: true,
        nonCanon: true
    },
    solitonMissile: {
        power: 0,
        attack: {
            missile: true,
            dice: 1,
            damage: 3
        },
        initiative: 1,
        unique: true
    },
    antimatterCannon: {
        power: -4,
        attack: {
            dice: 1,
            damage: 4
        },
        techsRequired: ['this']
    },
    antimatterMissile: {
        power: 0,
        attack: {
            missile: true,
            dice: 1,
            damage: 4
        },
        unique: true
    },
    gaussShield: {
        power: 0,
        shieldPenalty: -1,
        techsRequired: ['this']
    },
    phaseShield: {
        power: 1,
        shieldPenalty: -2,
        techsRequired: ['this']
    },
    nuclearSource: {
        power: 3
    },
    fusionSource: {
        power: 6,
        techsRequired: ['this']
    },
    tachyonSource: {
        power: 9,
        techsRequired: ['this']
    },
    nuclearDrive: {
        power: -1,
        initiative: 1,
        travel: 1
    },
    fusionDrive: {
        power: -2,
        initiative: 2,
        travel: 2,
        techsRequired: ['this']
    },
    tachyonDrive: {
        power: -3,
        initiative: 3,
        travel: 3,
        techsRequired: ['this']
    },
    electronComputer: {
        power: 0,
        aiming: 1
    },
    positronComputer: {
        power: -1,
        aiming: 2,
        // Note, it seems the initiative bonus is absent from 2nd edition.
        initiative: 1,
        techsRequired: ['this']
    },
    gluonComputer: {
        power: -2,
        aiming: 3,
        initiative: 2,
        techsRequired: ['this']
    },

    // Unusual parts:
    ionTurret: {
        power: -1,
        attack: {
            dice: 2,
            damage: 1
        },
        unique: true
    },
    // riftCannon: {
    //     power: -1,
    //     attack: {
    //         dice: 1,
    //         rift: true
    //         // 1 ally damage
    //         // miss
    //         // miss
    //         // 1 damage
    //         // 2 damage
    //         // 3 damage, 1 ally damage
    //     },
    //     techsRequired: ['this']
    // },
    // riftTurret: {
    //     power: -1,
    //     attack: {
    //         dice: 2,
    //         rift: true
    //         // 1 ally damage
    //         // miss
    //         // miss
    //         // 1 damage
    //         // 2 damage
    //         // 3 damage, 1 ally damage
    //     },
    //     unique: true
    // },
    axionComputer: {
        power: 0,
        aiming: 3,
        initiative: 1,
        unique: true
    },
    fluxShield: {
        power: -2,
        shieldPenalty: -3,
        unique: true
    },
    absorptionShield: {
        power: 4,
        shieldPenalty: -1,
        techsRequired: ['this'],
        rareTech: true
    },
    inversionShield: {
        power: 2,
        shieldPenalty: -2,
        unique: true
    },
    conformalDrive: {
        power: -2,
        initiative: 2,
        travel: 4,
        unique: true
    },
    transitionDrive: {
        power: 0,
        travel: 3,
        initiative: -1,
        techsRequired: ['this'],
        rareTech: true
    },
    shardHull: {
        power: 0,
        durability: 3,
        unique: true
    },
    hypergridSource: {
        power: 11,
        unique: true
    },
    sentientHull: {
        power: 0,
        durability: 1,
        aiming: 1,
        techsRequired: ['this'],
        rareTech: true
    },
    conifoldField: {
        power: -2,
        durability: 3,
        techsRequired: ['this'],
        rareTech: true
    },
    interceptorBay: {
        power: -2,
        capacity: 2,
        durability: 1,
        techsRequired: ['this'],
        nonCanon: true
    },
    fluxMissile: {
        power: 0,
        attack: {
            missile: true,
            dice: 2,
            damage: 1
        },
        initiative: 2,
        techsRequired: ['this'],
        rareTech: true
    },
    zeroPointSource: {
        power: 12,
        techsRequired: ['this'],
        rareTech: true
    },
    jumpDrive: {
        power: -2,
        jump: true,
        techsRequired: ['this'],
        nonCanon: true
    },
    muonSource: {
        power: 2,
        initiative: 1,
        ignoreSlots: true,
        techsRequired: ['this'],
        unique: true
    },
    morphShield: {
        power: 0,
        shieldPenalty: -1,
        initiative: 2,
        regeneration: 1,
        techsRequired: ['this']
    },
    ionDisruptor: {
        power: 0,
        attack: {
            dice: 1,
            damage: 1
        },
        initiative: 3,
        techsRequired: ['this'],
        unique: true
    },




    // // Homebrew scratch
    // precisionCannon: {
    //     power: 0,
    //     weight: 1,
    //     techsRequired: [
            
    //     ]
    // },
    // decoyLauncher: {
    //     power: 0,
    //     weight: 1,
    //     techsRequired: [
            
    //     ]
    // },
    // antimatterDrive: {
    //     power: 0,
    //     weight: 1,
    //     techsRequired: [
            
    //     ]
    // },
    // inertialessDrive: {
    //     power: 0,
    //     weight: 1,
    //     techsRequired: [
            
    //     ]
    // },
    // deflectorShield: {
    //     power: 0,
    //     weight: 1,
    //     techsRequired: [
            
    //     ]
    // },
    // slipspaceDrive: {
    //     power: 0,
    //     weight: 1,
    //     techsRequired: [
            
    //     ]
    // },
    // reasonerMatrix: {
    //     power: 0,
    //     weight: 1,
    //     techsRequired: [
            
    //     ]
    // },
    // stealthPlating: {
    //     power: 0,
    //     weight: 1,
    //     techsRequired: [
            
    //     ]
    // },
    // tacticalIonEngine: {
    //     power: 0,
    //     weight: 1,
    //     techsRequired: [
            
    //     ]
    // },
    // cockpit: {
    //     power: -1,
    //     aiming: 1,
    //     initiative: 2,
    //     techsRequired: [
    //         'lifeSupport'
    //     ]
    //     // sensors: 3,
    //     // comms: 2,
    // },
    // // I guess their cargo makes this fill a whole slot? Not sure.
    // eccentricGenius: {
    //     power: 0,
    //     aiming: 1,
    //     initiative: 1,
    //     unique: true,
    //     techsRequired: [
    //         'lifeSupport'
    //     ]
    // }

};
