'use strict';

const WorldState = require('./worldState.js');
const Timeline = require('./timeline.js');

const WizardingPerson = require('../wnode/wizardingPerson.js');

const Util = require('../util/util.js');

// LATER will need to use yamlify or something to get FS to work in a browser. 
const FS = require('fs');
const Yaml = require('js-yaml');

const Potterverse = Yaml.safeLoad(
    FS.readFileSync('./codices/hogwarts/potterverse.yml', 'utf8')
);

class HogwartsWorldState extends WorldState {
    constructor () {
        super();

        this.year = 1993;

        this.init();
    }

    init () {
        this.people = [];

        // later staff

        for (let y = this.year; y >= this.year - 6; y--) {
            this.fillYear(y);
        }
    }

    fillYear (startingYear) {
        this.addCanonCharacters(startingYear);

        // Util.logDebug(`people.length is ${this.people.length}`)

        for (let h = 0; h < 4; h++) {
            this.fillHouseYear(HogwartsWorldState.HOUSES()[h], startingYear);
        }
    }

    addCanonCharacters (startingYear) {
        const byHouse = Potterverse.canon.characters.uk[startingYear];

        if (! byHouse) {
            return;
        }

        for (let house in byHouse) {
            for (let gender in byHouse[house]) {
                
                for (let name of byHouse[house][gender]) {
                    // Later expect something other than strings here
                    const p = new WizardingPerson(startingYear, gender, house, name);
                    p.fillBlanks();

                    // Util.logDebug(`addCanonCharacters(), name is ${name}, p.name is ${p.name}`)

                    this.people.push(p);
                }
            }
        }
    }

    fillHouseYear (house, startingYear) {
        const existing = this.peopleWith({
            house: house,
            startingYear: startingYear
        });

        const spots = Math.max(10 - existing.length, 0);

        // Util.logDebug(`Hogwarts WS fillHouseYear(${house}, ${startingYear}), spots is ${spots}`)

        for (let i = 0; i < spots; i++) {
            const student = new WizardingPerson(startingYear, undefined, house);
            student.fillBlanks();

            this.people.push(student);
        }
    }

    peopleWith (criteria, source) {
        source = source || this.people;

        return source.filter(
            p => {
                const wrong = (criteria.house && criteria.house !== p.house) ||
                    (criteria.startingYear && criteria.startingYear !== p.startingYear) ||
                    (criteria.gender && criteria.gender !== p.gender);

                // Util.logDebug(`Hogwarts WS .peopleWith(), criteria is ${Util.stringify(criteria)}, \np is ${Util.stringify(p)}, \nwrong is ${wrong}`);

                return ! wrong;
            }
        );
    }

    printGrid () {
        const grid = [];

        // Alternate alg could be:
        // Maintain grid of arrays
        // Iterate over this.people
        // push() each into appropriate array
        // when done, optionally gender sort each array
          // or just iterate over all girls before over all boys
        // join(\n) arrays

        // rows are years, cols are houses
        for (let y = 0; y < 7; y++) {
            grid.push([]);

            for (let h = 0; h < 4; h++) {
                const house = HogwartsWorldState.HOUSES()[h];

                // later could functionize:
                let houseColor;
                switch(house) {
                    case 'ravenclaw':
                        houseColor = 'blue'; break;
                    case 'gryffindor':
                        houseColor = 'red'; break;
                    case 'slytherin':
                        houseColor = 'green'; break;
                    default:
                        houseColor = 'yellow';
                }

                const girls = this.peopleWith({
                    gender: 'female',
                    house: house,
                    startingYear: this.year - y
                });

                const boys = this.peopleWith({
                    gender: 'male',
                    house: house,
                    startingYear: this.year - y
                });

                const all = girls.concat(boys);

                // debug
                // if (house === 'gryffindor' && this.year - y === 1991) {
                //     const names = all.map(p => p.name);

                //     // Util.logDebug(`hogwarts WS, names is ${Util.stringify(names)}, \nthis.people.length is ${this.people.length}`);
                // }

                const multiline = all.map(
                    p => p.name
                )
                .join('\n');

                grid[y].push(
                    // Util.customColored(multiline, 'black', houseColor)
                    multiline
                );
            }
        }

        // Util.logDebug(`hogwarts WS, grid is ${Util.stringify(grid)}`);
        const yearsAmongStudents = Util.unique(
            this.people.map(p => p.startingYear)
        );

        // Later could make a textGrid() with non-uniform rectangles, like a spreadsheet
        const text = Util.textGrid(grid, undefined, 86);
        console.log(text);
    }

    static HOUSES () {
        return [
            'ravenclaw',
            'slytherin',
            'gryffindor',
            'hufflepuff'
        ];
    }

    static test () {
        const ws = new HogwartsWorldState();
        ws.printGrid();
    }

}

module.exports = HogwartsWorldState;

HogwartsWorldState.test();
