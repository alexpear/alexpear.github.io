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

    // Returns number
    dataAt (xPixel, yPixel) {
        if (xPixel > SquareNode.EARTH_WIDTH || yPixel > SquareNode.EARTH_HEIGHT) {
            return 0;
        }

        // Converts y into a further portion of the flattened array, all in rasters[0].
        const value = this.rasters[ yPixel * SquareNode.EARTH_WIDTH + xPixel ];

        if (value > 0) {
            return value;
        }
        else {
            return 0;
        }

        // return await this.tiff.readRasters({
        //     window: [
        //         xPixel,
        //         yPixel,
        //         xPixel + squareWidth,
        //         yPixel + squareWidth,
        //     ]
        // });
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

    printLowRes (width) {
        console.log(`Resolution = ${width} squares`);
        // const lines = [];

        for (let x = 0; x < SquareNode.EARTH_WIDTH; x += width) {
            const row = [];

            for (let y = 0; y < SquareNode.EARTH_HEIGHT; y += width) {
                let newResPop = 0;

                for (let xInSquare = 0; xInSquare < width; xInSquare++) {
                    for (let yInSquare = 0; yInSquare < width; yInSquare++) {
                        const pixelPop = this.dataAt(x + xInSquare, y + yInSquare);

                        if (pixelPop > 0) {
                            newResPop += pixelPop;
                        }
                    }
                }

                row.push(newResPop);
            }

            console.log(`${row.join(' ')}`);
        }
    }

    // questions: 
    // Is the main call to visit() failing to call placeOddities? Is it not finding enough population under test parameters?
    // How exactly to make a progress % log call?
    // Is it walking both up & down as intended?
    // What specifically is slow?
    // Would it be faster to call dataAt() for a larger square instead of for each pixel?
    // Would it be faster to abandon the tree data structure? And instead rely on 2d-grid-shaped data structures? We could still zoom in & out according to the same gridtree patterns.
    // Exactly what params should i be inputting? Could write a func to convert between the units. 
    // Should we speed up by not checking every last pixel, & assuming similarity to neighbors?
    // FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
    // Note that this happens even when i mock dataAt(). The tree is too big i think.
    //   Can i load only a portion of the tiff file at a time? Streaming etc...

    async odditiesTreeMap (rate, name, dryRun) {
        this.rate = rate;
        SquareNode.EARTH_HEIGHT = 18_720;
        SquareNode.EARTH_WIDTH = 43_200;
        SquareNode.MAX_RES = Math.pow(2, 16);
        SquareNode.pixelsPopulated = 0;
        SquareNode.childCount = 1;

        // Debug. Mapping from width to the max population of a node of that width.
        SquareNode.maxPopAtWidth = {};

        // this.rasters = await this.tiff.readRasters();
        const raw = await this.tiff.readRasters();

        // TODO read from worldpop low res txt file instead for speedup. Will need to modify dataAt() too. See capes sheet for which rates are supported by which resolutions.

        // {
        //     // small test
        //     window: [ 
        //         30_200, 
        //         7_000, 
        //         30_200 + Math.pow(2, 12), 
        //         7_000 + Math.pow(2, 12) 
        //     ] 
        // }

        /** Runtime notes
         * 2025 June 13 1629 - 20 minutes. readRasters() was set to 2^12 width, rest was full scale. readRasters() was only 10 seconds.
         * 2025 June 13 1705 - Ran readRasters() with no params: 3m 30s for that step. Total alg was 20 minutes. Still saw bug with NaN & null populations.
         */

        this.rasters = raw[0];

        // 2^16 > EARTH_WIDTH
        // this.root = new SquareNode(
        //     30_200, // leftX
        //     7_000, // topY
        //     Math.pow(2, 4), // temp small scale for testing
        // );
        this.root = new SquareNode(0, 0, SquareNode.MAX_RES);

        let currentNode = this.root;

        // return; // temp

        while (currentNode) {
            let unexplored = currentNode.unexploredLeaf();
            if (unexplored) {
                currentNode = unexplored;
                continue;
            }

            if (currentNode.population === undefined) {
                currentNode.population = 0;

                for (const child of currentNode.children) {
                    if (child.population === undefined) {
                        Util.error({
                            message: `Child population is undefined`,
                            child,
                        });
                    }

                    currentNode.population += child.population;
                }

                currentNode.updateMaxPopAtWidth();
            }

            if (currentNode.width >= Math.pow(2, 12) && currentNode.population !== undefined) {
                Util.logDebug({
                    context: 'odditiesTreeMap() while loop',
                    currentNode: currentNode.toString(),
                    // rasterLength: SquareNode.cp.rasters.length,
                    pixelsPopulated: SquareNode.pixelsPopulated,
                    pixelTotalCount: 4_294_967_296, // 2^16^2
                    // populatedRatio: SquareNode.pixelsPopulated / (SquareNode.EARTH_WIDTH * SquareNode.EARTH_WIDTH),
                    // heapUsed: process.memoryUsage().heapUsed / 1_048_576, // MB
                });

                if (! Util.exists(currentNode.population)){
                    Util.error({
                        message: `currentNode.population is screwy`,
                        currentNode: currentNode.toString(),
                    });
                }
            }

            if (currentNode.population >= SquareNode.cp.rate && ! dryRun) {
                currentNode.placeOddities();
            }

            // NOTE - memoryUsage() is slow - instead, manually track tree size in a prop analogous to pixelsPopulated.
            if (SquareNode.childCount > 10_000_000) {
                currentNode.tidyChildren();
            }
            currentNode = currentNode.parent;
        }

        // const randomLeaf = this.root.unexploredLeaf();

        // Util.logDebug({
        //     context: 'odditiesTreeMap after readRasters()',
        //     randomLeaf: randomLeaf?.toString(),
        // });

        // await randomLeaf.visit();

        if (dryRun) {
            console.log(`SquareNode.maxPopAtWidth is complete:`);
            Util.log(SquareNode.maxPopAtWidth);
        }
        else {
            // Add one final oddity at global res. Force it to round up to 1 oddity.
            this.root.placeOddities();

            console.log(
                `${name}: ` + 
                this.oddities.map(
                    oddity => `${oddity.lat} ${oddity.lon}`
                ).join('\n')
            );
        }
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
        if (! process.argv[2]) {
            if (process.argv[1]) {
                console.log(`Usage - To search for oddities, run: node capePopulation.mjs search`);
            }

            return;
        }

        const cp = await CapePopulation.new();
        Util.logDebug(`Done with new().`);

        // await cp.randomOdditiesVegas(71_012_000, 'wizard schools');

        await cp.odditiesTreeMap(71_012_000, 'wizard schools');
        // await cp.odditiesTreeMap(71_012_000, 'wizard schools', 'dryRun');

        // cp.printLowRes(32);
        // cp.printLowRes(256);

        Util.logDebug(`Done with run()`);
    }
};

