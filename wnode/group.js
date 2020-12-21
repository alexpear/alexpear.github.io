'use strict';

const Coord = require('../util/coord.js');
const NodeTemplate = require('../battle20/nodeTemplate.js');
const Util = require('../util/util.js');
const WNode = require('./wnode.js');

const WGenerator = require('../generation/wgenerator.js');

// Can be very similar to Group from Battle20 / dndBottle
// .quantity, .template (CreatureTemplate), maybe some a prop for the SP of the sole wounded member.
// .getWeight(), .getMaxSize(), .getSizeTotal(), .getSpeed() <- only different from template if there is some status condition effect, etc

// Similar to the concept of a 'banner' or 'stack' or 'army' in large-scale map-based wargames.
// Contains a homogenous set of 1+ Creatures
// These are not instantiated in .components.
class Group extends WNode {
    constructor (template, quantity, alignment, coord) {
        super(template);

        if (quantity === 0) {
            return undefined;
        }

        this.quantity = Util.exists(quantity) ?
            quantity :
            template && template.quantity || 1;

        this.worstSp = this.template ?
            this.template.sp :
            1;

        this.alignment = alignment;
        this.coord = coord;
        this.destination = undefined;  // Coord
        this.target = undefined;  // Group
    }

    toAlignmentString () {
        const tName = Util.fromCamelCase(this.templateName);

        return `${tName} x${this.quantity} (${this.alignmentAsString()} Group)`;
    }

    // Unit: meters of longest dimension when in storage.
    getSize () {
        return this.traitMax('size');
    }

    getTotalSp () {
        return (this.quantity - 1) * this.template.sp + this.worstSp;
    }

    // Returns number
    resistanceTo (tags) {
        // LATER it's probably more performant to recursively gather a net resistance obj here, instead of multiple times in resistanceToTag()
        return Util.sum(
            tags.map(
                tag => this.resistanceToTag(tag)
            )
        );
    }

    // Returns number
    resistanceToTag (tag) {
        const localResistance = (this.template &&
            this.template.resistance &&
            this.template.resistance[tag]) ||
            0;

        return this.components.reduce(
            (overallResistance, component) => {
                return localResistance +
                    (component.resistanceTo && component.resistanceToTag(tag) || 0);
            },
            localResistance
        );
    }

    // Returns string like '::::.', a visual depiction of this.quantity.
    // The string can be multiline.
    dotGrid () {
        // Making it divisble by 5 could be dropped in future.
        let columns = Math.ceil(
            Math.sqrt(this.quantity) / 5
        ) * 5;

        if (columns > 90) {
            columns = 90;
        }

        const rowCount = Math.ceil(
            this.quantity / columns / 2
        );

        // Top row can be incomplete and can contain a . instead of just :s
        // Lower rows are filled with :s
        // ::.
        // :::::
        // :::::
        // 25

        // When the top row is exactly divisible, we want to fill it with colons.
        const topRowQuantity = (this.quantity % (columns * 2)) || (columns * 2);
        const topRowColonCount = Math.floor(topRowQuantity / 2);
        const topRowColons = ':'.repeat(topRowColonCount);
        const topRow = topRowQuantity % 2 === 0 ?
            topRowColons :
            topRowColons + '.';

        // if (rowCount === 1) {
        //     return topRow;
        // }

        const lowerRow = ':'.repeat(columns);
        const rows = [topRow];

        for (let r = 1; r < rowCount; r++) {
            rows.push(lowerRow);
        }

        return rows.join('\n');
    }

    static testDotGrid () {
        for (let x = 0; x < 10; x++) {
            const quantity = Math.ceil(Math.random() * 1000)
            const grid = new Group(undefined, quantity).dotGrid();

            Util.log(quantity + '\n' + grid);

            const simplified = grid.replace(/\n/g, '');
            const count = Util.contains(simplified, '.') ?
                simplified.length * 2 - 1 :
                simplified.length * 2;

            if (count !== quantity) {
                throw new Error(`${quantity}, but i see ${count} dots. Simplified grid is: ${simplified}`);
            }
        }
    }

    // Later can move this to interface Actor or something.
    act (worldState) {
        this.destination = this.chosenDestination(worldState);
        this.target = this.chosenTarget(worldState);

        const stoppingPoint = worldState.coordAtEndOfMove(this, this.destination);

        this.moveTo(stoppingPoint, worldState);

        // Consider firing at .target if cooldown allows.
        //   How is cooldown tracked?
        if (true) {
            this.attack(this.target, worldState);
        }

        // And make sure we persist everything as BEvents in Timeline
    }

    chosenDestination (worldState) {
        if (! this.canReach(this.destination)) {
            
        }
    }

    goodTimeToThink (worldState) {
        return worldState.t % 10 === 0;
    }

    takeCasualties (casualties) {
        const outcome = {
            casualties,
            wipedOut: false
        };

        if (casualties >= this.quantity) {
            casualties = this.quantity;

            this.active = false;
            outcome.wipedOut = true;
        }

        this.quantity -= casualties;
        outcome.resultingQuantity = this.quantity;

        return outcome;
    }

    takeDamage (damage) {
        const outcome = {
            damage,
            active: true
        };

        const startSp = this.getTotalSp();

        let endTotalSp = startSp - damage;
        if (endTotalSp < 0) {
            endTotalSp = 0;
        }

        const endQuantity = Math.ceil(endTotalSp / this.template.sp);
        const endWorstSp = endTotalSp % this.template.sp;

        this.quantity = endQuantity;
        this.worstSp = endWorstSp;

        outcome.endQuantity = endQuantity;
        outcome.endWorstSp = endWorstSp;

        if (this.quantity === 0) {
            this.active = false;
            outcome.active = false;
        }

        return outcome;
    }

    // Creates a Group with a template with totally random properties.
    static randomCreatures () {
        const template = {
            size: Math.ceil(Math.random() * 20) / 10,
            speed: Math.ceil(Math.random() * 3),
            // ac
            sp: Math.ceil(Math.random() * 100),
            // resistance:
        };

        const group = new Group();

        const quantity = Math.ceil(Math.random() * 100);

        // TODO

        return group;
    }

    // distanceTo (target) {
    //     const targetCoord = target.coord || target;

    //     return this.coord.manhattanDistanceTo(targetCoord);
    // }

    // // Unit: meters of longest dimension when in storage.
    // getSize () {
    //     return this.traitMax('size');
    // }

    // // Unit: kg on Earth's surface.
    // subtreeWeight () {
    //     const localWeight = this.template && this.template.weight;

    //     return this.components.reduce(
    //         (sum, component) => sum + component.subtreeWeight(),
    //         localWeight
    //     );
    // }

    static new (fullCodexPath, quantity, alignment, coord) {
        // Later can add a func to WGenerator that returns just the template obj instead of WNode[]
        const nodes = WGenerator.generateNodes(fullCodexPath);

        return new Group(
            nodes[0].template || fullCodexPath,
            quantity,
            alignment,
            coord
        );
    }

    static marineCompany () {
        const company = Group.new('halo/unsc/individual/marinePrivate', 50);

        return company;
    }

    static run () {
        // Group.testDotGrid();
    }
};

module.exports = Group;

Group.run();
