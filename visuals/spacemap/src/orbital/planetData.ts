import { Body } from 'astronomy-engine';

export interface PlanetDef {
    body: Body;
    name: string;
    color: string;
    orbitalPeriodDays: number;
}

// Sidereal orbital periods are fixed astronomical constants, not live data.
export const PLANETS: PlanetDef[] = [
    {
        body: Body.Mercury,
        name: 'Mercury',
        color: '#9e9e9e',
        orbitalPeriodDays: 87.969,
    },
    {
        body: Body.Venus,
        name: 'Venus',
        color: '#e0c074',
        orbitalPeriodDays: 224.701,
    },
    {
        body: Body.Earth,
        name: 'Earth',
        color: '#4f82c6',
        orbitalPeriodDays: 365.256,
    },
    {
        body: Body.Mars,
        name: 'Mars',
        color: '#c1562d',
        orbitalPeriodDays: 686.98,
    },
    {
        body: Body.Jupiter,
        name: 'Jupiter',
        color: '#c99a6b',
        orbitalPeriodDays: 4332.59,
    },
    {
        body: Body.Saturn,
        name: 'Saturn',
        color: '#d4c58a',
        orbitalPeriodDays: 10759.22,
    },
    {
        body: Body.Uranus,
        name: 'Uranus',
        color: '#9fd4d8',
        orbitalPeriodDays: 30688.5,
    },
    {
        body: Body.Neptune,
        name: 'Neptune',
        color: '#5a74e0',
        orbitalPeriodDays: 60182,
    },
    {
        body: Body.Pluto,
        name: 'Pluto',
        color: '#b8a08c',
        orbitalPeriodDays: 90560,
    },
];
