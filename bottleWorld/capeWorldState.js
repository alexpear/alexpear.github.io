'use strict';

const _ = require('lodash');

const WorldState = require('./worldState.js');
const Timeline = require('./timeline.js');

const WGenerator = require('../generation/wgenerator.js');

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');

const Group = require('../wnode/group.js');

// Bottle World for Parahumans style superhero stories.
class CapeWorldState extends WorldState {

    allAlignments () {
        return [
            'hero',
            'rogue',
            'villain'
        ];
    }

    // Pretty formatting func.
    static capeSummary (capeNode) {
        if (capeNode.templateName !== 'cape') {
            throw new Error(capeNode.templateName);
        }

        const name = capeNode.displayName || capeNode.name || 'Cape';

        const powerNode = capeNode.findComponent('power');

        const ratingStr = powerNode.components.filter(
            c => c.templateName === 'rating'
        )
        .map(
            c => CapeWorldState.formatRating(c)
        )
        .join(', ');

        const gender = capeNode.findComponent(
            c => Util.contains(['female', 'male', 'nonbinary'], c.templateName)
        )
        .templateName;

        const ageNode = capeNode.findComponent(
            c => c.templateName.endsWith('YearsOld')
        );
        const age = ageNode.templateName.slice(0, 'YearsOld'.length * -1);

        const themeNode = capeNode.findComponent('theme');
        const themeString = themeNode ?
            `, ${Util.fromCamelCase(themeNode.components[0].templateName)}-themed` :
            '';

        return `${name} (${ratingStr}, ${gender}, ${age}${themeString})`;
    }

    static formatRating (ratingNode) {
        // This format could become less fragile LATER
        const classNodeI = 1;
        const classNode = ratingNode.components[classNodeI];

        // Guess where it is.
        const numberNodeI = classNodeI === 0 ?
            1 :
            classNodeI - 1;

        const numberNode = ratingNode.components[numberNodeI];

        // Util.logDebug(ratingNode.toPrettyString());

        const ratingStr = `${Util.capitalized(classNode.templateName)} ${numberNode.templateName}`;

        if (classNode.templateName = 'tinker') {
            const child = classNode.components.find(
                c => Util.contains(CapeWorldState.CLASSIFICATIONS, c.templateName)
            );

            if (child) {
                return `${ratingStr} (${Util.capitalized(child.templateName)})`
            }
        }

        return ratingStr;
    }

    static example (timeline) {
        const worldState = new CapeWorldState();

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;

        worldState.timeline = timeline;

        return worldState;
    }

    static randomCape () {
        const cape = WGenerator.generators['parahumans/cape'].getOutputs()[0];

        Util.logDebug(CapeWorldState.capeSummary(cape));

        return cape;
    }

    static test () {
        // Util.log(`Beginning the CapeWorldState test...`, `debug`);

        const cape = CapeWorldState.randomCape();

        const worldState = CapeWorldState.example();

        // Util.log(`Up to t=${worldState.now()}, the timeline is: \n${worldState.timeline.toDebugString()}`, 'debug');

        return worldState;
    }

    static run () {
        const consoleArguments = process.argv;
        if (consoleArguments[2] === 'test') {
            CapeWorldState.test();
        }
    }
}

CapeWorldState.CLASSIFICATIONS = [
    'mover',
    'shaker',
    'brute',
    'breaker',
    'master',
    'tinker',
    'blaster',
    'thinker',
    'striker',
    'changer',
    'trump',
    'stranger'
];

module.exports = CapeWorldState;

// Run with the following CLI command:
// node capeWorldState.js test

CapeWorldState.run();

