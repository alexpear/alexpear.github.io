'use strict';

const StorageModes = require('../wnode/storageModes.js');
const Util = require('../util/util.js');
const WGenerator = require('../generation/wgenerator.js');
const WNode = require('../wnode/wnode.js');

const Hotkeys = require('hotkeys-js');

// Tree Navigator on alexpear.github.io

const TreeBrowser = module.exports = class TreeBrowser {
    constructor (generator, root) {
        this.generator = generator || WGenerator.exampleGenerator();
        this.root = root || this.newRoot();
        this.currentNode = this.root;
        this.storedNodeCount = this.root.subtreeSize();

        this.parentButton = document.getElementById('parentButton');

        if (!this.parentButton) {
            console.log('parentButton seems undefined :o :o');
        }

        Hotkeys('`', (event, handler) => {
            this.parentButton.click();
        });

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

            this.updatePropertiesDiv(newNode);

            // TODO newNode has a circular reference, according to JSON.stringify()
            this.currentNodeName.innerHTML = newNode.toSimpleString();

            this.updateComponentButtons(newNode);
        }
    }

    updatePropertiesDiv (newNode) {
        this.propertiesDiv.innerHTML = newNode.getPropText();
    }

    async updateComponentButtons (newNode) {
        this.clearComponentShortcuts();
        this.clearDiv(this.componentsDiv);

        await this.sleep(100);

        newNode.components.forEach((component, index) => {
            const button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('id', component.id);
            button.classList.add('iconButton');
            button.value = component.toSimpleString();

            // Keys 1-9 are keyboard shortcuts
            if (index <= 8) {
                const numberString = (index + 1).toString();
                Hotkeys(numberString, (event, handler) => {
                    button.click();
                    console.log(`Detected keyboard shortcut ${numberString} and going to ${button.value}`);
                });
            }

            this.componentsDiv.appendChild(button);

            button.onclick = function () {
                window.treeBrowser.goToChild(this.id);
            };
        });
    }

    clearComponentShortcuts () {
        for (let i = 1; i <= this.componentsDiv.childElementCount; i++) {
            Hotkeys.unbind(i.toString());
            // console.log(`Cleared hotkey ${i}`);
        }
    }

    clearDiv (div) {
        while(div && div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }

    goToNode (newNode) {
        this.currentNode = newNode;
        this.updateCache(newNode);
        this.updateUi(newNode);
    }

    goUp () {
        if (! this.currentNode.parent) {
            console.log('Cannot go up to parent because this node has no parent.');
            return;
        }

        this.goToNode(this.currentNode.parent);
    }

    goToChild (childId) {
        const child = this.currentNode.components.find(component => component.id === childId);

        if (! child) {
            // LATER: Friendlier notification.
            return alert(`Error: Could not find a child component with id ${ childId }. The number of child components is ${ this.currentNode.components.length }.`);
        }

        this.goToNode(child);
    }

    updateCache (visitedNode) {
        if (! visitedNode || ! this.generator) {
            Util.log(`Cannot update tree cache. Not enough information present to generate nodes. Generator is ${this.generator ? 'present, however' : 'absent'}.`, 'error');
            return;
        }

        // TODO flesh this out
        // If visitedNode is a Partial, generate any missing children.
        if (visitedNode.storageMode === StorageModes.Partial) {
            const existingChildCount = visitedNode.components.length;

            // this.generator.maybeAddChildrenOnly(visitedNode);

            // Update total count.
            const newNodeCount = visitedNode.components.length - existingChildCount;
            this.storedNodeCount += newNodeCount;
        }

        // check whether there are too many nodes in the tree.
        if (this.storedNodeCount >= TreeBrowser.TOO_MANY_NODES) {
            // this.pruneOldest();
        }
    }

    // Later perhaps move the pruning logic to a more backendy func. TreeBrowser can be frontend.
    pruneOldest () {
        const toBeRemoved = this.storedNodeCount - TreeBrowser.PRUNE_DOWN_TO;

        // Later, we can make this more efficient.
        const allNodes = [];

        // First draft: Add all nodes to the allNodes array. Sort them by lastVisited.
        // Slice off the oldest chunk of allNodes. Iterate over that chunk and drop each node.
        // Drop in this context means: go to curNode's parent and modify its parent's components array such that curNode is no longer in it.
        // The root cannot be dropped because it has no parent. Skip it.

        // Or, after sorting and finding the set of WNodes to prune, look at the lastVisited timestamp of the newest of that set. Then call wnode.pruneIfOlderThan(timestamp) recursively across the tree.
        // Aka .pruneIfOld(timestamp)

        while (toBeRemoved > 0) {

        }
    }

    discard () {
        // TODO
        this.updateUi();
    }

    loadFile (fileName) {
        // Later
    }

    newRoot () {
        return this.generator.getOutputs()[0];
    }

    static exampleRoot () {
        const wgen = WGenerator.exampleGenerator();
        const outputs = wgen.getOutputs();
        return outputs[0];
    }

    // TODO add to utils.js
    sleep (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

TreeBrowser.PRUNE_CEILING = 10; // 100000000;
TreeBrowser.PRUNE_DOWN_TO = 5;  // 10000000;

function init () {
    window.treeBrowser = new TreeBrowser();
}

// Make the bundle like this in the CLI:
// browserify treeBrowser.js -o bundle.js

init();
