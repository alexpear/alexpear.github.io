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
					e: 'virginia',
				}
			},
			virginia: {
				displayName: 'Virginia',
				desc: 'Virginia desc',
				neighbors: {
					w: 'bambi',
				}
			},
			neworleans: {
				displayName: '',
				desc: '',
				neighbors: {
					n: 'virginia',
				}
			},
			colombia: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			andes: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			caribbean: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			atlantis: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			// Or could combine British movies. King John the lion sits the throne but the true power is unofficial: The Horned King & Maleficent, now wed.
			maleficent: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			robinhood: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			paris: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			frozen: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			gothel: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			pleasureisland: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			pridelands: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			claytonville: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			greece: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			agrabah: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			junglebook: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			china: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			kumandra: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			motunui: {
				displayName: '',
				desc: '',
				neighbors: {
					// TODO
				}
			},
			space: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			neverneverland: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			wonderland: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			strangeworld: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},
			zootopia: {
				displayName: '',
				desc: '',
				neighbors: {

				}
			},

			// Border areas - TODO: Move to separate dict.
			bambivirginia: {
				desc: 'bambi virginia border desc'
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
			const borderDesc = borderInfo ? borderInfo.desc : '';
			const dirWord = this.directionWord(dir);

			// TODO add hyperlink.
			const relationSentence = dirWord === 'exotic' ?
				'' :
				`To the ${dirWord} lies ${neighborName}. `;

			elements.push(
				this.htmlPassage(relationSentence + borderDesc)
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

			if (Object.keys(regionInfo.neighbors).length === 0) {
				console.log(`${key}.neighbors - needs to be populated`);
			}

			for (let dirKey in regionInfo.neighbors) {
				const neighborKey = regionInfo.neighbors[dirKey];

				const opposite = this.otherDirection(dirKey);
				const counterpartEntry = this.regionDict[neighborKey].neighbors[opposite];

				if (counterpartEntry !== key) {
					console.log(`${neighborKey}.neighbors.${opposite} ?= ${key}`);
				}

				const borderKey = this.borderKey(key, neighborKey);
				this.testField(borderKey, 'desc', '(border entry)');

				// const borderDesc = this.regionDict[borderKey].desc;
				// if (! borderDesc || borderDesc.length < 99) {
				// 	this.missing[borderKey].desc = 'missing';
				// }
			}
		}
	}

	// Helper func.
	testField (key, fieldName, note) {
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

			console.log(`${key}.${fieldName} -- incomplete ` + (note || ''));
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
