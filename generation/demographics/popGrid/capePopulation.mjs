'use strict';

// Tools for estimating number of superpowered people per location.
// About the Parahumans fictional universe created by Wildbow.

import Util from '../../../util/util.js';

// const GeoTIFF = require('geotiff');
// import GeoTIFF from 'geotiff';
import { fromFile } from 'geotiff';
import { dirname } from 'path';
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

        const __dirname = dirname(fileURLToPath(import.meta.url));
        cp.file = await fromFile(__dirname + '/data/ppp_2020_1km_Aggregated.tif');

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
        this.rasterData = await this.tiff.readRasters();
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
        const box = [];
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
            box[yInBox][xInBox] = this.rasterData[0][i];
            // push and push row

            Util.logDebug({
                box,
                xInBox,
                yInBox,
                i,
                x,
                y,
                width,
                height,
            });

            if (xInBox >= width) {
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

    setHtml () {
        const imageData = window.ctx.getImageData(0, 0, 40, 40);

        imageData.data.set(
            new Uint8ClampedArray(
                this.box2rgba(
                    this.sampleBox()
                )
            )
        );

        window.ctx.putImageData(imageData, 0, 0);
    }

    /*
    Select a box from rasters (to save space) (eg top left)
    Equatorial is x = 35520 to 35560, y = 9320 to 9360
    Print it comma-separated for later fast testing.
    Convert to flat rgba array
        ie, each number turns into 4 numbers
        A, transparency, can be 255 always
    Have a func to write to html canvas
    Call it on html page load
    var palette = ctx.getImageData(0,0,160,120); //x,y,w,h
    palette.data.set(new Uint8ClampedArray(rgbaArray));
    ctx.putImageData(palette,0,0);

    https://stackoverflow.com/questions/15908179/draw-image-from-pixel-array-on-canvas-with-putimagedata
    */

    static async run () {
        const cp = await CapePopulation.new();

        cp.sampleBox();


        Util.logDebug(`Done with test.`);
    }
};

// module.exports = CapePopulation;

CapePopulation.run();
