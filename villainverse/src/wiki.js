'use strict';

// Wiki for Disney Villainverse fanfiction project
// This script stores fiction passages & loads them into a HTML page.

const Util = require('../../util/util.js');

class Wiki {
	constructor () {
		this.loadDict();
	}

	loadDict () {
		this.regionDict = {
			bambi: {
				displayName: 'Deer Forest',
				desc: 'bambi desc',
				neighbors: {
					e: 'pocahontas',
				}
			},
			pocahontas: {
				displayName: 'Virginia',
				desc: 'Virginia desc',
				neighbors: {
					w: 'bambi',
				}
			},
			princessfrog: {
				displayName: '',
				desc: '',
				neighbors: {
					n: 'pocahontas',
				}
			},
			// TODO

			// Border areas
			bambipocahontas: {
				desc: 'bambi pocahontas border desc'
			},
			// TODO
		};
	}

	pageHtmlStr (pageKey) {
		const regionInfo = this.regionDict[pageKey];
		const elements = [
			this.asElement(regionInfo.displayName, 'label'),
			this.htmlPassage(regionInfo.desc),
		];

		for (let dir of this.directions()) {
			const neighborKey = regionInfo.neighbors[dir];

			// Util.logDebug(`wiki.pageHtmlStr(${pageKey}), top of for() loop, dir is ${dir}.`);

			if (! neighborKey) { continue; }

			const neighborName = this.regionDict[neighborKey].displayName;
			const borderKey = this.borderKey(pageKey, neighborKey);
			const borderInfo = this.regionDict[borderKey];
			const dirWord = this.directionWord(dir);

			const relationSentence = dirWord === 'exotic' ?
				'' :
				`To the ${dirWord} lies ${neighborName}. `;

			elements.push(
				this.htmlPassage(relationSentence + borderInfo.desc)
			);

			// Util.logDebug(`wiki.pageHtmlStr(${pageKey}), bottom of for() loop, dir is ${dir}. elements[last] is ${elements[elements.length - 1]}`);
		}

		return elements.join('\n');
	}

	htmlPassage (content) {
		return this.asElement(content, 'p');
	}

	asElement (content, elementName) {
		// TODO make content HTML-friendly
		return `<${elementName}>${content}</${elementName}>`;
	}

	directions () {
		return [ 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'exotic'];
	}

	directionWord (dirKey) {
		const DIR_DICT = {
			nw: 'northwest',
			n: 'north',
			ne: 'northeast',
			e: 'east',
			se: 'southeast',
			s: 'south',
			sw: 'southwest',
			w: 'west',
			exotic: 'exotic',
		};

		return DIR_DICT[dirKey];
	}

	otherDirection (dirKey) {
		return {
			nw: 'se',
			n: 's',
			ne: 'sw',
			e: 'w',
			se: 'nw',
			s: 'n',
			sw: 'ne',
			w: 'e',
		}
		[dirKey];
	}

	borderKey (a, b) {
		return [a, b].sort().join('');
	}

	testRegionDict () {
		for (let key in this.regionDict) {
			const regionInfo = this.regionDict[key];
			if (! regionInfo.neighbors) { continue; } // border case

			this.testField(key, 'displayName');
			this.testField(key, 'desc');

			for (let dirKey in regionInfo.neighbors) {
				const neighborKey = regionInfo.neighbors[dirKey];

				const opposite = this.otherDirection(dirKey);
				const counterpartEntry = this.regionDict[neighborKey].neighbors[opposite];

				if (counterpartEntry !== key) {
					console.log(`${neighborKey}.neighbors.${opposite} ?= ${key}`);
				}

				const borderKey = this.borderKey(key, neighborKey);
				this.testField(borderKey, 'desc');

				// const borderDesc = this.regionDict[borderKey].desc;
				// if (! borderDesc || borderDesc.length < 99) {
				// 	this.missing[borderKey].desc = 'missing';
				// }
			}
		}
	}

	// Helper func.
	testField (key, fieldName) {
		const regionInfo = this.regionDict[key];
		const content = regionInfo && regionInfo[fieldName];

		let legit = !! content;

		if (legit && fieldName === 'desc' && content.length < 99) {
			legit = false;
		}

		if (! legit) {
			// const info = {};
			// info[fieldName] = 'incomplete';
			// this.missing[key] = info;

			console.log(`${key}.${fieldName} -- incomplete`);
		}
	}

	testPages () {
		for (let key in this.regionDict) {
			const info = this.regionDict[key];
			if (! info.neighbors) { continue; }

			console.log(
				'\n' + this.pageHtmlStr(key) + '\n'
			);
		}
	}

	updateHTML (pageKey) {
		// this.articleMain.innerHTML = displayString;
	}

	static run () {
		const wiki = new Wiki();
		wiki.testRegionDict();
		wiki.testPages();
	}
}

Wiki.run();

// TODO pin down details of entry point; how the starting pagename param is input to this script.
