"use strict";
// A representation of one thing from a game, in Intergame format.
Object.defineProperty(exports, "__esModule", { value: true });
class Concept {
    constructor() {
        // keyed by context id, value is the original data from that context
        this.versions = {};
    }
    type() {
        return 'concept';
    }
}
exports.default = Concept;
