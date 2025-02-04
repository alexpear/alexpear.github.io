
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    let mini = nums[0] < target ?
        -1 * nums.length :
        -1 * nums.length + 1;

    let maxi = nums.length;
    // let mink = 0;
    // let maxk = nums.length - 1;
    let spotlight = 0; //Math.floor(nums.length / 2);
    let prevSpotlight;
    let prevValue;

    // Or can we do 2 passes in log n? Find pivot, find target?
    // Maybe we dont need to find the pivot, & can do spotlight % nums.length to handle wrap.

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
        else if (prevSpotlight < spotlight && currentValue < prevValue) {
            // We went right but values decreased. We passed the pivot.
            maxi = spotlight;
        }
        else if (spotlight < prevSpotlight && prevValue < currentValue) {
            // We went left but values increased. We passed the pivot.
            mini = spotlight;
        }
        else if (currentValue < target) {
            // Obstacle: If you overshoot right & pass the pivot, when should you go left, & when right?
            // Also will be risk of repeat visits, unless we do a tabu list.
            // Maybe should avoid shifting spotlight outside the range [-length, 2 * length]

            // mini & maxi are on the spotlight number line
            // Keep bringing them closer together
            // Always go to the midpoint between them
            // When adjacent, return -1
            // If you pass the pivot, detect that somehow
            // Then try to express mini & maxi such that mini < maxi

            // Or, rather, detect maxi < mini & then increment maxi += nums.length to fix it.
            // Can that extend our runtime infinitely? TODO


            // if prevSpotlight was left or right of spotlight, whichever is weirder, then set one of the mink maxk fields.
            // if (spotlight < prevSpotlight) {
            //     // TODO is this enough info, or does it conflate overshooting up a slope with crossing the pivot?

            // }
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
            spotlight,
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
];

function runTests () {
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

        const shouldBe = passed ?
            `` :
            ` but it should be ${test.output}`;

        console.log(`(${passed ? 'PASS' : 'FAIL'}) My output was: ${JSON.stringify(myOutput, undefined, '    ')}${shouldBe}`);
    }
}

runTests();

