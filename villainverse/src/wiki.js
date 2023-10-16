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
				desc: 'A new beast has begun stalking the green forest. It is Man, armed with rifles that combine Man\'s red flower with alchemical gunpowder.',
				neighbors: {
					se: 'neworleans',
					exotic: 'zootopia',
				}
			},
			virginia: {
				displayName: 'Virginia',
				desc: 'In the wake of devastating plagues, English colonists conquered Virginia. Then they shook off Britain\'s reins. Yet they did not abandon the project of conquest.',
				neighbors: {
					e: 'atlantis',
					s: 'neworleans',
					colonial: 'britain',
				}
			},
			neworleans: {
				displayName: 'New Orleans',
				desc: 'French colonists have driven out the locals & built a city they call New Orleans. As if that weren\'t bad enough, French power in the city has since been usurped by the influence of the demons of Hell. Enterprising Satanists have signed away their afterlives for the opportunity to dominate public life. Now demon summoning is openly practiced in the militia barracks & the office of the Governor-General.',
				neighbors: {
					nw: 'bambi',
					n: 'virginia',
					s: 'colombia',
					colonial: 'paris',
				}
			},
			colombia: {
				displayName: 'Encanto',
				desc: 'In a torrid clime there was a house of many marvelous virtues. One night, twelve Incan soldiers leapt through the bedroom windows, bottled the breath of everyone sleeping in the house, & flew away, carried by a giant purple hawk. A sorceress of the Andes brewed these pneumatic essences into thousands of crystal phials, laughing as she did so. Now her empire threatens Encanto\'s perimeter with its own abilities. Her armies clear the rain when attacking, & gather storms when defending. Sword-slashed soldiers jeer & pull out Chef Kronk\'s magical arepas, healing them instantly. Even the beasts of the jungle have been recruited: strong jaguar, swift toucan, agile squirrel.',
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
				desc: 'The fairies were angels once. When they fell from Heaven, some (like Tinker Bell) wavered in their convictions, flirting again with virtue. Pleasure Island is the work of a fairy who did not waver. Here, children live forgotten by the world. Here, kicking & shouting is permitted. Here, children never grow up - they grow into asses.',
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
					exotic2: 'zootopia',
				}
			},
			// Tarzan
			claytonville: {
				displayName: 'Claytonville',
				desc: 'Thousands of foreign loggers have descended on the jungle, & when their ships sail back they carry lumber for Britain & beasts for the zoos.',
				neighbors: {
					n: 'pridelands',
					colonial2: 'britain',
				}
			},
			greece: {
				displayName: 'Mount Olympos',
				desc: 'Having unleashed the Titans once more against his brother Zeus, fire-headed Hades now rules heaven. The gods have been imprisoned on the other planets, save Ares, who serves Hades, & Artemis, who no foe can catch. The blasphemous Titans now stride knee-deep in the Mediterranean, & thousands of mortals have fled Greece to evade their fickle gaze.',
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
				desc: 'The Agrabah rainforest was once a desert city. Instead of streets, it now has rivers. Instead of slums, sequoias. Mongoose & tiger pick fruit together, fangs forgotten, unaging. Beneath the forest floor sprawls an underground palace nineteen stories deep, containing Atlantean texts, jarred Proteans, pixie dust. Above the redwoods soars the skyscraper Latter Babel, seat of Jafar the Unfettered. In his veins glimmer fire, stolen from the djinn. It is no longer sorcery that he envies; it is God. Wielding the same power that produced Creation in six days, he has remade Eden in Agrabah. Now his gaze flickers across the future, plotting a Day of Judgement wherein Earth judges Heaven.',
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
				desc: 'An ancient Shaivite temple looms over a field of blackened stumps. It has been taken over by the impious Bonfire King, a mighty orangutan whose arms stretch longer than anacondas. Guarded night & day by wary gorillas, the Dynastic Fire flickers in the courtyard, fed hourly on jungle lumber. This wood, & fruit, & martial service are the tribute paid by jungle creatures to the Bonfire King. Peacocks gift him fine earthworms, & even ants carry kindling to his throne. Those defiant species, like the peaceable Bears, have woken to a red glow at midnight, & fled as their homes transformed to Hellfire, then ashes. But guilt glowers too, in the heart of torchbearing Abu on the steps of the temple.',
				neighbors: {
					nw: 'agrabah',
					ne: 'china',
					e: 'kumandra',
				}
			},
			china: {
				displayName: 'China',
				desc: 'After Bori Khan touched his torch to the kindling & burned the Emperor alive, he sent messengers to every village of China & of his conquered lands (in other words to every corner of Asia) saying the Emperor had not been killed. "The Emperor could no longer ignore the will of Heaven & declared Bori Khan his heir. Now he attends higher matters on pilgramage to the Four Mountains." But to me he said, "Return to Venice, beyond even my grasp. Of every land in this world, listen to its multiple stories, & record that which glows brightest in your heart." And so I have done.',
				neighbors: {
					w: 'agrabah',
					sw: 'junglebook',
					s: 'kumandra',
					se: 'motunui',
				}
			},
			kumandra: {
				displayName: 'Kumandra',
				desc: 'In the Land of Statues, art rules & artists cower. Upon its five thrones sit silent-shouting statues. Its streets are populated with stone people of masterful vitality. Only in five secret places - cave, roof, boat, tower, treetop - do five underfed humans draw breath. They cannot leave, for they cannot trust anyone beyond the blue glow of what they hold in their hands.',
				neighbors: {
					n: 'china',
					w: 'junglebook',
					e: 'motunui',
				}
			},
			motunui: {
				displayName: 'Motunui',
				desc: 'When Death seized Heaven\'s throne, he conscripted the wayward Titans to enforce his plutocracy. Lava-blooded Te Ka, now a Hadean vassal, strides the ocean demanding treasure. Islands that do not tithe must evacuate, enduring a long voyage to an uncertain harbor. Those that give up their heirlooms must quickly find or steal more before the firetyrant returns to the island. The only fearless places here are the smoking footsteps of towering Te Ka, new islands in the ocean, drawing squabbling birds, seals, green grass.',
				neighbors: {
					nw: 'china',
					w: 'kumandra',
					e: 'inca',
					distant: 'atlantis',
				}
			},
			space: {
				displayName: 'Outer Space',
				desc: 'Throughout the universe, no planet is as feared as Aurelion, the world where everything is for sale. Ever since the planet was purchased by the pirate Captain Flint, United Galactic Federation sessions have lapsed into apprehensive silence, as all listen to the new Aurelion representative, Senator John Silver. For no armada has yet forestalled Flint\'s audacious raids, nor has any ruler outrun his vengeful ships. As a sword cannot slice a shadow, so no army can defy the Captain. And unless the Federation wants things to get uncomfortable, suggests Senator Silver, they should allow Captain Flint to commission custom weapons from geneticist Dr Jumba Jookiba...',
				neighbors: {
					interplanetary: 'atlantis',
					interplanetary2: 'greece',
				}
			},
			neverneverland: {
				displayName: 'Never Never Land',
				desc: 'When infants Romulus & Remus were left to die among seven wild hills, they were found at night by a she-wolf. She carried them through a secret tunnel to an island of fairies & mermaids, where they lived in a willow-tree. Ever since, this tree (or trees or houses of similarly low quality) has been home to those children who find themselves outdoors at night with nowhere to go. But all beings under God are capable of sin, & there came a time when some of these lost ones marauded in a ship under a cruel Captain. And in time it happened that these pirates cut down the willow-tree (or tree-house, or driftwood-house) & claimed the next lost child directly as their cabin boy. "It is we who run this island," they said to him, "so get your head out of the clouds & work!"',
				neighbors: {
					exotic: 'britain',
				}
			},
			wonderland: {
				displayName: 'Wonderland',
				desc: 'In your house or mine, the pet is the guest of humanity. But in different worlds it is otherwise. The Red Queen is in truth a kitten, but to call her that is to violate her fiercest edict, since a cat on the throne would make no sense.',
				neighbors: {
					exotic2: 'britain',
				}
			},
			strangeworld: {
				displayName: 'the Strange World',
				desc: 'Somewhere in the starry dance of Night, there is a world where Nature has tamed Humanity. Some wayward ancients ventured there long ago, but little knowledge can reach us from that place. The last letter received from such a visitor read, "Strange this new world is, but I have found my home. With these words I write my last."',
				neighbors: {
					exotic: 'atlantis',
				}
			},
			// Including House of Mouse, Duck Tales, etc
			zootopia: {
				displayName: 'Zootopia',
				desc: 'There is a land unknown to Human where the claw is subject to the paw. The lions march shackled before the mocking-tongued goats. Civility & cruelty hold hands in Zootopia, where sophisticated sheep keep their brother animals in chains. Those who show mercy are exiled to the countryside ... but may perhaps befriend an outlaw trio there, duck dog & mouse, who live as casteless equals.',
				neighbors: {
					exotic: 'bambi',
					exotic2: 'pridelands',
				}
			},
		};

		this.borderDict = {
		    bambineworleans: {
		        desc: 'The newest hunter in the wild forests is Gaston, a bold Frenchman who is eager to tame a New World in the name of colonialism.',
		    },
		    pridelandszootopia: {
		        desc: '',
		    },
		    bambizootopia: {
		        desc: '',
		    },
		    atlantisvirginia: {
		        desc: '',
		    },
		    neworleansvirginia: {
		        desc: '',
		    },
		    britainvirginia: {
		        desc: '',
		    },
		    colombianeworleans: {
		        desc: '',
		    },
		    neworleansparis: {
		        desc: '',
		    },
		    atlantiscolombia: {
		        desc: '',
		    },
		    colombiainca: {
		        desc: '',
		    },
		    incamotunui: {
		        desc: '',
		    },
		    pleasureislandursula: {
		        desc: '',
		    },
		    greeceursula: {
		        desc: '',
		    },
		    agrabahursula: {
		        desc: '',
		    },
		    atlantisursula: {
		        desc: '',
		    },
		    pridelandsursula: {
		        desc: '',
		    },
		    atlantismotunui: {
		        desc: '',
		    },
		    atlantisspace: {
		        desc: '',
		    },
		    atlantisstrangeworld: {
		        desc: '',
		    },
		    arendellebritain: {
		        desc: '',
		    },
		    britaingermany: {
		        desc: '',
		    },
		    britainparis: {
		        desc: '',
		    },
		    britainneverneverland: {
		        desc: '',
		    },
		    britainwonderland: {
		        desc: '',
		    },
		    britainpridelands: {
		        desc: '',
		    },
		    britainclaytonville: {
		        desc: '',
		    },
		    arendellegermany: {
		        desc: '',
		    },
		    coronagermany: {
		        desc: '',
		    },
		    germanyparis: {
		        desc: '',
		    },
		    germanypleasureisland: {
		        desc: '',
		    },
		    parispleasureisland: {
		        desc: '',
		    },
		    arendellecorona: {
		        desc: '',
		    },
		    coronapleasureisland: {
		        desc: '',
		    },
		    coronagreece: {
		        desc: '',
		    },
		    greecepleasureisland: {
		        desc: '',
		    },
		    agrabahpridelands: {
		        desc: '',
		    },
		    claytonvillepridelands: {
		        desc: '',
		    },
		    agrabahgreece: {
		        desc: '',
		    },
		    greecespace: {
		        desc: '',
		    },
		    agrabahchina: {
		        desc: '',
		    },
		    agrabahjunglebook: {
		        desc: '',
		    },
		    chinajunglebook: {
		        desc: '',
		    },
		    junglebookkumandra: {
		        desc: '',
		    },
		    chinakumandra: {
		        desc: '',
		    },
		    chinamotunui: {
		        desc: '',
		    },
		    kumandramotunui: {
		        desc: ''
		    },
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

			const neighborCount = Object.keys(regionInfo.neighbors).length;
			if (neighborCount <= 0) {
				console.log(`this.regionDict.${key}.neighbors has ${neighborCount} entries - needs to be populated`);
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
					// Add it in-memory for later printing.
					this.borderDict[borderKey] = borderInfo || {desc: ''};

					// Temporarily comment this to reduce noise.
					console.log(`  this.borderDict.${borderKey}.desc -- ${message}`);
				}
			}
		}

		// Uncomment to print pasteable blank border entries.
		// console.log(
		// 	Util.stringify(this.borderDict)
		// );
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