class SquareNode {
    // X & Y refer to tiff pixels.
    constructor (leftX = 0, topY = 0, width = 1, parent) {
        this.leftX = leftX;
        this.topY = topY;
        this.width = width;
        this.population = undefined;
        this.children = [];
        this.parent = parent;
    }

    toString () {
        const pop = this.population === undefined ?
            '?' :
            this.population;

        return `SquareNode at (${this.leftX}, ${this.topY}), width ${this.width}, population ${pop}, ${this.children.length} child nodes.`;
    }

    // If all 4 children have .population numbers, returns undefined.
    // Otherwise, explores a path down past 1 of those unexplored children until it reaches the leaf depth. Returns that leaf. 
    unexploredLeaf () {
        /* Algorithm:
        * if this is already a leaf, return undefined if it has population.
          * if it doesn't, look up its population & return it
        * if this has no children, make them.
        * select a random unexplored child.
        * if no such child was found, return undefined.
        * return await selected.unexploredLeaf()
         */
    
        // Util.logDebug({
        //     context: 'unexploredLeaf() top',
        //     width: this.width,
        //     leftX: this.leftX,
        //     topY: this.topY,
        //     childrenLength: this.children.length,
        //     pixelsPopulated: SquareNode.pixelsPopulated,
        // });

        if (this.width === 1) {
            if (this.population === undefined) {
                this.population = SquareNode.cp.dataAt(this.leftX, this.topY);
                SquareNode.pixelsPopulated++;
                this.updateMaxPopAtWidth();

                return this;
            }

            return;
        }

        if (this.children.length === 0) {
            const childWidth = this.width / 2;

            this.children = [
                new SquareNode(
                    this.leftX,
                    this.topY,
                    childWidth,
                    this
                ),
                new SquareNode(
                    this.leftX + childWidth,
                    this.topY,
                    childWidth,
                    this
                ),
                new SquareNode(
                    this.leftX,
                    this.topY + childWidth,
                    childWidth,
                    this
                ),
                new SquareNode(
                    this.leftX + childWidth,
                    this.topY + childWidth,
                    childWidth,
                    this
                ),
            ];

            SquareNode.childCount += 4;
        }

        const indices = Util.shuffle([0, 1, 2, 3]);

        for (const i of indices) {
            const subsquare = this.children[i];

            if (subsquare.population === undefined) {
                return subsquare.unexploredLeaf();
            }
        }

        return; // All children are explored.
    }

