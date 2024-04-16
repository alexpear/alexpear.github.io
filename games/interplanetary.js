'use strict';

// Software tools for designing the Interplanetary board game.

const Util = require('../util/util.js');

class Interplanetary {
    constructor () {
        Interplanetary.setup();
    }

    static setup () {
        for (let name in Interplanetary.LOCATIONS) {
            const body = Interplanetary.LOCATIONS[name];

            if (body.moons) {
                for (let moonName in body.moons) {
                    const moon = body.moons[moonName];

                    moon.solDist = body.solDist;
                }
            }
        }
    }

    static run () {

    }
}

Interplanetary.LOCATIONS = {
    mercury: {
        solDist: 1,
        gravity: 4,
    },
    // 'mercuryOrbit' is how we represent the orbit of mercury.
    venus: {
        solDist: 2,
        gravity: 5,
    },
    earth: {
        solDist: 3,
        gravity: 5,
        moons: {
            luna: {
                gravity: 1,
            },
        },
    },
    mars: {
        solDist: 4,
        gravity: 2,
        moons: {
            phobos: {
                gravity: 0,
            },
            deimos: {
                gravity: 0,
            },
        },
    },
    vesta: {
        solDist: 5,
        gravity: 2,
    },
    ceres: {
        solDist: 5,
        gravity: 2,
    },
    jupiter: {
        solDist: 6,
        gravity: 20,
        moons: {
            io: {
                gravity: 3,
            },
            europa: {
                gravity: 3,
            },
            ganymede: {
                gravity: 3,
            },
            callisto: {
                gravity: 3,
            },
        },
    },
    saturn: {
        solDist: 7,
        gravity: 12,
        moons: {
            rhea: {
                gravity: 2,
            },
            titan: {
                gravity: 4,
            },
        },
    },
    uranus: {
        solDist: 8,
        gravity: 9,
        moons: {
            titania: {
                gravity: 1,
            },
            oberon: {
                gravity: 1,
            }
        },
    },
    neptune: {
        solDist: 9,
        gravity: 9,
        moons: {
            triton: {
                gravity: 1,
            },
        },
    },
    pluto: {
        solDist: 10,
        gravity: 2,
    },
    eris: {
        solDist: 11,
        gravity: 1,
    },
    sedna: {
        solDist: 30,
        gravity: 1,
    },
};

Interplanetary.ACTION = Util.makeEnum([
    'work',
    'buy',
    'burn',
    'look'
]);

Interplanetary.PIECE = Util.makeEnum([
    'fuel',
    'missionCard',
    'robot',
    'astronaut',
    'telescope',
    'station',
    'elevator',
    'traitCard',
]);

Interplanetary.SHOP = {
    Robot: 1,
    Astronaut: 2,
    Telescope: 2,
    Station: 4,
    Elevator: 10,
    Tech: '?',
    Card: '?',
};

class Player {
    constructor () {
        this.launchpad = []; // array of pieces. Excludes fuel.
        this.launchpadFuel = 0;
        this.hq = 1;
        this.techLevel = 4;
        this.missionCards = [];
    }

    planAction () {

    }

    work () {

    }

    buy (thing) {

    }

    burn (action) {

    }

    look (action) {

    }

}

class MissionCard {
    constructor () {
    // this.number = 1
    // this.location = 'earth'
        this.pieces = [];
        this.fuel = 0;
    }

    stations () {
        return this.pieces.filter(
            piece => piece === Interplanetary.PIECE.Station
        ).length;
    }


}

Interplanetary.run();
