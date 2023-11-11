'use strict';

// Utilities for file conversion. More useful during development & building than at final runtime.

// const Templates = require('./templates.js');
const Util = require('../../../util/util.js');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Done.
const templatesToYaml = () => {
    const yamlData = yaml.dump(Templates.Halo);
    console.log(yamlData);
};

const logConvertedCSVs = () => {
    const csvStrings = [
        fs.readFileSync(
            path.join(__filename, '..', '..', '..', 'data', 'Monster Manual - Halo Groups.csv'),
            'utf8'
        ),
        fs.readFileSync(
            path.join(__filename, '..', '..', '..', 'data', 'Monster Manual - Halo Weaps.csv'),
            'utf8'
        ),
        fs.readFileSync(
            path.join(__filename, '..', '..', '..', 'data', 'Monster Manual - Halo.csv'),
            'utf8'
        ),
        fs.readFileSync(
            path.join(__filename, '..', '..', '..', 'data', 'Coin Stacks - Stats.csv'),
            'utf8'
        ),
    ];

    const warbandDatasets = csvStrings.map(csv2json)
        .map(json2warband);

    const organized = organize(warbandDatasets);

    const ymlString = yaml.dump(organized, { indent: 4 });
    console.log(ymlString);
};

const csv2json = (csvFileString) => {
    const lines = csvFileString.split('\n');
    const header = lines[0];
    const keys = header.split(',');

    const rowObjs = [];

    for (let line of lines) {
        if (line === header) { continue; }

        const obj = {};
        rowObjs.push(obj);

        if (line[0] === '"') {
            const closingQuoteIndex = line.indexOf('"', 1);
            const firstVal = line.slice(1, closingQuoteIndex)
                .replaceAll(',', '');

            // In these spreadsheets i made, commas mostly only appear in the left column. Other commas will have to be spotted manually.
            line = firstVal + line.slice(closingQuoteIndex + 1);
        }

        const vals = line.split(',');

        for (let col = 0; col < keys.length; col++) {
            const value = vals[col];
            if (! Util.legit(value) || value === '\r') { continue; }

            // Note that we standardize to lower case.
            const key = keys[col].toLowerCase();

            obj[key] = value;
        }
    }

    return rowObjs;
};

