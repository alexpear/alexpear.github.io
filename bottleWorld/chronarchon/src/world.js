// Game state of a bottle world.

const Group = require('./group.js');
const Place = require('./place.js');
const Template = require('./template.js');
const Util = require('../../../util/util.js');

const Yaml = require('js-yaml');

class World {
    constructor (context = 'scifi') {
        this.context = context;
        Template.CONTEXT = context;

        this.events = [];

        // BTW, each Place has its own grid coordinate.
        this.places = [ new Place() ];

        this.entities = [];

        // For traits that apply to this whole world.
        this.traits = [];

        this.t = 0;
        this.id = Util.uuid();
    }

    async demo () {
        if (typeof window !== 'undefined') {
            window.world = this;
            // LATER might instead focus on a window.player or window.session    
            await this.replaceCandidate();
        }
    }

    // Move the world 1 turn forward in time.
    next () {
        // New character shows up.
        this.entities.push(
            Group.random()
        );

        this.t += 1;
    }

    async replaceCandidate () {
        this.candidate = await Group.random();

        console.log(`Candidate generated.`);
        console.log(
            this.candidate.toString()
        );

        window.document.getElementById('candidateTextBox').innerText = this.candidate.toString();

        this.candidate.draw(
            window.document.getElementById('outsiderSlot')
        );
    }

    async swapUnit (button) {
        const unitNumber = Number(button.parentElement.id.charAt(-1));

        this.entities[unitNumber] = this.candidate;

        this.candidate.draw(
            button.parentElement.querySelector('.unitImageStack')
        );

        button.parentElement.querySelector('.unitTextBox').innerText = this.candidate.toString();

        await this.replaceCandidate();
    }

    toYml () {
        return Yaml.dump(
            this,
            // LATER, rather than 'this', maybe just a subset of relevant fields. Also write objs as ids.
            {
                sortKeys: true,
                indent: 4,
            },
        );
    }

    static fromFile (path) {
        const worldObj = Yaml.load(
            require(path),
            { json: true } 
            // BTW: json: true means duplicate keys in a mapping will override values rather than throwing an error.
        );

        return Object.assign(new World(), worldObj);
    }
}

module.exports = World;