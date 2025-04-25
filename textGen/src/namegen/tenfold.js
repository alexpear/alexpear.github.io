'use strict';

const Util = require('../../../util/util.js');

class Tenfold {
    static syllables () {
        return [
            'on',
            'di',
            'tre',
            'que',
            'phi',
            'ex',
            'su',
            'av',
            'nor',
            'ko',
        ];
    }

    static syllable (numeral) {
        return Tenfold.syllables()[ numeral - 1 ];
    }

    static allPairs () {
        for (let a of Tenfold.syllables()) {
            for (let b of Tenfold.syllables()) {
                const name = Util.capitalized(a + b);

                console.log(name);
            }
        }
    }

    static randomWord (syllables) {
        let word = '';

        for (let i = 0; i < syllables; i++) {
            word += Util.randomOf(Tenfold.syllables());
        }

        return Util.capitalized(word);
    }

    static randomPerson () {
        return Tenfold.randomWord(4) + ' ' + Tenfold.randomWord(4) + ' ' + Tenfold.randomWord(2);
    }

    static run () {
        // Tenfold.allPairs();

        for (let i = 0; i < 1; i++) {
            const p = Person.random();
            const output = p.bio();

            console.log(output);
        }
    }
}

class Person {
    constructor (numerals) {
        this.numerals = numerals;
    }

    titledName () {
        if (this.rankNumber() === 0) {
            return `The ${this.title()}`;
        }

        return `${this.title()} ${this.name()}`;
    }

    name (numerals = this.numerals) {   
        const tetranym = Util.capitalized(
            numerals.slice(0, 4)
                .map(
                    n => Tenfold.syllable(n)
                )
                .join('')
        );

        if (numerals.length <= 4) {
            return tetranym;
        }

        return tetranym + ' ' + this.name(numerals.slice(4));
    }

    localName () {
        return this.name(
            this.numerals.slice(4)
        );
    }

    title () {
        const TITLES = [
            'Imperator',
            'Rex',
            'Dux',
            'Princeps',
            'Lady',
            'Admiral',
            'Lieutenant',
            'Captain',
            'Centurion',
            'Officer',
            'Member',
        ];

        const rankNumber = this.rankNumber();

        if (this.rankNumber() === 4 && this.gender() === 'male') {
            return 'Lord';
        }

        return TITLES[rankNumber];
    }

    rankNumber () {
        return this.numerals.length;
    }

    gender () {
        const seed = 1 + Number(
            this.numerals.join('')
        );

        const integer = Math.floor(
            Util.simpleHash(seed) * 10
        );

        return integer % 2 === 0 ?
            'female' :
            'male';
    }

    residence () {
        const PLACETYPE = [
            'The Solar Palace',
            'Planet',
            'Continent',
            'Land',
            'City',
            'Campus',
            'Department',
            'Compound',
            'Wing',
            'Office',
            'Desk',
        ];

        if (this.rankNumber() === 0) {
            return PLACETYPE[0];
        }

        const noble = new Person(
            this.numerals.slice(0, 4)
        );

        const nobleResidence =  `the ${PLACETYPE[noble.rankNumber()]} of ${noble.name()}lia`;

        if (this.rankNumber() <= 4) {
            return nobleResidence;
        }

        return `the ${this.localName()} ${PLACETYPE[this.rankNumber()]} of ${nobleResidence}`;
    }

    boss () {
        return new Person(
            // Omit last numeral. Note: Will return [] for [].
            this.numerals.slice(0, -1)
        );
    }

    directSubordinates () {
        if (this.rankNumber() === 10) {
            return [];
        }

        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
            digit => new Person(
                this.numerals.concat(digit)
            )
        );
    }

    // Number of roles there are at this rank, including own role.
    peerQuantity () {
        return Math.pow(10, this.rankNumber());
    }

    subordinateQuantity () {
        let subordinates = 0;
        const ranksBelow = 10 - this.rankNumber();

        for (let scale = 1; scale <= ranksBelow; scale++) {
            subordinates += Math.pow(10, scale);
        }

        return subordinates;
    }

    planetTopic () {
        const TOPICS = [
            undefined,
            'military',
            'ecology',
            'transportation',
            'construction',
            'research',
            'medicine',
            'supply',
            'resources',
            'art',
            'communication',
        ];

        return TOPICS[
            this.numerals[0]
        ];
    }

    planetSentence () {
        if (this.rankNumber() === 0) {
            return `${Util.capitalized(this.sheHe())} rules all ten planets of the Stellarium`;
        }

        const planetSyllable = Util.capitalized(
            Tenfold.syllable(this.numerals[0])
        );

        return `${planetSyllable}lia is the ${this.planetTopic()} planet`;
    }

    sheHe () {
        return this.gender() === 'female' ?
            'she' :
            'he';
    }

    herHis () {
        return this.gender() === 'female' ?
            'her' :
            'his';
    }

    bio () {
        const sheHe = Util.capitalized(this.sheHe());

        const subQuantity = this.subordinateQuantity();

        const directSubs = this.directSubordinates().map(
            sub => sub.titledName()
        )
        .join('\n');

        const directsString = subQuantity >= 1 ?
            `, most directly the following:\n${directSubs}` :
            '';

        return `${this.titledName()} is in charge of ${this.residence()}. ${this.planetSentence()}. ${sheHe} is 1 of ${Util.commaNumber(this.peerQuantity())} of ${this.herHis()} rank. ${this.boss().titledName()} is ${this.herHis()} boss. \n${sheHe} has ${Util.commaNumber(subQuantity)} subordinates${directsString}.`;
    }

    // Distribution where leadership is more common.
    static random () {
        const numerals = [];

        while (numerals.length < 10) {
            const next = Util.randomUpTo(10) + 1;

            if (next === 11) {
                break;
            }

            numerals.push(next);
        }

        return new Person(numerals);
    }
}

module.exports = Tenfold;

Tenfold.run();

