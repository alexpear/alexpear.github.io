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

        // Later leave blank squares undrawn, and let a large background image show thru.
        // if (! templateName) {
        //     return;
        // }

        // const terms = templateName.split('/');

        const lastTerm = terms[terms.length - 1];

        // Later i can probably just read the filenames instead.
        const extensions = {
            banshee: 'jpeg',
            brute: 'jpg',
            bruteChieftain: 'png',
            bruteProwler: 'jpg',
            ccsLightCruiser: 'png',
            chopper: 'jpg',
            combatForm: 'png',
            corvette: 'png',
            crawler: 'png',
            cryptum: 'png',
            didact: 'png',
            drone: 'png',
            elite: 'jpg',
            enforcer: 'png',
            falcon: 'png',
            floodCarrier: 'png',
            floodTank: 'png',
            frigate: 'png',
            ghost: 'jpg',
            goldElite: 'jpg',
            grunt: 'png',
            harvester: 'jpg',
            highCharity: 'jpg',
            hornet: 'png',
            hunter: 'png',
            infinity: 'jpeg',
            jackal: 'png',
            keyship: 'png',
            knight: 'jpg',
            kraken: 'jpg',
            lich: 'png',
            mammoth: 'png',
            mantis: 'png',
            marathonCruiser: 'png',
            marine: 'png',
            missileSilo: 'jpg',
            mongoose: 'gif',
            odst: 'jpg',
            officer: 'jpg',
            pelican: 'png',
            phantom: 'png',
            pod: 'jpg',
            rifleJackal: 'png',
            sand: 'jpg',
            scarab: 'png',
            scorpion: 'png',
            sentinel: 'jpg',
            shade: 'png',
            sniperJackal: 'png',
            spartan: 'png',
            spire: 'jpg',
            transportWarthog: 'png',
            warthog: 'jpg',
            wasp: 'png',
            wraith: 'png'
        };

        return `images/${lastTerm}.${extensions[lastTerm]}`;
    }

    setGridHtml () {
        const musings = document.getElementById('musings');

        musings.innerHTML = `The scale is ${this.worldState.mPerSquare} meters per square.`;

        const table = document.getElementById('grid');
        // const firstDraw = ! table.rows.length;

        for (let r = 0; r < GridView.WINDOW_SQUARES; r++) {
            const row = table.rows[r] || table.insertRow();

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
                // LATER - stop loading image freshly every time we call setGridHtml()
                img.src = this.spriteFor(
                    group && group.templateName
                );

                const existingCell = row.cells[c];
                if (existingCell) {
                    // Util.logDebug(`GridView, existingCell.childNodes.length is ${existingCell.childNodes.length}`)
                    existingCell.removeChild(existingCell.childNodes[0]);
                }

                const cell = existingCell || row.insertCell();
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

// TODO - testing on laptop that suits 10x10, but default scenario still considers 8 the halfway, which is too much.
GridView.WINDOW_SQUARES = 10; // number of squares
GridView.DEFAULT_SQUARE_SIZE = 4; // meters

module.exports = GridView;

// GridView.run();

// TODO Give the html a button to advance time forward 1 second.
// TODO Give the html a div on the side that will show html text giving more info about the square currently being moused over.
