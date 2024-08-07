'use strict';

// leetcode 1105

// Optimize the 2-row interval consisting of the cur row & the next
// Then lock in the cur row
// Then go down 1 row

var minHeightShelves = function(books, shelfWidth) {

    const shelve = currentBooks => {
        let topShelfHeight = currentBooks[0][1];
        let bestTopShelfHeight = currentBooks[0][1];
        let minHeightOfTop2Shelves = 99999999999999999999999;
        let nextShelfIndex = 1;

        for (let i = 0; i < currentBooks.length; i++) {
            const iHeight = currentBooks[i][1];

            if (currentBooks[i][1] > topShelfHeight) {
                topShelfHeight = iHeight;
            }

            let shelf2Width = 0;
            let shelf2Height = 0;

            for (let n = i + 1; n < currentBooks.length; n++) {
                const nWidth = currentBooks[n][0];
                const nHeight = currentBooks[n][1];

                console.log(JSON.stringify(
                    {
                        context: `shelve(), top of n-for() loop.`,
                        currentBooksLength: currentBooks.length,
                        nextShelfIndex,
                        i,
                        n,
                        nWidth,
                        nHeight,
                        iBook: currentBooks[i],
                        shelf2Height,
                        bestTopShelfHeight,
                        topShelfHeight,
                        minHeightOfTop2Shelves,
                    },
                    undefined,
                    '    '
                ));

                if (shelf2Width + nWidth <= shelfWidth) {
                    if (shelf2Height < nHeight) {
                        shelf2Height = nHeight;
                    }

                    shelf2Width += nWidth;
                }
                else {
                    break;
                }
            }

            // Now we know shelf2Height.
            const totalHeight = topShelfHeight + shelf2Height;

            if (totalHeight < minHeightOfTop2Shelves) {

                console.log(JSON.stringify(
                    {
                        context: `shelve(), found a new best option, about to update vars.`,
                        currentBooksLength: currentBooks.length,
                        nextShelfIndex,
                        i,
                        iBook: currentBooks[i],
                        shelf2Height,
                        bestTopShelfHeight,
                        topShelfHeight,
                        minHeightOfTop2Shelves,
                        totalHeight,
                    },
                    undefined,
                    '    '
                ));

                minHeightOfTop2Shelves = totalHeight;
                bestTopShelfHeight = topShelfHeight;
                nextShelfIndex = i + 1;
            }
        }

        console.log(JSON.stringify(
            {
                context: `end of shelve()`,
                bestTopShelfHeight,
                nextShelfIndex,
                topShelfHeight,
                minHeightOfTop2Shelves,
                currentBooksLength: currentBooks.length,
            },
            undefined,
            '    '
        ));

        return {
            bestTopShelfHeight,
            nextShelfIndex,
        }
    };


    if (books.length === 1) {
        return books[0][1];
    }

    let heightOfShelvesAbove = 0;
    let i = 0;

    while (i < books.length) {
        // horizon is the index of the furthest book in books that we need to think about right now.
        let horizon;
        let widthConsidered = 0;

        for (let h = i; h < books.length; h++) {
            widthConsidered += books[h][0];

            if (widthConsidered >= shelfWidth * 2) {
                horizon = h;
                break;
            }
        }

        horizon = horizon || books.length - 1;

        // Optimize the interval [i, horizon]
        const info = shelve(books.slice(i, horizon + 1));

        heightOfShelvesAbove += info.bestTopShelfHeight;

        i += info.nextShelfIndex;
    }

    return heightOfShelvesAbove;
};


/*
Notes
[90,170], -> width 90
[81,127], -> w 171
[57,151], -> doesnt fit, new line
[167,127],
[95,89]

*/



const TESTS = [
    {
        input: {
            books: [[1,1],[2,3],[2,3],[1,1],[1,1],[1,1],[1,2]],
            shelfWidth: 4,
        },
        output: 6,
    },
    // {
    //     input: {
    //         books: [[11,83],[170,4],[93,80],[155,163],[134,118],[75,14],[122,192],[123,154],[187,29],[160,64],[170,152],[113,179],[60,102],[28,187],[59,95],[187,97],[49,193],[67,126],[75,45],[130,160],[4,102],[116,171],[43,170],[96,188],[54,15],[167,183],[58,158],[59,55],[148,183],[89,95],[90,113],[51,49],[91,28],[172,103],[173,3],[131,78],[11,199],[77,200],[58,65],[77,30],[157,58],[18,194],[101,148],[22,197],[76,181],[21,176],[50,45],[80,174],[116,198],[138,9],[58,125],[163,102],[133,175],[21,39],[141,156],[34,185],[14,113],[11,34],[35,184],[16,132],[78,147],[85,170],[32,149],[46,94],[196,3],[155,90],[9,114],[117,119],[17,157],[94,178],[53,55],[103,142],[70,121],[9,141],[16,170],[92,137],[157,30],[94,82],[144,149],[128,160],[8,147],[153,198],[12,22],[140,68],[64,172],[86,63],[66,158],[23,15],[120,99],[27,165],[79,174],[46,19],[60,98],[160,172],[128,184],[63,172],[135,54],[40,4],[102,171],[29,125],[81,9],[111,197],[16,90],[22,150],[168,126],[187,61],[47,190],[54,110],[106,102],[55,47],[117,134],[33,107],[2,10],[18,62],[109,188],[113,37],[59,159],[120,175],[17,147],[112,195],[177,53],[148,173],[29,105],[196,32],[123,51],[29,19],[161,178],[148,2],[70,124],[126,9],[105,87],[41,121],[147,10],[78,167],[91,197],[22,98],[73,33],[148,194],[166,64],[33,138],[139,158],[160,19],[140,27],[103,109],[88,16],[99,181],[2,140],[50,188],[200,77],[73,84],[159,130],[115,199],[152,79],[1,172],[124,136],[117,138],[158,86],[193,150],[56,57],[150,133],[52,186],[21,145],[127,97],[108,110],[174,44],[199,169],[139,200],[66,48],[52,190],[27,86],[142,191],[191,79],[126,114],[125,100],[176,95],[104,79],[146,189],[144,78],[52,106],[74,74],[163,128],[34,181],[20,178],[15,107],[105,8],[66,142],[39,126],[95,59],[164,69],[138,18],[110,145],[128,200],[149,150],[149,93],[145,140],[90,170],[81,127],[57,151],[167,127],[95,89]],
    //         shelfWidth: 200,
    //     },
    // },
];

function runTests () {
    for (let test of TESTS) {
        const myOutput = minHeightShelves(test.input.books, test.input.shelfWidth);

        console.log(`My output was: ` + JSON.stringify(myOutput, undefined, '    '));
    }
}

runTests();