const json2warband = (rowObjs) => {
    // const ignoredPrefices = [
    //     'Blanks',
    //     'Gets hit by Hit...',
    //     'Dmg vs HP',
    //     'Hit vs Def',
    //     'Perfect TtK',
    //     'Hits vs',
    //     'TtK',
    //     'Dmg / Shot',
    //     'Equiv',
    //     'SMG',
    //     'Light Bullets',
    //     'Scorpion',
    //     'Mammoth',
    //     'Max DpS',
    //     'Direct DpS',
    //     'Splash DpS',
    //     'Spartan Hits',
    //     '1/prev',
    //     'DMR hits',
    //     'hit - dmg',
    // ];

    const propMap = {
        name: [
            { synonym: 'name' },
            { synonym: 'creature' },
            { synonym: 'attack' },
            { synonym: 'unit' },
        ],
        faction: [
            { synonym: 'faction' },
        ],
        type: [
            { synonym: 'damage type' },
            { synonym: 'attack type' },
            { synonym: 'infinite dmg type' },
        ],
        scale: [
            { synonym: 'scale' },
        ],
        source: [
            { synonym: 'from game' },
        ],
        tags: [
            { synonym: 'tags' },
            { synonym: 'type' },
        ],
        transport: [
            { synonym: 'transp' },
        ],
        special: [
            { synonym: 'special' },
        ],
        group: [
            { synonym: 'group' },
        ],
        gear: [
            { synonym: 'notes' },
            { synonym: 'narrative notes' },
            { synonym: 'gear' },
        ],
        damage: [
            {
                synonym: 'direct sp dmg',
                ratio: 1/15,
            },
            {
                synonym: 'damage',
                ratio: 4,
            },
            {
                synonym: 'fpower',
                ratio: 1.9,
            },
            {
                synonym: 'cq',
                ratio: 3,
            },
        ],
        rof: [
            {
                synonym: 'shots / sec',
                ratio: 0.3,
            },
            {
                synonym: 'shots',
                ratio: 1,
            },
        ],
        accuracy: [
            {
                synonym: 'hit',
                ratio: 0.3,
            },
            {
                synonym: 'acc 4m',
                ratio: 2,
            },
        ],
        preferredRange: [
            {
                synonym: 'range',
                ratio: 2.5,
            },
            {
                synonym: 'range (m)',
                ratio: 2.5 / 30,
            },
            {
                synonym: 'max range',
                ratio: 1/20,
            },
        ],
        size: [
            {
                synonym: 'squares / side',
                ratio: 2,
            },
            {
                synonym: 'size',
                ratio: 2,
            },
        ],
        speed: [
            {
                synonym: 'm/s',
                ratio: 1.5 / 9,
            },
            {
                synonym: 'speed',
                ratio: 1.5,
            },
        ],
        durability: [
            {
                synonym: 'sp',
                ratio: 1/7,
            },
            {
                synonym: 'defense',
                ratio: 1,
            },
            {
                synonym: 'hp',
                ratio: 5,
            },
            {
                synonym: 'durability est',
                ratio: 0.25,
            },
            {
                synonym: 'def',
                ratio: 1.5,
            },
        ],
        classic: [
            {
                synonym: 'cool / classic',
                ratio: 1,
            },
            {
                synonym: 'prevalence / 10',
                ratio: 1,
            },
            {
                synonym: 'classic',
                ratio: 1,
            },
        ],
        cost: [
            {
                synonym: 'cost',
                ratio: 1,
            },
            {
                synonym: 'Cost w/ default gear',
                ratio: 2,
            },
            {
                synonym: 'army points',
                ratio: 1,
            },
        ],
        aoe: [
            {
                synonym: 'infantry affected',
                ratio: 1,
            },
        ],
    };

    const warbandObjs = [];

    for (let obj of rowObjs) {
        const warbandObj = {};

        for (let desiredKey in propMap) {
            for (let synonymInfo of propMap[desiredKey]) {
                // Note - i know the acronym in csvValue is crazy.
                const csvValue = obj[synonymInfo.synonym];
                const blankValues = [ '?', '-' ];

                if (Util.legit(csvValue) && ! blankValues.includes(csvValue)) {
                    const asFloat = parseFloat(csvValue);

                    if (Util.exists(asFloat)) {
                        warbandObj[desiredKey] = Math.round(
                            asFloat * (synonymInfo.ratio || 1),
                            1
                        );
                    }
                    else {
                        warbandObj[desiredKey] = csvValue;
                    }

                    // if (warbandObj[desiredKey] === 0) {
                    // // if (warbandObj?.name.includes?.('ydra')) {
                    //     Util.logDebug({
                    //         name: warbandObj.name,
                    //         desiredKey,
                    //         ratio: synonymInfo.ratio,
                    //         asFloat,
                    //         wrote: warbandObj[desiredKey],
                    //         context: 'Parser.json2warband() - after assignment to warbandObj.',
                    //     });
                    // }

                    break;
                }
            }
        }

        // for (let key in obj) {
        //     let useKey = true;

        //     for (let prefix of ignoredPrefices) {
        //         if (key.startsWith(prefix)) {
        //             useKey = false;
        //             break;
        //         }
        //     }

        //     if (! useKey) { continue; }

        //     const warbandKey = key.toLowerCase();

        //     warbandObj[warbandKey] = obj[key];
        //     // LATER translate traits into warband terms instead of just copying.
        // }
        if (Object.keys(warbandObj).length >= 1) {
            warbandObjs.push(warbandObj);
        }
    }

    return warbandObjs;
};

const organize = (fileObjs) => {
    const halo = {};

    for (let file of fileObjs) {
        file.sort((a,b) => a.name.localeCompare(b.name));

        for (let obj of file) {
            const faction = obj.faction || 'Unsorted';

            if (! halo[faction]) {
                halo[faction] = {
                    Item: {},
                    Creature: {},
                    Squad: {},
                };
            }

            let componentType;
            if (obj.scale === 'Battalion') { componentType = 'Squad'; }
            else if (obj.durability)       { componentType = 'Creature'; }
            else if (obj.type)             { componentType = 'Item'; }
            else                           { componentType = 'Squad'; }

            const entryName = obj.name || Util.newId(7);

            delete obj.name;
            delete obj.faction;

            const existing = halo[faction][componentType][entryName];

            if (existing) {
                halo[faction][componentType][entryName] = merge(existing, obj);
            }
            else {
                halo[faction][componentType][entryName] = obj;
            }
        }
    }

    return halo;
};

