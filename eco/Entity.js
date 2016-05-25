'use strict';

module.exports = class Entity {
    constructor () {
        this.type = 'entity';
        this.region = null;
        this.coord = new Coord();
        this.sprite = '?';
    }
};
