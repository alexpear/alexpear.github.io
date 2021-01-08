'use strict';

const Util = require('./util.js');

class MtgColor {
    static random () {
        return Util.randomOf(MtgColor.COLORS);
    }

    static randomSet (size) {
        if (size >= 5) {
            return MtgColor.COLORS.slice();
        }

        let set = [];

        while (set.length < size) {
            const candidate = MtgColor.random();

            if (Util.contains(set, candidate)) {
                continue;
            }

            set.push(candidate);
        }

        return set;
    }

    static opinionOf (a, b) {
        if (a === b) {
            return 2;
        }

        if (MtgColor.areAllies(a, b)) {
            return 1;
        }

        return -2;
    }

    static areAllies (a, b) {
        return Util.contains(MtgColor.ALLIES[a], b);
    }
};

MtgColor.COLORS = ['white', 'green', 'red', 'black', 'blue'];

[
    MtgColor.W,
    MtgColor.G,
    MtgColor.R,
    MtgColor.B,
    MtgColor.U
] = MtgColor.COLORS;

MtgColor.ALLIES = {};
MtgColor.ALLIES[MtgColor.G] = [MtgColor.W, MtgColor.R];
MtgColor.ALLIES[MtgColor.R] = [MtgColor.G, MtgColor.B];
MtgColor.ALLIES[MtgColor.B] = [MtgColor.R, MtgColor.U];
MtgColor.ALLIES[MtgColor.U] = [MtgColor.B, MtgColor.W];
MtgColor.ALLIES[MtgColor.W] = [MtgColor.U, MtgColor.G];

MtgColor.ABBRVS = {};
MtgColor.ABBRVS[MtgColor.G] = 'G';
MtgColor.ABBRVS[MtgColor.R] = 'R';
MtgColor.ABBRVS[MtgColor.B] = 'B';
MtgColor.ABBRVS[MtgColor.U] = 'U';
MtgColor.ABBRVS[MtgColor.W] = 'W';

module.exports = MtgColor;
