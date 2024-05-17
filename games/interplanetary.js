'use strict';

// Software tools for designing the Interplanetary board game.

const Util = require('../util/util.js');

class Interplanetary {
    constructor () {
        Interplanetary.staticSetup();

        const p1 = new Player();
        p1.number = 1;
        this.players = [p1];
    }

    // Add properties to LOCATIONS obj.
    static staticSetup () {
        for (let name in Interplanetary.LOCATIONS) {
            if (name.endsWith('Orbit')) { continue; }

            const body = Interplanetary.LOCATIONS[name];

            body.name = name;

            if (body.moonOf) {
                const parent = Interplanetary.LOCATIONS[body.moonOf];

                body.solDist = parent.solDist;
            }

            // Add the corresponding orbital zone location.
            Interplanetary.LOCATIONS[ name + 'Orbit' ] = {
                name: name + 'Orbit',
                solDist: body.solDist,
            };
        }
    }

    gamestateStr () {
        const locs = this.locationSummaries();

        // LATER make each summary more pretty.

        return locs.join('\n');
    }

    locationSummaries () {
        // for (let name in Interplanetary.LOCATIONS) {
        //     const body = Interplanetary.LOCATIONS[name];
        // }

        const summaries = [];

        for (let player of this.players) {
            for (let mission of player.missionCards) {
                const existingSummary = summaries.find(s => s.locationName === mission.locationName);

                if (existingSummary) {

                }
                else {
                    summaries.push({
                        locationName: mission.locationName,

                    });
                }
            }
        }
    }

    static run () {
        const game = new Interplanetary();
    }
}

Interplanetary.LOCATIONS = {
    Mercury: {
        solDist: 1,
        gravity: 4,
    },
    // 'MercuryOrbit' is how we construct the name of the orbit zone of Mercury.
    Venus: {
        solDist: 2,
        gravity: 5,
    },
    Earth: {
        solDist: 3,
        gravity: 5,
        moons: ['Luna'],
    },
    Mars: {
        solDist: 4,
        gravity: 2,
        moons: ['Deimos', 'Phobos'],
    },
    Vesta: {
        solDist: 5,
        gravity: 2,
    },
    Ceres: {
        solDist: 5,
        gravity: 2,
    },
    Jupiter: {
        solDist: 6,
        gravity: 20,
        moons: ['Io', 'Europa', 'Ganymede', 'Callisto'],
    },
    Saturn: {
        solDist: 7,
        gravity: 12,
        moons: ['Rhea', 'Titan'],
    },
    Uranus: {
        solDist: 8,
        gravity: 9,
        moons: ['Titania', 'Oberon'],
    },
    Neptune: {
        solDist: 9,
        gravity: 9,
        moons: ['Triton'],
    },
    Pluto: {
        solDist: 10,
        gravity: 2,
    },
    Eris: {
        solDist: 11,
        gravity: 1,
    },
    // ...
    Sedna: {
        solDist: 30,
        gravity: 1,
    },

    // moons:
    Luna: {
        moonOf: 'Earth',
        gravity: 1,
    },
    Deimos: {
        moonOf: 'Mars',
        gravity: 0,
    },
    Phobos: {
        moonOf: 'Mars',
        gravity: 0,
    },
    Io: {
        moonOf: 'Jupiter',
        gravity: 3,
    },
    Europa: {
        moonOf: 'Jupiter',
        gravity: 3,
    },
    Ganymede: {
        moonOf: 'Jupiter',
        gravity: 3,
    },
    Callisto: {
        moonOf: 'Jupiter',
        gravity: 3,
    },
    Rhea: {
        moonOf: 'Saturn',
        gravity: 2,
    },
    Titan: {
        moonOf: 'Saturn',
        gravity: 4,
    },
    Titania: {
        moonOf: 'Uranus',
        gravity: 1,
    },
    Oberon: {
        moonOf: 'Uranus',
        gravity: 1,
    },
    Triton: {
        moonOf: 'Neptune',
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
    'fire',
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
        this.gainEarthIncome(this.hq);

        for (let mission of this.missionCards) {
            // LATER - a Fire prevents production.

            if (mission.location === 'Earth') { continue; }

            const stations = mission.stations();

            if (mission.isOrbiting()) {
                this.gainEarthIncome(stations);
            }
            else {
                mission.fuel += this.incomeFromLocation(stations);
            }
        }
    }

    gainEarthIncome (stationCount) {
        this.launchpadFuel += this.incomeFromLocation(stationCount);
    }

    incomeFromLocation (stationCount) {
        return Math.min(
            stationCount,
            this.techLevel
        );
    }

    buy (name) {
        const price = Interplanetary.SHOP[name];

        if (this.launchpadFuel >= price) {
            this.launchpadFuel -= price;
            this.launchpad.push(name);
        }
        else {
            Util.logError(`Cannot buy a ${name} when you only have ${this.launchpadFuel} fuel on Earth.`);
        }
    }

    burn (action) {

    }

    look (action) {

    }
}

class Action {
    // this.type = 'Burn'
    // this.targetLocation = 'MarsOrbit'
    // this.mission = <MissionCard>
}

class MissionCard {
    constructor () {
    // this.number = 1
    // this.locationName = 'Earth'
        this.pieces = [];
        this.fuel = 0;
    }

    stations () {
        const count = this.pieces.filter(
            piece => piece === Interplanetary.PIECE.Station
        ).length;

        if (! (count >= 0)) {
            throw new Error({
                this,
                count,
            });
        }

        return count;
    }

    isOrbiting () {
        return this.locationName?.endsWith('Orbit');
    }

    // Returns the location obj this mission is at or is orbiting.
    closestPlanetoid () {
        const planetoidName = this.isOrbiting() ?
            // 5 is the length of the string 'Orbit'
            this.locationName.slice(0, -5) :
            this.locationName;

        return Interplanetary.LOCATIONS[planetoidName];
    }

    solDist () {
        if (! this.locationName) {
            throw new Error(`MissionCard has no .locationName prop.`);
        }

        return this.closestPlanetoid().solDist;
    }
}

Interplanetary.run();
