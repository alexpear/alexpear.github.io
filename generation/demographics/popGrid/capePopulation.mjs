'use strict';

import exp from 'constants';
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

        // Separate attempt: Read from .txt file instead
        await cp.load();
        Util.logDebug(`Done with load()`);

        cp.oddities = [];
        SquareNode.cp = cp;

        return cp;
    }

    // Returns array
    async dataAt (xPixel, yPixel, squareWidth = 1) {
        return await this.tiff.readRasters({
            window: [
                xPixel,
                yPixel,
                xPixel + squareWidth,
                yPixel + squareWidth,
            ]
        });
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
        FS.createReadStream(this.__dirname + '/squareList.txt')
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
        // BUG: rasterData never initialized.
        for (let pop of this.rasterData[0]) {
            console.log(
                pop >= 0 ?
                    Util.round(pop) :
                    -1
            );
        }
    }

    async odditiesTreeMap (rate, name) {
        this.rate = rate;

        // 2^16 > width
        SquareNode.MAX_RES = Math.pow(2, 16);
        this.root = new SquareNode(0, 0, SquareNode.MAX_RES);
        await this.root.visit();

        Util.log({
            oddities: this.oddities,
            name,
        });
    }

    // NOTE: Currently takes 5 minutes ish to run. Each square has a chance of a oddity; neighbors not considered.
    async randomOdditiesVegas (rate, name) {
        const noun = name ? 
            ` ${name}` : 
            ``;

        const width = this.tiff.getWidth();
        const height = this.tiff.getHeight();
        // width: 43200, height: 18720

        const raster = await this.tiff.readRasters(); // LATER store in class variable. Slow step.

        Util.logDebug({
            context: `randomOdditiesVegas() after readRasters()`,
        });

        for (let y = 0; y < height; y++) {
            // Util.logDebug({
            //     context: `randomOdditiesVegas() in y loop`,
            //     y,
            // });

            for (let x = 0; x < width; x++) {
                const index = y * width + x; // generated logic - converts y into a further portion of the flattened array, all in raster[0].
                const value = raster[0][index];

                if (! (value > 0)) {
                    continue;
                }

                const expectedQuantity = value / rate;
                const remainder = expectedQuantity % 1;
                const randomized = Math.random() < remainder ? 
                    1 : 
                    0;
                const quantity = Math.floor(expectedQuantity) + randomized;

                if (quantity <= 0) {
                    continue;
                }

                const lat = y / height * -180 + 90;
                const lon = x / width * 360 - 180;

                console.log(`${quantity}${noun} at ${lat}, ${lon}`);
            }
        }
    }

    static async run () {
        const cp = await CapePopulation.new();
        Util.logDebug(`Done with new().`);

        // await cp.randomOdditiesVegas(71_012_000, 'wizard schools');
        await cp.odditiesTreeMap(71_012_000, 'wizard schools');

        // cp.printSimple();

        Util.logDebug(`Done with run()`);
    }
};

class SquareNode {
    // X & Y refer to tiff pixels.
    constructor (leftX, topY, width) {
        this.leftX = leftX;
        this.topY = topY;
        this.width = width;
        // this.population = undefined;
        this.children = [];
    }

    // Returns a random subsquare with unknown population, or undefined if there are no unknown subsquares.
    getRandomMysteriousSubsquare () {
        if (this.width === 1) {
            return; // Can't zoom in more.
        }

        if (this.children.length === 0) {
            const childWidth = this.width / 2;

            this.children = [
                new SquareNode(this.leftX, this.topY, childWidth),
                new SquareNode(this.leftX + childWidth, this.topY, childWidth),
                new SquareNode(this.leftX, this.topY + childWidth, childWidth),
                new SquareNode(this.leftX + childWidth, this.topY + childWidth, childWidth),
            ];
        }

        const indices = Util.shuffle([0, 1, 2, 3]);

        for (const i of indices) {
            const subsquare = this.children[i];

            if (subsquare.population === undefined) {
                return subsquare;
            }
        }

        return;
    }

