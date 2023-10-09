'use strict';

const Creature = require('./creature.js');
const Thing = require('./thing.js');
const WNode = require('./wnode.js');

const TraitGrid = require('../bottleWorld/traitGrid.js');

const Util = require('../util/util.js');

class DetailedPerson extends Creature {
    constructor (template, coord, alignment) {
        super(template, coord, alignment);

        this.name = this.name || 
            ( Util.randomLetter() + Util.randomLetter() ); //TODO randomName

        this.gender = TraitGrid.randomGender();
        this.genderPrefs = this.datesTheseGenders();

        this.age = Util.randomIntBetween(0, 110);

        const mbti = new WNode('mbti');
        mbti.updateMbti();
        this.add(mbti);

        this.traitGrid = TraitGrid.random();

        // LATER these should be on the template instead, not the WNode.
        this.sp = 10;
        this.size = 2;
    }

    opinionOf (other) {
        let opinion = this.traitGrid.opinionOf(other.traitGrid);

        if (this.gender === other.gender) {
            opinion += 1;
        }

        return opinion;
    }

    toPrettyString () {
        // Later expand this.
        const name = this.displayName || this.templateName;

        return `${this.traitGrid} ${this.age}-year-old ${this.gender} ${name}`;
    }

    static example () {
        return DetailedPerson.yaExample();
    }

    // Example from the genre of Young Adult novels.
    static yaExample () {
        const human = new DetailedPerson('human');
        human.add(new Thing('duelingSword'));

        // Note: After edits, this function has become boring.

        return human;
    }

    datesTheseGenders () {
        const genders = [];
        for (let i = 0; i < 3; i++) {
            genders.push(
                TraitGrid.randomGender()
            );
        }

        return Util.unique(genders);
    }

    genderPrefsString () {
        return this.genderPrefs.join(' & ') + ' people';
    }

    datesAgeRange () {
        return {
            min: Math.floor(this.age * 5/6),
            max: Math.ceil(this.age * 1.2),
        };

        // min: Math.floor(this.age / 2) + 7,
        // max: 2 * (this.age - 7)
    }

    dateableAge () {
        const range = this.datesAgeRange();

        return Util.randomIntBetween(range.min, range.max + 1);
    }

    static testAgeRange () {
        for (let a = 0; a < 120; a++) {
            const person = new DetailedPerson();
            person.age = a;
            const range = person.datesAgeRange();

            // console.log(`a ${range.min}-year-old & a ${person.age}-year-old\ta ${person.age}-year-old & a ${range.max}-year-old`);

            console.log(`${range.min} & ${person.age}\t\t${person.age} & ${range.max}`);
            // console.log(`${a} & ${Math.ceil(a * 1.2)}`)

        }
    }

    introString () {
        return `I am ${this.name}, a ${this.demographicPhrase()}`;
    }

    speedDate () {
        console.log(`\n${this.introString()} who is searching for romance. I date ${this.genderPrefsString()}.`);

        console.log(`DEBUG - I am a ${this.traitGrid.toString()} ${this.demographicPhrase()}.`);

        let date;
        let compatibleGenders;

        for (let i = 0; i < 99; i++) {
            date = new DetailedPerson();
            date.age = this.dateableAge();
            
            console.log(`  \nHi, ${date.introString()}.`);

            compatibleGenders = true;
            if (! this.genderPrefs.includes(date.gender)) {
                console.log(`Unfortunately, ${this.name} isn't looking for ${date.gender} dates.`);
                compatibleGenders = false;
            }
            if (! date.genderPrefs.includes(this.gender)) {
                console.log(`Unfortunately, ${date.name} isn't looking for ${this.gender} dates.`)
                compatibleGenders = false;
            }

            if (! compatibleGenders) {
                continue;
            }

            break;
        }

        if (! compatibleGenders) { return; } // bad luck, timed out

        console.log(`DEBUG - They are a ${date.traitGrid.toString()} ${date.demographicPhrase()}.`);

        // TODO reveal traits from traitgrid 1 by 1
        // LATER functionize
        const unknownAxes = Util.shuffle(
            Object.keys(TraitGrid.axisToAdjective)
        );

        const asker = this;
        for (let axis of unknownAxes) {
            asker.askAboutTrait(axis, date);

            // Alternate. 
            // asker = (asker === this) ?
            //     date :
            //     this;
            // EDIT, actually alternation is tricky with differing trait counts.
        }


        
    }

    askAboutTrait (axis, date) {
        const myTrait = this.traitGrid.formatTrait(axis);
        const datesTrait = date.traitGrid.formatTrait(axis);

        let asker = this;
        let responder = date;
        let askerTrait = myTrait;
        let responderTrait = datesTrait;

        if (myTrait === '') {
            if (datesTrait === '') {
                return;
            }

            asker = date;
            responder = this;
            askerTrait = datesTrait;
            responderTrait = myTrait;
        }

        const question = `My friends say I'm ${askerTrait}. Are you ${askerTrait} too?`;

        let response;
        if (askerTrait === responderTrait) {
            response = `Oh yeah, we definitely have that in common.`;
        }
        else if (responderTrait === '') {
            response = `Well, not as much as you.`;
            // TODO Immediately bring up the next axis that responder has a value in. Will require function refactor. 
        }
        else {
            response = `Actually, I'm pretty ${responderTrait}.`;
        }

        console.log(`\n${asker.name}: ${question}\n${responder.name}: ${response}\n`);
    }

    demographicPhrase () {
        const THRESHOLD = 20;
        const YOUNG_NOUNS = {
            female: 'girl',
            nonbinary: 'enby',
            male: 'boy',
        };

        const ADULT_NOUNS = {
            female: 'woman',
            nonbinary: 'enby',
            male: 'man',
        };

        const noun = this.age < THRESHOLD ?
            YOUNG_NOUNS[this.gender] :
            ADULT_NOUNS[this.gender];

        return `${this.age}-year-old ${noun}`;
        // return `${this.gender} ${this.age}-year-old`;
    }

    static testSpeedDate () {
        const protag = new DetailedPerson();
        protag.speedDate();
    }

    static test () {
        const ally = DetailedPerson.yaExample();
        const a = ally.toPrettyString();
        const stranger = DetailedPerson.yaExample();
        const s = stranger.toPrettyString();

        Util.log([
            `I am a ${a}.`,
            `My opinion of them is: ${ally.opinionOf(stranger)}.`,
            `They are a ${s}.`,
            `Their opinion of me is: ${stranger.opinionOf(ally)}.`
        ].join('\n'));
    }
};

module.exports = DetailedPerson;

// DetailedPerson.test();
DetailedPerson.testSpeedDate();
// DetailedPerson.testAgeRange();
