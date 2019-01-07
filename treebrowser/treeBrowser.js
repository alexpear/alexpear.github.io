'use strict';

// TODO look up info about browserify and relative paths
const WGenerator = require('../generation/wgenerator.js');
const WNode = require('../wnode/wnode.js');
const Util = require('../util/util.js');

//

const TreeBrowser = module.exports = class TreeBrowser {
    constructor (curNode) {
        this.currentNode = curNode || this.exampleRoot();

        this.parentButton = document.getElementById('parentButton');
        if (!this.parentButton) {
            alert('parentButton seems undefined :o');
            console.log('parentButton seems undefined :o :o');
        }
        else {
            alert('all is well :)');
            console.log('all is well :)');
        }

        // this.fake.bad.foolish = {};


        this.currentNodeName = document.getElementById('currentNodeName');
        this.discardButton = document.getElementById('discardButton');
        this.propertiesDiv = document.getElementById('properties');
        // TODO this is turning out undefined for some reason
        this.componentsDiv = document.getElementById('components');

        this.updateUi(this.currentNode);
    }

    updateUi (newNode) {
        if (newNode) {
            // Update parent button
            if (newNode.parent) {
                this.parentButton.value = newNode.parent.toSimpleString();
            }
            else {
                this.parentButton.value = '(No parent)';
            }

            // Update current node
            // TODO newNode has a circular reference, according to JSON.stringify()
            this.currentNodeName.innerHTML = newNode.toSimpleString();

            // Update component buttons
            this.updateComponentButtons(newNode);
        }
    }

    updateComponentButtons (newNode) {
        this.clearDiv(this.componentsDiv);

        newNode.components.forEach((component, index) => {
            const button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('id', component.id);
            button.classList.add('iconButton');
            button.value = component.toSimpleString();

            this.componentsDiv.appendChild(button);

            button.onclick = function () {
                window.treeBrowser.goToChild(this.id);
            };
        });
    }

    clearDiv (div) {
        while(div && div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }

    goToNode (newNode) {
        currentNode = newNode;
        this.updateUi(newNode);
    }

    goUp () {
        if (! currentNode.parent) {
            // TODO: Friendlier notification.
            return alert('This node has no parent.');
        }

        goToNode(currentNode.parent);
    }

    goToChild (childId) {
        // alert(`calling goToChild(${childId})`);
        const child = currentNode.components.find(component => component.id === childId);

        if (! child) {
            // TODO: Friendlier notification.
            return alert(`Error: Could not find a child component with id ${ childId }. The number of child components is ${ currentNode.components.length }.`);
        }

        this.goToNode(child);
    }

    discard () {
        // TODO
        updateUi();
    }

    loadFile (fileName) {
        // Later
    }

    exampleRoot () {
        const li = new WNode('adacemyStudent');
        li.add(new WNode('smg'));
        li.add(new WNode('helmet'));

        const wren = new WNode('academyStudent');
        wren.add(new WNode('gladius'));
        wren.add(new WNode('combatShield'));

        const squad = new WNode('infantrySquad');
        squad.add(li, wren);

        return squad;
    }
};

function init () {
    window.treeBrowser = new TreeBrowser();
}

init();
