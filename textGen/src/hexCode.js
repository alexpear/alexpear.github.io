'use strict';

// Colors as RGB hexadecimal codes like #00FF00

const Util = require('../../util/util.js');

class HexCode {
    constructor (str6chars) {
        this.rgb = [
            parseInt(str6chars.slice(0, 2), 16),
            parseInt(str6chars.slice(2, 4), 16),
            parseInt(str6chars.slice(4, 6), 16),
        ];

        console.log(`new HexCode(${str6chars}).toString() is ${this.toString()}`)
    }

    asDemoElement (hexCode) {
        return `<label style="background-color: ${this.toString()}">${this.toString()}</label>`;
    }

    hexString () {
        const str = this.axisAsHex(0) + 
            this.axisAsHex(1) + 
            this.axisAsHex(2);

        return str.toUpperCase();
    }

    axisAsHex (axis) {
        const num = this.rgb[axis];
        const converted = num.toString(16);

        return converted.padStart(2, '0');
    }

    toString () {
        return '#' + this.hexString();
    }

    // Defined as Manhattan distance from #000000
    brightness () {
        return this.rgb[0] + this.rgb[1] + this.rgb[2];
    }

    compare (otherColor) {
        // First sort by octant
        const thisOctant = this.nearestCorner();
        const otherOctant = this.nearestCorner();

        for (let i = 0; i <= 2; i++) {
            const octantAxisDiff = otherOctant.rgb[i] - thisOctant.rgb[i];
            if (octantAxisDiff !== 0) {
                return octantAxisDiff;
            }
        }

        // If both are in same octant, sort by brightness.
        const brightnessDiff = otherColor.brightness() - this.brightness(); 
        if (brightnessDiff !== 0) {
            return brightnessDiff;
        }

        // If tied brightness, sort by RGB axes.
        for (let i = 0; i <= 2; i++) {
            const axisDiff = otherColor.rgb[i] - this.rgb[i];
            if (axisDiff !== 0) {
                return axisDiff;
            }
        }

        // If same color:
        return 0;
    }

    // For sorting into octants of the color cube
    nearestCorner () {
        return {
            rgb: [
                this.rgb[0] <= 127 ? 0 : 255,
                this.rgb[1] <= 127 ? 0 : 255,
                this.rgb[2] <= 127 ? 0 : 255,
            ]
        };
    }

    output () {

    }

    static run () {

    }
}

module.exports = HexCode;

HexCode.run();
