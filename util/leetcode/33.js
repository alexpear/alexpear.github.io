
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    if (nums.length <= 1) {
        return nums[0] === target ?
            0 :
            -1;
    }

    let mini;
    if (nums[0] < target) {
        mini = -1 * nums.length;
    }
    else if (nums[1] === target) {
        // We have to check if nums[1] is target so that the while loop can exit confidently later.
        return 1;
    }
    else {
        // Corresponds to nums[1].
        mini = -1 * nums.length + 1;
    }

    let maxi = nums.length;
    let spotlight = 0; //Math.floor(nums.length / 2);
    let prevSpotlight;
    let prevValue;

    while ( (maxi - mini) >= 2 ) {

        let normalized = spotlight;
        while (normalized < 0) {
            normalized += nums.length;
        }
        normalized = normalized % nums.length;

        const currentValue = nums[normalized];

        if (currentValue === target) {
            return normalized;
        }
        // TODO replace these 2 ifs. Instead, detect if you're in a Bad Interval. Defined as, if you would gradient descent in it, you would move towards either mini or maxi, & you know the value there is not good enough. So instead you have to jump towards the other one (mini or maxi) to get out of the Bad Interval.
        // If not in a bad interval, do normal gradient descent.
        else if (prevSpotlight < spotlight && currentValue < prevValue) {
            // We went right but values decreased. We passed the pivot.
            maxi = spotlight;
        }
        else if (spotlight < prevSpotlight && prevValue < currentValue) {
            // We went left but values increased. We passed the pivot.
            mini = spotlight;
        }
        else if (currentValue < target) {
            mini = spotlight;
        }
        else {
            maxi = spotlight;
        }

        if (maxi < mini) {
            // Expressed in terms of spotlight's number line, before the % operator.
            maxi += nums.length;

            // TODO might be able to handle this pivot overshooting case better. Worried about infinite runtime.
        }

        console.log(JSON.stringify({
            mini,
            maxi,
            prevSpotlight,
            spotlight,
            prevValue,
            currentValue,
            normalized,
            // modulo: normalized % nums.length,
        }, undefined, '    '));

        prevValue = currentValue;
        prevSpotlight = spotlight;
        spotlight = Math.floor( (mini + maxi) / 2 );
    }

    return -1;
};


const TESTS = [
    {
        inputs: [
            [4,5,6,7,0,1,2],
            0,
        ],
        output: 4,
    },

    {
        inputs: [
            [4,5,6,7,0,1,2],
            3,
        ],
        output: -1,
    },

    {
        inputs: [
            [1],
            0,
        ],
        output: -1,
    },

    {
        inputs: [
            [1],
            1,
        ],
        output: 0,
    },

    {
        inputs: [
            [3, 1],
            1,
        ],
        output: 1,
    },

    {
        inputs: [
            [3,4,5,6,1,2],
            2,
        ],
        output: 5,
    },
];

function runTests () {
    let failures = 0;

    for (let test of TESTS) {
        console.log();
        console.log(test.inputs[0].join(' '));

        const myOutput = search.apply(undefined, test.inputs);

        let passed = myOutput === test.output;

        // for (let i = 0; i < test.output.length; i++) {
        //     if (myOutput[i] !== test.output[i]) {
        //         passed = false;
        //         break;
        //     }
        // }

        if (! passed) { failures++; }

        const shouldBe = passed ?
            `` :
            ` but it should be ${test.output}`;

        console.log(`(${passed ? 'PASS' : 'FAIL'}) My output was: ${JSON.stringify(myOutput, undefined, '    ')}${shouldBe}`);
    }

    console.log(`\n${failures} tests failed.`);
}

runTests();

