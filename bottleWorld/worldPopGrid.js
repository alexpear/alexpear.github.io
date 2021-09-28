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
// A final \n ends the file

const FS = require('fs');

class WorldPopGrid {
    constructor () {
        this.grid = [];
    }

    loadRaw () {
        const eighthGrids = [];

        for (let i = 0; i < 4; i++) {
            eighthGrids.push(this.loadEighth(i + 1));
        }

        this.loadHemisphere(eighthGrids);

        for (let i = 4; i < 8; i++) {
            eighthGrids.push(this.loadEighth(i + 1));
        }

        this.loadHemisphere(eighthGrids);
    }

    // returns number[][]
    loadEighth (n) {
        const raw = FS.readFileSync(
            './data/unpopgrid/gpw_v4_population_count_adjusted_to_2015_unwpp_country_totals_rev11_2020_30_sec_' +
                n +
                '.asc',
            'utf8'
        );

        console.log(`Loaded raw file ${n}`);

        const lines = raw.split('\n')
            .slice(7);

        let debugCount = 1;

        return lines.map(
            line => {
                console.log(`line ${debugCount}`);
                debugCount++;

                return line.split(' ')
                    .map(Number);
            }
        );
    }

    loadHemisphere (eighthGrids) {
        // const lineSets = hemisphereRaws.map(
        //     eighth => eighth.split('\n')
        //         .slice(7)
        // );

        for (let r = 0; r < 10800; r++) {
            console.log(`Loading ${r}...`);

            const fourLines = eighthGrids.map(
                set => set[r]
            );

            this.grid.push(
                fourLines.reduce(
                    (outLine, eighthLine) => outLine.concat(eighthLine),
                    []
                )
            );
        }
    }

    // Returns 2d array of pixels
    // lat & long refer to upper left corner of focus rectangle.
    focusOn (lat, long, arcSecPerPixel) {

    }

    toCoordinates (eighth, row, col) {

    }

    static run () {
        const g = new WorldPopGrid();
        g.loadRaw();

        console.log(`${g.grid.length} rows & ${g.grid[0].length} cols`);
    }
}

module.exports = WorldPopGrid;

WorldPopGrid.run();
