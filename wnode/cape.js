'use strict';

const Group = require('./group.js');

const RegionTree = require('../generation/demographics/regionTree.js');
const WGenerator = require('../generation/wgenerator.js');

const Util = require('..//util/util.js');

const fs = require('fs');
const readline = require('readline');

// For the Cape Demographics fan project.
class Cape extends Group{
    constructor (csv) {
        super();

        if (csv) {
            const cells = csv.split(',');

            [
                this.capeName,
                this.fullName,
                this.age,
                this.gender,
                this.mbti,
                this.classification,
                this.rating,
                this.theme,
                this.allegiance
            ] = cells;

            this.age = Number(this.age);
            this.rating = Number(this.rating);
            this.location = cells.slice(9);

            return;
        }

        const wTree = WGenerator.fromCodex('parahumans/cape').getOutputs();
        this.components = wTree[0].components;

        const ageNode = this.components.find(node => node.templateName.endsWith('YearsOld'));
        this.age = ageNode &&
            Number(ageNode.templateName.slice(0, 2));

        const genderNode = this.components.find(node => node.templateName.startsWith('gender'));
        this.gender = genderNode && genderNode.templateName.toLowerCase().slice(6);

        const mbtiNode = this.components.find(
            node => node.description && node.description.startsWith('Myers-Briggs')
        );
        this.mbti = mbtiNode && mbtiNode.displayName.toLowerCase();

        const powerNode = this.components.find(node => node.templateName === 'power');
        const powerChildren = powerNode.components[0].components;

        // eg blaster
        this.classification = powerChildren.find(
            node => node.templateName.length >= 5
        ).templateName;

        // eg 5
        this.rating = Cape.randomRatingUnbound();

        const themeNode = this.components.find(node => node.templateName === 'theme');
        this.theme = themeNode && themeNode.components[0].templateName;

        const allegianceNode = this.components.find(node => Util.contains(['hero', 'rogue', 'villain'], node.templateName));
        this.allegiance = allegianceNode && allegianceNode.templateName;

        this.location = RegionTree.randomLocation().reverse();
    }

    toCsvRow () {
        const locString = this.location.join(',');

        // Later might be convenient to store header names as a constant array of strings.
        return [
            this.capeName, // later
            this.fullName, // later
            this.age,
            this.gender,
            this.mbti,
            this.classification,
            this.rating,
            this.theme,
            this.allegiance,
            locString
        ].join(',');
    }

    // In the style of PRTQuest's bios of capes
    toPrettyBio () {
        const cName = this.capeName ?
            this.prefix() + this.capeName.toUpperCase() :
            '[' + this.allegiance.toUpperCase() + ']';

        const rName = this.fullName || 'Civilian name unknown';
        const classification = Util.capitalized(this.classification);
        const theme = Util.capitalized(this.theme);
        const mbti = this.mbti.toUpperCase();
        const locString = RegionTree.toPrettyString(this.location);

        return `\n ◈ ${cName} (${rName}, ${this.gender}, age ${this.age}). ${classification} ${this.rating}. ${theme}-themed costume. Personality type ${mbti}. \n   Based out of: ${locString}`;
    }

    prefix () {
        if (this.allegiance === 'villain') {
            return 'VLLN_';
        }

        if (this.allegiance === 'hero') {
            return 'HERO_';
        }

        return 'ROGUE_';
    }

    static randomRating () {
        let out = 0;
        const PASSES = 6;

        for (let pass = 0; pass < PASSES; pass++) {
            out += Math.random();
        }

        out *= 12.4 / PASSES;

        return Math.round(out);
    }

    // Unbounded method
    static randomRatingUnbound () {
        let rating = 0.5;
        const WINE = 8;
        let roll;

        do {
            roll = Math.random() * (rating + WINE);
            rating += 0.5;
        }
        while (roll > rating);

        return Math.round(rating);
    }

    // Stepwise method
    static randomRatingStepwise () {
        const cases = [
            0,
            1,
            2, 2,
            3, 3, 3, 3, 3,
            4, 4, 4, 4, 4, 4,
            5, 5, 5, 5, 5, 5
        ];

        const rating = Util.randomOf(cases);

        if (rating === 5) {
            // Iterative random chance of adding +1.
        }

        return rating;
    }

