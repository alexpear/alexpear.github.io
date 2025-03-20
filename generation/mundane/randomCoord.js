//

const Util = require('../../util/util.js');

class Coord {
    static defaultRange () {
        return [
            [32.5524542814877, -117.28082535322118],
            [32.9185202369451, -116.95985499422495],
            // [-90, -180],
            // [90, 180],
        ];
    }

    static random (cornerCoords) {
        cornerCoords = cornerCoords || Coord.defaultRange();

        return [
            Coord.randomBetween(cornerCoords[0][0], cornerCoords[1][0]),
            Coord.randomBetween(cornerCoords[0][1], cornerCoords[1][1]),
        ];
    }

    static randomBetween (a, b) {
        return Math.min(a, b) +
            Math.random() * Math.abs(a - b);
    }

    static print (array) {
        console.log(array.join(', '));
    }

    static run () {
        const coord = Coord.random();

        Coord.print(coord);
    }
}

Coord.run();
