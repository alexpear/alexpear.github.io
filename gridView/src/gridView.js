'use strict';

// Here's how we connect js and html.
// The js file connects to specific html ids.
// Then we build with the below browserify command.
// The html file connects to the resulting bundle with a element like this:
// <script src="groupGridBundle.js"></script>

// Set it up with this command:
// browserify gridView/src/*.js -o groupGridBundle.js

const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

const Group = require('../../wnode/group.js');

class GridView {
    constructor (worldState, cornerCoord) {
        Util.logDebug(`GridView constructor. input param worldState is ${worldState}`)

        this.worldState = worldState;

        // The top left corner of the view is displaying this coord.
        this.cornerCoord = cornerCoord || new Coord(0, 0);

        // Later dont overwrite .nodes prop.
        // this.worldState.nodes = this.exampleGroups();
        this.mPerSquare = GridView.DEFAULT_SQUARE_SIZE;
    }

    exampleGroups () {
        return [
            new Group('halo/unsc/individual/odst', 5, 'unsc', this.randomOnScreen()),
            new Group('halo/unsc/individual/odst', 5, 'unsc', this.randomOnScreen()),
            new Group('halo/unsc/individual/odst', 5, 'unsc', this.randomOnScreen()),
            new Group('halo/unsc/individual/odst', 5, 'unsc', this.randomOnScreen()),
            new Group('halo/unsc/individual/odst', 5, 'unsc', this.randomOnScreen()),
            new Group('halo/unsc/individual/odst', 5, 'unsc', this.randomOnScreen()),
            new Group('halo/unsc/individual/odst', 5, 'unsc', this.randomOnScreen()),
            new Group('halo/unsc/individual/odst', 5, 'unsc', this.randomOnScreen()),
            new Group('halo/cov/squad/bruteProwler', 1, 'cov', this.randomOnScreen()),
            new Group('halo/cov/squad/bruteProwler', 1, 'cov', this.randomOnScreen())
        ];
    }

    randomOnScreen () {
        // Later support scrolling
        return new Coord(
            Util.randomUpTo(GridView.WINDOW_SQUARES - 1),
            Util.randomUpTo(GridView.WINDOW_SQUARES - 1)
        );
    }

    spriteFor (templateName) {
        const terms = templateName ?
            templateName.split('/') :
            ['sand'];

        const lastTerm = terms[terms.length - 1];

        const extensions = {
            banshee: 'jpeg',
            brute: 'jpg',
            bruteProwler: 'jpg',
            corvette: 'png',
            elite: 'jpg',
            falcon: 'jpg',
            frigate: 'png',
            ghost: 'jpg',
            goldElite: 'jpg',
            grunt: 'png',
            hunter: 'png',
            jackal: 'png',
            mantis: 'png',
            marathonCruiser: 'png',
            marine: 'jpg',
            missileSilo: 'jpg',
            odst: 'jpg',
            pelican: 'png',
            phantom: 'png',
            sand: 'jpg',
            scorpion: 'png',
            spartan: 'png',
            spire: 'jpg',
            warthog: 'jpg',
            wraith: 'png'
        };

        return `images/${lastTerm}.${extensions[lastTerm]}`;
    }

    setGridHtml () {
        const musings = document.getElementById('musings');

        musings.innerHTML = `The scale is ${this.worldState.mPerSquare} meters per square...`;

        const table = document.getElementById('grid');

        for (let r = 0; r < GridView.WINDOW_SQUARES; r++) {
            const row = table.insertRow();

            for (let c = 0; c < GridView.WINDOW_SQUARES; c++) {
                // Util.logDebug(`top of inner for loop in setGridHtml(). this.worldState.constructor.name is ${this.worldState.constructor.name}.\n  this.worldState.nodes is ${this.worldState.nodes}`)

                // Later could functionize this.
                const group = this.worldState.nodes.find(
                    g => g.coord.x === c && g.coord.y === r
                );
                
                const squareDiv = document.createElement('div');
                squareDiv.classList.add('groupSquare');

                const img = document.createElement('img');

                // img.height = 45;
                // img.width = 60;
                img.src = this.spriteFor(
                    group && group.templateName
                );

                const cell = row.insertCell();
                cell.appendChild(squareDiv);
                squareDiv.appendChild(img);

                if (! group) {
                    continue;
                }

                const quantityText = document.createElement('div');
                quantityText.classList.add('quantityText');
                quantityText.innerHTML = group.quantity > 1 ?
                    group.quantity :
                    '';
                squareDiv.appendChild(quantityText);
            }
        }
    }

    gridSquareOfCoord (coord) {
        return new Coord(
            coord.x * this.mPerSquare + this.cornerCoord.x,
            coord.y + this.mPerSquare + this.cornerCoord.y
        );
    }

    static run () {
        // set up example
        const view = new GridView();

        view.setGridHtml();
    }
}

GridView.WINDOW_SQUARES = 16; // number of squares
GridView.DEFAULT_SQUARE_SIZE = 4; // meters

module.exports = GridView;

// GridView.run();
