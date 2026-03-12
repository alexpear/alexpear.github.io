import { Goal } from '../src/goal';

const DAY_MS = 1000 * 60 * 60 * 24;

// Pin time to just after midnight so visit() → lastVisited=midnight → ~0 days elapsed.
const MIDNIGHT = new Date('2000-01-01T00:00:01');

beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MIDNIGHT);
});

afterEach(() => {
    jest.useRealTimers();
});

function goalDaysAgo(n: number): Goal {
    const goal = new Goal();
    goal.lastVisited = new Date(goal.today().getTime() - n * DAY_MS);
    return goal;
}

describe('Goal', () => {
    describe('never visited', () => {
        test('has 1000 points (max) when constructed with no date', () => {
            const goal = new Goal();
            expect(goal.pointsAvailable()).toBe(1000);
        });

        test('text() returns "1000"', () => {
            const goal = new Goal();
            expect(goal.text()).toBe('1000');
        });
    });

    describe('visited today', () => {
        test('has 0 points immediately after visit()', () => {
            const goal = new Goal();
            goal.visit();
            expect(goal.pointsAvailable()).toBe(0);
        });

        test('text() returns empty string when 0 points', () => {
            const goal = new Goal();
            goal.visit();
            expect(goal.text()).toBe('');
        });

        test('has 0 points if we visit after midnight then check at 2300 that day', () => {
            const goal = new Goal();
            goal.visit();

            jest.setSystemTime(
                new Date(MIDNIGHT.getTime() + 23 * 60 * 60 * 1000),
            );

            expect(goal.pointsAvailable()).toBe(0);
        });
    });

    describe('points accumulate over days', () => {
        test('1 point after 1 day', () => {
            const goal = goalDaysAgo(1);
            expect(goal.pointsAvailable()).toBe(1);
            expect(goal.text()).toBe('1');
        });

        test('1 point if we visit before midnight then check right after', () => {
            jest.setSystemTime(
                new Date(MIDNIGHT.getTime() + 23 * 60 * 60 * 1000),
            );

            const goal = new Goal();
            goal.visit();

            jest.setSystemTime(
                new Date(MIDNIGHT.getTime() + 25 * 60 * 60 * 1000),
            ); // 0100 the next day

            expect(goal.pointsAvailable()).toBe(1);
        });

        test('1 point if we visit at in morning then check in the afternoon of the next day', () => {
            jest.setSystemTime(
                new Date(MIDNIGHT.getTime() + 11 * 60 * 60 * 1000),
            );

            const goal = new Goal();
            goal.visit();

            jest.setSystemTime(
                // 1600 the next day
                new Date(MIDNIGHT.getTime() + (24 + 16) * 60 * 60 * 1000),
            );

            expect(goal.pointsAvailable()).toBe(1);
        });

        test('5 points after 5 days', () => {
            const goal = goalDaysAgo(5);
            expect(goal.pointsAvailable()).toBe(5);
        });

        test('capped at 1000 after 1000+ days', () => {
            const goal = goalDaysAgo(1500);
            expect(goal.pointsAvailable()).toBe(1000);
        });

        test('capped at 1000 for never-visited (epoch) goal', () => {
            const goal = new Goal(new Date(0));
            expect(goal.pointsAvailable()).toBe(1000);
        });
    });

    describe('visit()', () => {
        test('resets points to 0', () => {
            const goal = goalDaysAgo(10);
            expect(goal.pointsAvailable()).toBe(10);
            goal.visit();
            expect(goal.pointsAvailable()).toBe(0);
        });

        test('sets lastVisited to midnight', () => {
            const goal = new Goal();
            goal.visit();
            expect(goal.lastVisited.getHours()).toBe(0);
            expect(goal.lastVisited.getMinutes()).toBe(0);
            expect(goal.lastVisited.getSeconds()).toBe(0);
        });

        test('visiting twice same day still gives 0 points', () => {
            const goal = new Goal();
            goal.visit();
            goal.visit();
            expect(goal.pointsAvailable()).toBe(0);
        });
    });
});
