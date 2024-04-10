'use strict';

// Tools for estimating number of superpowered people per location.
// About the Parahumans fictional universe created by Wildbow.
// See src/capeMap.js for leaner funcs that deal with the front end rather than with the data file.
// See also - older funcs in alexpear.github.io/bottleWorld/worldPopGrid.js

import Util from '../../../util/util.js';

import FS from 'fs';
import { fromFile } from 'geotiff';
import JSONStream from 'JSONStream';
import { dirname } from 'path';
import Split from 'split';
import { fileURLToPath } from 'url';

// Using world population data from: https://hub.worldpop.org/geodata/summary?id=24777
// DOI : 10.5258/SOTON/WP00647

class CapePopulation {

    // Use await CapePopulation.new() instead of the constructor.
    // (Motive: async constructor seems awkward.)
    static async new () {
        const cp = new CapePopulation();

        // Util.logDebug(Object.getOwnPropertyNames(GeoTIFF));
        // Util.logDebug(Object.getOwnPropertyNames(GeoTIFF.prototype));

        // cp.file = await GeoTIFF.fromFile('/path/to/file.tif');

        Util.logDebug(`Now we call GeoTIFF fromFile()`);

        cp.__dirname = dirname(fileURLToPath(import.meta.url));

        cp.file = await fromFile(cp.__dirname + '/data/ppp_2020_1km_Aggregated.tif');

        Util.logDebug(`Now we call getImage()`);
        cp.tiff = await cp.file.getImage();
        Util.logDebug(`Done with getImage()`);

        // if (window) {
        //     const canvas = document.getElementById('canvas');
        //     window.ctx = canvas.getContext('2d');
        // }

        await cp.load();
        Util.logDebug(`Done with load()`);

        return cp;
    }

    // Returns array
    async dataAt(xPixel, yPixel) {
        return await this.tiff.readRasters(
            [
                xPixel,
                yPixel,
                xPixel + 1,
                yPixel + 1,
            ]
        );
    }

    /* Returns obj:
    {
        0: [array of length 808704000],
        length: 1,
        width: 43200,
        height: 18720,
    }
    */
    async load () {
        fs.createReadStream(this.__dirname + '/squareList.txt')
            .pipe(Split())
            .on('data', (line) => {
                // later
            });
    }

    equatorPixels () {
        const output = [];

        const y = Math.floor(this.rasterData.height / 2);

        for (let x = 0; x < this.rasterData.width; x++) {
            output.push(
                this.rasterData[0][ y * this.rasterData.width + x ]
            );
        }

        return output;
    }

    printPixel (pixelData) {
        Util.logDebug(`printPixel() top.`);
        Util.logDebug(`pixelData.length === ${pixelData.length}`);
        Util.logDebug({
            typeof: typeof pixelData,
            note: 'logging type',
        });
        Util.logDebug({
            props: Object.getOwnPropertyNames(pixelData),
            note: 'logging props',
        });
        // Util.logDebug({
        //     firstElement: pixelData[0],
        //     note: 'logging pixelData[0]',
        // });

        if (Util.isPrimitive(pixelData.height)) {
            Util.logDebug({ height: pixelData.height });
        }

        if (Util.isPrimitive(pixelData.width)) {
            Util.logDebug({ width: pixelData.width });
        }

        Util.logDebug({ typeofFieldZero: typeof pixelData[0] });

        Util.analyze(pixelData);

        const str = Util.stringify(pixelData[0].slice(0, 100));

        console.log(str);
    }

    printPixelArray (pixels) {
        const lines = [];
        let negativeStartedAt = Infinity;

        for (let i = 0; i < pixels.length; i++) {
            const pop = pixels[i];

            if (negativeStartedAt < i) { // If we are already in a negative sequence:

                if (pop >= -999) {
                    lines.push(`... blank from ${negativeStartedAt} to ${i - 1} ...`);
                    negativeStartedAt = Infinity;

                    lines.push(Util.round(pop));
                }
            }
            else if (pop < -999) {
                negativeStartedAt = i;
            }
            else {
                lines.push(Util.round(pop));
            }
        }

        const str = lines.join('\n');

        console.log(str);
    }

    subbox (x, y, width, height) {
        const box = [ [] ];
        let xInBox = 0;
        let yInBox = 0;

        Util.logDebug({
            box,
            xInBox,
            yInBox,
            x,
            y,
            width,
            height,
        });

        const start = y * this.rasterData.width + x;

        for (let i = start; i < start + width * height; i++) {

            box[yInBox].push( this.rasterData[0][i] );

            Util.logDebug({
                boxLength: box.length,
                xInBox,
                yInBox,
                i,
                x,
                y,
                width,
                height,
            });

            if (xInBox >= width) {
                box.push([]);
                yInBox++;
                xInBox = 0;
            }
            else {
                xInBox++;
            }
        }

        return box;
    }

    sampleBox () {
        const box = this.subbox(35520, 9320, 40, 40);

        Util.log(box);

        return box;
    }

    box2rgba (array2d) {
        const rgba = [];
        const MAX = 7000;

        for (let row of array2d) {
            for (let pop of row) {

                const colorVal = pop >= 0 ?
                    Math.floor(pop / 7000 * 255) :
                    0;

                rgba.push(colorVal);
                rgba.push(colorVal);
                rgba.push(colorVal);
                rgba.push(255);
            }
        }
    }

    // moved to src/ dir.
    // setHtml () {
    //     const imageData = window.ctx.getImageData(0, 0, 40, 40);

    //     imageData.data.set(
    //         new Uint8ClampedArray(
    //             this.box2rgba(
    //                 this.sampleBox()
    //             )
    //         )
    //     );

    //     window.ctx.putImageData(imageData, 0, 0);
    // }

    // "-1": 404,113,794,
    // "0":   82,478,570,
    // "1":   41,329,500,
    // "10":  12,093,033,
    // "100":  1,273,434,
    // "1000":    45,945,
    // "10000":       67,
    histogram () {
        const histo = {};
        const benchmarks = [-1, 0, 1, 10, 100, 1000, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];

        for (let square of this.rasterData[0]) {
            for (let bi = 0; bi < benchmarks.length; bi++) {
                const mark = benchmarks[bi];

                if (mark < square) {
                    // Once we reach a benchmark that surpasses the square, then we know the previous benchmark describes it.

                    const countsAsMark = (bi === 0) ?
                        benchmarks[0] : // Low negative case. Lump it together.
                        benchmarks[bi - 1];

                    if (histo[countsAsMark] === undefined) {
                        histo[countsAsMark] = 1;
                    }
                    else {
                        histo[countsAsMark]++;
                    }
                }
            }
        }

        Util.logDebug(histo);

        return histo;
    }

    printSimple () {
        for (let pop of this.rasterData[0]) {
            console.log(
                pop >= 0 ?
                    Util.round(pop) :
                    -1
            );
        }
    }

    static async run () {
        const cp = await CapePopulation.new();
        Util.logDebug(`Done with new().`);

        cp.printSimple();

        Util.logDebug(`Done with run()`);
    }
};

// module.exports = CapePopulation;

CapePopulation.run();
