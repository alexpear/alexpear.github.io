import { BlockScout } from '../src/blockscout';
import { Goal } from '../src/goal';

const DAY_MS = 1000 * 60 * 60 * 24;
const MIDNIGHT = new Date('2000-01-01T00:00:01');

const HOME = { lat: 37.77, long: -122.42 }; // San Francisco
const SOUTH = { lat: 37.76, long: -122.42 }; // 0.01 degrees south of HOME

// --- Mock setup ---

function makeMockMap(): object {
    return {
        setView: jest.fn().mockReturnThis(),
        on: jest.fn(),
        createPane: jest.fn(),
        getPane: jest.fn().mockReturnValue({ style: {} }),
        getBounds: jest.fn().mockReturnValue({
            getSouth: () => 37.74,
            getNorth: () => 37.8,
            getWest: () => -122.45,
            getEast: () => -122.39,
        }),
        getZoom: jest.fn().mockReturnValue(15),
        removeLayer: jest.fn(),
        getContainer: jest.fn().mockReturnValue({}),
        panTo: jest.fn(),
    };
}

function setupLeafletMock(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).L = {
        map: jest.fn().mockReturnValue(makeMockMap()),
        tileLayer: jest.fn().mockReturnValue({
            addTo: jest.fn().mockReturnThis(),
            on: jest.fn(),
            setOpacity: jest.fn(),
        }),
        control: { zoom: jest.fn().mockReturnValue({ addTo: jest.fn() }) },
        canvas: jest.fn().mockReturnValue({}),
        marker: jest.fn().mockReturnValue({
            addTo: jest.fn().mockReturnThis(),
            setIcon: jest.fn(),
        }),
        divIcon: jest.fn().mockReturnValue({}),
        rectangle: jest
            .fn()
            .mockReturnValue({ addTo: jest.fn().mockReturnThis() }),
        circleMarker: jest.fn().mockReturnValue({
            addTo: jest.fn().mockReturnThis(),
            setLatLng: jest.fn(),
        }),
    };
}

function makeGame(): BlockScout {
    jest.spyOn(BlockScout.prototype, 'quickUpdateScreen').mockImplementation(
        () => {},
    );
    setupLeafletMock();
    return new BlockScout();
}

// --- Test lifecycle ---

function makeMockEl(): object {
    return {
        textContent: '',
        addEventListener: jest.fn(),
        classList: { add: jest.fn(), remove: jest.fn() },
    };
}

// Minimal globals — no jsdom needed since these tests don't exercise DOM visuals.
let mockStorage: Record<string, string> = {};
let game: BlockScout;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).localStorage = {
    getItem: (k: string): string | undefined => mockStorage[k] ?? undefined,
    setItem: (k: string, v: string): void => {
        mockStorage[k] = v;
    },
    clear: (): void => {
        mockStorage = {};
    },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).navigator = { geolocation: { watchPosition: jest.fn() } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).document = {
    // Return undefined for 'map' so the module-level guard doesn't call BlockScout.run().
    getElementById: jest
        .fn()
        .mockImplementation((id: string) =>
            id === 'map' ? undefined : makeMockEl(),
        ),
    addEventListener: jest.fn(),
    hidden: false,
};

beforeEach(() => {
    mockStorage = {};
    jest.useFakeTimers();
    jest.setSystemTime(MIDNIGHT);
    game = makeGame();
});

afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
});

// --- Tests ---

