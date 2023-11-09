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
    const ignoredPrefices = [
        'Blanks',
        'Gets hit by Hit...',
        'Dmg vs HP',
        'Hit vs Def',
        'Perfect TtK',
        'Hits vs',
        'TtK',
        'Dmg / Shot',
        'Equiv',
        'SMG',
        'Light Bullets',
        'Scorpion',
        'Mammoth',
        'Max DpS',
        'Direct DpS',
        'Splash DpS',
        'Spartan Hits',
        '1/prev',
        'DMR hits',
        'hit - dmg',
    ];

    const propMap = {
        faction: ['faction'],
        type: ['damage type', 'attack type', 'infinite dmg type'],
        damage: ['damage'],
        rof: ['shots / sec'],
        accuracy: ['hit', 'acc 4m'],
        preferredRange: ['range (m)'],
        size: ['squares / side', 'size'],
        speed: ['m/s'],
        durability: ['sp', 'durability est', 'hp', 'defense'],
        name: ['name', 'creature', 'attack'],
        scale: ['scale'],
        classic: ['cool / classic', 'prevalence / 10'],
        cost: ['cost'],
        aoe: ['splash'],
        source: ['from game'],
    };

    const warbandObjs = [];

    for (let obj of rowObjs) {
        const warbandObj = {};

        for (let desiredKey in propMap) {
            for (let synonymKey of propMap[desiredKey]) {

                // Util.logDebug({
                //     context: 'Parser.json2warband()',
                //     desiredKey,
                //     synonymKey,
                //     objValue: obj[synonymKey],
                // });

                if (Util.legit(obj[synonymKey])) {
                    warbandObj[desiredKey] = obj[synonymKey];
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
            if (obj.durability) { componentType = 'Creature'; }
            else if (obj.type)  { componentType = 'Item'; }
            else                { componentType = 'Squad'; }

            halo[faction][componentType][obj.name || Util.newId(7)] = obj;
            delete obj.name;
            delete obj.faction;
        }
    }

    return halo;
};

/*
Background: I like how yaml is readable for nondevs, but it'll be tricky to make it compatible with browserify. For now, i'll just have my build script copy the .yml file to a string within a .js file.
The user has to run the build script after editing. But that's true already because of browserify.
*/
const translateConfig = () => {
    const ymlString = fs.readFileSync(
        path.join(__filename, '..', '..', '..', 'data', 'config.yml'),
        'utf8'
    );

    const configJsString = 'module.exports = `' + ymlString + '`;';

    fs.writeFileSync(
        path.join(__filename, '..', '..', '..', 'data', 'config.js'),
        configJsString,
        'utf8'
    );
}


logConvertedCSVs();
translateConfig();