    updateMaxPopAtWidth () {
        if (SquareNode.maxPopAtWidth[this.width] === undefined) {
            SquareNode.maxPopAtWidth[this.width] = this.population;
        }
        else if (this.population > SquareNode.maxPopAtWidth[this.width]) {
            SquareNode.maxPopAtWidth[this.width] = this.population;
        }
        else {
            return;
        }

        // Util.logDebug({
        //     context: 'SquareNode.updateMaxPopAtWidth()',
        //     squareNode: this.toString(),
        //     maxPopAtThisWidth: SquareNode.maxPopAtWidth[this.width],
        // });
    }

    /* Variant alg idea: Each node has a .oddityCount field. Root starts with all the oddities. We gradually populate the other nodes' .oddityCount fields. Presumably we divide the count proportionally among the 4 subsquares, with randomness as necessary.
     * We don't decrease .population fields, rather, we look at both .population & .oddityCount & .cp.rate
     * Obstacle: Keeping the whole tree in-memory is expensive. Could estimate exactly how expensive.
     * I think this will be a general problem with top-down strategies.
     * 
     * V2: Start at random leaf. Grow up until we can place a oddity. Then blank out .children so the garbage collection can free up space.
     * Obstacle: If we want to re-use data in this square for position weighting, we'll have to query it again using readRasters().
     * That is okay.
     * visit() can do most of this i think. When we visit a node with known population, we either place oddities or return.
     * Obstacle: Summing the 3-4 mysterious child populations. ... Well, no, visit() can write to .population & return nothing. Then the sum can read from the 4 .population fields.
     * 
     * Sketch of V2 alg:
     * randomLeaf() makes & returns a leaf. It also reads the population for that leaf.
     * We begin our visit() process at this leaf.
     * 1, If there are mysterious subsquares, use randomLeaf() to explore them. Name it this.randomUnknownLeaf() maybe.
     * 2, if population is known in this subtree, try to place oddities. If we do, note this in this node. Overwrite .children once we can.
     * 3, visit() parent.
     *   Do we do this recursively or via a top level imperative func? During the mysterious subsquare visits, will this cause 3 visits back to here?
     *   I guess the trouble is that, midway thru a mysterious subtree search, parent.visit() is unnecessary. BUT since we start at a leaf, going up that parent chain is indeed necessary.
     *   Okay so we get rid of recursive DFS for mysterious subtrees, & use randomLeaf() for everything. Comment edited to reflect this above. We never have multiple things happening at once.
     * 
     * And if there are still memory problems, we can delete subtrees during visit() after we establish all 4 subsquares are mapped. Delete grandchildren etc.
     */

