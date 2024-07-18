'use strict';

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

const countPairs = function(root, distance) {
    let pairCount = 0;
    const doneIndices = {};

    const isLeaf = i => {
        return ! exists(left(i)) &&
            ! exists(right(i));
    };

    const exists = i => {
        return i !== null &&
            i !== undefined;
            // ! Number.isNaN(i);
    };

    const left = i => {
        const li = 2 * i + 1;

        if (li >= root.length) {
            return;
        }

        return li;
    };

    const right = i => {
        const ri = 2 * i + 2;

        if (ri >= root.length) {
            return;
        }

        return ri;
    };

    const parent = i => {
        const pi = Math.floor( (i - 1) / 2 );

        if (pi < 0) {
            return;
        }

        return pi;
    };

    const walkFrom = i => {
        doneIndices[i] = true;

        walkHelper(i, distance);
    };

    const walkHelper = (i, hopsLeft, prev) => {
        console.log(`Top of walkHelper(${i}, ${hopsLeft}, ${prev}).`);
        if (exists(i)) { console.log(`Parent: ${parent(i)}, Self: ${i}, Left: ${left(i) || ''}, Right: ${right(i) || ''}`); }


        if (! exists(i) || ! exists(root[i]) || i === prev || hopsLeft < 0) {
            return;
        }

        if (isLeaf(i) && exists(prev) && ! doneIndices[i]) {
            console.log(`pairCount++`);
            pairCount++;
        }

        walkHelper(left(i), hopsLeft - 1, i);
        walkHelper(right(i), hopsLeft - 1, i);
        walkHelper(parent(i), hopsLeft - 1, i);
    };

    for (let i = root.length - 1; i >= 1; i--) {
        if (! exists(root[i]) || ! isLeaf(i)) {
            continue;
        }

        walkFrom(i);
    }

    return pairCount;
};

const TESTS = [
    {
        input: {
            root: [1,2,3,null,4],
            // indices:
            //   0
            // 1   2
            //  4
            distance: 3,
        },
        output: 1,
    },

    {
        input: {
            root: [2, 2, 2, 2, 2, 2, 2],
            distance: 3,
        },
        output: 2,
    },
];

function runTests () {
    for (let test of TESTS) {
        const myOutput = countPairs(test.input.root, test.input.distance);

        console.log(`My output was: ` + JSON.stringify(myOutput, undefined, '    '));
    }
}

runTests();

