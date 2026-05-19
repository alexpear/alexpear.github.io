import { Group } from '../src/group';
import { Idea } from '../src/idea';

function mockIdea(overrides: Partial<Idea> = {}): Idea {
    return Object.assign(
        new Idea(),
        { ideaType: 'item' as const, id: 'mock' },
        overrides,
    );
}

describe('Group slotIsOpen()', () => {
    test('returns false when base idea has no slots', () => {
        const g = new Group(mockIdea());
        expect(g.slotIsOpen('barrel')).toBe(false);
    });

    test('returns true when slot exists and nothing fills it', () => {
        const g = new Group(mockIdea({ slots: { barrel: 1 } }));
        expect(g.slotIsOpen('barrel')).toBe(true);
    });

    test('returns false when the one slot capacity is filled by a mod', () => {
        const base = mockIdea({ slots: { barrel: 1 } });
        const mod = mockIdea({ asmod: { slot: 'barrel' } });
        const g = new Group([base, mod]);
        expect(g.slotIsOpen('barrel')).toBe(false);
    });

    test('returns true when capacity-2 slot has only 1 mod attached', () => {
        const base = mockIdea({ slots: { chamber: 2 } });
        const mod = mockIdea({ asmod: { slot: 'chamber' } });
        const g = new Group([base, mod]);
        expect(g.slotIsOpen('chamber')).toBe(true);
    });

    test('returns false when capacity-2 slot has 2 mods attached', () => {
        const base = mockIdea({ slots: { chamber: 2 } });
        const mod1 = mockIdea({ asmod: { slot: 'chamber' } });
        const mod2 = mockIdea({ asmod: { slot: 'chamber' } });
        const g = new Group([base, mod1, mod2]);
        expect(g.slotIsOpen('chamber')).toBe(false);
    });

    test('a mod in a different slot does not close the queried slot', () => {
        const base = mockIdea({ slots: { barrel: 1, core: 1 } });
        const mod = mockIdea({ asmod: { slot: 'core' } });
        const g = new Group([base, mod]);
        expect(g.slotIsOpen('barrel')).toBe(true);
    });
});

describe('Group randomItem()', () => {
    test('returns a Group', () => {
        expect(Group.randomItem()).toBeInstanceOf(Group);
    });

    test('first idea is an item', () => {
        expect(Group.randomItem().ideas[0].isItem()).toBe(true);
    });

    test('quantity is 1', () => {
        expect(Group.randomItem().quantity).toBe(1);
    });

    test('every attached mod occupies a slot that the base item declares', () => {
        for (let i = 0; i < 30; i++) {
            const g = Group.randomItem();
            for (let j = 1; j < g.ideas.length; j++) {
                const slot = g.ideas[j].asmod?.slot;
                expect(slot).toBeDefined();
                expect(g.ideas[0].slots?.[slot!]).toBeGreaterThan(0);
            }
        }
    });
});
