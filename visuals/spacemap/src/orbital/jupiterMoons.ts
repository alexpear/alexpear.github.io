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
import { CelestialObject, Point2D } from './types';

interface GalileanMoonDef {
    id: string;
    name: string;
    color: string;
    orbitalPeriodDays: number; // sidereal period: a fixed astronomical constant, not live data
    stateVector: (moons: JupiterMoonsInfo) => StateVector;
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

export const JUPITER_MOONS: CelestialObject[] = GALILEAN_MOON_DEFS.map(
    (def) => ({
        id: def.id,
        name: def.name,
        color: def.color,
        isPhysicalBody: true,
        positionAu: (date: Date) => moonPositionAu(def, date),
        orbitPathAu: (date: Date) =>
            tracedOrbitPathAu(
                (sampleDate) => moonPositionAu(def, sampleDate),
                def.orbitalPeriodDays,
                date,
            ),
    }),
);