describe('BlockScout', () => {
    describe('visit()', () => {
        test('visited location has 0 points immediately', () => {
            game.visit(HOME.lat, HOME.long);
            expect(game.goalAt(HOME.lat, HOME.long).pointsAvailable()).toBe(0);
        });

        test('visiting same location twice in one day does not award points twice', () => {
            game.visit(HOME.lat, HOME.long);
            const scoreAfterFirst = game.playerScore;
            game.visit(HOME.lat, HOME.long);
            expect(game.playerScore).toBe(scoreAfterFirst);
        });

        test('visit 2 places, then go home & sleep: home has 0 points, south is reset', () => {
            game.visit(HOME.lat, HOME.long);
            game.visit(SOUTH.lat, SOUTH.long);

            jest.setSystemTime(new Date(MIDNIGHT.getTime() + DAY_MS + 1000));

            game.visit(HOME.lat, HOME.long); // in morning

            expect(game.goalAt(HOME.lat, HOME.long).pointsAvailable()).toBe(0);
            expect(game.goalAt(SOUTH.lat, SOUTH.long).pointsAvailable()).toBe(
                Goal.START_POINTS,
            );
        });

        test('on fresh save, claim home score', () => {
            expect(game.playerScore).toBe(0);
            game.visit(HOME.lat, HOME.long);
            expect(game.playerScore).toBe(1000);
        });
    });

    describe('goalAt()', () => {
        test('never-visited location has 1000 points', () => {
            expect(game.goalAt(0, 0).pointsAvailable()).toBe(1000);
        });

        test('visited location has 0 points immediately, then points are reset the next day', () => {
            game.visit(0, 0);
            expect(game.goalAt(0, 0).pointsAvailable()).toBe(0);

            jest.setSystemTime(new Date(MIDNIGHT.getTime() + DAY_MS));

            expect(game.goalAt(0, 0).pointsAvailable()).toBe(Goal.START_POINTS);
        });
    });

    describe('scoring', () => {
        test('visiting a location awards its accumulated points, not always 1000', () => {
            const threeDaysAgo = new Goal().today().getTime() - 3 * DAY_MS;
            game.coords2dates['0,0'] = new Date(threeDaysAgo).toISOString();

            game.visit(0, 0);

            expect(game.playerScore).toBe(Goal.START_POINTS + (3 - 1));
        });

        test('score equals sum of individual point values across visited locations', () => {
            const today = new Goal().today().getTime();

            const INTERVAL_A = 3; // in days
            const INTERVAL_B = 5;

            game.coords2dates['0,0'] = new Date(
                today - INTERVAL_A * DAY_MS,
            ).toISOString();
            game.coords2dates['0,0.01'] = new Date(
                today - INTERVAL_B * DAY_MS,
            ).toISOString();

            game.visit(0, 0);
            game.visit(0, 0.01);

            expect(game.playerScore).toBe(
                Goal.START_POINTS +
                    (INTERVAL_A - 1) +
                    Goal.START_POINTS +
                    (INTERVAL_B - 1),
            );
        });
    });

    describe('updateAfterGPS()', () => {
        test('traveling from 0,0 to 0.01,0.02 after 1.8h', () => {
            const visitSpy = jest.spyOn(game, 'visit');

            game.updateAfterGPS(0, 0);

            jest.setSystemTime(
                new Date(MIDNIGHT.getTime() + 1.8 * 60 * 60 * 1000), // TODO functionize HOUR
            );

            game.updateAfterGPS(0.01, 0.02);

            const calls = visitSpy.mock.calls;
            expect(calls).toHaveLength(4);
            expect(calls[0]).toEqual([0, 0]);

            expect(calls[1][0]).toBeCloseTo(0.01 / 3);
            expect(calls[1][1]).toBeCloseTo(0.02 / 3);

            expect(calls[2][0]).toBeCloseTo(0.02 / 3);
            expect(calls[2][1]).toBeCloseTo(0.04 / 3);

            expect(calls[3]).toEqual([0.01, 0.02]);

            // make sure we visited a good set of blocks
            expect(Object.keys(game.coords2dates)).toHaveLength(4);
            const today = new Goal().today().toISOString();
            expect(game.coords2dates['0,0']).toEqual(today);
            expect(game.coords2dates['0,0.01']).toEqual(today);
            expect(game.coords2dates['0.01,0.01']).toEqual(today);
            expect(game.coords2dates['0.01,0.02']).toEqual(today);
        });

        test('gap > 2h between pings: no intermediate visits', () => {
            const visitSpy = jest.spyOn(game, 'visit');

            game.updateAfterGPS(0, 0);
            jest.setSystemTime(
                new Date(MIDNIGHT.getTime() + 2 * 60 * 60 * 1000 + 1),
            );
            game.updateAfterGPS(0.02, 0.03);

            expect(visitSpy.mock.calls).toHaveLength(2);
            expect(visitSpy.mock.calls[0]).toEqual([0, 0]);
            expect(visitSpy.mock.calls[1]).toEqual([0.02, 0.03]);
        });

        test('speed too fast (motor vehicle): no intermediate visits', () => {
            const visitSpy = jest.spyOn(game, 'visit');

            game.updateAfterGPS(0, 0);
            jest.setSystemTime(new Date(MIDNIGHT.getTime() + 30 * 60 * 1000)); // 30 min later
            game.updateAfterGPS(0.06, 0); // 0.06 degrees in 30min exceeds speed limit

            expect(visitSpy.mock.calls).toHaveLength(2);
            expect(visitSpy.mock.calls[0]).toEqual([0, 0]);
            expect(visitSpy.mock.calls[1]).toEqual([0.06, 0]);
        });

        test('traveling due north visits correct intermediates', () => {
            const visitSpy = jest.spyOn(game, 'visit');

            game.updateAfterGPS(0, 0);
            jest.setSystemTime(
                new Date(MIDNIGHT.getTime() + 1.8 * 60 * 60 * 1000),
            );
            game.updateAfterGPS(0.03, 0);

            const calls = visitSpy.mock.calls;
            expect(calls).toHaveLength(4);
            expect(calls[0]).toEqual([0, 0]);

            expect(calls[1][0]).toBeCloseTo(0.01);
            expect(calls[1][1]).toBeCloseTo(0);

            expect(calls[2][0]).toBeCloseTo(0.02);
            expect(calls[2][1]).toBeCloseTo(0);

            expect(calls[3]).toEqual([0.03, 0]);
        });

        test('traveling due east visits correct intermediates', () => {
            const visitSpy = jest.spyOn(game, 'visit');

            game.updateAfterGPS(0, 0);
            jest.setSystemTime(
                new Date(MIDNIGHT.getTime() + 1.8 * 60 * 60 * 1000),
            );
            game.updateAfterGPS(0, 0.03);

            const calls = visitSpy.mock.calls;
            expect(calls).toHaveLength(4);
            expect(calls[0]).toEqual([0, 0]);

            expect(calls[1][0]).toBeCloseTo(0);
            expect(calls[1][1]).toBeCloseTo(0.01);

            expect(calls[2][0]).toBeCloseTo(0);
            expect(calls[2][1]).toBeCloseTo(0.02);

            expect(calls[3]).toEqual([0, 0.03]);
        });

        // after refresh, the first GPS ping should create the playerMarker.
        test('first GPS ping creates playerMarker', () => {
            expect(game.playerMarker).toBeUndefined();
            game.updateAfterGPS(HOME.lat, HOME.long);
            expect(game.playerMarker).toBeDefined();
        });
    });

    describe('updateAfterPan()', () => {
        // moveend triggers updateAfterPan, which must not loop back into moveend.
        test('calls updateAfterGPS exactly once with cached lastSeen coords', () => {
            game.updateAfterGPS(HOME.lat, HOME.long); // establish lastSeen
            const spy = jest.spyOn(game, 'updateAfterGPS');
            game.updateAfterPan();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(HOME.lat, HOME.long);
        });

        // moveend should re-apply cached coords so the dot stays visible.
        test('re-visits cached position so player marker stays current', () => {
            game.updateAfterGPS(HOME.lat, HOME.long);
            const visitSpy = jest.spyOn(game, 'visit');
            game.updateAfterPan();
            expect(visitSpy).toHaveBeenCalledWith(HOME.lat, HOME.long);
        });
    });

    describe('save() and load()', () => {
        test('save & reloading preserves score & a goal state', () => {
            const game1 = makeGame();
            game1.visit(HOME.lat, HOME.long);
            game1.save();

            const game2 = makeGame();
            expect(game2.playerScore).toBe(game1.playerScore);
            expect(game2.goalAt(HOME.lat, HOME.long).pointsAvailable()).toBe(0);
        });

        test('no saved data: score is 0 and coords2dates is empty', () => {
            expect(game.playerScore).toBe(0);
            expect(Object.keys(game.coords2dates)).toHaveLength(0);
        });

        test('saved data with missing coords2dates field: does not crash', () => {
            mockStorage['mapGame'] = '{"playerScore": 42}';
            expect(() => makeGame()).not.toThrow();
        });
    });
});
