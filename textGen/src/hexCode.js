'use strict';

// Colors as RGB hexadecimal codes like #00FF00

const Util = require('../../util/util.js');

class HexCode {
    constructor (str6chars) {
        // LATER could make robust to different input formats like #C0FFEE or CAT
        this.rgb = [
            parseInt(str6chars.slice(0, 2), 16),
            parseInt(str6chars.slice(2, 4), 16),
            parseInt(str6chars.slice(4, 6), 16),
        ];

        // console.log(`new HexCode(${str6chars}).toString() is ${this.toString()}`)
    }

    static fromNumbers (r, g, b) {
        const code = new HexCode('000000');
        code.rgb = [r, g, b];
        return code;
    }

    asDemoElement (hexCode) {
        return `<label style="background-color: ${this.toString()}">${this.toString()}</label>`;
    }

    hexString () {
        let str = this.axisAsHex(0) + 
            this.axisAsHex(1) + 
            this.axisAsHex(2);

        str = str.toUpperCase();

        // 3-digit format case
        if (
            str[0] === str[1] &&
            str[2] === str[3] &&
            str[4] === str[5]
        ) {
            return str[0] + str[2] + str[4];
        }

        return str;
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
        const otherOctant = otherColor.nearestCorner();

        for (let i = 0; i <= 2; i++) {
            const octantAxisDiff = otherOctant.rgb[i] - thisOctant.rgb[i];
            if (octantAxisDiff !== 0) {
                return octantAxisDiff;
            }
        }

        // LATER - variant where at this point we start recursively splitting each octant into suboctants.
        // Note that should check whether theyre the same color first, or at least early.

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
        return HexCode.fromNumbers(
            this.rgb[0] <= 127 ? 0 : 255,
            this.rgb[1] <= 127 ? 0 : 255,
            this.rgb[2] <= 127 ? 0 : 255,
        );
    }

    static run () {

    }
}

module.exports = HexCode;

// HexCode.run();
