'use strict';

//

const ConfigString = require('../data/config.js');
const Util = require('../../util/util.js');
const yaml = require('js-yaml');

class Templates {
    static init () {
        Templates.errors = [];

        // json: true means duplicate keys in a mapping will override values rather than throwing an error.
        const Config = yaml.load(ConfigString, { json: true });

        for (let topKey in Config) {
            // eg topKey === 'Halo'
            Templates[topKey] = Config[topKey];
        }

        const entryNotes = [];

        // Populate some values in-memory that would be too repetitive to store in the .yml file.
        for (let universe of Templates.universes()) {
            for (let faction in universe) {
                // Util.logDebug(`Templates.init(), faction=${faction}`);

                if (Util.isString(universe[faction])) { continue; }

                universe[faction].name = faction;

                for (let section in universe[faction]) {
                    const sectionObj = universe[faction][section];

                    if (Util.isString(sectionObj)) { continue; }

                    for (let entryName in sectionObj) {
                        const entryObj = sectionObj[entryName];

                        // Util.logDebug(`Templates.init() loop, faction=${faction} entryName=${entryName}`)

                        entryNotes.push({
                            entryObj,
                            section,
                            missingInfo: Templates.missingFields(entryObj, section),
                        });

                        if (section === 'Creature') {
                            Templates.setupCreature(entryObj);
                        }
                        else if (section === 'Item') {
                            Templates.setupItem(entryObj);
                        }

                        Templates.setupAnything(
                            entryObj,
                            [universe.name, faction, section, entryName]
                        );
                    }
                }
            }
        }

        // Util.logDebug(entryNotes);

        Templates.logDiagnostics(entryNotes);

        if (Templates.errors.length >= 1) {
            throw new Error(Templates.errors.join(' | '));
        }
    }

    static setupAnything (obj, pathArray) {
        // Util.logDebug(`Templates.setupAnything(obj=${Util.stringify(obj)}, pathArray=${pathArray})`)

        // LATER if pathArray[3] is camelCase (ie contains [a-z][A-Z]), add spaces back into the name using replaceAll(regex, ' ')
        obj.name = obj.name || pathArray[pathArray.length - 1];
        obj.faction = obj.faction || pathArray[1];

        if (obj.preferredRange && obj.preferredRange > 15) {
            Templates.errors.push(Util.stringify(obj));
        }

        // Links
        if (obj.creature) {
            obj.creature = Templates.translateDotPath(pathArray, obj.creature);
        }

        if (obj.items) {
            for (let i = 0; i < obj.items.length; i++) {
                obj.items[i] = Templates.translateDotPath(pathArray, obj.items[i]);
            }
        }

    }

    static translateDotPath (pathArray, dotPath) {
        const words = dotPath.split('.');
        const translatedPath = [];

        // universe, faction, section, entry
        for (let i = 0; i < pathArray.length; i++) {
            const lengthDiff = pathArray.length - words.length;

            // Util.logDebug(`translateDotPath(${pathArray.join('.')}, ${dotPath}): i=${i}, pathArray.length - i = ${pathArray.length - i}, words[i - lengthDiff] is ${words[i - lengthDiff]}`);

            // If dotPath is long enough, use that. Else use pathArray.
            const narrowerKey = words.length >= (pathArray.length - i) ?
                words[i - lengthDiff] :
                pathArray[i];

            translatedPath.push(narrowerKey);
        }

        // Util.logDebug(`${dotPath} in context ${pathArray.join('.')} translates to ${translatedPath.join('.')}`);

        let obj = Templates;
        for (let key of translatedPath) {
            obj = obj[key];
        }

        // Util.logDebug(`Templates.translateDotPath(${pathArray}, foo...): obj=${Util.stringify(obj)}`);

        return obj;
    }

    static setupItem (item) {
        const DEFAULTS = {
            size: 0.1,
            cost: 0.1,
            durability: 1,
        };

        for (let key in DEFAULTS) {
            if (! Util.exists(item[key])) {
                item[key] = DEFAULTS[key];
            }
        }
    }

    static setupCreature (creature) {
        const DEFAULTS = {
            size: 2,
            // LATER we could also add bulk or weight, if useful.
            cost: 1,
            speed: 1,
            durability: 1,
            shields: 0,
            accuracy: 0,
            resistance: {},
            items: [],
        };

        for (let key in DEFAULTS) {
            if (! Util.exists(creature[key])) {
                creature[key] = DEFAULTS[key];
            }
        }
    }

    static allSquads () {
        return Templates.allEntries('Squad');
    }

    static allEntries (type) {
        let entries = [];
        for (let universe of Templates.universes()) {
            for (let factionKey in universe) {
                const faction = universe[factionKey];
                if (Util.isString(faction)) { continue; }

                // Util.logDebug(`Templates.allEntries(${type || ''}), factionKey=${factionKey}`);

                if (type) {
                    entries = entries.concat(Object.values(faction[type] || {}));
                }
                else {
                    entries = entries.concat(Object.values(faction.Item || {}));
                    entries = entries.concat(Object.values(faction.Creature || {}));
                    entries = entries.concat(Object.values(faction.Squad || {}));
                }
            }
        }

        return entries;
    }

