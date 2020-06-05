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
    }
    
    exampleGroups () {
        return [
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
        const sprites = {
            sand: 'https://images.homedepot-static.com/productImages/7c61a416-c547-4ee2-bf95-d6b7b25d8c9f/svn/stone-tan-armstrong-vct-tile-54004031-64_1000.jpg',
            odst: 'https://content.halocdn.com/media/Default/encyclopedia/factions/odst/media-gallery/assassinjv11-1920x1080-e34ddadf403241d4b0c1b31945c48403.jpg',
            bruteProwler: 'https://content.halocdn.com/media/Default/encyclopedia/vehicles/prowler/prowler-large-square-542x542-84509ba37f0f49c28e74f4b3620fc683.jpg'
        };

        const terms = templateName.split('/');

        return sprites[
            terms[terms.length - 1]
        ];
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

    static run () {
        // set up example
        const view = new GridView();

        view.setGridHtml();
    }
}

GridView.WINDOW_SQUARES = 16;

GridView.run();
