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
};

beforeEach(() => {
    mockStorage = {};
    game = makeGame();
    jest.useFakeTimers();
    jest.setSystemTime(MIDNIGHT);
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

        test('visit 2 places, then go home & sleep: home has 0 points, south has 2', () => {
            game.visit(HOME.lat, HOME.long);
            game.visit(SOUTH.lat, SOUTH.long);

            jest.setSystemTime(new Date(MIDNIGHT.getTime() + DAY_MS + 1000));

            game.visit(HOME.lat, HOME.long);

            expect(game.goalAt(HOME.lat, HOME.long).pointsAvailable()).toBe(0);
            expect(game.goalAt(SOUTH.lat, SOUTH.long).pointsAvailable()).toBe(
                2,
            );
        });

        test('on fresh save, claim home score', () => {
            expect(game.playerScore).toBe(0);
            game.visit(HOME.lat, HOME.long);
            expect(game.playerScore).toBe(1000);
        });
    });

    describe('updateAfterGPS()', () => {
        test('traveling from 0,0 to 0.02,0.03 after 1.8h visits 4 intermediate points', () => {
            const visitSpy = jest.spyOn(game, 'visit');

            game.updateAfterGPS(0, 0);

            jest.setSystemTime(
                new Date(MIDNIGHT.getTime() + 1.8 * 60 * 60 * 1000), // TODO functionize HOUR
            );

            game.updateAfterGPS(0.02, 0.03);

            const calls = visitSpy.mock.calls;
            expect(calls).toHaveLength(6);
            expect(calls[0]).toEqual([0, 0]);

            expect(calls[1][0]).toBeCloseTo(0.004);
            expect(calls[1][1]).toBeCloseTo(0.006);

            expect(calls[2][0]).toBeCloseTo(0.008);
            expect(calls[2][1]).toBeCloseTo(0.012);

            expect(calls[3][0]).toBeCloseTo(0.012);
            expect(calls[3][1]).toBeCloseTo(0.018);

            expect(calls[4][0]).toBeCloseTo(0.016);
            expect(calls[4][1]).toBeCloseTo(0.024);

            expect(calls[5]).toEqual([0.02, 0.03]);

            // make sure we visited a good set of blocks
            expect(Object.keys(game.coords2dates)).toHaveLength(6);
            const today = new Goal().today().toISOString();
            expect(game.coords2dates['0,0']).toEqual(today);
            expect(game.coords2dates['0,0.01']).toEqual(today);
            expect(game.coords2dates['0.01,0.01']).toEqual(today);
            expect(game.coords2dates['0.01,0.02']).toEqual(today);
            expect(game.coords2dates['0.02,0.02']).toEqual(today);
            expect(game.coords2dates['0.02,0.03']).toEqual(today);
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
    });
});