    static randomFaction () {
        return Util.randomOf([
            'Covenant',
            'Flood',
            'Forerunner',
            'UNSC',
        ]);
    }

    static randomSquad (factionKey) {
        const keys = Object.keys(Templates.Halo[factionKey].Squad);

        return Templates.Halo[factionKey].Squad[
            Util.randomOf(keys)
        ];
    }

    static missingFields (entry, type) {
        const FIELDS = {
            Item: {
                core: ['damage', 'rof'],
                extra: ['accuracy', 'aoe', 'classic', 'color', 'cost', 'name', 'preferredRange', 'tags', 'type'],
            },
            Creature: {
                core: ['accuracy', 'durability', 'items', 'size', 'speed'],
                extra: ['classic', 'scale'] // 'source',
            },
            Squad: {
                core: ['creature', 'image'],
                extra: ['quantity']
            }
        };

        if (! type) { throw new Error(Util.stringify(entry)); }

        const fieldNames = FIELDS[type];
        const missing = { core: [], extra: [], incompleteness: 0, };

        for (let coreKey of fieldNames.core) {
            const blankItems = coreKey === 'items' && ! entry.items?.length;
            // if (coreKey === 'items') {
            //     throw new Error(Util.stringify(entry));
            // }

            if (! Util.legit(entry[coreKey]) || blankItems) {
                missing.core.push(coreKey);
                missing.incompleteness += 10;
            }
        }

        for (let extraKey of fieldNames.extra) {
            if (! Util.legit(entry[extraKey])) {
                missing.extra.push(extraKey);
                missing.incompleteness += 1;
            }
        }

        return missing;
    }

    static logDiagnostics (entryNotes) {
        const extensions = {
            banshee: 'jpeg',
            brute: 'jpg',
            bruteChieftain: 'png',
            bruteProwler: 'jpg',
            ccsLightCruiser: 'png',
            chopper: 'jpg',
            combatForm: 'png',
            corvette: 'png',
            crawler: 'png',
            cryptum: 'png',
            didact: 'png',
            drone: 'png',
            elite: 'jpg',
            enforcer: 'png',
            falcon: 'png',
            floodCarrier: 'png',
            floodTank: 'png',
            frigate: 'png',
            ghost: 'jpg',
            goldElite: 'jpg',
            grunt: 'png',
            harvester: 'jpg',
            highCharity: 'jpg',
            hornet: 'png',
            hunter: 'png',
            infinity: 'jpeg',
            jackal: 'png',
            keyship: 'png',
            knight: 'jpg',
            kraken: 'jpg',
            lich: 'png',
            mammoth: 'png',
            mantis: 'png',
            marathonCruiser: 'png',
            marine: 'png',
            missileSilo: 'jpg',
            mongoose: 'gif',
            odst: 'jpg',
            officer: 'jpg',
            pelican: 'png',
            phantom: 'png',
            pod: 'jpg',
            rifleJackal: 'png',
            sand: 'jpg',
            scarab: 'png',
            scorpion: 'png',
            sentinel: 'jpg',
            shade: 'png',
            sniperJackal: 'png',
            spartan: 'png',
            spire: 'jpg',
            transportWarthog: 'png',
            warthog: 'jpg',
            wasp: 'png',
            wraith: 'png'
        };

        entryNotes.sort(
            (a, b) => b.missingInfo.incompleteness - a.missingInfo.incompleteness
        );

        for (let notes of entryNotes) {
            const camelName = Util.toCamelCase(notes.entryObj.name);

            if (! notes.entryObj.image && extensions[camelName]) {
                console.log(`--> ${notes.entryObj.name} could use image: ${camelName}.${extensions[camelName]}`);
            }

            if (notes.missingInfo.incompleteness === 0) { continue; }
            console.log(`${notes.entryObj.name} (${notes.missingInfo.incompleteness}) is missing fields: ${notes.missingInfo.core.join(', ')} ... ${notes.missingInfo.extra.join(', ')}.`);
        }
    }

    static test () {
        Util.logDebug(Templates.universes());
    }

    static universes () {
        return [
            Templates.Halo,
        ];
    }
}

Templates.ATTACK_TYPE = {
    Kinetic: 'Kinetic',
    Fire: 'Fire',
    Impact: 'Impact',
    Explosive: 'Explosive',
    Hardlight: 'Hardlight',
    Electric: 'Electric',
};

Templates.General = {
    General: {
        Squad: {
            KO: {
                name: 'KO Squad',
                quantity: 0,
                image: 'sand.jpg',
            }
        }
    }
};

module.exports = Templates;

Templates.init();
// Templates.test();
