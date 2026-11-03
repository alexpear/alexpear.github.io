import {
    Body,
    JupiterMoons,
    JupiterMoonsInfo,
    StateVector,
} from 'astronomy-engine';
import {
    eclipticPositionAu,
    toEclipticPoint,
    tracedOrbitPathAu,
} from './positions';
import { Point2D, Thing } from './types';

// Sol itself: fixed at the ecliptic origin, so no orbit to trace.
export const SOL: Thing = {
    id: 'sol',
    name: 'Sol',
    color: '#ffd27f',
    kind: 'star',
    body: Body.Sun,
    positionAu: () => ({ x: 0, y: 0 }),
};

interface PlanetDef {
    id: string;
    body: Body;
    name: string;
    color: string;
    orbitalPeriodDays: number;
}

// TODO put all Things here, such as the Galilean moons, not just planets. Rename.
const PLANET_DEFS: PlanetDef[] = [
    {
        id: 'mercury',
        body: Body.Mercury,
        name: 'Mercury',
        color: '#9e9e9e',
        orbitalPeriodDays: 87.969,
    },
    {
        id: 'venus',
        body: Body.Venus,
        name: 'Venus',
        color: '#e0c074',
        orbitalPeriodDays: 224.701,
    },
    {
        // Body.EMB (the Earth-Moon barycenter) rather than Body.Earth: the
        // offset from Earth's center is a few thousand km, invisible at this
        // map's AU scale, and using EMB makes lagrange() exact when this
        // Thing is used as the minor body of a Sun-Earth Lagrange point.
        id: 'earth',
        body: Body.EMB,
        name: 'Earth',
        color: '#4f82c6',
        orbitalPeriodDays: 365.256,
    },
    {
        id: 'mars',
        body: Body.Mars,
        name: 'Mars',
        color: '#c1562d',
        orbitalPeriodDays: 686.98,
    },
    {
        id: 'jupiter',
        body: Body.Jupiter,
        name: 'Jupiter',
        color: '#c99a6b',
        orbitalPeriodDays: 4332.59,
    },
    {
        id: 'saturn',
        body: Body.Saturn,
        name: 'Saturn',
        color: '#d4c58a',
        orbitalPeriodDays: 10759.22,
    },
    {
        id: 'uranus',
        body: Body.Uranus,
        name: 'Uranus',
        color: '#9fd4d8',
        orbitalPeriodDays: 30688.5,
    },
    {
        id: 'neptune',
        body: Body.Neptune,
        name: 'Neptune',
        color: '#5a74e0',
        orbitalPeriodDays: 60182,
    },
    {
        id: 'pluto',
        body: Body.Pluto,
        name: 'Pluto',
        color: '#b8a08c',
        orbitalPeriodDays: 90560,
    },
];

export const PLANETS: Thing[] = PLANET_DEFS.map(
    (def): Thing => ({
        id: def.id,
        name: def.name,
        color: def.color,
        kind: 'planet',
        body: def.body,
        orbitalPeriodDays: def.orbitalPeriodDays,
        positionAu: (date: Date) => eclipticPositionAu(def.body, date),
        orbitPathAu: (date: Date) =>
            tracedOrbitPathAu(
                (sampleDate) => eclipticPositionAu(def.body, sampleDate),
                def.orbitalPeriodDays,
                date,
            ),
    }),
);

// Named references into PLANETS, for callers (eg the Lagrange points in
// catalog.ts) that need a specific planet Thing rather than the whole list.
export const EARTH: Thing = PLANETS.find((planet) => planet.id === 'earth')!;
export const JUPITER: Thing = PLANETS.find(
    (planet) => planet.id === 'jupiter',
)!;

interface GalileanMoonDef {
    id: string;
    name: string;
    color: string;
    orbitalPeriodDays: number;
    stateVector: (moons: JupiterMoonsInfo) => StateVector; // TODO this func seems useless
}

const GALILEAN_MOON_DEFS: GalileanMoonDef[] = [
    {
        id: 'io',
        name: 'Io',
        color: '#e8d99a',
        orbitalPeriodDays: 1.769,
        stateVector: (m) => m.io,
    },
    {
        id: 'europa',
        name: 'Europa',
        color: '#d8dde0',
        orbitalPeriodDays: 3.551,
        stateVector: (m) => m.europa,
    },
    {
        id: 'ganymede',
        name: 'Ganymede',
        color: '#a9977f',
        orbitalPeriodDays: 7.155,
        stateVector: (m) => m.ganymede,
    },
    {
        id: 'callisto',
        name: 'Callisto',
        color: '#7d7265',
        orbitalPeriodDays: 16.689,
        stateVector: (m) => m.callisto,
    },
];

// Jovicentric (relative to Jupiter's center); add Jupiter's own heliocentric
// position to place the moon in the same frame as everything else on the map.
function moonPositionAu(def: GalileanMoonDef, date: Date): Point2D {
    const jupiterHelio = eclipticPositionAu(Body.Jupiter, date);
    const jovicentric = def.stateVector(JupiterMoons(date));
    const jovicentricEcliptic = toEclipticPoint(
        jovicentric.x,
        jovicentric.y,
        jovicentric.z,
        jovicentric.t,
    );
    return {
        x: jupiterHelio.x + jovicentricEcliptic.x,
        y: jupiterHelio.y + jovicentricEcliptic.y,
    };
}

export const JUPITER_MOONS: Thing[] = GALILEAN_MOON_DEFS.map(
    (def): Thing => ({
        id: def.id,
        name: def.name,
        color: def.color,
        kind: 'moon',
        orbitalPeriodDays: def.orbitalPeriodDays,
        positionAu: (date: Date) => moonPositionAu(def, date),
        orbitPathAu: (date: Date) =>
            tracedOrbitPathAu(
                (sampleDate) => moonPositionAu(def, sampleDate),
                def.orbitalPeriodDays,
                date,
            ),
    }),
);
