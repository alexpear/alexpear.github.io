const Parts = module.exports = {
    hullArmor: {
        power: 0,
        weight: 1000,
        durability: 1
    },
    improvedHullArmor: {
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
        }
        techsRequired: ['this']
    },
    plasmaMissile: {
        power: 0,
        attack: {
            missile: true,
            dice: 2,
            damage: 2
        }
        techsRequired: ['this']
    },
    antimatterCannon: {
        power: -4,
        attack: {
            dice: 1,
            damage: 4
        }
        techsRequired: ['this']
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
    fissionReactor: {
        power: 3
    },
    fusionReactor: {
        power: 6,
        techsRequired: ['this']
    },
    tachyonReactor: {
        power: 9,
        techsRequired: ['this']
    },
    fissionDrive: {
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
        }
        techsRequired: ['this']
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
    // fusionReactor: {
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
    // zeroPointReactor: {
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
    //     power: 10,
    //     weight: 1000,
    //     sensors: 3,
    //     comms: 10,
    //     processing: 3,
    //     techsRequired: [
    //         'lifeSupport'
    //     ]
    // }

};
