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
        this.worldState = worldState || {};

        // The top left corner of the view is displaying this coord.
        this.cornerCoord = cornerCoord || new Coord(0, 0);

        // Later dont overwrite .nodes prop.
        this.worldState.nodes = this.exampleGroups();
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
        const terms = templateName.split('/');
        const lastTerm = terms[terms.length - 1];

        const extensions = {
            sand: 'jpg',
            odst: 'jpg',
            wraith: 'png',
            bruteProwler: 'jpg'
        };

        return `images/${lastTerm}.${extensions[lastTerm]}`;
    }

    setGridHtml () {
        const table = document.getElementById('grid');

        for (let r = 0; r < GridView.WINDOW_SQUARES; r++) {
            const row = table.insertRow();

            for (let c = 0; c < GridView.WINDOW_SQUARES; c++) {
                const group = this.worldState.nodes.find(
                    g => g.coord.x === c && g.coord.y === r
                );

                const child = document.createElement('img');

                child.height = 45;
                child.width = 60;
                child.src = this.spriteFor(
                    group ?
                        group.templateName :
                        'sand'
                );

                const cell = row.insertCell();
                cell.appendChild(child);
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

GridView.run();
