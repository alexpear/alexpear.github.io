'use strict';

const Group = require('./group.js');

const RegionTree = require('../generation/demographics/regionTree.js');
const WGenerator = require('../generation/wgenerator.js');

const Util = require('..//util/util.js');

const fs = require('fs');

// For the Cape Demographics fan project.
class Cape extends Group{
    constructor () {
        super();

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
        this.rating = powerChildren.find(
            node => node.templateName.length <= 2
        ).templateName;

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
        return Cape.EVERYONE.filter(
            cape => {
                for (let key in traitsObj) {
                    const skipThese = [];
                    if (Util.contains(skipThese, key)) {
                        continue;
                    }

                    if (key === 'age') {
                        // Interpret as a maximum for now.
                        if (cape.age > traitsObj.age) {
                            return false;
                        }

                        continue;
                    }

                    if (key === 'rating') {
                        // Interpret as minimum
                        if (cape.rating < traitsObj.rating) {
                            return false;
                        }

                        continue;
                    }

                    if (key === 'location') {
                        const path = traitsObj.location;

                        for (let i = 0; i < path.length; i++) {
                            if (path[i] !== cape.location[i]) {
                                return false;
                            }
                        }

                        continue;
                    }

                    if (! cape[key] || cape[key] !== traitsObj[key]) {
                        return false;

                        // Later support searching by parts of MBTI
                    }
                }

                return true;
            }
        );
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

    static run () {
        Cape.EVERYONE = [];

        for (let i = 0; i < 683000; i++) {
            Cape.EVERYONE.push(new Cape());

            // TODO append to file using fs.createWriteStream(), to save memory

            if (i % 50000 === 0) {
                Util.log(i);
            }
        }

        Util.log('\n' + Cape.toCsv(Cape.EVERYONE));

        Util.log(
            '\n' +
            Cape.toCsv(
                Cape.withTraits({
                    rating: 6,
                    location: ['northAmerica', 'usa', 'california', 'santaBarbara']
                })
            )
        );
    }
};

module.exports = Cape;

Cape.run();
