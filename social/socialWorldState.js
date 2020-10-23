'use strict';

const SpeechLine = require('./speechLine.js');

const WorldState = require('../bottleWorld/worldState.js');

class SocialWorldState extends WorldState {

    // Returns pretty English string
    renderSpeech (speechLine, speaker, addressee) {
        const subjectId = speechLine.getSubject();
        let subject = '';

        if (subjectId === speaker && speaker.id) {
            subject = 'I';
        }
        else if (subjectId === addressee && addressee.id) {
            subject = 'You';
        }
        else {
            // TODO fromId() should not clumsily fall back on WGenerator.
            const subjectThing = this.fromId(subjectId);

            if (! subjectThing) {
                // Fall back on the ID for now.
                subject = speechLine.getSubject();
            }
            else {
                subject = Util.capitalized(subjectThing.displayName);
            }
        }

        const verb = speechLine.renderVerb(3);

        // Later also convert object to pronoun if it is the speaker or the addressee

        const objectThing = this.thingById(
            speechLine.getObject()
        );

        const object = objectThing.displayName;

        return `${subject} ${verb} ${object}.`;
    }

    static testRenderSpeech () {
        const worldState = new SocialWorldState(); // TODO params

        for (let i = -101; i < 102; i++) {
            const line = SpeechLine.example();
            line.words[3] = i;

            const text = worldState.renderSpeech(line);
            console.log(`${text} (${i})`);
        }
    }
}

module.exports = SocialWorldState;

SocialWorldState.testRenderSpeech();

