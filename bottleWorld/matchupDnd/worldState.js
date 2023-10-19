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
                name: 'Citystate of Vett',
                weight: 1,
                alignment: 'LR',
                planeCategory: 'material',
                // LATER perhaps give each faction a subset of species & classes to draw from.
                species: ['human'],
                classesExcept: ['ghost', 'warlock', 'barbarian', 'samurai', 'lich', 'vampire', 'werewolf'], // TODO support classesExcept
            },
            {
                name: 'Mines of Moradin',
                weight: 1,
                alignment: 'LD',
                planeCategory: 'material',
                species: ['dwarf'],
            },
            {
                name: 'Everwoods',
                weight: 1,
                planeCategory: 'material',
                species: ['elf', 'pixie', 'triton', 'giant'],
            },
            {
                name: 'Hordelands',
                weight: 1,
                planeCategory: 'material',
                species: ['goblin', 'orc', 'ogre', 'saurian'],
            },
            {
                name: 'Azlanti',
                weight: 1,
                planeCategory: 'material',
                species: ['human'],
            },
            {
                name: 'Drow',
                weight: 1,
                planeCategory: 'material',
                species: ['Dark Elf'], // TODO make species autocapitalize both words, or have a displayName, so i dont have to specify it as capital everywhere.
            },
            {
                name: 'Mind Flayers',
                weight: 1,
                planeCategory: 'material',
                species: ['mindflayer'],
            },
            // {
            //     name: 'Aboleths',
            //     weight: 1,
            //     planeCategory: 'material',
            //     species: [''],
            // },
            {
                name: 'Feywild',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['elf', 'pixie', 'triton', 'giant', 'goblin'],
            },
            {
                name: 'Shadowfell',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['Dark Elf', 'skeleton', 'demon', 'golem', 'mindflayer'],
            },
            {
                name: 'City of Sigil',
                weight: 1,
                planeCategory: 'extraplanar',
                // All species & classes possible
            },
            {
                name: 'Far Realm',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['demon', 'golem', 'beholder'],
            },
            {
                name: 'Dreamlands',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['pixie', 'giant', 'aasimar', 'demon'],
            },
            {
                name: 'Astral Plane',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['elf', 'Dark Elf', 'aasimar', 'saurian', 'golem'],
            },
            {
                name: 'Jandelay Archive',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['elf', 'Dark Elf', 'aasimar', 'mindflayer', 'golem'],
            },
            {
                name: 'Seven Heavens',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['aasimar', 'dragon'],
            },
            {
                name: 'Plane of Bitopia',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['dwarf', 'elf', 'aasimar', 'golem'],
            },
            {
                name: 'Plane of Elysium',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['elf', 'aasimar', 'pixie', 'naga', 'dragon'],
            },
            {
                name: 'Beastlands',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['elf', 'aasimar', 'triton'],
            },
            {
                name: 'Plane of Olympia',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['elf', 'aasimar', 'triton', 'giant', 'saurian'],
            },
            {
                name: 'Plane of Ysgard',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['human', 'dwarf', 'ogre', 'giant', 'dragon'],
            },
            {
                name: 'Elemental Chaos',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['goblin', 'golem', 'naga', 'beholder', 'giant', 'dragon'],
            },
            {
                name: 'Pandaemonium',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['human', 'mindflayer', 'goblin', 'demon', 'skeleton'],
            },
            {
                name: 'Abyss',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['demon'],
            },
            {
                name: 'Plane of Gehenna',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['Dark Elf', 'skeleton']
            },
            {
                name: 'Plane of Erebus',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['skeleton', 'demon'],
            },
            {
                name: 'Plane of Carceri',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['demon', 'giant'],
            },
            {
                name: 'Nine Hells',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['demon'],
            },
            {
                name: 'Plane of Acheron',
                weight: 1,
                planeCategory: 'extraplanar',
                // All species & classes.
            },
            {
                name: 'Plane of Axis',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['aasimar'],
            },
            {
                name: 'Plane of Arcadia',
                weight: 1,
                planeCategory: 'extraplanar',
                species: ['aasimar', 'human', 'elf', 'pixie', 'giant'],
            },
            {
                name: 'Planet Mercury',
                weight: 1,
                planeCategory: 'interplanetary',
//                species: ['giant', 'dwarf', 'goblin', 'saurian', 'aasimar', 'ogre'],
                speciesExcept: ['human', 'triton'],
            },
            {
                name: 'Planet Venus',
                weight: 1,
                planeCategory: 'interplanetary',
                // All species & classes
            },
            {
                name: 'Planet Mars',
                weight: 1,
                planeCategory: 'interplanetary',
                speciesExcept: ['human'],
            },
            {
                name: 'Asteroid Belt',
                weight: 1,
                planeCategory: 'interplanetary',
                speciesExcept: ['human', 'triton'],
            },
            {
                name: 'Planet Jupiter',
                weight: 1,
                planeCategory: 'interplanetary',
                speciesExcept: ['human'],
            },
            {
                name: 'Planet Saturn',
                weight: 1,
                planeCategory: 'interplanetary',
                speciesExcept: ['human'],
            },
            {
                name: 'Planet Uranus',
                weight: 1,
                planeCategory: 'interplanetary',
                speciesExcept: ['human'],
            },
            {
                name: 'Planet Neptune',
                weight: 1,
                planeCategory: 'interplanetary',
                speciesExcept: ['human'],
            },
            {
                name: 'Planet Pluto',
                weight: 1,
                planeCategory: 'interplanetary',
                speciesExcept: ['human'],
            },
            {
                name: 'Planet Eris',
                weight: 1,
                planeCategory: 'interplanetary',
                speciesExcept: ['human'],
            },
            {
                name: 'Occult Realms',
                weight: 1,
                // All species & classes
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

    newFactionCharacter (factionTemplate = this.protagFaction) {
        let speciesInfo;
        if (this.speciesExcept) {
            if (this.speciesExcept.length >= Character.SPECIES().length) {
                throw new Error(`${factionTemplate.name} has too many (${this.speciesExcept.length}) speciesExcept entries.`);
            }

            do {
                speciesInfo = Util.randomOf(Character.SPECIES());
            } 
            while (this.speciesExcept.includes(speciesInfo.name));
        }
        else if (this.species) {
            speciesName = Util.randomOf(this.species);

            speciesInfo = Character.SPECIES().find(s => s.name === speciesName);
        }
        else {
            speciesInfo = Util.randomOf(Character.SPECIES());
        }

        let classInfo = Util.randomOf(Character.CLASS());

        return new Character(speciesInfo, classInfo);
    }

    synopsis () {
        return `I am a ${new Character().toString()} from the ${this.protagFaction.toString()}.\nI & my ${new Character().toString()} friend are in the ${this.antagFaction.toString()}.\nWe were thwarted by a ${new Character().toString()} so we're going up against a ${new Character().toString()} instead.`;
    }

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
