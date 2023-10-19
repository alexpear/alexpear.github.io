'use strict';

// Fantasy bottle world that focuses on 2 sub-milieus per setup.

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
                species: [],
                classes: [],
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
                name: 'City of Sigil',
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
                name: 'Jandelay Archive',
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
                name: 'Plane of Bitopia',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Plane of Elysium',
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
                name: 'Plane of Olympia',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Plane of Ysgard',
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
                name: 'Plane of Gehenna',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Plane of Erebus',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Plane of Carceri',
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
                name: 'Plane of Acheron',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Plane of Axis',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Plane of Arcadia',
                weight: 1,
                planeCategory: 'extraplanar',
                creatures: [
                ],
            },
            {
                name: 'Planet Mercury',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Planet Venus',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Planet Mars',
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
                name: 'Planet Jupiter',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Planet Saturn',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Planet Uranus',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Planet Neptune',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Planet Pluto',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Planet Eris',
                weight: 1,
                planeCategory: 'interplanetary',
                creatures: [
                ],
            },
            {
                name: 'Occult Realms',
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
        // return '\n' + this.protagFaction.toString() + ' vs ' +
        //     this.antagFaction.toString() + 
        //     '\n\nwith these characters:\n' +
        //     Character.groupOfSameSpecies(2).map(
        //         c => c.toString()
        //     )
        //     .join('\n') + '\n';

        return `I am a ${new Character().toString()} from the ${this.protagFaction.toString()}.\nI & my ${new Character().toString()} friend are in the ${this.antagFaction.toString()}.\nWe were thwarted by a ${new Character().toString()} so we're going up against a ${new Character().toString()} instead.`;
    }

    // LATER synopsis like:

    /* I am a Orc Artificer from the Planet Saturn. 
    I & my ally, a Demon Rogue, are in the Feywild. 
    We were thwarted by a Elf Scout so we're going up against a Pixie Scholar instead.

    LATER - prepend Planet to .name of all planets, prepend 'the' to every faction when printing.
    */

    static run () {
        const ws = new WorldState();

        console.log(ws.synopsis());
    }
}

// LATER move to own file
class Faction {
    constructor (template) {
        this.template = template;
    }

    toString () {
        return this.template.name;
    }
}

class Character {
    constructor (speciesTemplate, classTemplate) {
        this.species = speciesTemplate || Util.randomOf(Character.SPECIES());
        this.class = classTemplate || Util.randomOf(Character.CLASS());
    }

    toString () {
        return Util.capitalized(this.species.name) + ' ' +
            Util.capitalized(this.class.name);
    }

    static groupOfSameSpecies (quantity = 2, speciesTemplate) {
        speciesTemplate = speciesTemplate || Util.randomOf(Character.SPECIES());

        const output = [];
        for (let i = 0; i < quantity; i++) {
            output.push(
                new Character(
                    speciesTemplate,
                    Util.randomOf(Character.CLASS())
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
