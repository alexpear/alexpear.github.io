// A place on the world map. Size is vague, from a building to a large region.

const Covonym = require('../../../textGen/src/namegen/covonym.js');
const Util = require('../../../util/util.js');

class Place {
    constructor (template) {
        this.template = template;
        // LATER if !template, Template.randomPlace()
        this.name = Covonym.random(1000);
        this.id = Util.uuid();
    }

    // toString () {
    // }

    // static random () {
    // }
}

module.exports = Place;
