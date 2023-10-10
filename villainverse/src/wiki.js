'use strict';

// Wiki for Disney Villainverse fanfiction project
// This script stores fiction passages & loads them into a HTML page.

const Util = require('../../util/util.js');

class Wiki {
	constructor () {
		this.loadDicts();
	}

	loadDicts () {
		this.regionDict = {
			// Gaston is here, colonial hunter.
			bambi: {
				displayName: 'the Deer Forest',
				desc: 'bambi desc',
				neighbors: {
					e: 'virginia',
					exotic: 'zootopia',
				}
			},
			virginia: {
				displayName: 'Virginia',
				desc: 'Virginia desc',
				neighbors: {
					w: 'bambi',
					e: 'atlantis',
				}
			},
			neworleans: {
				displayName: 'New Orleans',
				desc: '',
				neighbors: {
					n: 'virginia',
					se: 'caribbean',
					s: 'colombia',
				}
			},
			colombia: {
				displayName: 'Colombia',
				desc: '',
				neighbors: {
					n: 'neworleans',
					ne: 'caribbean',
					s: 'inca',
				}
			},
			inca: {
				displayName: 'the Incan Empire',
				desc: '',
				neighbors: {

				}
			},
			caribbean: {
				displayName: 'the Mermaid Kingdom',
				desc: '',
				neighbors: {
					nw: 'neworleans',
					ne: 'atlantis',
					s: 'colombia',
					w: 'motunui', // distantly
					exotic: 'paris', // colonial French land humans.
				}
			},
			atlantis: {
				displayName: 'Atlantis',
				desc: '',
				neighbors: {
					w: 'virginia', // Washington DC colonizing Atlantis
					sw: 'caribbean',
					exotic: 'space',
					// maybe strange world too. could add new direction 'interplanetary'
				}
			},
			// We combine British movies. King John the lion sits the throne but the true power is unofficial: The Horned King & Maleficent, now wed.
			britain: {
				displayName: 'Britain',
				desc: '',
				neighbors: {
					e: 'arendelle',
					se: 'germany',
					s: 'paris',
					// TODO opposite check should be able to handle 'exotic' etc
					exotic: 'neverneverland',
					// need keys to link to more:
					exotic2: 'wonderland',
					colonial: 'virginia',
					colonial2: 'claytonville',
				}
			},
			// Evil queen from Snow White
			germany: {
				displayName: 'Germany',
				desc: '',
				neighbors: {
					nw: 'britain',
					n: 'arendelle',
					e: 'corona',
					w: 'paris',
					s: 'pleasureisland',
				}
			},
			// Frollo from Notre Dame
			// Beauty & the Beast characters under siege
			paris: {
				displayName: 'Paris',
				desc: '',
				neighbors: {
					colonial: 'neworleans',
					colonial2: 'caribbean',
				}
			},
			// frozen
			arendelle: {
				displayName: 'Arendelle',
				desc: '',
				neighbors: {

				}
			},
			// Mother Gothel from Tangled
			corona: {
				displayName: 'Corona',
				desc: '',
				neighbors: {

				}
			},
			pleasureisland: {
				displayName: 'Pleasure Island',
				desc: '',
				neighbors: {

				}
			},
			pridelands: {
				displayName: 'Pride Lands',
				desc: '',
				neighbors: {

				}
			},
			claytonville: {
				displayName: 'Claytonville',
				desc: '',
				neighbors: {

				}
			},
			greece: {
				displayName: 'Mount Olympos',
				desc: '',
				neighbors: {

				}
			},
			agrabah: {
				displayName: 'Agrabah',
				desc: '',
				neighbors: {

				}
			},
			junglebook: {
				displayName: 'the Jungle',
				desc: '',
				neighbors: {

				}
			},
			china: {
				displayName: 'China',
				desc: '',
				neighbors: {

				}
			},
			kumandra: {
				displayName: 'Kumandra',
				desc: '',
				neighbors: {

				}
			},
			motunui: {
				displayName: 'Motunui',
				desc: '',
				neighbors: {
					// TODO
				}
			},
			space: {
				displayName: 'Outer Space',
				desc: '',
				neighbors: {

				}
			},
			neverneverland: {
				displayName: 'Never Never Land',
				desc: '',
				neighbors: {

				}
			},
			wonderland: {
				displayName: 'Wonderland',
				desc: '',
				neighbors: {

				}
			},
			strangeworld: {
				displayName: 'the Strange World',
				desc: '',
				neighbors: {

				}
			},
			zootopia: {
				displayName: 'Zootopia',
				desc: '',
				neighbors: {

				}
			},
		};

		this.borderDict = {
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
			const borderInfo = this.borderDict[borderKey];
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

			this.testField(key, 'displayName');
			this.testField(key, 'desc');

			if (Object.keys(regionInfo.neighbors).length === 0) {
				console.log(`this.regionDict.${key}.neighbors - needs to be populated`);
			}

			for (let dirKey in regionInfo.neighbors) {
				const neighborKey = regionInfo.neighbors[dirKey];

				const opposite = this.otherDirection(dirKey);
				const counterpartEntry = this.regionDict[neighborKey].neighbors[opposite];

				if (counterpartEntry !== key) {
					console.log(`this.regionDict.${neighborKey}.neighbors.${opposite} ?= ${key}`);
				}

				const borderKey = this.borderKey(key, neighborKey);

				const goodBorderDesc = this.borderDict[borderKey] &&
					this.borderDict[borderKey].desc.length > 99;

				if (! goodBorderDesc) {
					console.log(`this.borderDict.${borderKey}.desc -- incomplete`);
				}
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
			console.log(`this.regionDict.${key}.${fieldName} -- incomplete ` + (note || ''));
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