    static testRandomRating () {
        const histogram = {};

        const POPULATION = 680000;

        for (let i = 0; i < 680000; i++) {
            const rating = Cape.randomRatingUnbound();

            if (histogram[rating]) {
                histogram[rating] += 1;
            }
            else {
                histogram[rating] = 1;
            }
        }

        for (let r = 0; r < 20; r++) {
            const context = Util.commaNumber(Math.round(
                POPULATION / histogram[r]
            ));

            Util.log(`${r}: ${histogram[r]} (${(histogram[r] / POPULATION * 100).toFixed(4)}%) (1 in ${context})`);
        }
    }

    static async withTraits (traitsObj) {
        return new Promise(
            (resolve, reject) => {
                const selected = [];

                const lineReader = readline.createInterface({
                    input: fs.createReadStream('./generation/demographics/everyCape.txt')
                });

                lineReader.on(
                    'line',
                    line => {
                        const cape = new Cape(line);

                        for (let key in traitsObj) {
                            // TODO First attempt to filter into a in-memory array. If too many are ending up in output, stop and write to a out file instead.

                            const skipThese = [];
                            if (Util.contains(skipThese, key)) {
                                continue;
                            }

                            if (key === 'age') {
                                // Interpret as a maximum for now.
                                if (cape.age > traitsObj.age) {
                                    return;
                                }

                                continue;
                            }

                            if (key === 'rating') {
                                // Interpret as minimum
                                if (cape.rating < traitsObj.rating) {
                                    return;
                                }

                                continue;
                            }

                            if (key === 'location') {
                                const path = traitsObj.location;

                                for (let i = 0; i < path.length; i++) {
                                    if (path[i] !== cape.location[i]) {
                                        return;
                                    }
                                }

                                continue;
                            }

                            if (! cape[key] || cape[key] !== traitsObj[key]) {
                                return;

                                // Later support searching by parts of MBTI
                            }
                        }

                        selected.push(cape);
                        // Util.log(cape.toCsvRow());

                        if (selected.length % 1000 === 0) {
                            Util.log(`Selected a ${selected.length}th cape.`);
                        }
                    }
                );

                // TODO this returns [], probably from a async / sync timing mismatch.
                // return selected;

                lineReader.on(
                    'close',
                    () => { resolve(selected); } // TODO this could work inside a Promise func.
                );
            }
        );
    }

    // input: [continent, nation, province, city, borough, neighborhood]
    // returns: Cape[]
    static async inLocation (path) {
        return Cape.withTraits({
            location: path
        });
    }

    static toCsv (capes) {
        return capes.map(
            c => c.toCsvRow()
        ).join('\n');
    }

    static async biosWithTraits (traitsObj) {
        const capes = await Cape.withTraits(traitsObj);

        const bios = capes.map(c => c.toPrettyBio());

        Util.log(
            bios.join('\n')
        );

        return bios;
    }

    static testCsvConversion () {
        for (let i = 0; i < 100; i++) {
            const cape = new Cape();
            const csv = cape.toCsvRow();
            const converted = new Cape(csv);

            for (const key in cape) {
                if (Util.contains(['id', 'components', 'lastVisited'], key)) {
                    continue;
                }

                const debugMessage = `key ${key} discrepancy (${cape[key]}, type ${typeof cape[key]} vs ${converted[key]}, type ${typeof converted[key]}) in ${csv}`;

                if (key === 'location') {
                    const loc = cape.location;
                    const convertedLoc = converted.location;
                    for (let j = 0; j < loc.length; j++) {
                        if (loc[j] !== convertedLoc[j]) {
                            throw new Error(debugMessage);
                        }
                    }

                    continue;
                }

                if (cape[key] !== converted[key]) {
                    throw new Error(debugMessage);
                }
            }
        }
    }

    static async run () {
        Cape.testCsvConversion();

        // const outStream = fs.createWriteStream(`allCapes-${Util.newId()}.txt`, { flags: 'a' });

        // for (let i = 0; i < 683270; i++) {
        //     const cape = new Cape();
        //     // Cape.EVERYONE.push(cape);

        //     // Append to file to save JS memory
        //     outStream.write(cape.toCsvRow() + '\n');

        //     if (i % 50000 === 0) {
        //         Util.log(i);
        //     }
        // }

        // outStream.end();

        // Util.log(
        //     '\n' +
        //     Cape.toCsv(
        //         // Later CLI support.
        //         Cape.withTraits({
        //             // allegiance: 'hero',
        //             rating: 10,
        //             location: ['eurasia', 'japan']
        //         })
        //     )
        // );

        await Cape.biosWithTraits({
            // allegiance: 'hero',
            // rating: 12,
            location: ['northAmerica', 'usa', 'california', 'santaCruzCounty', 'santaCruz']
        });
    }
};

module.exports = Cape;

Cape.run();
