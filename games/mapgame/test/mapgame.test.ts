import { MapGame } from '../src/mapgame';

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

function makeGame(): MapGame {
    jest.spyOn(MapGame.prototype, 'quickUpdateScreen').mockImplementation(
        () => {},
    );
    setupLeafletMock();
    return new MapGame();
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
    // Return undefined for 'map' so the module-level guard doesn't call MapGame.run().
    getElementById: jest
        .fn()
        .mockImplementation((id: string) =>
            id === 'map' ? undefined : makeMockEl(),
        ),
};

beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MIDNIGHT);
    mockStorage = {};
});

afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
});

// --- Tests ---

describe('MapGame', () => {
    describe('visit()', () => {
        test('visited location has 0 points immediately', () => {
            const game = makeGame();
            game.visit(HOME.lat, HOME.long);
            expect(game.goalAt(HOME.lat, HOME.long).pointsAvailable()).toBe(0);
        });

        test('visiting same location twice in one day does not award points twice', () => {
            const game = makeGame();
            game.visit(HOME.lat, HOME.long);
            const scoreAfterFirst = game.playerScore;
            game.visit(HOME.lat, HOME.long);
            expect(game.playerScore).toBe(scoreAfterFirst);
        });

        test('visit 2, then go home & sleep: home has 0 points, south has 1', () => {
            const game = makeGame();

            game.visit(HOME.lat, HOME.long);
            game.visit(SOUTH.lat, SOUTH.long);

            jest.setSystemTime(new Date(MIDNIGHT.getTime() + DAY_MS + 1000));

            game.visit(HOME.lat, HOME.long);

            expect(game.goalAt(HOME.lat, HOME.long).pointsAvailable()).toBe(0);
            expect(game.goalAt(SOUTH.lat, SOUTH.long).pointsAvailable()).toBe(
                1,
            );
        });

        test('on fresh save, claim home score', () => {
            const game = makeGame();
            expect(game.playerScore).toBe(0);
            game.visit(HOME.lat, HOME.long);
            expect(game.playerScore).toBe(1000);
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
