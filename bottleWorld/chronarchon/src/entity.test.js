// jest

const Entity = require('./entity.js');
const Group = require('./group.js');

test('coherency of level() & _impactRating()', () => {
    const entity = Group.example();

    for (let i = 0; i < 10; i++) {
        // Never overwrite template.level in real life!
        entity.template.level = i;

        const level = entity.level();
        const impactRating = entity._impactRating();

        console.log(`test i: ${i}, level: ${level}, impactRating: ${impactRating}`);

        expect(entity.level()).toBe(i);
    }
});
