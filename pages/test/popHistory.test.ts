import { TownCensus } from '../src/townCensus';
import { PopHistory } from '../src/popHistory';

const LIST1 = [
    {
        population: 100,
        lat: 30,
        long: 30,
        year: -1000,
        confidence: 0.5,
    },
    {
        population: 200,
        lat: 30,
        long: 30,
        year: -1,
        confidence: 0.5,
    },
    {
        population: 240,
        lat: 30,
        long: 30,
        year: 1,
        confidence: 0.5,
    },
    {
        population: 300000,
        lat: 30,
        long: 30,
        year: 2025,
        confidence: 0.5,
    },
];

const UNORDERED_LIST = [
    {
        population: 200000,
        lat: 30,
        long: 30,
        year: 1999,
        confidence: 0.5,
    },
    {
        population: 10000,
        lat: 30,
        long: 30,
        year: 1100,
        confidence: 0.5,
    },
    {
        population: 40000,
        lat: 30,
        long: 30,
        year: 1500,
        confidence: 0.5,
    },
];

beforeEach(() => {});

afterEach(() => {});

// TODO
describe('PopHistory', () => {
    describe('importCensusList()', () => {
        test('sort unsorted lists', () => {
            expect().toBe();
        });
        test('2 contradicting censuses in same year', () => {
            expect().toBe();
        });
        test('a list with a very different growth curve from existing data', () => {
            expect().toBe();
        });
    });
    describe('latestCensus()', () => {
        test('no previous census', () => {
            expect().toBe();
        });
    });
    describe('nextCensus()', () => {
        test('no later census', () => {
            expect().toBe();
        });
    });
    describe('townCoordsInBox()', () => {
        test('corner cases', () => {
            expect().toBe();
        });
    });
    describe('popAt()', () => {
        test('growing pop', () => {
            expect().toBe();
        });
        test('unchanging pop', () => {
            expect().toBe();
        });
        test('declining pop', () => {
            expect().toBe();
        });
    });
});
