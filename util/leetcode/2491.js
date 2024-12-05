
var dividePlayers = function(skill) {
    const teamCount = skill.length / 2;

    const sorted = skill.sort(
        (a, b) => Number(a) - Number(b)
    );

    let sumOfEachTeam = sorted[0] + sorted[sorted.length - 1];
    let chemistriesProduct = sorted[0] * sorted[sorted.length - 1];

    for (let i = 1; i < teamCount; i++) {
        const badPlayer = sorted[i];
        const goodPlayer = sorted[ sorted.length - i - 1 ];

        if (badPlayer + goodPlayer !== sumOfEachTeam) {
            console.log(JSON.stringify({
                badPlayer,
                goodPlayer,
                i,
                sumOfEachTeam,
                chemistriesProduct,
                teamCount,
                sorted: sorted.join(', '),
            },
            undefined,'    '));

            return -1;
        }

        console.log(JSON.stringify({
            badPlayer,
            goodPlayer,
            i,
            sumOfEachTeam,
            chemistriesProduct,
            teamCount,
            sorted: sorted.join(', '),
        },
        undefined,'    '));

        chemistriesProduct += badPlayer * goodPlayer;
    }

    return chemistriesProduct;
};

const TESTS = [
    {
        input: {
            array: [13,1,14,3,2,15]
        },
        output: 82,
    },
];

function runTests () {
    for (let test of TESTS) {
        const myOutput = dividePlayers(test.input.array);

        console.log(`My output was: ` + JSON.stringify(myOutput, undefined, '    '));
    }
}

runTests();

