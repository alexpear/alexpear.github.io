// jest

const Anniversary = require('./anniversary.js');

test('dayNumber()', () => {
    for (let i = 0; i < 366; i++) {
        const ann = new Anniversary(
            // Test is a leap year because dayOfYear() is numbered in terms of leap years.
            new Date(2040, 0, 1 + i)
        );

        expect(ann.dayOfYear()).toBe(i);
    }
});
