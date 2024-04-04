'use strict';

const Util = require('../util/util.js');

class ComplicityMassEffect {

    static run () {
        const character = new Character();

        Util.logDebug(character);

        console.log(character.toFullString());
    }
}

ComplicityMassEffect.SKILL = Util.makeEnum([
    'Combat',
    'Science',
    'Social',
    'Tech',
]);

class Character {
    constructor (species, role) {
        this.speciesCard = species || Card.randomSpecies();

        this.roleCards = Util.array(role || Card.randomRole());
    }

    speciesName () {
        return Util.capitalized(this.speciesCard.name);
    }

    cards () {
        return [this.speciesCard].concat(this.roleCards);
    }

    skillObj () {
        const output = {};

        const skillObjs = this.cards().map(
            c => c.skillObj()
        );

        for (let skill in ComplicityMassEffect.SKILL) {

            for (let skillsFromCard of skillObjs) {

                if (skillsFromCard[skill]) {

                    if (output[skill]) {
                        output[skill] += skillsFromCard[skill];
                    }
                    else {
                        output[skill] = skillsFromCard[skill];
                    }
                }
            }
        }

        return output;
    }

    // Rival format to skillObj()
    skillArray () {
        let array = this.speciesCard.skillArray();

        for (let roleCard of this.roleCards) {
            array = array.concat(
                roleCard.skillArray()
            );
        }

        return array.map(
            sk => Util.capitalized(sk)
        )
        .sort();
    }

    skillStr () {
        const array = this.skillArray();

        if (array.length === 0) {
            return ``;
        }

        return ` (${array.join(' ')})`;
    }

    toString () {
        const roleNames = this.roleCards.map(
            card => Util.capitalized(card.name)
        ).join(' ');

        return `${this.speciesName()} ${roleNames}`;
    }

    toFullString () {
        return `${this.toString()}${this.skillStr()}`;
    }
}

class Card {
    constructor (template) {
        Object.assign(this, template);
    }

    static random (constraints) {
        const ALL_CARDS = [
            { name: 'asari', type: 'species', skills: 'combat' },

            { name: 'engineer', type: 'role', skills: 'science tech' },

        ];

        const subset = ALL_CARDS.filter(
            template => {
                for (let key in (constraints || {}) ) {

                    // Util.logDebug({
                    //     key,
                    //     constraintsKey: constraints[key],
                    //     template,
                    // });

                    if (template[key] !== constraints[key]) {
                        return false;
                    }
                }

                return true;
            }
        );

        // Util.logDebug({
        //     constraints,
        //     subset,
        // });

        return new Card(
            Util.randomOf(subset)
        );
    }

    static randomSpecies () {
        return Card.random({
            type: 'species',
        });
    }

    static randomRole () {
        return Card.random({
            type: 'role',
        });
    }

    skillObj () {
        const obj = {};

        if (! this.skills) { return obj; }

        const words = this.skills.split(' ');

        for (let w of words) {
            const skill = Util.capitalized(w);

            if (obj[skill]) {
                obj[skill]++;
            }
            else {
                obj[skill] = 1;
            }
        }

        return obj;
    }

    skillArray () {
        return this.skills ?
            this.skills.split(' ') :
            [];
    }
}

module.exports = ComplicityMassEffect;

ComplicityMassEffect.run();
