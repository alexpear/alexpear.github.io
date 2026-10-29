import { Body } from 'astronomy-engine';
import { eclipticPositionAu, tracedOrbitPathAu } from './positions';
import { CelestialObject } from './types';

interface PlanetDef {
    id: string;
    body: Body;
    name: string;
    color: string;
    orbitalPeriodDays: number; // sidereal period: a fixed astronomical constant, not live data
}

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
        id: 'earth',
        body: Body.Earth,
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

export const PLANETS: CelestialObject[] = PLANET_DEFS.map((def) => ({
    id: def.id,
    name: def.name,
    color: def.color,
    isPhysicalBody: true,
    positionAu: (date: Date) => eclipticPositionAu(def.body, date),
    orbitPathAu: (date: Date) =>
        tracedOrbitPathAu(
            (sampleDate) => eclipticPositionAu(def.body, sampleDate),
            def.orbitalPeriodDays,
            date,
        ),
}));
