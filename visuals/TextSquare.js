'use strict';

//

class TextSquare {
    constructor (size) {
        if (size < 0.5) {
            this.grid = [['*']];
        }
        else if (size < 1) {
            this.grid = [['o']];
        }
        else if (size < 1.5) {
            this.grid = [['O']];
        }
        else {
            // Note: chars are approximately twice as tall as they are wide.
            const horizontalCharCount = 2 * size - 1;

            // Top row
            const topRow = [TextSquare.NW_CORNER].concat(
                TextSquare.arrayOfChar(TextSquare.HORIZONTAL, horizontalCharCount - 2)
            );

            topRow.push(TextSquare.NE_CORNER);

            this.grid = [topRow];

            // Middle rows
            // Later, compute this more efficiently.
            for (let i = 0; i < size - 2; i++) {
                const row = [TextSquare.VERTICAL].concat(
                    TextSquare.arrayOfChar(' ', horizontalCharCount - 2)
                );

                row.push(TextSquare.VERTICAL);
                this.grid.push(row);
            }

            // Bottom row
            const bottomRow = [TextSquare.SW_CORNER].concat(
                TextSquare.arrayOfChar(TextSquare.HORIZONTAL, horizontalCharCount - 2)
            );

            bottomRow.push(TextSquare.SE_CORNER);
            this.grid.push(bottomRow);
        }
    }

    toString () {
        return this.grid.map(
            row => row.join('')
        )
        .join('\n');
    }

    static arrayOfChar (char, count) {
        const row = [];
        for (let i = 0; i < count; i++) {
            row.push(char);
        }

        return row;
    }

    static test (size) {
        size = size || 4;
        const textSquare = new TextSquare(size);
        const output = `TextSquare.test(${ size }): \n${ textSquare.toString() }\n`;

        console.log(output);
        return output;
    }
}

TextSquare.GENERIC_CORNER = '+';
TextSquare.NW_CORNER  = TextSquare.GENERIC_CORNER || '╭';
TextSquare.NE_CORNER  = TextSquare.GENERIC_CORNER || '╮';
TextSquare.SE_CORNER  = TextSquare.GENERIC_CORNER || '╯';
TextSquare.SW_CORNER  = TextSquare.GENERIC_CORNER || '╰';
TextSquare.VERTICAL   = '│';
TextSquare.HORIZONTAL = '─';


// Run
TextSquare.test(1);
TextSquare.test(2);
TextSquare.test(3);
TextSquare.test(4);


/*
Examples:

3x3:
╭───╮
│   │
╰───╯
*/