    // Try to convert population to oddities
    // Tempted to have this be a nonrecursive alg - singlethreaded etc
    // Possible outcomes: Need to examine a specific mysterious subsquare first, or found N oddities. 
    // Rename func to getOddities()? I suppose that sounds recursive... perhaps that is the way to go?
    // Let's avoid recursive. Singlethreaded. Output oddities to a global .oddities field. Static? SquareNode.cp.oddities
    async visit () {
        Util.logDebug({
            leftX: this.leftX,
            topY: this.topY,
            width: this.width,
            population: this.population,
            childrenLength: this.children.length,
        });

        if (this.width === 1) {
            if (this.population === undefined) {
                const rasters = await SquareNode.cp.dataAt(
                    this.leftX,
                    this.topY,
                    1,
                );

                Util.logDebug({ rasters, });

                this.population = rasters[0][0];
            }

            if (this.population >= this.cp.rate) {
                this.placeOddities(
                    this.leftX,
                    this.topY,
                    Math.floor(this.population / this.cp.rate),
                );
            }

            return;
        }

        let mysteriousSubsquare = this.getRandomMysteriousSubsquare();

        while (mysteriousSubsquare) {
            await mysteriousSubsquare.visit();

            mysteriousSubsquare = this.getRandomMysteriousSubsquare();
        }

        // TODO NEXT cut recount - we will keep this.population up to date as we go.
        this.population = 0; // Recount, because child visits may have partially converted child populations to oddities.

        for (const child of this.children) {
            if (child.population === undefined) {
                Util.error({
                    message: `Child population is undefined`,
                    child,
                });
            }

            this.population += child.population; // well, if we dont trust .population fields, we might need to look deeper than 1 level down during the recount, right?
        }

        if (this.population < this.cp.rate) {
            if (this.width < SquareNode.MAX_RES) {
                return; // Not enough population in this square; deal with it at lower res.
            }

            // TODO add the final oddity at global res. Reuse part or all of placeOddities - note that we have to force it to round up to 1 oddity.
            // Or could move that to the top-level func, after the root.visit() call.
            return;
        }

        // add oddities
        // start weighted across all 4 children, but decrement pop of whichever child we land in. 
        // Do we need to decrement pop at all lower resolutions?
        // Tempting not to; would rather forget about low res squarenodes forever after they have defined populations.
        // but OBSTACLE - the lower res data could usefully guide us in placing oddities.
        
        // If we decrement, is it easier to decrement all descendants upon each new oddity, or to always check your children rather than trusting your .population value?
        // Well, the 2nd option kindof obviates caching in general. So only leaves would need .population values.
        // And when you place oddities, it's kindof like decrementing the 1-width square and its _ancestors_, not descendants.
        // So cache population on nonleaves or not?
        // I think do cache it & keep it up to date. At least with magic schools, there will be far fewer oddities than pop-reads.
        this.placeOddities();
    }

    placeOddities () {
        const quantity = Math.floor(this.population / this.cp.rate) || 1;

        for (let i = 0; i < quantity; i++) {

        }

        // TODO place oddities in random coords within this square. Decrement this.population.
        
        // Hmm: Will need a parent pointer etc to decrement .population of ancestors.
        // Well, could instead call SquareNode.root.updatePop(-1_000_000, 51, 33), which will traverse down & update all nodes that encompass pixel (51, 33). Or .decreasePop(1_000_000, ...) etc, which is simpler than a negative parameter.

        // Maybe start with visual diagram... 

        // LATER might reuse part or all of this func for squares of width > 1 too. 
        // TODO In that case it will recurse, sometimes into squares that have population less than .rate. In these cases, will need to decrement the overflow into sibling squares, to add up to 1. Probably divide this overflow half & half into the 2 orthoganal siblings, then if there is more, the rest into the diagonal sibling.

        // GENERATED unproofread:
        // const lat = y / this.cp.tiff.getHeight() * -180 + 90;
        // const lon = x / this.cp.tiff.getWidth() * 360 - 180;
        // this.cp.oddities.push({
        //     quantity,
        //     lat,
        //     lon,
        // });
    }
}

// module.exports = CapePopulation;

await CapePopulation.run();
