'use strict';

const Util = require('../util/util.js');

class ComplicityMassEffect {

    static run () {
        const character = new Character();

        // Util.logDebug(character);

        console.log();
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
            { name: 'human',    type: 'species' },
            { name: 'asari',    type: 'species', skills: 'combat' },
            { name: 'turian',   type: 'species', skills: 'combat' },
            { name: 'salarian', type: 'species', skills: 'tech' },
            { name: 'krogan',   type: 'species', skills: 'combat combat' },
            { name: 'quarian',  type: 'species', skills: 'tech' },
            { name: 'batarian', type: 'species' },
            { name: 'drell',    type: 'species' },
            { name: 'volus',    type: 'species', skills: 'social' },
            { name: 'synthetic', type: 'species', skills: 'tech' },
            { name: 'hanar',    type: 'species' },
            { name: 'elcor',    type: 'species', },
            { name: 'vorcha',   type: 'species', },
            { name: 'prothean', type: 'species', skills: 'science' },
            // { name: 'angara',   type: 'species', },
            // { name: 'kett',     type: 'species', },
            // { name: 'yahg',     type: 'species', },
            // { name: 'rachni',   type: 'species', skills: 'combat' },
            // { name: 'collector', type: 'species', skills: 'science' },
            // { name: 'keeper',   type: 'species', skills: 'tech' },
            // { name: 'jardaan',  type: 'species', skills: 'tech' },

            { name: 'soldier',      type: 'role', skills: 'combat combat' },
            { name: 'scientist',    type: 'role', skills: 'science science' },
            { name: 'boss',         type: 'role', skills: 'social social' },
            { name: 'technician',   type: 'role', skills: 'tech tech' },

            { name: 'vanguard',     type: 'role', skills: 'combat science' },
            { name: 'spy',          type: 'role', skills: 'combat social' },
            { name: 'sentinel',     type: 'role', skills: 'combat tech' },
            { name: 'administrator', type: 'role', skills: 'science social' },
            { name: 'engineer',     type: 'role', skills: 'science tech' },
            { name: 'analyst',      type: 'role', skills: 'social tech' },
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
