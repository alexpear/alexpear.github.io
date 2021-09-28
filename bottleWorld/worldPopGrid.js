'use strict';

// Utils for a dataset of world population
// Grid of 30 arcsecond squares
// http://sedac.ciesin.columbia.edu/data/set/gpw-v4-population-count-rev11

// Original format:
// 8 files, each 1/8 of the Earth's surface
// 7 header metadata lines
// Then 10800 lines (\n-delimited) of 10800 numbers (space-separated)
// The cells are 30 arcseconds wide
// -9999 represents blank
// The numbers are a estimate of the number of people in that trapezoidal cell
// There are way too many decimal places, but whatever.

const FS = require('fs');

class WorldPopGrid {
    constructor () {

    }

    load () {
        const rawStr = FS.readFileSync('./data/unpopgrid/' +
            'gpw_v4_population_count_adjusted_to_2015_unwpp_country_totals_rev11_2020_30_sec_' +
            '1' +
            '.asc',
            'utf8');

        const lines = rawStr.split('\n');
        console.log('lines length: ' + lines.length);

        const firstLineParts = lines[0].split(' ');
        const cols = firstLineParts[firstLineParts.length - 1];
        console.log('cols value: ' + cols);

        const dataStr = lines[6];
        const cells = dataStr.split(' ');
        console.log('cells length: ' + cells.length);

        // for (let r = 5000; r < 5100; r++) {
        //     const cells = lines[r].split(' ');

        //     const max = Math.max(...cells);
        //     // console.log(`line ${r} has ${cells.length} cells, & max ${max}`);
        // }
    }

    // Returns 2d array of pixels
    // lat & long refer to upper left corner of focus rectangle.
    focusOn (lat, long, arcSecPerPixel) {

    }

    toCoordinates (eighth, row, col) {

    }

    static run () {
        const g = new WorldPopGrid();
        g.load();
    }
}

module.exports = WorldPopGrid;

WorldPopGrid.run();
