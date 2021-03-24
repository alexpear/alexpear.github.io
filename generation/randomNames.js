'use strict';

const Util = require('../util/util.js');

const fs = require('fs');

// This logic came from the old birddecisions site, and could be tidied up later.
class RandomNames {
    static name (words = 1) {
        return RandomNames.genText(words);
    }

    // tableString excludes * but includes name
    static loadTable(tableString) {
        const results = [];
        const lines = tableString.split('\n');

        let tableName = lines[0].trim();

        // TODO somewhat clumsy checking if it's * output instead of just output for root table
        if (tableName.slice(0, 2) == '* ') {
            // cut off the '*' and trim.
            tableName = tableName.slice(1).trim();
        }

        // iterate over other lines, starting at 1.
        for (let i = 1; i < lines.length; i++) {
            const spaces = /\s+/;
            const words = lines[i].split(spaces);

            if (words.length < 2) {
                continue;  // Skip blank or invalid lines
            }

            // ie the tail/rest of 'words', in string form, omitting trailing spaces.
            const resultText = words.slice(1)
                .join(' ')
                .trim();

            // anonymous class Result
            const result = {
                text: resultText,  
                lineNumber: i,
                table: tableName  // for learning later.
            };

            // Add result to 'results' weight times (memory-inelegant)
            const weight = words[0];

            for (let w = 0; w < weight; w++) {
                results.push(result);
            }
        }

        // anonymous class Table
        return {
            results: results,
            name: tableName
        };
    }

    static tableResult(results) {
        const resultIndex = Math.floor(
            Math.random() * results.length
        );
        
        return results[resultIndex].text;
    }

    static fillBlanks(origString, tables) {
        // TODO: gender/choice [] brackets
        // iLeft is the index of first left bracket
        for (let iLeft = 0; iLeft < origString.length; iLeft++) {
            if (origString[iLeft] == '{') {
                // Now find corresponding '}'
                for (let iRight = iLeft+1; iRight < origString.length; iRight++) {
                    if (origString[iRight] == '{') {
                        throw new Error('syntax error: im confused by this { that i found inside a {...} pair.');
                    }

                    if (origString[iRight] == '}') {
                        const subtableName = origString.slice(
                            iLeft+1, // inclusive
                            iRight // exclusive
                        );

                        let subtableText = RandomNames.tableResult(tables[subtableName]);

                        // recursively fill out the {} blanks in the new substring.
                        // possibly clumsy
                        subtableText = RandomNames.fillBlanks(subtableText, tables);

                        return ( 
                            origString.slice(0, iLeft) +
                            subtableText +
                            origString.slice(iRight+1, origString.length)
                        );
                    }
                }
            }
        }

        return origString;  // if no {...} pair found, just return it unchanged
    }

    static genText (words) {
        // TODO functionize the first part of this into a static init() func, for performance.
        const fullText = RandomNames.nameCodex();

        // Load into table objects.
        const tableStrings = fullText.split('\n*');

        // TODO: don't hardcode 'output' lower down
        const tables = [];
        for (let i=0; i < tableStrings.length; i++) {
            const table = RandomNames.loadTable(tableStrings[i]);
            tables[table.name] = table.results;
        }

        // Now roll a result in root table and recurse down.
        let outputStr = RandomNames.tableResult(tables['output']);

        // BTW: indexOf() is runtime-inefficient for long strings
        while (outputStr.indexOf('{') != -1) {
            outputStr = RandomNames.fillBlanks(outputStr, tables);
        }

        outputStr = outputStr.split(' ')
            .map(
                word => Util.capitalized(word)
            )
            .join(' ');

        return outputStr;
    }

    // This is for a minor fiction setting inspired by the Eightfold Hierarchy world. Everyone has names something like Suchaskori Rislochasko, constructed of conso/vowel pairs. 
    static syllabicHierarchy (syllables) {
        syllables = syllables || 4;

        const ALPHABET = [
            'bu',
            'do',
            'fel',
            'he',
            'ja',
            'ko',
            'lo',
            'mo',
            'ni',
            'per',
            'ri',
            'su',
            'ta',
            'vo',
            'we',
            'the',
            'shi',
            'dra',
            'sto',
            'ske',
            'slo',
            'kle',
            'flus',
            'cha'
        ];

        let output = '';
        for (let i = 0; i < syllables; i++) {
            output += Util.randomOf(ALPHABET);
        }

        return Util.capitalized(output);
    }

    static hierarchyPerson () {
        return `\nI am ${RandomNames.syllabicHierarchy(4)} ${RandomNames.syllabicHierarchy(4)}.`
    }

    static nameCodex () {
        return `
* output
4 {word}

* word
1 {v}{c}
1 {syllable}
4 {start}{end}
32 {start}{syllables}{end}

* vblock
4 {v}
1 {v}{vfriend}

* v
6 a
6 e
6 i
6 o
6 u
1 y

* vfriend
2 l
2 n
4 r
2 s

* c
6 b
2 c
2 ch
6 d
6 f
6 g
4 h
3 j
5 k
1 kh
6 l
6 m
6 n
6 p
2 ph
1 q
2 qu
6 r
6 s
3 sh
1 sch
5 t
3 th
5 v
4 w
3 x
1 y
1 z
1 {doublec}

* doublec
4 bb
3 cc
4 dd
4 ff
4 gg
2 jj
2 kk
4 ll
4 mm
4 nn
3 pp
1 qq
4 rr
4 ss
4 tt
1 vv
1 ww
1 xx
1 yy
3 zz

* start
4 {v}
4 {syllable}

* syllables
15 {syllable}
15 {syllable}{syllable}
1 {syllable}{syllable}{syllable}
0 {syllable}{syllable}{syllable}{syllable}

* syllable
1 {c}{vblock}

* end
4 {c}{endv}
4 {c}
4 {syllable}

* endv
11 ia
11 a
8 ium
7 ion
6 {v}n
6 {v}s`;
    }

    static dictionaryWord (maxChars) {
        if (! maxChars || maxChars <= 0) {
            maxChars = 999;
        }

        if (! RandomNames.DICTIONARY) {
            RandomNames.DICTIONARY = fs.readFileSync(
                '/usr/share/dict/words', 
                'utf8'
            )
            .split('\n');
        }

        let chosen = Util.randomOf(RandomNames.DICTIONARY);
        while (chosen.length > maxChars) {
            chosen = Util.randomOf(RandomNames.DICTIONARY);
        }

        return chosen;
    }

    static test () {
        Util.log('\n' + RandomNames.name());
        Util.log(RandomNames.hierarchyPerson())
    }
}

module.exports = RandomNames;

RandomNames.test();