const merge = (existing, newEntry) => {
    for (let key in newEntry) {
        if (Util.legit(existing[key])) {
            const oldAsNum = parseFloat(existing[key]);
            const newAsNum = parseFloat(newEntry[key]);

            if (Util.isNumber(oldAsNum) && Util.isNumber(newAsNum)) {
                existing[key] = Util.mean([ oldAsNum, newAsNum ]);
            }

            // And if the old val is legit and we can't average, just leave it.
            continue;
        }
        else {
            existing[key] = newEntry[key];
        }

        // const name = existing.name || newEntry.name;
        // if (existing[key] === 0) {
        // // if (name && name.includes('ydra')) {
        //     Util.logDebug({
        //         name,
        //         key,
        //         wrote: existing[key],
        //         context: 'Parser.merge() - bottom.',
        //     });
        // }
    }
};

const tidyConfig = () => {
    const ymlString = loadConfig();
    const lines = ymlString.split('\n');
    const duplications = {};

    for (let i = 0; i < lines.length; i++) {
        // const tripleIndented = /            [A-z]/.test(lines[i]);
        const tripleIndented = (lines[i].split(' ').length - 1) === 12;

        if (! tripleIndented) {
            continue;
        }

        const duplicates = lines.filter(l => l === lines[i]);

        if (duplicates.length >= 2) {
            duplications[lines[i]] = duplicates.length;
        }
    }

    if (Object.keys(duplications).length >= 1) {
        Util.logDebug(duplications);
        // return;
    }

    const halo = yaml.load(ymlString).Halo;

    // Util.logDebug(halo);
    // return;

    for (let factionKey in halo) {
        if (factionKey === 'name') { continue; }

        const faction = halo[factionKey];

        for (let sectionKey in faction) {
            // if ()
            const section = faction[sectionKey];

            if (Util.isString(section)) { continue; }

            for (let entryKey in section) {
                const entry = section[entryKey];

                const typeMap = {
                    Pierce: 'Kinetic',
                    Bullet: 'Kinetic',
                    Blast: 'Explosive',
                }

                if (typeMap[entry.type]) {
                    entry.type = typeMap[entry.type];
                }

                // console.log(entryKey);

                if (! entry.name && entryKey.includes(' ')) {
                    entry.name = entryKey;
                }
                else {
                    entry.name = Util.fromCamelCase(entryKey);
                }

                let tidyName = entryKey;
                while (tidyName.includes(' ')) {
                    const i = tidyName.indexOf(' ');

                    // Util.logDebug({
                    //     tidyName,
                    //     i,
                    //     iMinus1: tidyName[i - 1],
                    // });

                    tidyName = tidyName.slice(0, i-1) +
                        tidyName[i - 1].toLowerCase() +
                        tidyName[i + 1].toUpperCase() +
                        tidyName.slice(i + 2);
                }

                // if (/[a-z] [A-Z]/.test(entryKey)) {
                //     // tidyName = entryKey.replaceAll(' ', '');
                //     tidyName = entryKey.replaceAll(/([a-z]) ([A-Z])/, /\1\2/);
                    // No effect, oddly
                // }

                // if (entryKey.includes(' ')) {
                //     // tidyName = entryKey.replaceAll(/([A-Z]) /, '\1');
                // }

                delete section[entryKey];

                section[tidyName] = entry;
            }
        }
    }

    console.log(
        yaml.dump(halo, { sortKeys: true, indent: 4, })
    );
};

const loadConfig = () => {
    return fs.readFileSync(
        path.join(__filename, '..', '..', '..', 'data', 'config.yml'),
        'utf8'
    );
};

/*
Background: I like how yaml is readable for nondevs, but it'll be tricky to make it compatible with browserify. For now, i'll just have my build script copy the .yml file to a string within a .js file.
The user has to run the build script after editing. But that's true already because of browserify.
*/
const translateConfig = () => {
    const ymlString = loadConfig();

    const configJsString = 'module.exports = `' + ymlString + '`;';

    fs.writeFileSync(
        path.join(__filename, '..', '..', '..', 'data', 'config.js'),
        configJsString,
        'utf8'
    );
};

// logConvertedCSVs();
// tidyConfig();
translateConfig();
