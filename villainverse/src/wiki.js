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
				desc: 'A new beast has begun stalking the green forest. It is Man, armed with rifles that combine Man\'s red flower with alchemical gunpowder. The newest of these men is Gaston, a bold Frenchman who is eager to tame a New World in the name of colonialism.',
				neighbors: {
					e: 'virginia',
					exotic: 'zootopia',
				}
			},
			virginia: {
				displayName: 'Virginia',
				desc: 'In the wake of devastating plagues, English colonists conquered Virginia. Then they shook off Britain\'s reins. Yet they did not abandon the project of conquest.',
				neighbors: {
					w: 'bambi',
					e: 'atlantis',
					s: 'neworleans',
					colonial: 'britain',
				}
			},
			neworleans: {
				displayName: 'New Orleans',
				desc: 'French colonists have driven out the locals & built a city they call New Orleans. As if that weren\'t bad enough, French power in the city has since been usurped by the influence of the demons of Hell. Enterprising Satanists have signed away their afterlives for the opportunity to dominate public life. Now demon summoning is openly practiced in the militia barracks & the office of the Governor-General.',
				neighbors: {
					n: 'virginia',
					s: 'colombia',
					colonial: 'paris',
				}
			},
			colombia: {
				displayName: 'Colombia',
				desc: '',
				neighbors: {
					n: 'neworleans',
					ne: 'atlantis',
					s: 'inca',
				}
			},
			inca: {
				displayName: 'the Incan Empire',
				desc: 'A shadow has fallen on the Andes. Empress Yzma sits the throne, usurper of the foolish yet rightful Cuzco. Years of studying Atlantean relics have made her a master of the alchemical arts. Now she uses this knowledge against all who disagree with her. The forest is filling with her enemies, transformed into strange animals, incompetent in their new bodies.',
				neighbors: {
					n: 'colombia',
					w: 'motunui',
				}
			},
			ursula: {
				displayName: 'the Mermaid Kingdom',
				desc: 'The Mediterranean Throne was once a noble power, preserving peace with the land & guidance over the sea. Now Ursula the Demagogue, a witch of the coldest, most foetid crevasses of the seafloor, reigns. The merfolk do not fear her, however. \'Her skin is blue but her words ring true\' is often repeated by those under the charm of her political tongue, & the charm of the treasure her sea-beasts are bringing home from the Beach Wars.',
				neighbors: {
					n: 'pleasureisland',
					ne: 'greece',
					e: 'agrabah',
					w: 'atlantis',
					se: 'pridelands',
				}
			},
			atlantis: {
				displayName: 'Atlantis',
				desc: 'For millennia, Atlantis slept, fearful of its own strength. Then, an expedition from the newly-independent USA executed a daring coup & began ruling Atlantis as a puppet state. A colony of a colony, American Atlantis is somewhere between a state & a hostage situation. Nevertheless, the new administration is learning to exploit Atlantis\' arts. Glowing stone aircraft now float in clumsy circles round Washington\'s skies. Machine guns have been bolted to their sides, but when the Americans learn to activate their crystal weapons, history may repeat itself.',
				neighbors: {
					w: 'virginia', // Washington DC colonizing Atlantis
					e: 'ursula',
					sw: 'colombia',
					distant: 'motunui',
					interplanetary: 'space',
					exotic: 'strangeworld',
					// TODO make sure directions() can handle these keys.
				}
			},
			// We combine British movies. King John the lion sits the throne but the true power is unofficial: The Horned King & Maleficent, now wed.
			britain: {
				displayName: 'Britain',
				desc: 'In London, King John the lion sits the throne. Yet the true power in the realm lies in the forests to the north: The Horned King & Maleficent, now wed.',
				neighbors: {
					e: 'arendelle',
					se: 'germany',
					s: 'paris',
					exotic: 'neverneverland',
					exotic2: 'wonderland',
					dynastic: 'pridelands',
					colonial: 'virginia',
					colonial2: 'claytonville',
				}
			},
			// Evil queen from Snow White
			germany: {
				displayName: 'Germany',
				desc: 'Europe tiptoes around its Germanic heart, fearful to displease the tyrannical Mirrorqueen. A sorceress of unnatural age, there are few secrets hidden from her mystical scrutiny. Crowded are the cemeteries with those who have plotted against her, then tasted the retribution of her poisoners.',
				neighbors: {
					nw: 'britain',
					n: 'arendelle',
					e: 'corona',
					w: 'paris',
					s: 'pleasureisland',
				}
			},
			// Beauty & the Beast characters under siege
			paris: {
				displayName: 'Paris',
				desc: 'Nowhere but Paris is the sword of purity whetted so sharp. Surrounded by the thrones of witches & sorcerers, France\'s empire keeps pace via human muscle & heart alone. The King is weak, & the true throne is Notre-Dame, where sits the self-styled Pope Severinus II, born Claude Frollo. "God\'s tools against Lucifer\'s instruments," he proclaimed as kneeling soldiers cheered, "shall restore virtue to Rome." Yet to trusted cardinals he has been heard to say, "If a witch dwells with two innocents, God will burn down the house."',
				neighbors: {
					n: 'britain',
					e: 'germany',
					se: 'pleasureisland', // Victor Hugo's Frollo was obsessed with alchemy -> soldiers hurling chains of austere alloy that magical beings cannot bear to touch.
					colonial: 'neworleans',
				}
			},
			// Frozen
			arendelle: {
				displayName: 'Arendelle',
				desc: 'In the north, King Hans has defied Rome & sided with the claimant Pope Severinus II of Paris. Called the Dawn King, he bears a flaming sceptre that is said to miraculously turn his enemies to stone. "Lies," mutters an iron-shackled woman in the silent dungeons. In the town square, her stone likeness cowers, a statue built to trick the people into believing.',
				neighbors: {
					w: 'britain',
					s: 'germany',
					se: 'corona',
				}
			},
			// Mother Gothel from Tangled
			corona: {
				displayName: 'Corona',
				desc: 'One does not speak of heirs in the sunny kingdom of Corona. Bright-smiling Queen Gothel is generous to the guildmasters, to the convents, to children dancing in the street. She has built a friendship with almost everyone, in a century-long reign. But Coronan faces harden when visitors ask about what is missing from the castle: Old Age.',
				neighbors: {
					nw: 'arendelle',
					w: 'germany',
					sw: 'pleasureisland',
					s: 'greece',
				}
			},
			pleasureisland: {
				displayName: 'Pleasure Island',
				desc: '',
				neighbors: {
					nw: 'paris',
					n: 'germany',
					ne: 'corona',
					s: 'ursula',
					e: 'greece',
				}
			},
			pridelands: {
				displayName: 'Pride Lands',
				desc: 'On the savannah, mice live like kings, each burrough a palace. The grass is empty of all creatures too slow to escape the lion\'s claw. Gazelle, wild dog, elephant, all are gathered in shivering herds, perimetered night & day by jailor lions. For cruel generations, the pride has not ruled but farmed for meat.',
				neighbors: {
					nw: 'ursula',
					n: 'agrabah',
					s: 'claytonville',
					dynastic: 'britain',
				}
			},
			claytonville: {
				displayName: 'Claytonville',
				desc: '',
				neighbors: {
					n: 'pridelands',
					colonial2: 'britain',
				}
			},
			greece: {
				displayName: 'Mount Olympos',
				desc: '',
				neighbors: {
					n: 'corona',
					w: 'pleasureisland',
					sw: 'ursula',
					se: 'agrabah',
					interplanetary2: 'space',
				}
			},
			agrabah: {
				displayName: 'Agrabah',
				desc: '',
				neighbors: {
					nw: 'greece',
					w: 'ursula',
					e: 'china',
					se: 'junglebook',
					s: 'pridelands',
				}
			},
			junglebook: {
				displayName: 'the Jungle',
				desc: '',
				neighbors: {
					nw: 'agrabah',
					ne: 'china',
					e: 'kumandra',
				}
			},
			china: {
				displayName: 'China',
				desc: '',
				neighbors: {
					w: 'agrabah',
					sw: 'junglebook',
					s: 'kumandra',
					se: 'motunui',
				}
			},
			kumandra: {
				displayName: 'Kumandra',
				desc: '',
				neighbors: {
					n: 'china',
					w: 'junglebook',
					e: 'motunui',
				}
			},
			motunui: {
				displayName: 'Motunui',
				desc: '',
				neighbors: {
					nw: 'china',
					w: 'kumandra',
					e: 'inca',
					distant: 'atlantis',
				}
			},
			space: {
				displayName: 'Outer Space',
				desc: '',
				neighbors: {
					interplanetary: 'atlantis',
					interplanetary2: 'greece',
				}
			},
			neverneverland: {
				displayName: 'Never Never Land',
				desc: '',
				neighbors: {
					exotic: 'britain',
				}
			},
			wonderland: {
				displayName: 'Wonderland',
				desc: '',
				neighbors: {
					exotic2: 'britain',
				}
			},
			strangeworld: {
				displayName: 'the Strange World',
				desc: '',
				neighbors: {
					exotic: 'atlantis',
				}
			},
			// Including House of Mouse, Duck Tales, etc
			zootopia: {
				displayName: 'Zootopia',
				desc: '',
				neighbors: {
					exotic: 'bambi',
				}
			},
		};

		this.borderDict = {
			bambivirginia: {
				desc: 'bambi virginia border desc'
			},
			// TODO
		};

		const descs = Object.values(this.regionDict)
			.concat(
				Object.values(this.borderDict)
			)
			.map(
				region => region.desc
			);

		this.regionCount = descs.length;
		this.meanDescLength = Util.sum(
			descs.map(
				desc => desc.length
			)
		) / this.regionCount;
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

		// // v2 - iterate over borderDict?
		// for (let border in this.borderDict) {

		// }
		// eh, but maintaining neighbor pointers shouldnt be hard now that i have the test funcs.

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
		const opposites = {
			nw: 'se',
			n: 's',
			ne: 'sw',
			e: 'w',
			se: 'nw',
			s: 'n',
			sw: 'ne',
			w: 'e',
		};

		return opposites[dirKey] || dirKey;
	}

	borderKey (a, b) {
		return [a, b].sort().join('');
	}

	testRegionDict () {
		for (let key in this.regionDict) {
			const regionInfo = this.regionDict[key];

			this.testField(key, 'displayName'); 
			this.testField(key, 'desc');

			if (Object.keys(regionInfo.neighbors).length <= 1) {
				console.log(`this.regionDict.${key}.neighbors - needs to be populated`);
			}

			for (let dirKey in regionInfo.neighbors) {
				const neighborKey = regionInfo.neighbors[dirKey];

				const opposite = this.otherDirection(dirKey);
				// TODO - dont complain if they point to each other with colonial and colonial2 respectively
				const counterpartEntry = this.regionDict[neighborKey].neighbors[opposite];

				if (counterpartEntry !== key) {
					console.log(`this.regionDict.${neighborKey}.neighbors -- ${opposite}: '${key}',\n`);
				}

				const borderKey = this.borderKey(key, neighborKey);
				const borderInfo = this.borderDict[borderKey];

				const goodBorderDesc = borderInfo &&
					borderInfo.desc.length >= this.meanDescLength;

				const message = borderInfo ?
					borderInfo.desc.length + ' characters' :
					'Border entry missing';

				if (! goodBorderDesc) {
					// temp commented to reduce noise
					// console.log(`this.borderDict.${borderKey}.desc -- ${message}`);
				}
			}
		}
	}

	// Helper func.
	testField (key, fieldName, note) {
		const regionInfo = this.regionDict[key];
		const content = regionInfo && regionInfo[fieldName];

		let legit = !! content;

		if (legit && fieldName === 'desc' && content.length < this.meanDescLength) {
			legit = false;
		}

		if (! legit) {
			console.log(`this.regionDict.${key}.${fieldName} -- ${content.length} characters. ` + (note || ''));
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
		// wiki.testPages();
	}
}

Wiki.run();

// TODO pin down details of entry point; how the starting pagename param is input to this script.
