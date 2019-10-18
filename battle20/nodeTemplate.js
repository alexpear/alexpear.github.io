'use strict';

const TAG = require('../codices/tags.js');

module.exports = class NodeTemplate {
    constructor (name) {
        this.name = name;
        this.tags = [];
    }
}
