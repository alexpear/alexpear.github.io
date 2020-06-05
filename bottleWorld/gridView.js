'use strict';

// With TreeNode.html here's how we do that.
// The js file connects to specific html ids.
// Then we build with 'browserify treeBrowser.js -o bundle.js'.
// The html file connects to the resulting bundle with a element like this:
// <script src="bundle.js">
class GridView {
    constructor (worldState, cornerCoord) {
        this.worldState = worldState || {};

        // The top left corner of the view is displaying this coord.
        // Later standardize the prop names between this and coord.js
        this.cornerCoord = cornerCoord || { x: 0, y: 0 };

        // TODO make a test that uses real wnodes.
        this.worldState.nodes = this.exampleGroups();
    }
    
    exampleGroups () {
        return [
            {
                alignment: 'unsc',
                templateName: 'odst',
                coord: { x: 1, y: 1}
            },
            {
                alignment: 'unsc',
                templateName: 'odst',
                coord: { x: 4, y: 1}
            },
            {
                alignment: 'unsc',
                templateName: 'odst',
                coord: { x: 3, y: 2}
            },
            {
                alignment: 'covenant',
                templateName: 'bruteProwler',
                coord: { x: 2, y: 8}
            },
            {
                alignment: 'covenant',
                templateName: 'bruteProwler',
                coord: { x: 5, y: 7}
            }
        ];
    }

    spriteFor (templateName) {
        const sprites = {
            sand: 'https://images.homedepot-static.com/productImages/7c61a416-c547-4ee2-bf95-d6b7b25d8c9f/svn/stone-tan-armstrong-vct-tile-54004031-64_1000.jpg',
            odst: 'https://content.halocdn.com/media/Default/encyclopedia/factions/odst/media-gallery/assassinjv11-1920x1080-e34ddadf403241d4b0c1b31945c48403.jpg',
            bruteProwler: 'https://content.halocdn.com/media/Default/encyclopedia/vehicles/prowler/prowler-large-square-542x542-84509ba37f0f49c28e74f4b3620fc683.jpg'
        };

        return sprites[templateName];
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

                child.height = 15;
                child.width = 20;
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

GridView.WINDOW_SQUARES = 10;

GridView.run();
