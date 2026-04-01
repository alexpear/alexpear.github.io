"use strict";
// A fictional creature or character, in Intergame format.
Object.defineProperty(exports, "__esModule", { value: true });
const concept_1 = require("./concept");
class Creature extends concept_1.default {
    type() {
        return 'creature';
    }
}
exports.default = Creature;
