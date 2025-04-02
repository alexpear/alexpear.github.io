// jest

const Util = require('./util.js');

test('sum([])', () => {
    expect(Util.sum([])).toBe(0);
});
