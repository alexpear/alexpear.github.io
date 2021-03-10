'use strict';

const Util = require('../util/util.js');

// This logic came from the old birddecisions site, and could be tidied up later.
class RandomNames {
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

        return outputStr;
    }

    static nameCodex () {
        return `
* output
4 {word} {word}

* word
4 {V}{c}
2 {C}{v}
4 {start}{end}
6 {start}{syllables}{end}

* vblock
4 {v}
1 {v}{vfriend}

* Vblock
4 {V}
1 {V}{vfriend}

* v
4 a
4 e
4 i
4 o
4 u
2 y

* vfriend
2 l
2 n
4 r
2 s

* V
4 A
4 E
4 I
4 O
4 U
3 Y

* c
4 b
3 c
1 ch
4 d
4 f
4 g
3 h
3 j
3 k
1 kh
4 l
4 m
4 n
4 p
1 ph
1 q
3 qu
4 r
3 s
2 sh
1 sch
2 t
2 th
4 v
3 w
4 x
2 y
3 z
0 {doublec}

* C
4 B
3 C
1 Ch
4 D
4 F
4 G
3 H
4 J
3 K
1 Kh
4 L
4 M
4 N
4 P
2 Ph
1 Q
3 Qu
4 R
3 S
2 Sh
1 Sch
2 T
2 Th
4 V
3 W
4 X
2 Y
3 Z

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
4 {V}
4 {C}{v}

* syllables
5 {syllable}
5 {syllable}{syllable}
1 {syllable}{syllable}{syllable}
0 {syllable}{syllable}{syllable}{syllable}

* syllable
9 {c}{v}

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

    static name (words = 1) {
        return RandomNames.genText(words);
    }

    static test () {
        Util.log(RandomNames.name());
    }
}

module.exports = RandomNames;

// RandomNames.test();
