import { Body, LagrangePoint } from 'astronomy-engine';
import { toEclipticPoint, tracedOrbitPathAu } from './positions';
import { CelestialObject, Point2D } from './types';

interface LagrangePointDef {
    id: string;
    name: string;
    color: string;
    point: number; // 1..5
    majorBody: Body;
    minorBody: Body;
    orbitalPeriodDays: number; // the minor body's period: a fixed astronomical constant, not live data
}

const EARTH_ORBITAL_PERIOD_DAYS = 365.256;
const JUPITER_ORBITAL_PERIOD_DAYS = 4332.59;

// L3 (far side of the Sun) is omitted: it's rarely referenced outside fiction,
// and for a minimal-astronomy audience it's not worth the extra label to explain.
const LAGRANGE_POINT_DEFS: LagrangePointDef[] = [
    {
        id: 'sun-earth-l1',
        name: 'Sun–Earth L1',
        color: '#8fd1c7',
        point: 1,
        majorBody: Body.Sun,
        minorBody: Body.EMB,
        orbitalPeriodDays: EARTH_ORBITAL_PERIOD_DAYS,
    },
    {
        id: 'sun-earth-l2',
        name: 'Sun–Earth L2',
        color: '#8fd1c7',
        point: 2,
        majorBody: Body.Sun,
        minorBody: Body.EMB,
        orbitalPeriodDays: EARTH_ORBITAL_PERIOD_DAYS,
    },
    {
        id: 'sun-earth-l4',
        name: 'Sun–Earth L4',
        color: '#8fd1c7',
        point: 4,
        majorBody: Body.Sun,
        minorBody: Body.EMB,
        orbitalPeriodDays: EARTH_ORBITAL_PERIOD_DAYS,
    },
    {
        id: 'sun-earth-l5',
        name: 'Sun–Earth L5',
        color: '#8fd1c7',
        point: 5,
        majorBody: Body.Sun,
        minorBody: Body.EMB,
        orbitalPeriodDays: EARTH_ORBITAL_PERIOD_DAYS,
    },
    {
        id: 'sun-jupiter-l4',
        name: 'Sun–Jupiter L4 (Trojans)',
        color: '#d9b36c',
        point: 4,
        majorBody: Body.Sun,
        minorBody: Body.Jupiter,
        orbitalPeriodDays: JUPITER_ORBITAL_PERIOD_DAYS,
    },
    {
        id: 'sun-jupiter-l5',
        name: 'Sun–Jupiter L5 (Trojans)',
        color: '#d9b36c',
        point: 5,
        majorBody: Body.Sun,
        minorBody: Body.Jupiter,
        orbitalPeriodDays: JUPITER_ORBITAL_PERIOD_DAYS,
    },
];

// LagrangePoint() returns a vector relative to the major body's center
// (the Sun, for all points defined here), so no extra offset is needed.
function lagrangePointPositionAu(def: LagrangePointDef, date: Date): Point2D {
    const stateVector = LagrangePoint(
        def.point,
        date,
        def.majorBody,
        def.minorBody,
    );
    return toEclipticPoint(
        stateVector.x,
        stateVector.y,
        stateVector.z,
        stateVector.t,
    );
}

export const LAGRANGE_POINTS: CelestialObject[] = LAGRANGE_POINT_DEFS.map(
    (def) => ({
        id: def.id,
        name: def.name,
        color: def.color,
        isPhysicalBody: false,
        positionAu: (date: Date) => lagrangePointPositionAu(def, date),
        orbitPathAu: (date: Date) =>
            tracedOrbitPathAu(
                (sampleDate) => lagrangePointPositionAu(def, sampleDate),
                def.orbitalPeriodDays,
                date,
            ),
    }),
);
