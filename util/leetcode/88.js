
var merge = function(nums1, m, nums2, n) {
    let i = m - 1;
    let j = n - 1;

    for (let dest = nums1.length - 1; dest >= 0; dest--) {
        let next1 = nums1[i];
        let next2 = nums2[j];

        if (! (i >= 0)) {
            next1 = Number.NEGATIVE_INFINITY;
        }
        if (! (j >= 0)) {
            next2 = Number.NEGATIVE_INFINITY;
        }

        console.log(JSON.stringify({
            nums1,
            m,
            nums2,
            n,
            i,
            j,
            dest,
            next1,
            next2,
            iScrewy: ! (i >= 0),
        }));

        if (next1 < next2) {
            nums1[dest] = nums2[j];
            j--;
        }
        else {
            nums1[dest] = nums1[i];
            i--;
        }
    }

    return nums1; // For testing
};

const TESTS = [
    {
        input: {
            nums1: [0],
            m: 0,
            nums2: [1],
            n: 1
        },
        output: [1],
    },
];

function runTests () {
    for (let test of TESTS) {
        const myOutput = merge(
            test.input.nums1,
            test.input.m,
            test.input.nums2,
            test.input.n,
        );

        let passed = myOutput.length === test.output.length;
        for (let i = 0; i < test.output.length; i++) {
            if (myOutput[i] !== test.output[i]) {
                passed = false;
                break;
            }
        }

        console.log(`(${passed ? 'PASS' : 'FAIL'}) My output was: ` + JSON.stringify(myOutput, undefined, '    '));
    }
}

runTests();

