'use strict';

var Util = require('./Util.js');

// NOTE: I like 'Location' better than 'Region',
// but the browser consideres 'location' a reserved keyword.

module.exports = class Region {
	constructor () {
		this.type = NODE_TYPES.region;

	}
};
