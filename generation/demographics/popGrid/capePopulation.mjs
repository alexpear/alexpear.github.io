'use strict';

// Tools for estimating number of superpowered people per location.
// About the Parahumans fictional universe created by Wildbow.

import Util from '../../../util/util.js';

// const GeoTIFF = require('geotiff');
// import GeoTIFF from 'geotiff';
import { fromFile } from 'geotiff';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

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
        // LATER Could abbreviate negative sequences with `...`s.

        const str = pixels
            .map(n => Util.round(n))
            .join('\n');

        console.log(str);
    }

    static async run () {
        const cp = await CapePopulation.new();

        // const sample = await cp.dataAt(111, 111);
        // cp.printPixel(sample);

        const equator = cp.equatorPixels();
        cp.printPixelArray(equator);

        Util.logDebug(`Done with test.`);
    }
};

// module.exports = CapePopulation;

CapePopulation.run();
