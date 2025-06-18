// jest

import SquareNode from './capePopulation.mjs';

// Scope of worldpop pixel grid
SquareNode.EARTH_HEIGHT = 18_720;
SquareNode.EARTH_WIDTH = 43_200;

test('latLon()', () => {
    const node = new SquareNode();

    const tests = [
        // { y: 0, x: 0, expected: [90, -180] },
        // { y: 0, x: 0, expected: [60, -120] },
        { y: SquareNode.EARTH_HEIGHT, x: SquareNode.EARTH_WIDTH, expected: [-90, 180] },
    ];

    let y = 0;
    let x = 0; 
    let lat = 90;

    for (let lon = -180; lon < 180; lon += 30) {
        tests.push({ x, y, expected: [lat, lon] });

        x += SquareNode.EARTH_WIDTH / 12;
        y += SquareNode.EARTH_HEIGHT / 6;
        lat -= 30;

        if (lat < -90) {
            lat = 90;
            y = 0;
        }
    }

    // console.log(JSON.stringify(tests, undefined, '    '));

    tests.forEach(test => {
        node.leftX = test.x;
        node.topY = test.y;
        const output = node.latLon();

        // TODO bug -0 does not match 0
        
        expect(output.lat).toBeCloseTo(
            test.expected[0],
            1, // decimal places of divergence permitted.
        );
        expect(output.lon).toBeCloseTo(
            test.expected[1],
            1,
        );
    });
});
