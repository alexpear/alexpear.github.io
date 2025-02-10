/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    // Operate on the top-left quarter, and, if n is odd, the top-middle line up from the center.
    for (let x = 0; x < Math.ceil(matrix[0].length / 2); x++) {
        for (let y = 0; y < Math.floor(matrix.length / 2); y++) {
            swap4 (x, y);
        }
    }

    // Swap the 4 numbers that are in related locations.
    // in a 4x4: 0 1 - 2 0 - 3 2 - 1 3
    // in a 7x7: 2 1 - 5 2 - 4 5 - 1 4
    function swap4 (x, y) {
        console.log(`\n  swap4(${x}, ${y})`);

        let temp = matrix[x][y];

        console.log(`copying ${matrix[y][matrix.length - x - 1]}`);
        matrix[x][y] = matrix[y][matrix.length - x - 1];

                    console.log(`copying ${matrix[matrix.length - x - 1][matrix.length - y - 1]}`);
        matrix[y][matrix.length - x - 1] = matrix[matrix.length - x - 1][matrix.length - y - 1];

                console.log(`copying ${matrix[matrix.length - y - 1][x]}`);
        matrix[matrix.length - x - 1][matrix.length - y - 1] = matrix[matrix.length - y - 1][x];

                    console.log(`copying ${temp}`);
        matrix[matrix.length - y - 1][x] = temp;
    }
};


const TESTS = [
    {
        inputs: [
            [[1,2,3],[4,5,6],[7,8,9]]
        ],
        output: [[7,4,1],[8,5,2],[9,6,3]],
    },

    {
        inputs: [
            [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
        ],
        output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]],
    },
];

function runTests () {
    let failures = 0;

    for (let test of TESTS) {
        console.log();
        console.log(test.inputs[0].join(' '));

        const myOutput = rotate(test.inputs[0]);

        let passed = test.inputs[0] === test.output;

        if (! passed) { failures++; }

        const shouldBe = passed ?
            `` :
            ` but it should be ${test.output}`;

        console.log(`(${passed ? 'PASS' : 'FAIL'}) My output was: ${JSON.stringify(test.inputs[0].join(' '), undefined, '    ')}${shouldBe}`);
    }

    console.log(`\n${failures} tests failed.`);
}

runTests();

