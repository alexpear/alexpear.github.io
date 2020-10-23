'use strict';

class Mind {
    constructor () {
        this.id = Util.newId();
        this.fullName = '';
        this.age = undefined;
        this.opinions = {};
        this.tags = []; // Could change to hashmap in the unlikely event that performance becomes time-constrained.
    }

    opineOn (topic) {
        return new SpeechLine([
            this.id,
            'opinion',
            topic,
            this.opinions[topic] || 0
        ]);
    }

    static example () {
        const mind = new Mind();
        mind.fullName = 'Draco Malfoy';
        mind.age = 13;
        mind.opinions = {
            weirdSisters: 99,
            bloodPurity: 50
        };
        mind.tags = ['slytherin', 'male', 'pureBlood'];

        return mind;
    }
}

module.exports = Mind;

