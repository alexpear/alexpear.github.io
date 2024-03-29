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
                displayName: 'the United States',
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
                desc: 'In a torrid clime there was a house of many marvelous virtues. Alone in this world, Encanto is ruled not by evil but by good.',
                neighbors: {
                    n: 'neworleans',
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
                desc: 'The Mediterranean Throne was once a noble power, preserving peace with the land & guidance over the sea. Now Ursula the Demagogue, a witch of the coldest, most foetid crevasses of the seafloor, reigns. The merfolk do not fear her, however. "Her skin is blue but her words ring true," is often repeated by those under the charm of her political tongue, & the charm of the treasure her sea-beasts are bringing home from the Beach Wars.',
                neighbors: {
                    n: 'pleasureisland',
                    ne: 'greece',
                    e: 'agrabah',
                    w: 'atlantis',
                }
            },
            atlantis: {
                displayName: 'Atlantis',
                desc: 'For millennia, Atlantis slept, fearful of its own strength. Then, an expedition from the newly-independent USA executed a daring coup & began ruling Atlantis as a puppet state. A colony of a colony, American Atlantis is somewhere between a state & a hostage situation.',
                neighbors: {
                    w: 'virginia', // Washington DC colonizing Atlantis
                    e: 'ursula',
                    distant: 'motunui',
                    interplanetary: 'space',
                    exotic: 'strangeworld',
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
                }
            },
            // Evil queen from Snow White
            germany: {
                displayName: 'Germany',
                desc: 'Europe has long tiptoed around its Germanic heart, fearful to displease the tyrannical Mirrorqueen. A sorceress of unnatural age, there are few secrets hidden from her mystical scrutiny. Crowded are the cemeteries with those who have plotted against her, then tasted the retribution of her poison.',
                neighbors: {
                    nw: 'britain',
                    n: 'arendelle',
                    e: 'corona',
                    w: 'paris',
                }
            },
            // Beauty & the Beast characters under siege
            paris: {
                displayName: 'Paris',
                desc: 'Nowhere but Paris is the sword of purity whetted so sharp. Surrounded by the thrones of witches & sorcerers, France\'s empire keeps pace via human muscle & heart alone. The King is weak, & the true throne is Notre-Dame, where sits the self-styled Pope Severinus II, born Claude Frollo. "God\'s tools against Lucifer\'s instruments," he proclaimed as kneeling soldiers cheered, "shall restore virtue to Rome." Yet to trusted cardinals he has been heard to say, "If a witch dwells with two innocents, God will burn down the house."',
                neighbors: {
                    n: 'britain',
                    e: 'germany',
                    se: 'pleasureisland', // Victor Hugo's Frollo was obsessed with alchemy
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
                    ne: 'corona',
                    s: 'ursula',
                    exotic2: 'neverneverland',
                }
            },
            pridelands: {
                displayName: 'the Pride Lands',
                desc: 'On the savannah, mice live like kings, each burrow a palace. The grass is empty of all creatures too slow to escape the lion\'s claw. Gazelle, wild dog, elephant, all are gathered in shivering herds, perimetered night & day by jailor lions. For cruel generations, the pride has not ruled but farmed for meat.',
                neighbors: {
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
                    // zootopia?
                }
            },
            greece: {
                displayName: 'Mount Olympos',
                desc: 'Having unleashed the Titans once more against his brother Zeus, fire-headed Hades now rules heaven. The gods have been imprisoned on the other planets, save Ares, who serves Hades, & Artemis, who no foe can catch. The blasphemous Titans now stride knee-deep in the Mediterranean, & thousands of mortals have fled Greece to evade their fickle gaze.',
                neighbors: {
                    n: 'corona',
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
                    exotic3: 'zootopia',
                }
            },
            junglebook: {
                displayName: 'the Jungle',
                desc: 'An ancient Shaivite temple looms over a field of blackened stumps. It has been taken over by the impious Bonfire King, a mighty orangutan whose arms stretch longer than anacondas. Guarded night & day by wary gibbons, the Dynastic Fire flickers in the courtyard, fed hourly on jungle lumber. This wood, & fruit, & martial service are the tribute paid by jungle creatures to the Bonfire King. Peacocks gift him fine earthworms, & even ants carry kindling to his throne. Those defiant species, like the peaceable Bears, have woken to a red glow at midnight, & fled as their homes transformed to Hellfire, then ashes. But guilt glowers too, in the heart of torchbearing Abu on the steps of the temple.',
                neighbors: {
                    nw: 'agrabah',
                    ne: 'china',
                    e: 'kumandra',
                }
            },
            china: {
                displayName: 'China',
                desc: 'After Bori Khan touched his torch to the kindling & burned the Emperor alive, he sent messengers to every village of China & of his conquered lands (in other words to every corner of Asia) saying the Emperor had not been killed. "The Emperor could no longer ignore the will of Heaven & declared Bori Khan his heir. Now he attends higher matters on pilgramage to the Four Mountains." But to me he said, "Return to Venezia, beyond even my grasp. Of every land in this world, listen to its multiple stories, & record that which glows brightest in your heart." And so I have done.',
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
                desc: 'When Death seized Heaven\'s throne, he conscripted the wayward Titans to enforce his plutocracy. Lava-blooded Te Kā, now a Hadean vassal, strides the ocean demanding treasure. Islands that do not tithe must evacuate, enduring a long voyage to an uncertain harbor. Those that give up their heirlooms must quickly find or steal more before the firetyrant returns to the island. The only fearless places here are the smoking footsteps of towering Te Kā, new islands in the ocean, drawing squabbling birds, seals, green grass.',
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
                    exotic2: 'pleasureisland',
                    exotic3: 'wonderland',
                }
            },
            wonderland: {
                displayName: 'Wonderland',
                desc: 'In your house or mine, the pet is the guest of humanity. But in different worlds it is otherwise. The Red Queen is in truth a kitten, but to call her that is to violate her fiercest edict, since a cat on the throne would make no sense.',
                neighbors: {
                    exotic2: 'britain',
                    exotic3: 'neverneverland',
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
                desc: 'There is a land unknown to Human where the claw is subject to the hoof. The lions march shackled before the mocking-tongued goats. Civility & cruelty hold hands in Zootopia, where unfree Pluto\'s jeweled collar reads "Property of Scrooge McDuck". Those who show mercy are exiled to the countryside ... but may perhaps befriend an outlaw trio there, duck dog & mouse, who live as casteless equals.',
                neighbors: {
                    exotic: 'bambi',
                    exotic2: 'pridelands',
                    exotic3: 'agrabah',
                }
            },
        };

        this.borderDict = {
            bambineworleans: {
                desc: 'The newest hunter in the wild forests is Gaston, a bold Frenchman who is eager to tame a New World in the name of colonialism.',
            },
            pridelandszootopia: {
                desc: 'The young lions of the Pride are trained by scouting for rabbit-holes that lead to Zootopia. Well-armed bunnies & rats make sprinting raids on predator territory, trying to free prisoners & effect regime change.',
            },
            bambizootopia: {
                desc: 'Walking the deer paths that connect the worlds, Great Prince of the Forest Bambi emerges from Savannah Central Park in Zootopia with his antlers held high. He is here to give a speech on the harmony between prey & predators.',
            },
            atlantisvirginia: {
                desc: 'The new administration of Atlantis is learning to exploit the lost city\' arts. Glowing stone aircraft now float in clumsy circles round Washington\'s skies. Machine guns have been bolted to their sides, but when the Americans learn to activate their crystal weapons, history may repeat itself.',
            },
            neworleansvirginia: {
                desc: 'The hotels of Georgia are packed with preachers, called to defend their nation against Lousiana demons.',
            },
            britainvirginia: {
                desc: 'King John is not happy to have lost thirteen colonies worth of tax revenue.',
            },
            colombianeworleans: {
                desc: 'French ships periodically sail to conquer Encanto, but the winds of Pepa Madrigal\'s heart have so far prevented them from reaching shore. But the faces in Bruno\'s vision worry him, faces that are only pretending to be voodoo spirits.',
            },
            neworleansparis: {
                desc: 'Paris has put tariffs upon Louisiana to punish her for her traffic with the underworld. Plainclothes Jesuits, it is said, frequent the saloons of New Orleans, tricking fools into revealing the true names of devils.',
            },
            colombiainca: {
                desc: 'One night, twelve Incan soldiers leapt through the windows of Casa Madrigal, bottled the breath of everyone sleeping in the house, & flew away, carried by a giant purple hawk. A sorceress of the Andes brewed these pneumatic essences into thousands of crystal phials, laughing as she did so. Now her empire threatens Encanto\'s perimeter with its own abilities. Her armies clear the rain when attacking, & gather storms when defending. Sword-slashed soldiers jeer & pull out Chef Kronk\'s magical arepas, healing them instantly. Even the beasts of the jungle have been recruited: strong jaguar, swift toucan, tricky squirrel.',
            },
            incamotunui: {
                desc: 'One shipborne polity has fled Te Kā all the way to the Incan coast, bearing with them the defeated yet cheerful demigod Maui. Claiming a forgotten harbor as their new home, they were immediately engaged by the forces of the irate Empress. But while the Empire has mastered the mountains, none can match Maui at sea. Dispatching the sorceress\' octopus-form soldiers, he opines, "What could be better than a world full of foes?"',
            },
            pleasureislandursula: {
                desc: 'The children of Pleasure Island know well the rumor that eels will grab your ankle & pull you into the sea. Thinking their peers liars, they swim anyway. On one occasion, an overambitious eel was herself captured thanks to the whale Monstro, & held prisoner in an old bathtub. When thousands of murky lobsters crawled up the beach to rescue her, the children decided to fight to the death. And they would surely have been pinched to smithereens, had not a winged woman in an elegant blue dress descended, fighting on the front lines with them.',
            },
            greeceursula: {
                desc: 'Even water dies as it pours down the River Styx. Draining from the ocean to Tartarus, it bears the Mermaid Kingdom\'s toughest strike force of sharks & lobsters, who tear into the defending shades of Persephone, ruler of the underworld in Hades\' absence. Ferryman Chiron flees before Ursula\'s new allies: beastbodied Scylla & austere Thetis, mother of Achilles.',
            },
            agrabahursula: {
                desc: 'At the feet of Agrabah\'s walls huddle throngs of pilgrims from every land. And here shelter too two lovers, who arrived in a battered regal stagecoach full of knickknacks & fish. Suddenly, they are assailed by two enchanted sharks, their tails replaced with powerful legs! Fleeing these attackers, the redheaded lover trips & stumbles. As the sharks leap at her, she twists & draws two finecrafted blades from the scabbards on her back. In a crash of knees & fins, she slashes the hunters dead, for her arms are her most skillful limbs.',
            },
            agrabahzootopia: {
                desc: 'Every full moon in Zootopia\'s Sahara Square, the winged Simurgh carries armed emissaries from Agrabah. Bridled hyenas she bears, with hares in the saddles. These intruders are resisted immediately by Zootopia\'s Herbivore Corps. Tortoise veterans strike at the hyenas with spears. Gorilla charioteers toss nets to capture the away-darting fallen hares.',
            },
            atlantisursula: {
                desc: 'As giant squid grapple the sensors of the Atlantean Leviathan, a delegation of sharks rushes past, surging into the waterways of the lost city. They carry shipwreck gold & paperwork. Ursula wishes to make a generous donation to the Smithsonian Institution, & become a minority shareholder in the Ulysses expedition. For Ursula\'s endgame is to be queen of Atlantis & the one profession the Americans forgot to bring is lawyer.',
            },
            atlantismotunui: {
                desc: 'Although the life-giving Titan Te Fiti never harbored any intention of war, the ancient Atlanteans watched her with fearful mistrust. The mere existence of beings like her motivated the development of their incredible forcefields & weaponry.',
            },
            atlantisspace: {
                desc: 'Atlantis has long known the secrets of riding a pillar of alchemical fire up into the heavens. Now, American expeditions ride Atlantean spacecraft they barely understand into deep space. Speeding boldly towards planets rumored to contain lost technology, they pray to evade the telescopes of Captain Flint\'s pirates.',
            },
            atlantisstrangeworld: {
                desc: 'The Illumineers of ancient Atlantis were familiar with the strange world of Avalonia - perhaps even with every world.',
            },
            arendellebritain: {
                desc: 'Ice statues gleam as London readies for the royal wedding. King Hans has offered the hand of Princess Anna to King John the Lion. Everyone is delighted by the arrangment, except the bride, who mutters behind her veil, "Love is a one-way door".',
            },
            britaingermany: {
                desc: 'England & Germany are at peace in the same way that two rival anthills seem soundless from above, yet are tearing enemy limbs off below the leaves & soil. In München, traitorous dryads ambush solitary woodsmen. In Oxford, spies posing as theology students steal books of Merlin\'s secrets.',
            },
            britainparis: {
                desc: 'French troops have landed at Dover & fortified their camps. The French knights swing chains of cold iron, which is agony to fairies. English longbowmen take aim behind ranks of horned & winged defenders.',
            },
            britainneverneverland: {
                desc: 'The fairies of Neverland were born in London, but fled its iron fences, iron mills, iron doorknobs. Fey armies of Maleficent regularly alight upon Neverland\'s shores to steal its fabulous treasures. But the locals are wily & stubborn, & defend their isle like crows against hawks.',
            },
            britainwonderland: {
                desc: 'Many beings have failed to map Wonderland. One cartographer, called Alice of Oxford, instead models that land as a probabilistic vector grid, with each square of the grid sending you up, down, left, or right with peculiar likelihoods. These peculiarities can be summed into overall chances of being ejected off the grid into various other lands. Alice landed in Northern Oz, where she now lives with her scarecrow husband.',
            },
            britainpridelands: {
                desc: 'English ships bearing gold & dried meat support the Pride regime, for King John is in fact a descendant of the Scar dynasty.',
            },
            arendellegermany: {
                desc: '"I don\'t know how you got in here," says the women beneath Arendelle Castle, "but I want nothing of your sorcery. Vade retro me satana!" But the hook-nosed witch smiles patiently.',
            },
            coronagermany: {
                desc: 'The relationship between Queen Gothel & the Mirrorqueen is long & wrinkled with complications. Recent betrayals have poisoned the trust that was cultivated over a century of stable cold war. Queen Gothel stares into a basin of shimmering quicksilver. In the unnatural reflection, the Mirrorqueen\'s Garden of Fey Flowers shines in twelve colors, none quite as fair as sunlight.',
            },
            germanyparis: {
                desc: 'The Mirrorqueen has instructed Quasimodo, by letter from beggar to Beggar King to hunchback, to sprinkle the false Pope\'s food with soporific powder. Holding the readied apple in his hands, he watches mass from above, praying.',
            },
            parispleasureisland: {
                desc: 'Every year on Good Friday, French soldiers storm Pleasure Island, fighting their way past a new form of beast or illusion. If they win, they sheath their swords & seize as many children as they can. Terrific are the yells of the all-fighting children as they unwisely resist the rescue.',
            },
            arendellecorona: {
                desc: 'The trolls fear Corona, & will not sail upon its waters. They believe its clear sunlight will turn them to stone.',
            },
            coronapleasureisland: {
                desc: '"Back at home," the children often say mid-horseplay, "did you ever see anything crazy? Did you ever see anything that glows?" For there are such things in this world. "Cause you should never talk about it! Or the purple people will lock you up!" And indeed, there are grownups in purple finery sometimes, grownups more interested in children than in donkeys. They ask you if you\'ve ever seen a fallen star, or a sad little angel, the same color as your hair, perhaps.',
            },
            coronagreece: {
                desc: 'One night per year, the Titan Tethys lowers her bone-cold palm to the gate of Corona, to collect three wagonloads of tithed gold. The following night, as they have for decades, the cofferless Coronans light flying lanterns & speak of hope.',
            },
            agrabahpridelands: { // Book of Daniel
                desc: 'Some nights, the lions sing pride-songs of their preparations for conquest. One night, they were midsong silenced & their mouths shut, for in the central bonfire there had flickered up from nowhere a human. "Lo!", she said, "I am Nasira, emissary of Almighty Jafar. I know that you have dreamed of four kingdoms. A reign of lions. A reign of demons. A reign of lesser cats. And a reign of iron. You dream the truth! The world will bristle with the armies of conquerors, & the fourth conqueror will be the great Jafar." And throughout the den the lions\' mouths were shut.',
            },
            claytonvillepridelands: {
                desc: 'Cruel traps perimeter the woods around Claytonville. Any beast netted is sold by weight to the farms of the meat-hungry Pride.',
            },
            agrabahgreece: {
                desc: 'The Agrabah Sultinate is the only power in the Mediterranean that can match the might of Mount Olympos. Serpents of fire patrol Jerusalem\'s walls, as the jealous Cyclops wades out of the sea to make war.',
            },
            greecespace: {
                desc: 'We rent our bodies from Hades, we do not own. Yet the Stovetop Tyrant asks the Federation for an advance, a tithe of early death. Asphyxiation imps & starlight Titans besiege once-healthy planets. But thousands of creatures fire back in defense - one Galactic Armada uniform worn by bodies of a thousand shapes & sizes',
            },
            agrabahchina: {
                desc: 'Asura Jafar, as he is known to the Khan, forgets the Earth, & his green Garden walls stand lightly guarded. But when the sagittary cavalry breach the East Gate, marvels assail them ex nihilo. King David, young, resists, ringed by slingslain corpses. Fishhooked Leviathan churns the Palace moat. Bow-armed Lazarus is shot down twelve times, but plucks & refires arrows from his own corpse.',
            },
            agrabahjunglebook: {
                desc: 'On his morning walk through the Garden, Jafar caresses a mighty jungle vine curiously. Then he asks: "Interloper, name thyself!" The vine unloops: a great python. "The name\'s Kaa, of the Jungle of the Bonfire King." Jafar unloops also, rising tree-tall in form of serpent. "You hide from a friend, legless one," says Jafar. "I too am of fire." Kaa replies, with hungry eyes: "I know, the smokeless fire at your fingertips. But I wonder if your mind is of similar strength, or if that is your weakness..." And Jafar gazes back, & wonders also.',
            },
            chinajunglebook: {
                desc: 'Surprised by the agility & aggression of the Bonfire King\'s apes, the Hun armies have retreated to the Great Wall, defending it from the Chinese side. Horse archers skirmish against elephant-riding monkeys, while macaques throw stolen gunpowder bombs.',
            },
            junglebookkumandra: {
                desc: 'Statues of firebearing apes decorate the borderlands. Yet the sneakiest monkeys managed to evade the billowing Druun. They lurk in the Kumandran treetops, waiting for a moment of carelessness in which to steal a shiny object.',
            },
            chinakumandra: {
                desc: 'A tomb-garrison of stone soldiers stands in formation facing Kumandra. The new Emperor has declared the Dragon River too cursed to conquer. But he does not know the dead have sent their own emissary to Kumandra: Fa Mushu, the Last Dragon.',
            },
            chinamotunui: {
                desc: 'It is into a hostile environment that Zheng He\'s expeditionary fleet sailed. The ships of one of the Pacific\'s most aggressive islands chased him off-course, harassing him until he sought shelter on an uninhabited island. There, the Chinese expedition huddles besieged, blockaded by catamarans eager to steal their jade-inlaid machines.',
            },
            kumandramotunui: {
                desc: 'On a beach full of sand-dusted statues, a huge glimmering monster sidles out of the water. It is the crab Tamatoa, who uses the silent cities of Kumandra as his personal jewelry-box.',
            },
            neverneverlandpleasureisland: {
                desc: 'The Blue Fairy\'s reach is long, but the starscape is vast, & she cannot save everyone. She focuses on those lost children who pass a test of virtue (a banquet-table abandoned, forested with treats...), spiriting them to Neverland. Those who feast, well, the Coachman finds them before she returns.',
            },
            neverneverlandwonderland: {
                desc: 'Beyond the waking world, beyond the stars & planets, the rules that we call Story bend & discontinue. The abyss of un-space can access our planet at our moments of loosest ontology: day-dreams & night-dreams. And beyond Neverland, beyond Wonderland, there wells a benthic void of Nightmare, a don\'t-place of echoes that are not coachmen, of smiles that are not cats.',
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

    // TODO support back button
    // TODO a way to link to a page

    go (pageKey) {
        const mainDiv = document.getElementById('main');
        mainDiv.innerHTML = this.pageHtmlStr(pageKey);

        document.body.scrollTop = 0;
    }

    // random () {
    //     this.go(
    //         Util.randomOf(
    //             Object.keys(this.regionDict)
    //         )
    //     );
    // }

    randomLink () {
        const key = Util.randomOf(
            Object.keys(this.regionDict)
        );

        return this.asWikiLink(key, 'Read more...');
    }

    pageHtmlStr (pageKey) {
        const regionInfo = this.regionDict[pageKey];
        const elements = [
            this.asElement(Util.capitalized(regionInfo.displayName), 'label'),
            this.htmlPassage(regionInfo.desc),
        ];

        for (let dir of this.directions()) {
            this.addLinkPassage(pageKey, elements, dir);
        }

        // Now the other links, like 'exotic'.
        for (let dir in regionInfo.neighbors) {
            if (this.directions().includes(dir)) {
                continue;
            }

            this.addLinkPassage(pageKey, elements, dir);
        }

        return elements.join('\n');
    }

    writeHtmlFiles () {
        const fs = require('fs');
        const path = require('path');

        for (let regionKey in this.regionDict) {
            fs.writeFileSync(
                path.join(__filename, '..', '..', regionKey + '.html'),
                this.fullHtml(regionKey),
                'utf8'
            );

            console.log(`Wrote file ${regionKey}.html`);
        }
    }

    fullHtml (pageKey) {
        return `<html>
  <head>
    <meta charset="utf-8">
    <link href="page.css" rel="stylesheet" />
  </head>

  <body>
    <div id="header">
      <a href="index.html" class="wikilink">Villainverse of Neydis</a>
    </div>
    <br/>
    <div id="main">
      ${this.pageHtmlStr(pageKey)}
    </div>
  </body>
</html>
`;
    }

    addLinkPassage (pageKey, elements, dir) {
        const regionInfo = this.regionDict[pageKey];
        const neighborKey = regionInfo.neighbors[dir];

        if (! neighborKey) { return; }

        const neighborName = this.regionDict[neighborKey].displayName;
        const borderKey = this.borderKey(pageKey, neighborKey);
        const borderInfo = this.borderDict[borderKey];
        const borderDesc = borderInfo ? borderInfo.desc : '';
        const dirWord = this.directionWord(dir);

        let relationSentence;
        if (this.directions().includes(dir)) {
            const button = this.asWikiLink(neighborKey, neighborName);
            relationSentence = `To the ${dirWord} lies ${button}. `;
        }
        else {
            const button = this.asWikiLink(
                neighborKey,
                Util.capitalized(neighborName)
            );
            const colon = borderDesc ? ':' : '';

            relationSentence = button + colon + ' ';
        }

        elements.push(
            this.htmlPassage(relationSentence + borderDesc)
        );
    }

    htmlPassage (content) {
        return this.asElement(content, 'p');
    }

    asElement (content, elementName) {
        // TODO make content HTML-friendly, escape etc.
        return `<${elementName}>${content}</${elementName}>`;
    }

    asWikiLink (pageKey, displayName) {
        // return `<button type="button" class="wikilink" onclick="window.wiki.go('${pageKey}')">${displayName}</button>`;
        return `<a href="${pageKey}.html" class="wikilink">${displayName}</a>`;
    }

    directions () {
        return [ 'nw', 'n', 'ne', 'e', 'w', 'sw', 's', 'se'];
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
                    borderInfo.desc.length >= (this.meanDescLength / 2);

                const message = borderInfo ?
                    borderInfo.desc.length + ' characters' :
                    'Border entry missing';

                if (! goodBorderDesc) {
                    // Add it in-memory for later printing.
                    this.borderDict[borderKey] = borderInfo || {desc: ''};

                    if (key.localeCompare(neighborKey) < 0) {
                        // Only log each border once.
                        // You can temporarily comment this to reduce noise.
                        console.log(`  this.borderDict.${borderKey}.desc -- ${message}`);
                    }
                }
            }
        }

        // Uncomment to print pasteable blank border entries.
        // console.log(
        //  Util.stringify(this.borderDict)
        // );
    }

    // Helper func.
    testField (key, fieldName, note) {
        const regionInfo = this.regionDict[key];
        const content = regionInfo && regionInfo[fieldName];

        let legit = !! content;

        if (legit && fieldName === 'desc' && content.length < (this.meanDescLength / 2)) {
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

    initUI () {
        window.wiki = this;

        const randomizer = document.getElementById('randomButtonP');
        randomizer.removeChild(randomizer.firstChild);

        randomizer.innerHTML = this.randomLink();
    }

    static run () {
        const wiki = new Wiki();
        // wiki.testPages();
        wiki.testRegionDict();

        if (process.argv &&
            process.argv.length === 2 &&
            process.argv[0] &&
            process.argv[0].endsWith('node') &&
            process.argv[1].endsWith('wiki.js')) {

            wiki.writeHtmlFiles();

            return; // When testing via command line, skip window setup.
        }

        wiki.initUI();
    }
}

Wiki.run();

// TODO pin down details of entry point; how the starting pagename param is input to this script.
