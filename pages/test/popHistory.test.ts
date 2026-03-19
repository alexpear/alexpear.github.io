import { TownCensus } from '../src/townCensus';
import { PopHistory } from '../src/popHistory';

let popHistory: PopHistory;

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

beforeEach(() => {
    popHistory = new PopHistory();
});

afterEach(() => {});

describe('PopHistory', () => {
    describe('importCensusList()', () => {
        test('sort unsorted lists', () => {
            popHistory.importCensusList(LIST1);
            popHistory.importCensusList(UNORDERED_LIST);
            const censuses = popHistory.coord2census['30,30'];
            let previous: TownCensus | undefined = undefined;

            for (const census of censuses) {
                if (!previous) {
                    continue;
                }

                expect(previous.year).toBeLessThan(census.year);

                previous = census;
            }
        });
        test('2 contradicting censuses in same year', () => {
            // todo
        });
        test('a list with a very different growth curve from existing data', () => {
            // todo
        });
    });
    describe('previousCensus()', () => {
        test('exact year', () => {
            popHistory.importCensusList(LIST1);
            expect(popHistory.previousCensus(30, 30, -1000)?.population).toBe(
                100,
            );
        });
        test('no previous census', () => {
            popHistory.importCensusList(LIST1);
            expect(popHistory.previousCensus(30, 30, -999999)).toBe(0);
        });
    });
    describe('nextCensus()', () => {
        test('no later census', () => {
            // todo
        });
    });
    describe('townCoordsInBox()', () => {
        test('corner cases', () => {
            popHistory.importCensusList([
                {
                    lat: 9,
                    long: 9,
                    population: 100000,
                    year: 1,
                    confidence: 0.5,
                },
                {
                    lat: 9,
                    long: 70,
                    population: 100000,
                    year: 1,
                    confidence: 0.5,
                },
                {
                    lat: 70,
                    long: 9,
                    population: 100000,
                    year: 1,
                    confidence: 0.5,
                },
                {
                    lat: 70,
                    long: 70,
                    population: 100000,
                    year: 1,
                    confidence: 0.5,
                },
                {
                    lat: 44,
                    long: 44,
                    population: 100000,
                    year: 1,
                    confidence: 0.5,
                },
                // out of box:
                {
                    lat: 70,
                    long: 71,
                    population: 100000,
                    year: 1,
                    confidence: 0.5,
                },
            ]);

            const towns = popHistory.townCoordsInBox(9, 9, 70, 70);
            expect(towns.length).toBe(5);
        });
    });
    describe('popAt()', () => {
        test('growing pop', () => {
            popHistory.importCensusList([
                {
                    population: 2300,
                    lat: 30,
                    long: 30,
                    year: 0,
                    confidence: 0.5,
                },
                {
                    population: 50000,
                    lat: 30,
                    long: 30,
                    year: 1000,
                    confidence: 0.5,
                },
            ]);
            expect(popHistory.popAt(30, 30, 555)).toBe(6666);
        });
        test('unchanging pop', () => {
            popHistory.importCensusList([
                {
                    population: 50000,
                    lat: 30,
                    long: 30,
                    year: 0,
                    confidence: 0.5,
                },
                {
                    population: 50000,
                    lat: 30,
                    long: 30,
                    year: 1000,
                    confidence: 0.5,
                },
            ]);
            expect(popHistory.popAt(30, 30, 555)).toBe(50000);
        });
        test('declining pop', () => {
            popHistory.importCensusList([
                {
                    population: 50000,
                    lat: 30,
                    long: 30,
                    year: 0,
                    confidence: 0.5,
                },
                {
                    population: 2300,
                    lat: 30,
                    long: 30,
                    year: 1000,
                    confidence: 0.5,
                },
            ]);
            expect(popHistory.popAt(30, 30, 555)).toBe(6666);
        });
    });
});
