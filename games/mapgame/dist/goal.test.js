"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const goal_1 = require("./goal");
const DAY_MS = 1000 * 60 * 60 * 24;
// Pin time to just after midnight so visit() → lastVisited=midnight → ~0 days elapsed.
const MIDNIGHT = new Date('2026-03-11T00:00:01');

beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MIDNIGHT);
});

afterEach(() => {
    jest.useRealTimers();
});

function daysAgo(n) {
    return new Date(Date.now() - n * DAY_MS);
}

describe('Goal', () => {
    describe('never visited', () => {
        test('has 1000 points (max) when constructed with no date', () => {
            const goal = new goal_1.Goal();
            expect(goal.pointsAvailable()).toBe(1000);
        });
        test('text() returns "1000"', () => {
            const goal = new goal_1.Goal();
            expect(goal.text()).toBe('1000');
        });
    });
    describe('visited today', () => {
        test('has 0 points immediately after visit()', () => {
            const goal = new goal_1.Goal();
            goal.visit();
            expect(goal.pointsAvailable()).toBe(0);
        });
        test('text() returns empty string when 0 points', () => {
            const goal = new goal_1.Goal();
            goal.visit();
            expect(goal.text()).toBe('');
        });
    });
    describe('points accumulate over days', () => {
        test('1 point after 1 day', () => {
            const goal = new goal_1.Goal(daysAgo(1));
            expect(goal.pointsAvailable()).toBe(1);
        });
        test('5 points after 5 days', () => {
            const goal = new goal_1.Goal(daysAgo(5));
            expect(goal.pointsAvailable()).toBe(5);
        });
        test('capped at 1000 after 1000+ days', () => {
            const goal = new goal_1.Goal(daysAgo(1500));
            expect(goal.pointsAvailable()).toBe(1000);
        });
        test('capped at 1000 for never-visited (epoch) goal', () => {
            const goal = new goal_1.Goal(new Date(0));
            expect(goal.pointsAvailable()).toBe(1000);
        });
    });
    describe('visit()', () => {
        test('resets points to 0', () => {
            const goal = new goal_1.Goal(daysAgo(10));
            expect(goal.pointsAvailable()).toBe(10);
            goal.visit();
            expect(goal.pointsAvailable()).toBe(0);
        });
        test('sets lastVisited to midnight', () => {
            const goal = new goal_1.Goal();
            goal.visit();
            expect(goal.lastVisited.getHours()).toBe(0);
            expect(goal.lastVisited.getMinutes()).toBe(0);
            expect(goal.lastVisited.getSeconds()).toBe(0);
        });
        test('visiting twice same day still gives 0 points', () => {
            const goal = new goal_1.Goal();
            goal.visit();
            goal.visit();
            expect(goal.pointsAvailable()).toBe(0);
        });
    });
});
