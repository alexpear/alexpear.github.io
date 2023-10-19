'use strict';

// Fantasy bottle world that focuses on 2 sub-milieus per setup.

// const Creature = require('../wnode/creature.js');
const Util = require('../../util/util.js');

class WorldState {
    constructor () {
        this.load();
        this.protagFaction = this.randomFaction();
        this.antagFaction = this.randomFaction();
    }

    load () {
        this.FACTIONS = [
            {
                name: 'Human Citystate',
                weight: 1,
                alignment: 'LR',
                planeCategory: 'material',
                creatures: [
                    // {
                    //     name: '',
                    //     weight: 1,
                    //     might: 1,
                    // },
                    // LATER perhaps give each faction a subset of species & classes to draw from.
                ],
            },
            {
                name: 'Mines of Moradin',
                weight: 1,
                alignment: 'LD',
                planeCategory: 'material',
                creatures: [
                ],
            },
            {
                name: 'Wood Elves',
                weight: 1,
                planeCategory: 'material',
                creatures: [
                ],
            },
            {
                name: 'Goblinoids',
                weight: 1,
                planeCategory: 'material',
                creatures: [
                ],
            },
            {
                name: 'Azlanti',
                weight: 1,
                planeCategory: 'material',
                creatures: [
                ],
            },
            {
                name: 'Drow',
                weight: 1,
                planeCategory: 'material',
                creatures: [
                ],
            },
            {
                name: 'Mind Flayers',
                weight: 1,
                planeCategory: 'material',
                creatures: [
                ],
            },
            {
                name: 'Aboleths',
                weight: 1,
                planeCategory: 'material',
                creatures: [
                ],
            },
            {
                name: 'Feywild',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Shadowfell',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Sigil',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Far Realm',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Dreamlands',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Astral Plane',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Jandelay',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Seven Heavens',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Bitopia',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Elysium',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Beastlands',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Olympia',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Ysgard',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Elemental Chaos',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Pandaemonium',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Abyss',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Gehenna',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Hades',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Carceri',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Nine Hells',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Acheron',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Axis',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Arcadia',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Mercury',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Venus',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Mars',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Asteroid Belt',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Jupiter',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Saturn',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Uranus',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Neptune',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Pluto',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Eris',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Occult',
                weight: 1,
                planeCategory: 'material',
                creatures: [
                ],
            },
        ];

        this.TOTAL_FACTION_WEIGHT = Util.sum(
            this.FACTIONS.map(f => f.weight)
        );
    }

    randomFaction () {
        let roll = Math.random() * this.TOTAL_FACTION_WEIGHT;

        for (let faction of this.FACTIONS) {
            roll -= faction.weight;

            if (roll <= 0) {
                return new Faction(faction);
            }
        }

        // default case
        return new Faction(
            this.FACTIONS[this.FACTIONS.length - 1]
        );
    }

    synopsis () {
        return '\n' + this.protagFaction.toString() + ' vs ' +
            this.antagFaction.toString() + 
            '\n\nwith these characters:\n' +
            Creature.groupOfSameSpecies(2).map(
                c => c.toString()
            )
            .join('\n') + '\n';
    }

    // LATER gen 2 characters of same species & different class, for the synopsis.

    static run () {
        const ws = new WorldState();

        console.log(ws.synopsis());
    }
}

// LATER move to own file
class Faction {
    constructor (template) {
        this.template = template;
        // this.povCreature = new Creature(); // LATER use template.creatures to gen this.
    }

    toString () {
        return this.template.name;
    }
}

class Creature {
    constructor (speciesTemplate, classTemplate) {
        this.species = speciesTemplate || Util.randomOf(Creature.SPECIES());
        this.class = classTemplate || Util.randomOf(Creature.CLASS());
    }

    toString () {
        return Util.capitalized(this.species.name) + ' ' +
            Util.capitalized(this.class.name);
    }

    static groupOfSameSpecies (quantity = 2, speciesTemplate) {
        speciesTemplate = speciesTemplate || Util.randomOf(Creature.SPECIES());

        const output = [];
        for (let i = 0; i < quantity; i++) {
            output.push(
                new Creature(
                    speciesTemplate,
                    Util.randomOf(Creature.CLASS())
                )
            );
        }

        return output;
    }

    static SPECIES () {
        return [
            {
                name: 'human',
            },
            {
                name: 'elf',
            },
            {
                name: 'Dark Elf',
            },
            {
                name: 'pixie',
            },
            {
                name: 'dwarf',
            },
            {
                name: 'goblin',
            },
            {
                name: 'orc',
            },
            {
                name: 'ogre',
            },
            {
                name: 'giant',
            },
            {
                name: 'aasimar',
            },
            {
                name: 'saurian',
            },
            {
                name: 'naga',
            },
            {
                name: 'dragon',
            },
            {
                name: 'triton',
            },
            {
                name: 'skeleton',
            },
            {
                name: 'golem',
            },
            {
                name: 'demon',
            },
            {
                name: 'mindflayer',
            },
            {
                name: 'beholder',
            },
        ];
    }

    static CLASS () {
        return [
            {
                name: 'warrior',
            },
            {
                name: 'rogue',
            },
            {
                name: 'mage',
            },
            {
                name: 'cleric',
            },
            {
                name: 'ranger',
            },
            {
                name: 'diplomat',
            },
            {
                name: 'noble',
            },
            {
                name: 'ghost',
            },
            {
                name: 'bard',
            },
            {
                name: 'warlock',
            },
            {
                name: 'assassin',
            },
            {
                name: 'spellsword',
            },
            {
                name: 'scout',
            },
            {
                name: 'artificer',
            },
            {
                name: 'scholar',
            },
            {
                name: 'poet',
            },
            {
                name: 'paladin',
            },
            {
                name: 'barbarian',
            },
            {
                name: 'knight',
            },
            {
                name: 'samurai',
            },
            {
                name: 'lich',
            },
            {
                name: 'vampire',
            },
            {
                name: 'werewolf',
            },
        ];
    }
}

WorldState.run();
