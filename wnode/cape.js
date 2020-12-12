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
        this.rating = Number(powerChildren.find(
            node => node.templateName.length <= 2
        ).templateName);

        const themeNode = this.components.find(node => node.templateName === 'theme');
        this.theme = themeNode && themeNode.components[0].templateName;

        const allegianceNode = this.components.find(node => Util.contains(['hero', 'rogue', 'villain'], node.templateName));
        this.allegiance = allegianceNode && allegianceNode.templateName;

        this.location = RegionTree.randomLocation().reverse();
    }

    // findComponent (matchFunc) {
    //     return this.components.find(matchFunc);
    // }

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

    // TODO, in the style of PRTQuest's short paragraph bios of capes.
    toPrettyBio () {

    }

    static withTraits (traitsObj) {
        // TODO read from txt file instead of EVERYONE.
        const selected = [];
        const lineReader = readline.createInterface({
            input: fs.createReadStream('../generation/everyCape.txt')
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
                Util.log(cape.toCsvRow());

                if (selected.length % 1000 === 0) {
                    Util.log(`Selected a ${selected.length}th cape.`);
                }
            }
        );

        // TODO this returns [], probably from a async / sync timing mismatch.
        return selected;

        // return Cape.EVERYONE.filter(
        //     cape => {
        //         for (let key in traitsObj) {
        //             // TODO First attempt to filter into a in-memory array. If too many are ending up in output, stop and write to a out file instead.

        //             const skipThese = [];
        //             if (Util.contains(skipThese, key)) {
        //                 continue;
        //             }

        //             if (key === 'age') {
        //                 // Interpret as a maximum for now.
        //                 if (cape.age > traitsObj.age) {
        //                     return false;
        //                 }

        //                 continue;
        //             }

        //             if (key === 'rating') {
        //                 // Interpret as minimum
        //                 if (cape.rating < traitsObj.rating) {
        //                     return false;
        //                 }

        //                 continue;
        //             }

        //             if (key === 'location') {
        //                 const path = traitsObj.location;

        //                 for (let i = 0; i < path.length; i++) {
        //                     if (path[i] !== cape.location[i]) {
        //                         return false;
        //                     }
        //                 }

        //                 continue;
        //             }

        //             if (! cape[key] || cape[key] !== traitsObj[key]) {
        //                 return false;

        //                 // Later support searching by parts of MBTI
        //             }
        //         }

        //         return true;
        //     }
        // );
    }

    // input: [continent, nation, province, city, borough, neighborhood]
    // returns: Cape[]
    static inLocation (path) {
        return Cape.withTraits({
            location: path
        });
    }

    static toCsv (capes) {
        return capes.map(
            c => c.toCsvRow()
        ).join('\n');
    }

    static biosWithTraits (traitsObj) {
        Util.log(
            '\n' +
            Cape.withTraits(traitsObj)
                .map(c => c.toPrettyBio())
                .join('\n\n')
        );
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

    static run () {
        Cape.testCsvConversion();

        Cape.EVERYONE = [];

        // const outStream = fs.createWriteStream(`allCapes-${Util.newId()}.txt`, { flags: 'a' });

        // for (let i = 0; i < 683000; i++) {
        //     const cape = new Cape();
        //     // Cape.EVERYONE.push(cape);

        //     // Append to file to save JS memory
        //     outStream.write(cape.toCsvRow() + '\n');

        //     if (i % 50000 === 0) {
        //         Util.log(i);
        //     }
        // }

        // outStream.end();

        Util.log(
            '\n' +
            Cape.toCsv(
                Cape.withTraits({
                    // rating: 6,
                    location: ['northAmerica', 'usa', 'california', 'santaBarbara']
                })
            )
        );
    }
};

module.exports = Cape;

Cape.run();