    // Try to convert population to oddities
    // Tempted to have this be a nonrecursive alg - singlethreaded etc
    // Possible outcomes: Need to examine a specific mysterious subsquare first, or found N oddities. 
    // Rename func to getOddities()? I suppose that sounds recursive... perhaps that is the way to go?
    // Let's avoid recursive. Singlethreaded. Output oddities to a global .oddities field. Static? SquareNode.cp.oddities
    // async visit () {
    //     if (this.width >= Math.pow(2, 0)) {
    //         Util.logDebug({
    //             leftX: this.leftX,
    //             topY: this.topY,
    //             width: this.width,
    //             population: this.population,
    //             childrenLength: this.children.length,
    //             rasterLength: SquareNode.cp.rasters.length,
    //             populatedRatio: SquareNode.pixelsPopulated / (SquareNode.EARTH_WIDTH * SquareNode.EARTH_HEIGHT),
    //         });
    //     }

    //     let unexplored = this.unexploredLeaf();
    //     if (unexplored) {
    //         return await unexplored.visit();
    //     }

    //     if (this.population === undefined) {
    //         this.population = 0;

    //         for (const child of this.children) {
    //             if (child.population === undefined) {
    //                 Util.error({
    //                     message: `Child population is undefined`,
    //                     child,
    //                 });
    //             }

    //             this.population += child.population;
    //         }
    //     }

    //     if (this.population >= SquareNode.cp.rate) {
    //         // add oddities
    //         // start weighted across all 4 children, but decrement pop of whichever child we land in. 
    //         // Do we need to decrement pop at all lower resolutions?
    //         // Tempting not to; would rather forget about low res squarenodes forever after they have defined populations.
    //         // but OBSTACLE - the lower res data could usefully guide us in placing oddities.
            
    //         // If we decrement, is it easier to decrement all descendants upon each new oddity, or to always check your children rather than trusting your .population value?
    //         // Well, the 2nd option kindof obviates caching in general. So only leaves would need .population values.
    //         // And when you place oddities, it's kindof like decrementing the 1-width square and its _ancestors_, not descendants.
    //         // So cache population on nonleaves or not?
    //         // I think do cache it & keep it up to date. At least with magic schools, there will be far fewer oddities than pop-reads.
    //         this.placeOddities();
    //     }

    //     return await this.parent.visit(); // Not enough population in this square; deal with it later.
    

    //     // LATER could also delete grand/children here if necessary to save memory.
    // }

    placeOddities () {
        Util.logDebug({
            context: `SquareNode.placeOddities()`,
            leftX: this.leftX,
            topY: this.topY,
            width: this.width,
            population: this.population,
        });

        // TODO if children have been deleted, recreate them. 
        // OBSTACLE - top down or bottom up? Random or densest first?
        if (this.width >= 2 && this.children.length === 4) {
            while (this.population >= SquareNode.cp.rate) {
                this.densestPixel().placeOddities();
            }
        }
        else {
            if (this.topY > SquareNode.EARTH_HEIGHT || this.leftX > SquareNode.EARTH_WIDTH) {
                Util.error({
                    message: `SquareNode.placeOddities() called on square outside of Earth bounds`,
                    squareNode: this.toString(),
                });
            }

            const quantity = Math.floor(this.population / SquareNode.cp.rate) || 1;

            for (let i = 0; i < quantity; i++) {
                SquareNode.cp.oddities.push(this.latLon());

                // LATER distribute the oddities more evenly around the square, like with a vector field.
            }

            Util.logDebug({
                context: `SquareNode.placeOddities(), near bottom of else {}`,
                squareNode: this.toString(),
                quantity,
                rate: SquareNode.cp.rate,
                odditiesCount: SquareNode.cp.oddities.length,
            });

            this.decreasePopulation(quantity * SquareNode.cp.rate);
            // LATER could balance negative & positive populations after this.

            this.tidyChildren();
        }
        
        // LATER make sure densestPixel() doesnt have a bias towards the top left corner in areas of homogenous data. Like a random tiebreak or something.

        // The case of 4 squares of value 0.9 ... will need 3 calls to densestPixel().
        
        // Hmm: Will need to decrement .population of ancestors.
        // Parent pointers are perhaps best for runtime.
        // OR could leave .population unmodified but also reference the number of oddities in the square (somehow). Could be a convenient alternative to storing a negative .population in some leaves.

        // LATER might reuse part or all of this func for squares of width > 1 too. 
        // In that case it will recurse, sometimes into squares that have population less than .rate. In these cases, will need to decrement the overflow into sibling squares, to add up to 1. Probably divide this overflow half & half into the 2 orthoganal siblings, then if there is more, the rest into the diagonal sibling.
        // Or rather ... but could just leave it negative. Those depths probably wont get visited again ... unless the positive siblings have very high values ... 
    }

