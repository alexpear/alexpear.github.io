'use strict';

var Coord = require('./Coord.js');
var Entity = require('./Entity.js');
var Factions = require('./Factions.js');
var Region = require('./Region.js');
var Templates = require('./Templates.js');
var Util = require('./Util.js');

var _ = require('underscore');

// TODO: Will eventually need to split WorldState.js

module.exports = class WorldState {
    constructor (rows, cols) {
        // OR Could entities = {}, because unordered.
        this.entities = [];

        // I'm not sure about the 2d array idea.
        this.space = this.makeGrid(rows, cols);
        this.rowCount = Util.default(rows, Util.DEFAULTS.ROWCOUNT);
        this.colCount = Util.default(cols, Util.DEFAULTS.COLCOUNT);
        this.stepCount = 0;
    }

    debugSetup () {
        this.create(Templates.human, Factions.empire, new Coord(4,6));
        this.create(Templates.human, Factions.empire, new Coord(4,7));
        this.create(Templates.human, Factions.empire, new Coord(4,8));
        this.create(Templates.human, Factions.empire, new Coord(4,9));
        this.create(Templates.human, Factions.rebels, new Coord(8,6));
        this.create(Templates.human, Factions.rebels, new Coord(8,7));
        this.create(Templates.human, Factions.rebels, new Coord(8,8));
        this.create(Templates.human, Factions.rebels, new Coord(8,9));
    }

    makeGrid (rowCount, colCount) {
        rowCount = Util.default(rowCount, this.rowCount);
        colCount = Util.default(colCount, this.colCount);

        var grid = [];
        for (var ri = 0; ri < rowCount; ri++) {
            grid.push([]);

            for (var ci = 0; ci < colCount; ci++) {
                grid[ri].push(null);  // TODO: Is there a better way?
            }
        }

        return grid;
    }

    // TODO: Could cache this
    asGrid () {
        var grid = this.makeGrid();
        this.entities.forEach(function(entity) {
            if (! entity.alive) { return; }
            grid[entity.coord.r][entity.coord.c] = entity;
        });

        return grid;
    }

    // Dead entities are ignored
    at (coord) {
        // Runspeed is not currently a priority.
        return this.entities.find(function (entity) {
            return entity.alive && entity.coord.equals(coord);
        });
    }

    isInBounds (coord) {
        return 0 <= coord.r && coord.r < this.rowCount
            && 0 <= coord.c && coord.c < this.colCount;
    }

    create (template, faction, coord) {
        // Leniency for string input.
        template = (!! template.sprite) ? template : Templates[template];

        var newEntity = new Entity(
            Util.default(template, Templates.infantry),
            faction,
            coord
        );

        newEntity.alive = true;
        this.entities.push(newEntity);
        return newEntity;
    }

    step () {
        var self = this;

        self.stepCount++;
        self.entities.forEach(function (entity) {
            if (! entity.alive) { return; }
            self.visit(entity);
        });

        // At end of step, delete all dead entities.
        this.entities = this.entities.filter(function (entity) {
            return entity.alive;
        });
    }

    visit (entity) {
        // TODO encounters and interactions
        if (entity.stepsTillMove === 0) {
            // TODO: support stationary entities.
            entity.stepsTillMove = entity.moveInterval;

            // TODO: Random action with weightings.
            var chosenAction = this.chooseAction(entity);
            chosenAction(entity);
        }

        entity.stepsTillMove--;
    }

    chooseAction (entity) {
        // TODO: weighting, eg for Settlements.
        var options = [
            this.wait,
            this.wait,
            this.wait
        ];

        var emptyNeighbors = this.emptiesAdjacentTo(entity.coord);

        if (! entity.template.immobile && emptyNeighbors.length > 0) {
            // hacky for now.
            options.push(this.moveRandomly);
            options.push(this.moveRandomly);
            options.push(this.moveRandomly);
            options.push(this.moveRandomly);
            options.push(this.moveRandomly);
            options.push(this.moveRandomly);
            options.push(this.moveRandomly);
            options.push(this.moveRandomly);
            options.push(this.moveRandomly);
        }
        if (entity.template.canCreate && emptyNeighbors.length > 0) {
            options.push(this.createOffspring);
        }
        if (entity.template.canBecome) {
            // TODO: This restriction is for settlements.
            // Other transformations will need other logic.
            if (this.entitiesAdjacentTo(entity.coord).length === 0) {
                options.push(this.transform);
            }
        }
        // TODO Range 2+ not yet supported
        if (entity.template.attack > 0 &&
                this.foesAdjacentTo(entity).length > 0) {
            // Hacky for now
            options.push(this.attackRandom);
            options.push(this.attackRandom);
            options.push(this.attackRandom);
            options.push(this.attackRandom);
            options.push(this.attackRandom);
            options.push(this.attackRandom);
            options.push(this.attackRandom);
            options.push(this.attackRandom);
            options.push(this.attackRandom);
        }

        return (_.sample(options)).bind(this);
    }

    moveAbsolute (entity, destination) {
        if (! destination) {
            console.log('ERROR: moveAbsolute() called with falsey destination parameter.');
            return;
        }

        this.moveRelative(entity, destination.minus(entity.coord));
    }

    moveRelative (entity, relativeCoord) {
        if (2 <= relativeCoord.magnitude()) {
            // TODO: better error handling
            console.log('ERROR: move() called with oversized relative coord: entity.coord === '
                + entity.coord.toString() + ' and relativeCoord === ' + relativeCoord.toString()
                + ', which has magnitude ' + relativeCoord.magnitude());
            return;
        }

        var destination = entity.coord.plus(relativeCoord);
        if (! this.isInBounds(destination)) {
            console.log('ERROR: move() called with destination outside the bounds.');
            return;
        }

        if (!! this.at(destination)) {
            console.log('ERROR: move() cant move you to an occupied square.');
            return;
        }

        entity.coord = destination;
    }

    coordsAdjacentTo (centralCoord) {
        var self = this;
        return Coord.relatives
            .map(function (relativeCoord) {
                return centralCoord.plus(relativeCoord);
            })
            .filter(function (neighbor) {
                return self.isInBounds(neighbor);
            });
    }

    entitiesAdjacentTo (centralCoord) {
        var self = this;
        return this.coordsAdjacentTo(centralCoord)
            .map(function (coord) {
                return self.at(coord);
            })
            .filter(function (coord) {
                // at() returns undefined if the coord is unoccupied.
                return !! coord;
            });
    }

    foesAdjacentTo (entity) {
        var self = this;
        return this.entitiesAdjacentTo(entity.coord)
            .filter(function(other) {
                return other.faction !== entity.faction;
            });
    }

    emptiesAdjacentTo (centralCoord) {
        var self = this;
        return this.coordsAdjacentTo(centralCoord)
            .filter(function (neighbor) {
                return ! self.at(neighbor);
            });
    }

    randomEmptyNeighbor (centralCoord) {
        return _.sample(this.emptiesAdjacentTo(centralCoord));
    }

    // Actions
    moveRandomly (entity) {
        this.moveAbsolute(entity, this.randomEmptyNeighbor(entity.coord));
    }

    createOffspring (entity) {
        if (! entity.template.canCreate) {
            console.log('ERROR: createOffspring(entity) called on an entity with no .canCreate field.');
            return;
        }

        return this.create(
            // TODO: Weighting not yet implemented.
            _.sample(
                Object.keys(
                    entity.template.canCreate
                )
            ),
            entity.faction,
            this.randomEmptyNeighbor(entity.coord)
        );
    }

    transform (entity) {
        // console.log('transforming');
        // TODO: weighting not yet implemented.
        var templateName = _.sample(
            Object.keys(
                entity.template.canBecome
            )
        );

        entity.become(
            Templates[templateName]
        );
    }

    wait (entity) {
        return;
    }

    attackRandom (attacker) {
        var foes = this.foesAdjacentTo(attacker);
        var target = _.sample(foes);
        // TODO Log above the grid?
        if (attacker.attackSucceeds(target)) {
            // Remove defeated entity.
            target.alive = false;
            console.log('Entity destroyed at ' + target.coord.toString());
            // Updating entities might not work while .forEach()ing over it.
            // this.entities = this.entities.filter(function (entity) {
            //     return entity.alive;
            // });
        }
    }

    randomEmptyCoord () {
        if (this.rowCount * this.colCount <= this.entities.length) {
            console.log('ERROR: Cant find an empty coord because there is already one entity per coord.');
            return new Coord();
        }

        do {
            // TODO: move randomCoord() to worldstate
            var coord = Coord.random(this.rowCount, this.colCount);
        } while (!! this.at(coord));

        return coord;
    }

    textImage () {
        // Candidate alg: function to assemble a 2d array representation
        // of the world, then render that in ascii.
        return this.asGrid().map(function (row) {
            return row.map(function (entity) {
                if (entity) {
                    return entity.getSprite ? entity.getSprite() : '?';
                } else {
                    return '.';
                }
            }).join(' ');
        }).join('\n');
    }

    draw () {
        console.log(this.textImage());
        console.log();
    }

    diagnostic () {
        for (var i = 0; i < this.entities.length; i++) {
            var entityOne = this.entities[i];
            // Check entity is in bounds
            if (! this.isInBounds(entityOne.coord)) {
                console.log('ERROR: entity ' + entityOne.sprite + ' is out of bounds');
            }

            // Look for pairs of Entities that are in the same space
            for (var j = i+1; j < this.entities.length; j++) {
                var entityTwo = this.entities[j];
                if (entityOne.coord.equals(entityTwo.coord)) {
                    console.log('ERROR: multiple entities are both occupying ' + entityOne.coord.toString());
                }
            }
        }

        console.log('diagnostic completed.')
    }
};