    latLon () {
        const latRange = Math.min(this.width, SquareNode.EARTH_HEIGHT - this.topY);
        const lonRange = Math.min(this.width, SquareNode.EARTH_WIDTH - this.leftX);

        // We multiply Y by a negative number because we need to invert. 0 maps to 90 N.
        const lat = (this.topY + Math.random() * latRange) / SquareNode.EARTH_HEIGHT * -180 + 90;
        const lon = (this.leftX + Math.random() * lonRange) / SquareNode.EARTH_WIDTH * 360 - 180;
        
        // Util.logDebug({
        //     context: 'SquareNode.latLon()',
        //     squareNode: this.toString(),
        //     lat,
        //     lon,
        //     SquareNodeEarthHeight: SquareNode.EARTH_HEIGHT,
        //     SquareNodeEarthWidth: SquareNode.EARTH_WIDTH,
        // });

        return { 
            lat: Util.constrainOrError(lat, -90, 90), 
            lon: Util.constrainOrError(lon, -180, 180),
        };
    }

    // TODO getting some results offshore of where they should be. Probably replace decreasePopulation() with a squareNode.oddityCount number prop. Then perhaps re-explore deleted subsquares when densestPixel() descends to a deleted subtree. 
    // Or alternately do not delete subtrees so aggressively - only after placeOddities, not in the while() loop.
    densestPixel () {
        Util.logDebug({
            context: 'densestPixel()',
            toString: this.toString(),
        });

        // By this point we might well have deleted the children. LATER rename old misnomer Pixel in function name to Child etc.
        if (this.children.length === 0 || this.width === 1) {
            return this;
        }

        const indices = Util.shuffle([0, 1, 2, 3]);

        let densest = indices[0];

        // Sanity check. Note that densestPixel() is not a performance bottleneck.
        if (! Util.exists(this.children[densest].population)) {
            Util.error({
                message: `SquareNode.densestPixel() child population is screwy`,
                squareNode: this.toString(),
                childIndex: densest,
                childPopulation: this.children[densest].population,
            });
        }

        indices.slice(1).forEach(i => {
            if (this.children[i].population > this.children[densest].population) {
                densest = i;
            }
        });

        return this.children[densest].densestPixel();
    }

    decreasePopulation (n) {
        Util.logDebug({
            context: 'SquareNode.decreasePopulation() top',
            squareNode: this.toString(),
            n,
        });

        if (this.population === undefined) {
            return;
        }

        this.population -= n;

        Util.logDebug({
            context: 'SquareNode.decreasePopulation() after subtraction',
            squareNode: this.toString(),
        });

        if (! Util.exists(this.population)) {
            Util.error({
                message: `SquareNode.decreasePopulation() population is screwy`,
                squareNode: this.toString(),
                population: this.population,
            });
        }

        this.parent?.decreasePopulation(n);
    }

    tidyChildren () {
        // Aggressive for now.
        // this.children.forEach( child => { child.parent = undefined; }); // LATER delete this line - no impact on garbage collection.
        const childCount = this.children.length;
        this.children = [];
        SquareNode.nodeCount -= childCount;
        // TODO but this might delete more than 4 nodes.
    }
}

/* Performance testing ideas

clinic doctor -- node capePopulation.mjs

0x capePopulation.mjs

node --inspect-brk capePopulation.mjs
chrome://inspect
 */

export default SquareNode;

await CapePopulation.run();
